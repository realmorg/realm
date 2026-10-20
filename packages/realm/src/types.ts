import type { CssBindings } from "./css";
import type { PropType, prop } from "./props";

export type Handler = (this: Element, event: Event, ...vars: unknown[]) => unknown;

export interface SetupResult {
  get(name: string): unknown;
  handlers: Handler[];
}

export interface StoreOptions {
  persist?: "local" | "session" | StorageAdapter;
}

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
}

export interface Context {
  defineProps<T extends Record<string, PropType>>(schema: T): Record<keyof T, unknown>;
  useState<T extends object>(initial: T): T;
  useChildren(selector: string, attributes?: string[]): Element[];
  tick(): Promise<void>;
  listen(type: string, handler: (event: Event) => unknown, target?: EventTarget): void;
  defineMethods(methods: object): void;
  dispatch(type: string, detail?: unknown, options?: CustomEventInit): boolean;
  attrs: Record<string, string | null>;
  observe(fn: () => unknown): () => void;
  onConnected(fn: () => unknown): void;
  onDisconnected(fn: () => void): void;
  onFormReset(fn: () => void): void;
  onFormDisabled(fn: (disabled: boolean) => void): void;
  onFormStateRestore(fn: (state: unknown, mode: string) => void): void;
  defineStore<T extends object>(name: string, initial: T, options?: StoreOptions): T;
  lookup(name: string): unknown;
  prop: typeof prop;
  host: HTMLElement;
  refs: Record<string, Element>;
  signal: AbortSignal;
  internals: ElementInternals;
  setTimeout(callback: (...args: unknown[]) => void, delay?: number, ...args: unknown[]): number;
  setInterval(callback: (...args: unknown[]) => void, delay?: number, ...args: unknown[]): number;
  clearTimeout(id?: number): void;
  clearInterval(id?: number): void;
}

export type Setup = (context: Context) => SetupResult;

export interface Definition {
  name: string;
  source: string;
  base: string;
  markup: DocumentFragment;
  sheets: CSSStyleSheet[];
  names: Set<string>;
  handlers: Map<string, number>;
  events: string[];
  formAssociated: boolean;
  role: string | null;
  slot: string | null;
  delegatesFocus: boolean;
  css: CssBindings;
  setup: Setup;
}
