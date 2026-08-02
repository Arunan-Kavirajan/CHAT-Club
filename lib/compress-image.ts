// Resizes + re-encodes an image client-side before upload. Phone photos
// routinely come in at 8-15MB and far higher resolution than any web
// page displays — this keeps uploads small without the person ever
// needing to think about it.
export async function compressImage(
  file: File,
  maxDimension = 1920,
  quality = 0.82,
): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    // `imageOrientation: "from-image"` applies the photo's EXIF rotation
    // flag — without this, portrait phone photos can come out sideways,
    // since the raw pixel data is often stored landscape either way.
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    return file; // if decoding fails for any reason, fall back to the original
  }

  let { width, height } = bitmap;
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(bitmap, 0, 0, width, height);

  // PNGs stay PNG (lossless — resizing alone still shrinks them a lot).
  // Everything else becomes JPEG, which compresses far better for photos.
  const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, outputType, quality),
  );
  if (!blob) return file;

  const newName = file.name.replace(
    /\.[^.]+$/,
    outputType === "image/png" ? ".png" : ".jpg",
  );
  return new File([blob], newName, { type: outputType });
}