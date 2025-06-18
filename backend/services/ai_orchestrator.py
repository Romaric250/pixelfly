"""
AI Orchestrator for PixelFly
Coordinates multiple AI agents using LangGraph for photo enhancement and watermarking
"""

import os
import time
import asyncio
from typing import Dict, List, Any, Optional
import google.generativeai as genai
from langchain_core.messages import BaseMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict
import logging

from .photo_enhancer import PhotoEnhancementService
from .watermark_service import WatermarkService
from .image_processor import ImageProcessor

logger = logging.getLogger(__name__)

# Configure Gemini
genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))

class AgentState(TypedDict):
    """State shared between agents"""
    messages: Annotated[list, add_messages]
    image_url: str
    user_id: str
    task_type: str  # 'enhancement' or 'watermarking'
    processing_status: str
    result_data: Dict[str, Any]
    error_message: Optional[str]

class AIOrchestrator:
    """
    Orchestrates multiple AI agents for photo processing
    Uses LangGraph to coordinate between different AI models and services
    """
    
    def __init__(self):
        self.photo_enhancer = PhotoEnhancementService()
        self.watermark_service = WatermarkService()
        self.image_processor = ImageProcessor()
        
        # Initialize Gemini model
        self.gemini_model = ChatGoogleGenerativeAI(
            model="gemini-pro-vision",
            google_api_key=os.getenv('GOOGLE_API_KEY'),
            temperature=0.1
        )
        
        # Build the agent workflow
        self.workflow = self._build_workflow()
    
    def _build_workflow(self) -> StateGraph:
        """Build the LangGraph workflow for AI processing"""
        
        workflow = StateGraph(AgentState)
        
        # Add nodes (agents)
        workflow.add_node("image_analyzer", self._image_analyzer_agent)
        workflow.add_node("enhancement_agent", self._enhancement_agent)
        workflow.add_node("watermark_agent", self._watermark_agent)
        workflow.add_node("quality_checker", self._quality_checker_agent)
        workflow.add_node("finalizer", self._finalizer_agent)
        
        # Define the workflow edges
        workflow.set_entry_point("image_analyzer")
        
        workflow.add_conditional_edges(
            "image_analyzer",
            self._route_to_processor,
            {
                "enhancement": "enhancement_agent",
                "watermarking": "watermark_agent",
                "error": END
            }
        )
        
        workflow.add_edge("enhancement_agent", "quality_checker")
        workflow.add_edge("watermark_agent", "quality_checker")
        workflow.add_edge("quality_checker", "finalizer")
        workflow.add_edge("finalizer", END)
        
        return workflow.compile()
    
    async def _image_analyzer_agent(self, state: AgentState) -> AgentState:
        """Analyzes the input image and determines processing strategy"""
        try:
            logger.info(f"Analyzing image for user {state['user_id']}")
            
            # Use Gemini to analyze the image
            analysis_prompt = f"""
            Analyze this image for {state['task_type']} processing.
            
            For enhancement, identify:
            - Image quality issues (blur, noise, low light)
            - Subject type (portrait, landscape, food, etc.)
            - Recommended enhancement techniques
            
            For watermarking, identify:
            - Best watermark placement areas
            - Image composition
            - Contrast areas for visibility
            
            Provide a JSON response with analysis results.
            """
            
            # Simulate Gemini analysis (replace with actual API call)
            analysis_result = {
                "image_type": "portrait",
                "quality_score": 0.7,
                "recommended_enhancements": ["noise_reduction", "sharpening", "color_enhancement"],
                "watermark_zones": ["bottom_right", "bottom_left"],
                "processing_complexity": "medium"
            }
            
            state["result_data"]["analysis"] = analysis_result
            state["processing_status"] = "analyzed"
            
            return state
            
        except Exception as e:
            logger.error(f"Image analysis error: {str(e)}")
            state["error_message"] = str(e)
            state["processing_status"] = "error"
            return state
    
    async def _enhancement_agent(self, state: AgentState) -> AgentState:
        """Handles photo enhancement using AI"""
        try:
            logger.info(f"Enhancing photo for user {state['user_id']}")
            
            analysis = state["result_data"].get("analysis", {})
            
            # Use the photo enhancement service
            return_format = state["result_data"].get("return_format", "base64")
            image_base64 = state["result_data"].get("image_base64")
            enhanced_result = await self.photo_enhancer.enhance_photo_async(
                image_url=state["image_url"] if not image_base64 else None,
                image_base64=image_base64,
                enhancement_type=analysis.get("image_type", "auto"),
                quality_score=analysis.get("quality_score", 0.5),
                return_format=return_format
            )
            
            if "enhanced_base64" in enhanced_result:
                state["result_data"]["enhanced_base64"] = enhanced_result["enhanced_base64"]
            if "enhanced_url" in enhanced_result:
                state["result_data"]["enhanced_url"] = enhanced_result["enhanced_url"]
            state["result_data"]["enhancements_applied"] = enhanced_result["enhancements_applied"]
            state["processing_status"] = "enhanced"
            
            return state
            
        except Exception as e:
            logger.error(f"Enhancement error: {str(e)}")
            state["error_message"] = str(e)
            state["processing_status"] = "error"
            return state
    
    async def _watermark_agent(self, state: AgentState) -> AgentState:
        """Handles watermarking using AI"""
        try:
            logger.info(f"Adding watermark for user {state['user_id']}")
            
            analysis = state["result_data"].get("analysis", {})
            
            # Use the watermark service
            return_format = state["result_data"].get("return_format", "base64")
            watermark_config = state["result_data"].get("watermark_config", {})
            watermark_result = await self.watermark_service.add_watermark_async(
                image_url=state["image_url"],
                watermark_config={
                    "position": watermark_config.get("position", analysis.get("watermark_zones", ["bottom_right"])[0]),
                    "opacity": watermark_config.get("opacity", 0.7),
                    "text": watermark_config.get("text", f"© PixelFly User {state['user_id']}")
                },
                return_format=return_format
            )
            
            if "watermarked_base64" in watermark_result:
                state["result_data"]["watermarked_base64"] = watermark_result["watermarked_base64"]
            if "watermarked_url" in watermark_result:
                state["result_data"]["watermarked_url"] = watermark_result["watermarked_url"]
            state["processing_status"] = "watermarked"
            
            return state
            
        except Exception as e:
            logger.error(f"Watermarking error: {str(e)}")
            state["error_message"] = str(e)
            state["processing_status"] = "error"
            return state
    
    async def _quality_checker_agent(self, state: AgentState) -> AgentState:
        """Checks the quality of processed images"""
        try:
            logger.info(f"Checking quality for user {state['user_id']}")
            
            # Use Gemini to assess the processed image quality
            quality_prompt = """
            Assess the quality of this processed image.
            Rate on a scale of 1-10 and provide feedback.
            """
            
            # Simulate quality check
            quality_result = {
                "quality_score": 8.5,
                "feedback": "Excellent enhancement with good color balance",
                "passed": True
            }
            
            state["result_data"]["quality_check"] = quality_result
            state["processing_status"] = "quality_checked"
            
            return state
            
        except Exception as e:
            logger.error(f"Quality check error: {str(e)}")
            state["error_message"] = str(e)
            return state
    
    async def _finalizer_agent(self, state: AgentState) -> AgentState:
        """Finalizes the processing and prepares the result"""
        try:
            logger.info(f"Finalizing processing for user {state['user_id']}")
            
            # Prepare final result
            state["result_data"]["final_status"] = "completed"
            state["result_data"]["processing_time"] = time.time() - state["result_data"].get("start_time", time.time())
            state["processing_status"] = "completed"
            
            return state
            
        except Exception as e:
            logger.error(f"Finalization error: {str(e)}")
            state["error_message"] = str(e)
            return state
    
    def _route_to_processor(self, state: AgentState) -> str:
        """Routes to the appropriate processor based on task type"""
        if state.get("error_message"):
            return "error"
        
        task_type = state.get("task_type", "")
        if task_type == "enhancement":
            return "enhancement"
        elif task_type == "watermarking":
            return "watermarking"
        else:
            return "error"
    
    def enhance_photo(self, image_url: str = None, image_base64: str = None, user_id: str = "anonymous", enhancement_type: str = "auto", return_format: str = "base64") -> Dict[str, Any]:
        """Synchronous photo enhancement"""
        return asyncio.run(self.enhance_photo_async(image_url, image_base64, user_id, enhancement_type, return_format))
    
    async def enhance_photo_async(self, image_url: str = None, image_base64: str = None, user_id: str = "anonymous", enhancement_type: str = "auto", return_format: str = "base64") -> Dict[str, Any]:
        """Asynchronous photo enhancement using AI agents"""
        start_time = time.time()
        
        initial_state = AgentState(
            messages=[],
            image_url=image_url or f"data:image/jpeg;base64,{image_base64}" if image_base64 else None,
            user_id=user_id,
            task_type="enhancement",
            processing_status="started",
            result_data={"start_time": start_time, "return_format": return_format, "image_base64": image_base64},
            error_message=None
        )
        
        # Run the workflow
        final_state = await self.workflow.ainvoke(initial_state)
        
        if final_state.get("error_message"):
            raise Exception(final_state["error_message"])
        
        return final_state["result_data"]
    
    def bulk_watermark(self, image_urls: List[str], user_id: str, watermark_config: Dict[str, Any], return_format: str = "base64") -> Dict[str, Any]:
        """Synchronous bulk watermarking"""
        return asyncio.run(self.bulk_watermark_async(image_urls, user_id, watermark_config, return_format))
    
    async def bulk_watermark_async(self, image_urls: List[str], user_id: str, watermark_config: Dict[str, Any], return_format: str = "base64") -> Dict[str, Any]:
        """Asynchronous bulk watermarking using AI agents"""
        start_time = time.time()
        results = []
        
        # Process each image
        for image_url in image_urls:
            try:
                initial_state = AgentState(
                    messages=[],
                    image_url=image_url,
                    user_id=user_id,
                    task_type="watermarking",
                    processing_status="started",
                    result_data={"start_time": start_time, "watermark_config": watermark_config, "return_format": return_format},
                    error_message=None
                )
                
                final_state = await self.workflow.ainvoke(initial_state)
                
                if not final_state.get("error_message"):
                    results.append(final_state["result_data"]["watermarked_url"])
                else:
                    logger.error(f"Failed to watermark {image_url}: {final_state['error_message']}")
                    
            except Exception as e:
                logger.error(f"Error processing {image_url}: {str(e)}")
        
        return {
            "watermarked_urls": results,
            "processing_time": time.time() - start_time,
            "processed_count": len(results)
        }
