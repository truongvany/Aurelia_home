import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";

export interface CloudinaryUploadOptions {
  folder?: string;
  public_id?: string;
  resource_type?: "auto" | "image" | "video" | "raw";
  overwrite?: boolean;
}

/**
 * Upload a file buffer to Cloudinary
 * @param buffer - File buffer to upload
 * @param filename - Original filename (for context)
 * @param options - Additional Cloudinary options
 * @returns Promise with upload result containing secure_url
 */
export const uploadToCloudinary = async (
  buffer: Buffer,
  filename: string,
  options?: CloudinaryUploadOptions
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options?.folder || "kingman_products",
        resource_type: options?.resource_type || "auto",
        public_id: options?.public_id,
        overwrite: options?.overwrite ?? false,
        ...(options ? Object.fromEntries(Object.entries(options).filter(([k]) => !["folder", "resource_type", "public_id", "overwrite"].includes(k))) : {})
      },
      (error, result) => {
        if (error) {
          const errorMessage =
            typeof error === "object" && error !== null && "message" in error
              ? String((error as { message?: unknown }).message ?? "Cloudinary upload failed")
              : "Cloudinary upload failed";
          reject(new Error(errorMessage));
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to uploader
    const stream = Readable.from(buffer);
    stream.pipe(uploadStream);
  });
};

/**
 * Delete a file from Cloudinary by URL or public_id
 * @param publicId - The public_id of the file to delete
 * @returns Promise with deletion result
 */
export const deleteFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

/**
 * Extract public_id from a Cloudinary URL
 * @param url - The Cloudinary URL
 * @returns The public_id
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  const match = url.match(/\/v\d+\/(.+?)\.\w+$/);
  return match ? match[1] : null;
};
