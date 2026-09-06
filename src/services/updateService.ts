import { AppUpdateInfo } from "../types";

// The CI build injects VITE_APP_VERSION. Local/dev builds fall back to 1.0.0.
export const CURRENT_APP_VERSION =
  (import.meta.env.VITE_APP_VERSION || "1.0.0").replace(/^v/i, "").trim();
export const DEFAULT_GITHUB_REPO = "nahid6714/Edu-library-";

export function compareVersions(remoteVer: string, currentVer: string): number {
  const cleanRemote = remoteVer.replace(/^v/i, "").trim();
  const cleanCurrent = currentVer.replace(/^v/i, "").trim();

  const remoteParts = cleanRemote.split(".").map((p) => parseInt(p, 10) || 0);
  const currentParts = cleanCurrent.split(".").map((p) => parseInt(p, 10) || 0);

  const maxLen = Math.max(remoteParts.length, currentParts.length);
  for (let i = 0; i < maxLen; i++) {
    const r = remoteParts[i] || 0;
    const c = currentParts[i] || 0;
    if (r > c) return 1;
    if (r < c) return -1;
  }
  return 0;
}

export function getStoredGithubRepo(): string {
  const stored = localStorage.getItem("edu_github_repo");
  if (stored && stored.trim()) {
    return stored.trim().replace(/^https?:\/\/github\.com\//i, "");
  }
  return DEFAULT_GITHUB_REPO;
}

export function setStoredGithubRepo(repo: string): void {
  const clean = repo.trim().replace(/^https?:\/\/github\.com\//i, "");
  localStorage.setItem("edu_github_repo", clean);
}

export function isUpdateDismissed(version: string): boolean {
  try {
    const dismissed = localStorage.getItem("edu_dismissed_update");
    if (!dismissed) return false;
    const data = JSON.parse(dismissed);
    if (data.version === version && Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function dismissUpdate(version: string): void {
  localStorage.setItem(
    "edu_dismissed_update",
    JSON.stringify({ version, timestamp: Date.now() })
  );
}

/**
 * Check the public version.json first (no GitHub API rate-limit dependency),
 * then fall back to the latest GitHub Release API response.
 */
export async function checkAppUpdate(
  customRepo?: string,
  ignoreCache = false
): Promise<AppUpdateInfo> {
  const repo = customRepo || getStoredGithubRepo();
  const cacheKey = `edu_update_cache_${repo}_${CURRENT_APP_VERSION}`;

  if (!ignoreCache) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          return data as AppUpdateInfo;
        }
      } catch {
        // Ignore malformed cache.
      }
    }
  }

  const timestampQuery = `?t=${Date.now()}`;
  const staticUrls = [
    `https://raw.githubusercontent.com/${repo}/main/version.json${timestampQuery}`,
    `https://raw.githubusercontent.com/${repo}/master/version.json${timestampQuery}`,
    `https://cdn.jsdelivr.net/gh/${repo}@main/version.json${timestampQuery}`,
  ];

  for (const url of staticUrls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;

      const json = await res.json();
      if (!json || !json.version) continue;

      const latestVersion = String(json.version).replace(/^v/i, "").trim();
      const updateInfo: AppUpdateInfo = {
        hasUpdate: compareVersions(latestVersion, CURRENT_APP_VERSION) > 0,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: `v${latestVersion}`,
        releaseTitle: json.title || `Edu Library v${latestVersion}`,
        releaseNotes: json.releaseNotes || "",
        apkDownloadUrl:
          json.apkDownloadUrl ||
          `https://github.com/${repo}/releases/download/${`v${latestVersion}`}/EduLibrary-latest.apk`,
        publishedAt: json.publishedAt || new Date().toISOString(),
        htmlUrl: json.htmlUrl || `https://github.com/${repo}/releases`,
      };

      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: updateInfo, timestamp: Date.now() })
      );
      return updateInfo;
    } catch {
      // Try the next static source.
    }
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github.v3+json" },
      cache: "no-store",
    });

    if (response.ok) {
      const data = await response.json();
      const tagName: string = data.tag_name || "";
      const latestVersion = tagName.replace(/^v/i, "").trim();
      let apkUrl = "";

      if (Array.isArray(data.assets)) {
        const apkAsset = data.assets.find(
          (a: { name?: string; browser_download_url?: string }) =>
            a.name?.toLowerCase().endsWith(".apk") &&
            Boolean(a.browser_download_url)
        );
        apkUrl = apkAsset?.browser_download_url || "";
      }

      if (!apkUrl && tagName) {
        apkUrl = `https://github.com/${repo}/releases/download/${tagName}/EduLibrary-latest.apk`;
      }

      const updateInfo: AppUpdateInfo = {
        hasUpdate: Boolean(latestVersion) && compareVersions(latestVersion, CURRENT_APP_VERSION) > 0,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: latestVersion ? `v${latestVersion}` : `v${CURRENT_APP_VERSION}`,
        releaseTitle: data.name || `Release ${tagName}`,
        releaseNotes: data.body || "",
        apkDownloadUrl: apkUrl || `https://github.com/${repo}/releases`,
        publishedAt: data.published_at || new Date().toISOString(),
        htmlUrl: data.html_url || `https://github.com/${repo}/releases`,
      };

      localStorage.setItem(
        cacheKey,
        JSON.stringify({ data: updateInfo, timestamp: Date.now() })
      );
      return updateInfo;
    }
  } catch (error) {
    console.warn("Update check failed:", error);
  }

  return {
    hasUpdate: false,
    currentVersion: CURRENT_APP_VERSION,
    latestVersion: `v${CURRENT_APP_VERSION}`,
    releaseTitle: "Current",
    releaseNotes: "",
    apkDownloadUrl: `https://github.com/${repo}/releases`,
    publishedAt: new Date().toISOString(),
    htmlUrl: `https://github.com/${repo}/releases`,
  };
}
