// Firebase Storage Alternative (Currently Commented Out)
// Uncomment and configure when ready to switch from UploadThing

/*
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export interface UploadResult {
  url: string;
  fileName: string;
  filePath: string;
}

export class FirebaseStorageService {
  // Upload single photo for enhancement
  static async uploadPhotoForEnhancement(
    file: File, 
    userId: string
  ): Promise<UploadResult> {
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = `photos/enhancement/${userId}/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return { url, fileName, filePath };
  }

  // Upload multiple photos for watermarking
  static async uploadPhotosForWatermarking(
    files: File[], 
    userId: string
  ): Promise<UploadResult[]> {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${uuidv4()}-${file.name}`;
      const filePath = `photos/watermarking/${userId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      
      return { url, fileName, filePath };
    });
    
    return Promise.all(uploadPromises);
  }

  // Upload processed photo (enhanced or watermarked)
  static async uploadProcessedPhoto(
    file: Blob, 
    userId: string, 
    originalFileName: string,
    processType: 'enhanced' | 'watermarked'
  ): Promise<UploadResult> {
    const fileName = `${processType}-${uuidv4()}-${originalFileName}`;
    const filePath = `photos/processed/${processType}/${userId}/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return { url, fileName, filePath };
  }

  // Delete photo from storage
  static async deletePhoto(filePath: string): Promise<void> {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  }

  // Get download URL for existing file
  static async getDownloadURL(filePath: string): Promise<string> {
    const storageRef = ref(storage, filePath);
    return getDownloadURL(storageRef);
  }
}

// Environment variables to add to .env when switching to Firebase:
// FIREBASE_API_KEY=your_api_key
// FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
// FIREBASE_PROJECT_ID=your_project_id
// FIREBASE_STORAGE_BUCKET=your_project.appspot.com
// FIREBASE_MESSAGING_SENDER_ID=your_sender_id
// FIREBASE_APP_ID=your_app_id
*/

// For now, we're using UploadThing
export const StorageService = {
  uploadPhotoForEnhancement: () => {
    throw new Error("Currently using UploadThing. Switch to Firebase when ready.");
  },
  uploadPhotosForWatermarking: () => {
    throw new Error("Currently using UploadThing. Switch to Firebase when ready.");
  }
};
