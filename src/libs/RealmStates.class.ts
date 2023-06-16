import { createMap } from "../utils/object";

export type StateValue = Map<string, unknown>;

export type StateObserver = (
  oldValue: unknown,
  newValue: unknown,
  key: string
) => void;

export class RealmStates {
  #states: StateValue;
  #observers: Set<StateObserver>;

  constructor() {
    this.#states = createMap();
    this.#observers = new Set();
  }

  setItem(name: string, value: (prevState: unknown) => unknown) {
    const oldValue = this.#states.get(name);
    const newValue = typeof value === "function" ? value(oldValue) : value;
    console.log("attrchanged", oldValue, value);
    this.#states.set(name, newValue);
    this.#observers.forEach((fn) =>
      fn?.apply?.(this, [newValue, oldValue, name])
    );
  }

  getItem(name?: string) {
    return this.#states.get(name);
  }

  subscribe(observer: StateObserver) {
    this.#observers.add(observer);
  }
}
