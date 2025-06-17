// import { PhotoEnhancer } from "@/components/photo-enhancement/photo-enhancer";

export default function EnhancePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Photo Enhancement
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Transform your photos to iPhone 14 Pro Max quality with AI
        </p>
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <p className="text-gray-600">
            Photo enhancement feature coming soon! The backend is ready and waiting.
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "AI Photo Enhancement | PixelFly",
  description: "Transform your photos to iPhone 14 Pro Max quality with AI-powered enhancement. Upload any photo and watch our advanced AI enhance it to professional quality in seconds.",
};
