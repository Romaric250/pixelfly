import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Force dynamic rendering - no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log("📊 Fetching real-time stats from database...");

    // Get real user count
    const totalUsers = await db.user.count();
    console.log(`👥 Total users: ${totalUsers}`);

    // Get real photo enhancement count
    const photosEnhanced = await db.photoEnhancement.count({
      where: {
        success: true
      }
    });
    console.log(`📸 Photos enhanced: ${photosEnhanced}`);

    // Get real photo watermarking count (sum of photoCount for successful operations)
    const watermarkOperations = await db.photoWatermark.findMany({
      where: {
        success: true
      },
      select: {
        photoCount: true
      }
    });

    const photosWatermarked = watermarkOperations.reduce((total: number, op: any) => total + op.photoCount, 0);
    console.log(`🛡️ Photos watermarked: ${photosWatermarked}`);

    const stats = {
      users: totalUsers,
      photosEnhanced: photosEnhanced,
      photosWatermarked: photosWatermarked,
    };

    console.log("✅ Stats fetched successfully:", stats);

    // Return with no-cache headers to prevent caching
    return NextResponse.json(stats, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });

  } catch (error) {
    console.error("❌ Error fetching stats:", error);

    // Return fallback stats if database is unavailable
    const fallbackStats = {
      users: 0,
      photosEnhanced: 0,
      photosWatermarked: 0,
    };

    console.log("⚠️ Using fallback stats:", fallbackStats);

    // Return fallback stats with no-cache headers
    return NextResponse.json(fallbackStats, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
      },
    });
  }
}
