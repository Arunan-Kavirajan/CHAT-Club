import { NextResponse } from "next/server";

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const GITHUB_HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

function extractPathFromRawUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== "raw.githubusercontent.com") return null;
    const parts = u.pathname.split("/").filter(Boolean); // [owner, repo, branch, ...path]
    if (parts.length < 4) return null;
    return decodeURIComponent(parts.slice(3).join("/"));
  } catch {
    return null;
  }
}

function sanitizeFolder(folder: string): string {
  return folder
    .split("/")
    .map((part) => part.replace(/[^a-zA-Z0-9-_]/g, ""))
    .filter(Boolean)
    .join("/");
}

async function deleteFileByPath(path: string) {
  const infoRes = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: GITHUB_HEADERS },
  );
  if (!infoRes.ok) return; // already gone, or never existed — not fatal

  const info = await infoRes.json();
  const sha = info.sha as string | undefined;
  if (!sha) return;

  await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: "DELETE",
      headers: { ...GITHUB_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Delete ${path}`, sha, branch: GITHUB_BRANCH }),
    },
  );
}

export async function POST(request: Request) {
  if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
    return NextResponse.json({ error: "GitHub delete isn't configured." }, { status: 500 });
  }

  const body = await request.json();
  const { url, folder } = body as { url?: string; folder?: string };

  try {
    if (url) {
      const path = extractPathFromRawUrl(url);
      if (path) await deleteFileByPath(path);
    } else if (folder) {
      const safeFolder = sanitizeFolder(folder);
      if (!safeFolder) {
        return NextResponse.json({ error: "Invalid folder." }, { status: 400 });
      }
      const listRes = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${safeFolder}?ref=${GITHUB_BRANCH}`,
        { headers: GITHUB_HEADERS },
      );
      if (listRes.ok) {
        const items = await listRes.json();
        if (Array.isArray(items)) {
          for (const item of items) {
            if (item.type === "file" && item.sha) {
              await fetch(
                `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${safeFolder}/${item.name}`,
                {
                  method: "DELETE",
                  headers: { ...GITHUB_HEADERS, "Content-Type": "application/json" },
                  body: JSON.stringify({
                    message: `Delete ${safeFolder}/${item.name}`,
                    sha: item.sha,
                    branch: GITHUB_BRANCH,
                  }),
                },
              );
            }
          }
        }
      }
    } else {
      return NextResponse.json({ error: "Provide url or folder." }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("delete-photo failed:", err);
    return NextResponse.json({ error: "Delete failed." }, { status: 502 });
  }
}