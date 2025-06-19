import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("📊 Tracking watermark operation:", data);

    const {
      userId,
      filename,
      fileSize,
      processingTime,
      watermarkText,
      watermarkStyle,
      watermarkPosition,
      photoCount = 1,
      success = true
    } = data;

    // Create watermark record in database
    const watermark = await db.photoWatermark.create({
      data: {
        userId: userId === 'anonymous' ? null : userId,
        filename: filename || null,
        fileSize: fileSize || null,
        processingTime: processingTime || 0,
        watermarkText: watermarkText || null,
        watermarkStyle: watermarkStyle || null,
        watermarkPosition: watermarkPosition || null,
        photoCount: photoCount,
        success: success,
      },
    });

    console.log("✅ Watermark tracked successfully:", watermark.id);

    return NextResponse.json({ 
      success: true, 
      id: watermark.id 
    });

  } catch (error) {
    console.error("❌ Error tracking watermark:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to track watermark" 
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
