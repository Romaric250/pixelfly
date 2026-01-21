"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { backendClient } from "@/lib/backend-client";
import { useSession } from "@/lib/auth-client";
import { 
  Send, 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Loader2,
  Upload,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
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

export default function EnhancePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      type: "text",
      content: "👋 Hi! I'm your AI photo enhancement assistant. Upload a photo and I'll make it pop with stunning clarity and vibrant colors!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Authentication check
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addMessage("assistant", "text", "Please upload an image file (JPG, PNG, WebP).");
      return;
    }

    // Add user message with image preview
    const userMessageId = `user-${Date.now()}`;
    const imageUrl = URL.createObjectURL(file);
    
    addMessage("user", "image", undefined, imageUrl, undefined, undefined, file.name);

    // Add processing message
    const processingId = `processing-${Date.now()}`;
    addMessage("assistant", "enhancement", undefined, undefined, undefined, undefined, undefined, undefined, undefined, true);

    setIsProcessing(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          const base64 = base64Data.split(",")[1];

          // Test backend connection
          const backendUrl = "http://localhost:5000"
          // const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://pixelfly.onrender.com";
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
            image_base64: base64,
          };

          const enhancementResult = await backendClient.enhancePhotoWithProgress(
            request,
            (progress) => {
              // Update progress in processing message
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === processingId
                    ? { ...msg, content: `Processing... ${Math.round(progress)}%` }
                    : msg
                )
              );
            }
          );

          if (enhancementResult.success) {
            let enhancedBase64 = enhancementResult.enhanced_base64;
            if (enhancedBase64?.startsWith("data:")) {
              enhancedBase64 = enhancedBase64.split(",")[1];
            }

            // Remove processing message and add result
            setMessages((prev) =>
              prev
                .filter((msg) => msg.id !== processingId)
                .map((msg) =>
                  msg.id === userMessageId
                    ? {
                        ...msg,
                        originalImageUrl: imageUrl,
                      }
                    : msg
                )
                .concat({
                  id: `enhanced-${Date.now()}`,
                  role: "assistant",
                  type: "enhancement",
                  originalImageUrl: imageUrl,
                  enhancedBase64: enhancedBase64,
                  enhancedImageUrl: enhancementResult.enhanced_url,
                  filename: file.name,
                  processingTime: enhancementResult.processing_time,
                  enhancementsApplied: enhancementResult.enhancements_applied,
                  timestamp: new Date(),
                })
            );
          } else {
            throw new Error(enhancementResult.error || "Enhancement failed");
          }
        } catch (error) {
          setMessages((prev) => prev.filter((msg) => msg.id !== processingId));
          addMessage(
            "assistant",
            "text",
            `❌ ${error instanceof Error ? error.message : "Enhancement failed. Please try again."}`
          );
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setMessages((prev) => prev.filter((msg) => msg.id !== processingId));
      addMessage("assistant", "text", "❌ Failed to process image. Please try again.");
      setIsProcessing(false);
    }
  };

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
          "To enhance a photo, simply drag and drop an image or click the upload button. I'll automatically improve clarity, colors, and overall quality! 📸✨"
        );
      } else if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi")) {
        addMessage("assistant", "text", "Hello! Ready to enhance some photos? Just upload an image! 🚀");
      } else {
        addMessage(
          "assistant",
          "text",
          "I'm here to help enhance your photos! Upload an image to get started. You can drag and drop or use the upload button. 🎨"
        );
      }
    }, 500);
  };

  const downloadEnhanced = (base64: string, filename: string) => {
    try {
      let cleanBase64 = base64;
      if (cleanBase64.startsWith("data:")) {
        cleanBase64 = cleanBase64.split(",")[1];
      }

      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/jpeg" });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `enhanced-${filename}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
        {/* Chat Container */}
        <ScrollArea className="flex-1 px-4">
          <div className="max-w-3xl mx-auto py-6 space-y-6" ref={scrollRef}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={cn(
                      "flex flex-col gap-2 max-w-[80%]",
                      message.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    {/* Text Messages */}
                    {message.type === "text" && message.content && (
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2.5 text-sm",
                          message.role === "user"
                            ? "bg-purple-600 text-white"
                            : "bg-white text-gray-800 shadow-sm border border-gray-200"
                        )}
                      >
                        {message.content}
                      </div>
                    )}

                    {/* Image Messages */}
                    {message.type === "image" && message.imageUrl && (
                      <div className="rounded-xl overflow-hidden border-2 border-purple-200 shadow-md max-w-sm">
                        <img
                          src={message.imageUrl}
                          alt={message.filename || "Uploaded image"}
                          className="w-full h-auto max-h-64 object-contain bg-gray-50"
                        />
                      </div>
                    )}

                    {/* Enhancement Results */}
                    {message.type === "enhancement" && (
                      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-4 max-w-2xl">
                        {message.isProcessing ? (
                          <div className="flex items-center gap-3 py-4">
                            <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                            <span className="text-gray-600">{message.content || "Enhancing your photo..."}</span>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm font-semibold text-gray-800 mb-3">
                              ✨ Enhancement Complete!
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              {/* Original */}
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-gray-600">Original</div>
                                <div className="rounded-lg overflow-hidden border border-gray-200">
                                  <img
                                    src={message.originalImageUrl}
                                    alt="Original"
                                    className="w-full h-auto max-h-64 object-contain bg-gray-50"
                                  />
                                </div>
                              </div>
                              {/* Enhanced */}
                              <div className="space-y-2">
                                <div className="text-xs font-medium text-purple-600">Enhanced</div>
                                <div className="rounded-lg overflow-hidden border-2 border-purple-300 relative">
                                  <img
                                    src={
                                      message.enhancedBase64
                                        ? `data:image/jpeg;base64,${message.enhancedBase64}`
                                        : message.enhancedImageUrl || ""
                                    }
                                    alt="Enhanced"
                                    className="w-full h-auto max-h-64 object-contain bg-gray-50"
                                  />
                                  <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                    AI
                                  </div>
                                </div>
                              </div>
                            </div>
                            {message.enhancedBase64 && message.filename && (
                              <Button
                                onClick={() => downloadEnhanced(message.enhancedBase64!, message.filename!)}
                                size="sm"
                                className="w-full bg-purple-600 hover:bg-purple-700"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download Enhanced Image
                              </Button>
                            )}
                            {message.enhancementsApplied && message.enhancementsApplied.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {message.enhancementsApplied.map((enhancement, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
                                  >
                                    {enhancement.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </span>
                                ))}
                              </div>
                            )}
                            {message.processingTime && (
                              <div className="text-xs text-gray-500 text-center">
                                Processed in {message.processingTime.toFixed(2)}s
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 px-2">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-gray-200 text-gray-600">
                        {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-3xl mx-auto p-4">
            {/* Drag and Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                "mb-3 border-2 border-dashed rounded-lg p-4 text-center transition-colors",
                dragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-purple-400"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Upload className="h-4 w-4" />
                <span>
                  Drag and drop an image here, or{" "}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-purple-600 hover:text-purple-700 font-medium"
                  >
                    click to upload
                  </button>
                </span>
              </div>
            </div>

            {/* Text Input */}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything about photo enhancement..."
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
