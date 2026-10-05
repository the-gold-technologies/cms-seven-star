/**
 * Deletes a file from Cloudinary given its public URL.
 * Silently ignores errors so it never blocks an upload.
 */
export async function deleteFileFromSupabase(publicUrl: string): Promise<void> {
  if (!publicUrl) return;

  if (publicUrl.includes("cloudinary.com")) {
    try {
      await fetch(`/api/upload?url=${encodeURIComponent(publicUrl)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("Failed to delete file from Cloudinary:", err);
    }
  }
}

/**
 * Compresses an image file on the client side using HTML5 Canvas
 * and outputs a WebP file.
 */
async function compressImageToWebP(
  file: File,
  maxWidth = 1920,
  quality = 0.8,
): Promise<File> {
  return new Promise((resolve) => {
    // Only compress standard images (excluding GIFs)
    if (!file.type.startsWith("image/") || file.type.includes("gif")) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Resize if width exceeds maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file); // Fallback to original
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve(file); // Fallback to original
            }
            const baseName =
              file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const compressedFile = new File([blob], `${baseName}.webp`, {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/webp",
          quality,
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
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
      // Compress file on client side first (reduces bandwidth & server load)
      const processedFile = await compressImageToWebP(file);

      const formData = new FormData();
      formData.append("file", processedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.statusText}`);
      }

      const json = await res.json();
      if (!json.success || !json.files || json.files.length === 0) {
        throw new Error(json.error || "Invalid response from upload API");
      }

      uploadedUrls.push(json.files[0]);
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
