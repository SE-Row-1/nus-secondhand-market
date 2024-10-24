import { useEffect, useState } from "react";

/**
 * Determine whether the component is mounted.
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return isMounted;
}
