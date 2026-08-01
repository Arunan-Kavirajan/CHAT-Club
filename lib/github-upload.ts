export async function uploadImageToGithub(file: File, folder = "uploads"): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload-photo", {
    method: "POST",
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
}

export async function deleteFolderFromGithub(folder: string): Promise<void> {
  await fetch("/api/delete-photo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
}