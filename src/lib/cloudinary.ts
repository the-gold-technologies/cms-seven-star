import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "mbip34n2",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Extracts the Cloudinary public_id from a secure URL.
 * e.g. "https://res.cloudinary.com/.../upload/v1234/seven_star/123-image.webp"
 *      → "seven_star/123-image"
 */
export function extractCloudinaryPublicId(url: string): string | null {
  try {
    const regex = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Uploads a buffer directly to Cloudinary.
 */
export async function uploadBufferToCloudinary(
  buffer: Buffer,
  fileName: string,
  options?: {
    folder?: string;
    resourceType?: "image" | "raw" | "video" | "auto";
  }
): Promise<UploadApiResponse> {
  const folder = options?.folder || process.env.CLOUDINARY_FOLDER || "seven_star";
  const resourceType = options?.resourceType || "auto";

  // Strip extension for public_id to let Cloudinary manage formats
  const lastDot = fileName.lastIndexOf(".");
  const publicId = lastDot > 0 ? fileName.slice(0, lastDot) : fileName;

  return new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: resourceType,
        overwrite: true,
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("No result returned from Cloudinary"));
        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes a file from Cloudinary given its public URL.
 * Silently ignores errors so it never blocks workflows.
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
  const publicId = extractCloudinaryPublicId(url);
  if (!publicId) return;

  try {
    // Attempt deletion as image first, fallback to raw/video if needed
    const res = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });
    if (res.result !== "ok") {
      // Try raw/video
      await cloudinary.uploader.destroy(publicId, {
        resource_type: "raw",
        invalidate: true,
      });
    }
  } catch (err) {
    console.warn("Failed to delete asset from Cloudinary:", err);
  }
}
