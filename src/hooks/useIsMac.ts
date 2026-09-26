import { useState } from "react";

function detect(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? "";
  return /mac|iphone|ipad|ipod/i.test(platform);
}

/** True on Apple platforms — used to label the command palette shortcut ⌘K vs Ctrl K. */
export function useIsMac(): boolean {
  const [isMac] = useState(detect);
  return isMac;
}
