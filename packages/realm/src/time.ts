import { warn } from "./log";

const UNITS: Record<string, number> = { ms: 1, s: 1000, m: 60_000 };

export const parseDuration = (text: string): number => {
  const match = text.trim().match(/^(\d+(?:\.\d+)?)(ms|s|m)?$/);
  if (!match) {
    warn(`"${text}" is not a duration. Use values like "300ms", "2s" or "1m".`);
    return 0;
  }
  return Number(match[1]) * (UNITS[match[2] ?? "ms"] as number);
};

type Callback = (event: Event) => void;

export const withTiming = (el: Element, callback: Callback, signal: AbortSignal): Callback => {
  const debounce = el.getAttribute("debounce");
  const throttle = el.getAttribute("throttle");
  if (debounce !== null) {
    const wait = parseDuration(debounce);
    let timer: ReturnType<typeof setTimeout> | undefined;
    signal.addEventListener("abort", () => clearTimeout(timer));
    return (event) => {
      clearTimeout(timer);
      timer = setTimeout(() => callback(event), wait);
    };
  }
  if (throttle !== null) {
    const wait = parseDuration(throttle);
    let last = -Infinity;
    return (event) => {
      const now = performance.now();
      if (now - last < wait) return;
      last = now;
      callback(event);
    };
  }
  return callback;
};
