import { supabase } from "@/lib/supabase";

const BUCKET = "myBucket";

/**
 * Extracts the storage file path from a Supabase public URL.
 * e.g. "https://<project>.supabase.co/storage/v1/object/public/myBucket/1234-image.jpg"
 *      → "1234-image.jpg"
 */
function extractFilePath(publicUrl: string): string | null {
  try {
    const marker = `/object/public/${BUCKET}/`;
    const idx = publicUrl.indexOf(marker);
    if (idx === -1) return null;
    return decodeURIComponent(publicUrl.slice(idx + marker.length));
  } catch {
    return null;
  }
}

/**
 * Deletes a file from Supabase storage given its public URL.
 * Silently ignores errors so it never blocks an upload.
 */
export async function deleteFileFromSupabase(publicUrl: string): Promise<void> {
  const path = extractFilePath(publicUrl);
  if (!path) return;

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.warn("Failed to delete old file from Supabase:", error.message);
  }
}

/**
 * Uploads new File objects to Supabase storage.
 *
 * @param files    Array of File objects (new upload) or existing string URLs / null (kept as-is).
 * @param oldUrls  Optional array of old public URLs to delete before uploading.
 */
export async function uploadFiles(
  files: (File | string | null)[],
  oldUrls?: (string | null | undefined)[],
): Promise<(string | null)[]> {
  const fileIndices: number[] = [];
  const filesToUpload: File[] = [];

  files.forEach((file, index) => {
    if (file instanceof File) {
      filesToUpload.push(file);
      fileIndices.push(index);
    }
  });

  // Delete old files from Supabase before uploading replacements
  if (oldUrls && oldUrls.length > 0) {
    await Promise.all(
      oldUrls.map((url) => {
        if (url && typeof url === "string") {
          return deleteFileFromSupabase(url);
        }
        return Promise.resolve();
      }),
    );
  }

  if (fileIndices.length === 0) {
    // No new files to upload — return existing strings/nulls as-is
    return files.map((f) => (typeof f === "string" ? f : null));
  }

  try {
    const uploadedUrls: string[] = [];

    for (const file of filesToUpload) {
      const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.\-_]/g, "")}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase Storage Error:", error);
        throw new Error(`Supabase Storage Error: ${error.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    const result = [...files];
    let uploadIdx = 0;
    files.forEach((file, index) => {
      if (file instanceof File) {
        result[index] = uploadedUrls[uploadIdx++];
      } else if (typeof file === "string") {
        result[index] = file;
      } else {
        result[index] = null;
      }
    });

    return result as (string | null)[];
  } catch (err) {
    console.error("Upload error", err);
    throw err;
  }
}
