import { auth } from "@/lib/firebase";
import { compressImage } from "@/lib/compress-image";

async function authHeader(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadImageToGithub(file: File, folder = "uploads"): Promise<string> {
  const compressed = await compressImage(file);

  const formData = new FormData();
  formData.append("file", compressed);
  formData.append("folder", folder);

  const response = await fetch("/api/upload-photo", {
    method: "POST",
    headers: await authHeader(),
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Upload failed.");
  }

  return data.url as string;
}

export async function deleteImageFromGithub(url: string): Promise<void> {
  await fetch("/api/delete-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify({ url }),
  });
}

export async function deleteFolderFromGithub(folder: string): Promise<void> {
  await fetch("/api/delete-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(await authHeader()) },
    body: JSON.stringify({ folder }),
  });
}