"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { backendClient } from "@/lib/backend-client";
import { useSession } from "@/lib/auth-client";
import { ChatMessages } from "@/components/enhance/chat-messages";
import { ChatInput } from "@/components/enhance/chat-input";
import { ImageViewer } from "@/components/enhance/image-viewer";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  type: "text" | "image" | "enhancement";
  content?: string;
  imageUrl?: string;
  originalImageUrl?: string;
  enhancedImageUrl?: string;
  enhancedBase64?: string;
  filename?: string;
  processingTime?: number;
  enhancementsApplied?: string[];
  timestamp: Date;
  isProcessing?: boolean;
}

export interface ImageViewerState {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  type: "original" | "enhanced";
}

export default function EnhancePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      type: "text",
      content: "Hi! I'm PixelFly. Upload a photo and I'll enhance it with stunning clarity and vibrant colors.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imageViewer, setImageViewer] = useState<ImageViewerState>({
    isOpen: false,
    imageUrl: "",
    title: "",
    type: "original",
  });

  // Authentication check
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  // Show loading while checking authentication
  if (isPending) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="max-w-4xl mx-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking authentication...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!session) {
    return null;
  }

  const addMessage = (
    role: "user" | "assistant",
    type: "text" | "image" | "enhancement",
    content?: string,
    imageUrl?: string,
    originalImageUrl?: string,
    enhancedImageUrl?: string,
    filename?: string,
    processingTime?: number,
    enhancementsApplied?: string[],
    isProcessing?: boolean,
    enhancedBase64?: string
  ) => {
    const newMessage: ChatMessage = {
      id: `${role}-${Date.now()}-${Math.random()}`,
      role,
      type,
      content,
      imageUrl,
      originalImageUrl,
      enhancedImageUrl,
      enhancedBase64,
      filename,
      processingTime,
      enhancementsApplied,
      timestamp: new Date(),
      isProcessing,
    };

    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  const updateMessage = (messageId: string, updates: Partial<ChatMessage>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
    );
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addMessage("assistant", "text", "Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    // Add user message with image preview
    const imageUrl = URL.createObjectURL(file);
    addMessage("user", "image", undefined, imageUrl, undefined, undefined, file.name);

    // Add processing message
    const processingId = addMessage(
      "assistant",
      "enhancement",
      "Enhancing your photo...",
      undefined,
      imageUrl,
      undefined,
      file.name,
      undefined,
      undefined,
      true
    );

    setIsProcessing(true);

    try {
      // Convert file to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Test backend connection
      const backendUrl = "http://localhost:5000";
      console.log("Backend URL:", backendUrl);
      try {
        await fetch(`${backendUrl}/health`);
      } catch {
        throw new Error("Backend is not accessible. Please make sure it's running.");
      }

      // Process enhancement
      const request = {
        user_id: session?.user?.id || "anonymous",
        enhancement_type: "auto",
        return_format: "base64" as const,
        image_base64: base64Data,
      };

      console.log("Starting enhancement...");

      const enhancementResult = await backendClient.enhancePhotoWithProgress(
        request,
        (progress) => {
          console.log("Progress:", progress);
          updateMessage(processingId, {
            content: `Enhancing your photo... ${Math.round(progress)}%`,
          });
        }
      );

      console.log("Enhancement result:", enhancementResult);

      if (enhancementResult.success) {
        let enhancedBase64 = enhancementResult.enhanced_base64;
        if (enhancedBase64?.startsWith("data:")) {
          enhancedBase64 = enhancedBase64.split(",")[1];
        }

        console.log("Updating message with result...");
        // Update processing message with result
        updateMessage(processingId, {
          isProcessing: false,
          content: undefined,
          enhancedBase64: enhancedBase64,
          enhancedImageUrl: enhancementResult.enhanced_url,
          processingTime: enhancementResult.processing_time,
          enhancementsApplied: enhancementResult.enhancements_applied || [],
        });
        console.log("Message updated successfully");
      } else {
        throw new Error(enhancementResult.error || "Enhancement failed");
      }
    } catch (error) {
      console.error("Enhancement error:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== processingId));
      addMessage(
        "assistant",
        "text",
        `Enhancement failed: ${error instanceof Error ? error.message : "Please try again."}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnhanceAgain = async (enhancedBase64: string, filename: string) => {
    // Convert base64 to blob URL for display
    const byteCharacters = atob(enhancedBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    const imageUrl = URL.createObjectURL(blob);

    // Add user message with enhanced image
    addMessage("user", "image", undefined, imageUrl, undefined, undefined, filename);

    // Add processing message
    const processingId = addMessage(
      "assistant",
      "enhancement",
      "Enhancing your photo...",
      undefined,
      imageUrl,
      undefined,
      filename,
      undefined,
      undefined,
      true
    );

    setIsProcessing(true);

    try {
      // Test backend connection
      const backendUrl = "http://localhost:5000";
      try {
        await fetch(`${backendUrl}/health`);
      } catch {
        throw new Error("Backend is not accessible. Please make sure it's running.");
      }

      // Process enhancement with the enhanced image
      const request = {
        user_id: session?.user?.id || "anonymous",
        enhancement_type: "auto",
        return_format: "base64" as const,
        image_base64: enhancedBase64,
      };

      console.log("Starting enhancement again...");

      const enhancementResult = await backendClient.enhancePhotoWithProgress(
        request,
        (progress) => {
          console.log("Progress:", progress);
          updateMessage(processingId, {
            content: `Enhancing your photo... ${Math.round(progress)}%`,
          });
        }
      );

      console.log("Enhancement result:", enhancementResult);

      if (enhancementResult.success) {
        let newEnhancedBase64 = enhancementResult.enhanced_base64;
        if (newEnhancedBase64?.startsWith("data:")) {
          newEnhancedBase64 = newEnhancedBase64.split(",")[1];
        }

        console.log("Updating message with result...");
        // Update processing message with result
        updateMessage(processingId, {
          isProcessing: false,
          content: undefined,
          enhancedBase64: newEnhancedBase64,
          enhancedImageUrl: enhancementResult.enhanced_url,
          processingTime: enhancementResult.processing_time,
          enhancementsApplied: enhancementResult.enhancements_applied || [],
        });
        console.log("Message updated successfully");
      } else {
        throw new Error(enhancementResult.error || "Enhancement failed");
      }
    } catch (error) {
      console.error("Enhancement error:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== processingId));
      addMessage(
        "assistant",
        "text",
        `Enhancement failed: ${error instanceof Error ? error.message : "Please try again."}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput("");
    addMessage("user", "text", userMessage);

    // Simple responses for text messages
    setTimeout(() => {
      if (userMessage.toLowerCase().includes("help") || userMessage.toLowerCase().includes("how")) {
        addMessage(
          "assistant",
          "text",
          "To enhance a photo, simply drag and drop an image or click the upload button. I'll automatically improve clarity, colors, and overall quality!"
        );
      } else if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
        addMessage("assistant", "text", "Hello! Ready to enhance some photos? Just upload an image!");
      } else {
        addMessage(
          "assistant",
          "text",
          "I'm here to help enhance your photos! Upload an image to get started. You can drag and drop or use the upload button."
        );
      }
    }, 500);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-white">
        <ChatMessages
          messages={messages}
          session={session}
          onImageClick={(imageUrl, title, type) =>
            setImageViewer({ isOpen: true, imageUrl, title, type })
          }
          onEnhanceAgain={handleEnhanceAgain}
        />
        <ChatInput
          input={input}
          setInput={setInput}
          isProcessing={isProcessing}
          dragActive={dragActive}
          onDrag={setDragActive}
          onDrop={(e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          }}
          onFileSelect={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          onSend={handleSend}
        />
      </div>
      <ImageViewer
        viewer={imageViewer}
        onClose={() => setImageViewer({ ...imageViewer, isOpen: false })}
      />
    </>
  );
}
