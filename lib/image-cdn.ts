/**
 * Converts a raw.githubusercontent.com URL to its jsDelivr CDN
 * equivalent, for DISPLAY only. jsDelivr fronts GitHub content with a
 * purpose-built global CDN and doesn't share raw.githubusercontent.com's
 * occasional slow-first-fetch behavior on recently-pushed files — the
 * likely cause of the multi-minute blank-image delay.
 *
 * Never use this for anything that needs the ORIGINAL url — deletion
 * (app/api/delete-photo) must keep parsing the exact
 * raw.githubusercontent.com URL stored in Firestore.
 */
export function toDisplayUrl(url: string | null | undefined): string {
    if (!url) return "";
    const match = url.match(
      /^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/,
    );
    if (!match) return url;
    const [, owner, repo, branch, path] = match;
    return `https://cdn.jsdelivr.net/gh/${owner}/${repo}@${branch}/${path}`;
  }