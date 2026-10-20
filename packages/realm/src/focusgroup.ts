const FOCUSABLE = "button, a[href], input, select, textarea, [tabindex]";
const UNAVAILABLE = ':disabled, [disabled], [aria-disabled="true"], [inert], [hidden]';

const KEYS: Record<string, { axis: "inline" | "block"; step: number }> = {
  ArrowRight: { axis: "inline", step: 1 },
  ArrowLeft: { axis: "inline", step: -1 },
  ArrowDown: { axis: "block", step: 1 },
  ArrowUp: { axis: "block", step: -1 },
};

const inside = (el: Element): Element[] => {
  if (el.shadowRoot?.delegatesFocus) return [];
  return candidates(el.shadowRoot ?? el);
};

const candidates = (root: ParentNode): Element[] =>
  [...root.children].flatMap((child) => {
    if (child instanceof HTMLSlotElement)
      return child.assignedElements({ flatten: true }).flatMap((el) => [el, ...inside(el)]);
    return [child, ...inside(child)];
  });

export const items = (group: Element) =>
  (candidates(group) as HTMLElement[]).filter(
    (el) =>
      (el.matches(FOCUSABLE) || el.shadowRoot?.delegatesFocus === true) &&
      !el.matches(UNAVAILABLE) &&
      el.getAttribute("tabindex") !== "-2" &&
      el.checkVisibility(),
  );

export const bindFocusgroup = (group: Element, signal: AbortSignal) => {
  group.addEventListener(
    "keydown",
    (event) => {
      const tokens = new Set((group.getAttribute("focusgroup") ?? "").split(/\s+/).filter(Boolean));
      const restricted = tokens.has("inline") || tokens.has("block");
      const key = (event as KeyboardEvent).key;
      const list = items(group);
      const index = list.indexOf(
        event.composedPath().find((node) => list.includes(node as HTMLElement)) as HTMLElement,
      );
      const move = KEYS[key];
      const edge = { Home: 0, End: list.length - 1 }[key];
      if (index === -1 || (edge === undefined && !(move && (!restricted || tokens.has(move.axis)))))
        return;
      const rtl = move?.axis === "inline" && getComputedStyle(group).direction === "rtl" ? -1 : 1;
      const raw = edge ?? index + (move as { step: number }).step * rtl;
      const next = tokens.has("wrap")
        ? (raw + list.length) % list.length
        : Math.min(Math.max(raw, 0), list.length - 1);
      event.preventDefault();
      (list[next] as HTMLElement).focus();
    },
    { signal },
  );
};
