import { NextResponse } from "next/server";

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Strips anything outside [a-zA-Z0-9-_] per path segment — a ".." segment
// becomes empty and gets dropped, which neutralizes path traversal.
function sanitizeFolder(folder: string): string {
  const cleaned = folder
    .split("/")
    .map((part) => part.replace(/[^a-zA-Z0-9-_]/g, ""))
    .filter(Boolean)
    .join("/");
  return cleaned || "uploads";
}

export async function POST(request: Request) {
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GitHub upload isn't configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const rawFolder = (formData.get("folder") as string | null) || "uploads";
  const folder = sanitizeFolder(rawFolder);

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image." }, { status: 400 });
  }

  const MAX_BYTES = 4 * 1024 * 1024;
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4MB." }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const base64Content = Buffer.from(arrayBuffer).toString("base64");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const githubResponse = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({
        message: `Upload ${path}`,
        content: base64Content,
        branch: GITHUB_BRANCH,
      }),
    },
  );

  if (!githubResponse.ok) {
    const errorText = await githubResponse.text();
    console.error("GitHub upload failed:", githubResponse.status, errorText);
    return NextResponse.json({ error: "Upload to GitHub failed." }, { status: 502 });
  }

  const data = await githubResponse.json();
  const url = data.content?.download_url as string | undefined;

  if (!url) {
    return NextResponse.json(
      { error: "Upload succeeded but no URL returned." },
      { status: 502 },
    );
  }

  return NextResponse.json({ url });
}