import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // For now, allow all requests - Better Auth handles its own middleware
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
