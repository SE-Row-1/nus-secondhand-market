import { useEffect, useRef, type RefObject } from "react";

/**
 * Execute a callback only when user scrolls near the given element.
 */
export function useInfiniteScroll(
  bottomRef: RefObject<HTMLElement>,
  callback: () => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const bottom = bottomRef.current;

    if (!bottom) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          callbackRef.current();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(bottom);
    return () => observer.unobserve(bottom);
  }, [bottomRef]);
}
