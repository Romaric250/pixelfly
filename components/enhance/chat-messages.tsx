"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Sparkles, Download, Loader2, Maximize2, CheckCircle2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatMessage } from "@/app/enhance/page";
import { useEffect, useRef } from "react";

interface ChatMessagesProps {
  messages: ChatMessage[];
  session: any;
  onImageClick: (imageUrl: string, title: string, type: "original" | "enhanced") => void;
  onEnhanceAgain?: (enhancedBase64: string, filename: string) => void;
}

export function ChatMessages({ messages, session, onImageClick, onEnhanceAgain }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
    <ScrollArea className="flex-1">
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
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
                <Avatar className="h-9 w-9 shrink-0 border-2 border-purple-100">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={cn(
                  "flex flex-col gap-1.5 max-w-[75%]",
                  message.role === "user" ? "items-end" : "items-start"
                )}
              >
                {/* Text Messages */}
                {message.type === "text" && message.content && (
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    {message.content}
                  </div>
                )}

                {/* Image Messages */}
                {message.type === "image" && message.imageUrl && (
                  <div className="group relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow max-w-md">
                    <img
                      src={message.imageUrl}
                      alt={message.filename || "Uploaded image"}
                      className="w-full h-auto max-h-96 object-contain bg-gray-50 cursor-pointer"
                      onClick={() => onImageClick(message.imageUrl!, message.filename || "Original Image", "original")}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 flex items-center gap-1.5">
                        <Maximize2 className="h-3.5 w-3.5" />
                        Click to view
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhancement Results */}
                {message.type === "enhancement" && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4 max-w-2xl">
                    {message.isProcessing ? (
                      <div className="flex items-center gap-3 py-2">
                        <Loader2 className="h-5 w-5 text-purple-600 animate-spin shrink-0" />
                        <span className="text-gray-700 text-sm">{message.content || "Enhancing your photo..."}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-semibold text-gray-800">Enhancement Complete</span>
                        </div>
                        {/* Enhanced Image Only */}
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-2">Enhanced</div>
                          <div
                            className="group relative rounded-lg overflow-hidden border-2 border-purple-300 cursor-pointer hover:border-purple-400 transition-colors"
                            onClick={() => onImageClick(
                              message.enhancedBase64
                                ? `data:image/jpeg;base64,${message.enhancedBase64}`
                                : message.enhancedImageUrl || "",
                              message.filename || "Enhanced Image",
                              "enhanced"
                            )}
                          >
                            <img
                              src={
                                message.enhancedBase64
                                  ? `data:image/jpeg;base64,${message.enhancedBase64}`
                                  : message.enhancedImageUrl || ""
                              }
                              alt="Enhanced"
                              className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
                            />
                            <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded font-medium">
                              PixelFly
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1 text-xs font-medium text-gray-700 flex items-center gap-1.5">
                                <Maximize2 className="h-3 w-3" />
                                View
                              </div>
                            </div>
                          </div>
                        </div>
                        {message.enhancedBase64 && message.filename && (
                          <div className="flex gap-2">
                            {onEnhanceAgain && (
                              <Button
                                onClick={() => onEnhanceAgain(message.enhancedBase64!, message.filename!)}
                                size="sm"
                                variant="outline"
                                className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Enhance Again
                              </Button>
                            )}
                            <Button
                              onClick={() => downloadEnhanced(message.enhancedBase64!, message.filename!)}
                              size="sm"
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        )}
                        {message.enhancementsApplied && message.enhancementsApplied.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100">
                            {message.enhancementsApplied.map((enhancement, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full font-medium"
                              >
                                {enhancement.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                              </span>
                            ))}
                          </div>
                        )}
                        {message.processingTime && (
                          <div className="text-xs text-gray-400 text-center pt-1">
                            Processed in {message.processingTime.toFixed(2)}s
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-400 px-1.5">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {message.role === "user" && (
                <Avatar className="h-9 w-9 shrink-0 border-2 border-gray-100">
                  <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
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
  );
}
