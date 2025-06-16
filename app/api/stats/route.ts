import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get real number of users from database
    const totalUsers = await db.user.count();

    // TODO: These will be implemented when we add the photo enhancement and watermarking features
    // For now, we'll use placeholder values that will be replaced with real data later
    const photosEnhanced = 0; // Will be counted from PhotoEnhancement model
    const photosWatermarked = 0; // Will be counted from PhotoWatermark model

    const stats = {
      users: totalUsers, // Real user count from database
      photosEnhanced: photosEnhanced, // Will be real count when feature is implemented
      photosWatermarked: photosWatermarked, // Will be real count when feature is implemented
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);

    // Return fallback stats if database is unavailable
    return NextResponse.json({
      users: 0, // Real fallback - no fake numbers
      photosEnhanced: 0,
      photosWatermarked: 0,
    });
  }
}
