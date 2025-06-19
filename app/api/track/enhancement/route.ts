import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log("📊 Tracking enhancement operation:", data);

    const {
      userId,
      filename,
      fileSize,
      processingTime,
      enhancementType,
      success = true
    } = data;

    // Create enhancement record in database
    const enhancement = await db.photoEnhancement.create({
      data: {
        userId: userId === 'anonymous' ? null : userId,
        filename: filename || null,
        fileSize: fileSize || null,
        processingTime: processingTime || 0,
        enhancementType: enhancementType || 'smart_enhancement',
        success: success,
      },
    });

    console.log("✅ Enhancement tracked successfully:", enhancement.id);

    return NextResponse.json({ 
      success: true, 
      id: enhancement.id 
    });

  } catch (error) {
    console.error("❌ Error tracking enhancement:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to track enhancement" 
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
