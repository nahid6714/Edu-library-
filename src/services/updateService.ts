import { AppUpdateInfo } from "../types";

export const CURRENT_APP_VERSION = "1.0.0";
export const DEFAULT_GITHUB_REPO = "mdnahidislam6714/edu-library";

// Helper to sanitize and compare semver strings e.g. "v1.1.0" vs "1.0.0"
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
    // If it's the same version and dismissed less than 24 hours ago
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
 * Fetch update info without API rate limits using static raw GitHub JSON / CDN URLs.
 * Falls back to GitHub Releases API only if static JSON is not found.
 */
export async function checkAppUpdate(
  customRepo?: string,
  ignoreCache = false
): Promise<AppUpdateInfo> {
  const repo = customRepo || getStoredGithubRepo();

  // Cache check for 10 minutes unless forced
  const cacheKey = `edu_update_cache_${repo}`;
  if (!ignoreCache) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 10 * 60 * 1000) {
          return data as AppUpdateInfo;
        }
      } catch {
        // Cache parse failure, ignore
      }
    }
  }

  // 1. First Priority: Unlimited Static JSON from raw.githubusercontent.com / CDN
  // (Zero API limit, works for infinite users without any restrictions)
  const timestampQuery = `?t=${Date.now()}`;
  const staticUrls = [
    `https://raw.githubusercontent.com/${repo}/main/version.json${timestampQuery}`,
    `https://raw.githubusercontent.com/${repo}/master/version.json${timestampQuery}`,
    `https://cdn.jsdelivr.net/gh/${repo}@main/version.json`,
  ];

  for (const url of staticUrls) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json && json.version) {
          const hasUpdate = compareVersions(json.version, CURRENT_APP_VERSION) > 0;
          const updateInfo: AppUpdateInfo = {
            hasUpdate,
            currentVersion: CURRENT_APP_VERSION,
            latestVersion: json.version.startsWith("v") ? json.version : `v${json.version}`,
            releaseTitle: json.title || `Edu Library v${json.version}`,
            releaseNotes: json.releaseNotes || "",
            apkDownloadUrl:
              json.apkDownloadUrl ||
              `https://github.com/${repo}/releases/download/latest-release/EduLibrary-latest.apk`,
            publishedAt: json.publishedAt || new Date().toISOString(),
            htmlUrl: json.htmlUrl || `https://github.com/${repo}/releases`,
          };

          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: updateInfo, timestamp: Date.now() })
          );
          return updateInfo;
        }
      }
    } catch {
      // Continue to next URL
    }
  }

  // 2. Secondary Fallback: GitHub Releases API (used only if version.json is not yet uploaded)
  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const tagName: string = data.tag_name || "";
      const hasUpdate = compareVersions(tagName, CURRENT_APP_VERSION) > 0;

      let apkUrl = "";
      if (Array.isArray(data.assets) && data.assets.length > 0) {
        const apkAsset = data.assets.find((a: { name?: string; browser_download_url?: string }) =>
          a.name?.toLowerCase().endsWith(".apk")
        );
        if (apkAsset && apkAsset.browser_download_url) {
          apkUrl = apkAsset.browser_download_url;
        }
      }

      if (!apkUrl && tagName) {
        apkUrl = `https://github.com/${repo}/releases/download/${tagName}/EduLibrary-latest.apk`;
      }

      const updateInfo: AppUpdateInfo = {
        hasUpdate,
        currentVersion: CURRENT_APP_VERSION,
        latestVersion: tagName || CURRENT_APP_VERSION,
        releaseTitle: data.name || `Release ${tagName}`,
        releaseNotes: data.body || "",
        apkDownloadUrl: apkUrl,
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
    latestVersion: CURRENT_APP_VERSION,
    releaseTitle: "Current",
    releaseNotes: "",
    apkDownloadUrl: `https://github.com/${repo}/releases`,
    publishedAt: new Date().toISOString(),
    htmlUrl: `https://github.com/${repo}/releases`,
  };
}

