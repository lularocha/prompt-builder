"use client";

import { useEffect } from "react";

// iOS Safari (and home-screen standalone web apps) aggressively freeze and
// restore backgrounded pages from the back/forward cache instead of reloading
// them. A restored snapshot can look fine while its JavaScript is stale or not
// re-run — after a redeploy this shows up as buttons (e.g. the Prompt Rules
// modal link) doing nothing until the tab is closed and reopened. Reloading on
// a bfcache restore hands the user a fresh, interactive page automatically. A
// normal load reports persisted === false, so this never loops.
export function LifecycleReload() {
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) window.location.reload();
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return null;
}
