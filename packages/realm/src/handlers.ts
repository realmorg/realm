import { getOrCreate } from "./map";
import { compileHandler } from "./registry";

type Listener = (this: Element, event: Event) => unknown;

interface Slot {
  fn?: Listener | null;
  code?: string | null;
  listening?: boolean;
}

const slots = new WeakMap<Element, Map<string, Slot>>();

const slotFor = (el: Element, event: string) =>
  getOrCreate(
    getOrCreate(slots, el, () => new Map<string, Slot>()),
    event,
    (): Slot => ({}),
  );

const setHandler = (el: Element, event: string, fn: Listener | null, code: string | null) => {
  const slot = slotFor(el, event);
  slot.fn = fn;
  slot.code = code;
  if (!fn || slot.listening) return;
  slot.listening = true;
  el.addEventListener(event, (e) => {
    if (slot.fn?.call(el, e) === false) e.preventDefault();
  });
};

export const definePageHandlerProperty = (prototype: object, attribute: string) => {
  const event = attribute.slice(2);
  Object.defineProperty(prototype, attribute, {
    configurable: true,
    get(this: Element) {
      return slots.get(this)?.get(event)?.fn ?? null;
    },
    set(this: Element, fn: unknown) {
      setHandler(this, event, typeof fn === "function" ? (fn as Listener) : null, null);
    },
  });
};

export const bindPageHandler = (el: Element, name: string, value: string | null) => {
  const observed = (el.constructor as unknown as { observedAttributes: string[] })
    .observedAttributes;
  if (!observed.includes(name)) return;
  const event = name.slice(2);
  if (value === null) return setHandler(el, event, null, null);
  if (slotFor(el, event).code === value) return;
  setHandler(el, event, compileHandler(value) ?? null, value);
};
