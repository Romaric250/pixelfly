import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";

const f = createUploadthing();

// Authentication function using Better Auth
const getUser = async (req: Request) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    return session?.user || null;
  } catch (error) {
    return null;
  }
};

// FileRouter for PixelFly - handles photo uploads for enhancement and watermarking
export const ourFileRouter = {
  // Photo uploader for AI enhancement
  photoEnhancer: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 1
    }
  })
    .middleware(async ({ req }) => {
      const user = await getUser(req);

      // Allow uploads for authenticated users
      if (!user) throw new UploadThingError("Please sign in to upload photos");

      return {
        userId: user.id,
        userEmail: user.email,
        uploadType: "enhancement"
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Photo uploaded for enhancement:", {
        userId: metadata.userId,
        fileUrl: file.url,
        fileName: file.name,
        fileSize: file.size
      });

      // TODO: Trigger AI enhancement process here
      // This will be connected to our Flask backend

      return {
        uploadedBy: metadata.userId,
        originalUrl: file.url,
        fileName: file.name,
        uploadType: metadata.uploadType
      };
    }),

  // Bulk photo uploader for watermarking
  bulkWatermarker: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 50 // Allow bulk uploads
    }
  })
    .middleware(async ({ req }) => {
      const user = await getUser(req);

      if (!user) throw new UploadThingError("Please sign in to upload photos");

      return {
        userId: user.id,
        userEmail: user.email,
        uploadType: "watermarking"
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Photos uploaded for watermarking:", {
        userId: metadata.userId,
        fileCount: Array.isArray(file) ? file.length : 1,
        uploadType: metadata.uploadType
      });

      // TODO: Trigger bulk watermarking process here
      // This will be connected to our Flask backend

      return {
        uploadedBy: metadata.userId,
        uploadType: metadata.uploadType,
        fileCount: Array.isArray(file) ? file.length : 1
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;