// import { BulkWatermarker } from "@/components/watermarking/bulk-watermarker";

export default function WatermarkPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bulk Photo Watermarking
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Add watermarks to multiple photos at once with AI-powered placement
        </p>
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <p className="text-gray-600">
            Bulk watermarking feature coming soon! The backend is ready and waiting.
          </p>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Bulk Photo Watermarking | PixelFly",
  description: "Add watermarks to multiple photos at once with AI-powered placement optimization. Protect your images with smart, professional watermarking.",
};
