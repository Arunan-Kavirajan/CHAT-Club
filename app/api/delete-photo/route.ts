import { NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const API_BASE = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;

const GITHUB_HEADERS = {
  Authorization: `Bearer ${GITHUB_TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

const GITHUB_JSON_HEADERS = {
  ...GITHUB_HEADERS,
  "Content-Type": "application/json",
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

async function deleteFileByPath(path: string): Promise<boolean> {
  const infoRes = await fetch(
    `${API_BASE}/contents/${path}?ref=${GITHUB_BRANCH}`,
    { headers: GITHUB_HEADERS },
  );
  if (!infoRes.ok) return true; // already gone — not an error

  const info = await infoRes.json();
  const sha = info.sha as string | undefined;
  if (!sha) return true;

  const deleteRes = await fetch(`${API_BASE}/contents/${path}`, {
    method: "DELETE",
    headers: GITHUB_JSON_HEADERS,
    body: JSON.stringify({ message: `Delete ${path}`, sha, branch: GITHUB_BRANCH }),
  });

  if (!deleteRes.ok) {
    console.error("Single file delete failed:", path, deleteRes.status, await deleteRes.text());
  }
  return deleteRes.ok;
}

// Uses GitHub's documented deletion mechanism: a tree entry with the
// same path and sha: null, submitted against a base_tree, tells GitHub
// to remove just that file. Only the files actually being deleted go in
// the payload — not a full rebuild of every file in the repo — so a
// stray unusual entry elsewhere in a growing repo can't break this.
async function attemptFolderDelete(
  folder: string,
): Promise<"success" | "conflict" | "no-files" | "error"> {
  const refRes = await fetch(`${API_BASE}/git/ref/heads/${GITHUB_BRANCH}`, {
    headers: GITHUB_HEADERS,
  });
  if (!refRes.ok) {
    console.error("Failed to get branch ref:", refRes.status, await refRes.text());
    return "error";
  }
  const refData = await refRes.json();
  const commitSha = refData.object?.sha as string | undefined;
  if (!commitSha) return "error";

  const commitRes = await fetch(`${API_BASE}/git/commits/${commitSha}`, {
    headers: GITHUB_HEADERS,
  });
  if (!commitRes.ok) return "error";
  const commitData = await commitRes.json();
  const rootTreeSha = commitData.tree?.sha as string | undefined;
  if (!rootTreeSha) return "error";

  const treeRes = await fetch(
    `${API_BASE}/git/trees/${rootTreeSha}?recursive=1`,
    { headers: GITHUB_HEADERS },
  );
  if (!treeRes.ok) return "error";
  const treeData = await treeRes.json();

  type TreeEntry = { path: string; mode: string; type: string; sha: string };
  const allEntries = (treeData.tree || []) as TreeEntry[];

  const prefix = `${folder}/`;
  const toDelete = allEntries.filter(
    (entry) => entry.type === "blob" && entry.path.startsWith(prefix),
  );

  if (toDelete.length === 0) {
    return "no-files"; // folder's already empty/gone — nothing to do
  }

  const newTreeRes = await fetch(`${API_BASE}/git/trees`, {
    method: "POST",
    headers: GITHUB_JSON_HEADERS,
    body: JSON.stringify({
      base_tree: rootTreeSha,
      tree: toDelete.map((e) => ({
        path: e.path,
        mode: e.mode,
        type: "blob",
        sha: null,
      })),
    }),
  });
  if (!newTreeRes.ok) {
    console.error("Failed to create new tree:", newTreeRes.status, await newTreeRes.text());
    return "error";
  }
  const newTreeData = await newTreeRes.json();
  const newTreeSha = newTreeData.sha as string;

  const newCommitRes = await fetch(`${API_BASE}/git/commits`, {
    method: "POST",
    headers: GITHUB_JSON_HEADERS,
    body: JSON.stringify({
      message: `Delete folder ${folder}`,
      tree: newTreeSha,
      parents: [commitSha],
    }),
  });
  if (!newCommitRes.ok) return "error";
  const newCommitData = await newCommitRes.json();
  const newCommitSha = newCommitData.sha as string;

  const updateRefRes = await fetch(`${API_BASE}/git/refs/heads/${GITHUB_BRANCH}`, {
    method: "PATCH",
    headers: GITHUB_JSON_HEADERS,
    body: JSON.stringify({ sha: newCommitSha }),
  });

  if (updateRefRes.ok) return "success";

  const errorText = await updateRefRes.text();
  if (updateRefRes.status === 422 && errorText.includes("fast forward")) {
    return "conflict"; // branch moved since we read it — safe to retry fresh
  }

  console.error("Failed to update ref:", updateRefRes.status, errorText);
  return "error";
}

async function deleteFolderAtomic(folder: string): Promise<boolean> {
  const MAX_ATTEMPTS = 4;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await attemptFolderDelete(folder);
    if (result === "success" || result === "no-files") return true;
    if (result === "error") return false;
    await new Promise((resolve) => setTimeout(resolve, 300 * attempt));
  }
  console.error(`deleteFolderAtomic: gave up after ${MAX_ATTEMPTS} attempts (${folder})`);
  return false;
}

export async function POST(request: Request) {
  const auth = await verifyAdminRequest(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

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
      const success = await deleteFolderAtomic(safeFolder);
      if (!success) {
        return NextResponse.json(
          { error: "Folder delete failed — check server logs." },
          { status: 502 },
        );
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