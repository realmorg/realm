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
    this.#states = new Map();
    this.#observers = new Set();
  }

  setItem(name: string, value: (prevState: unknown) => void | unknown) {
    const oldValue = this.#states.get(name);
    const newValue = typeof value === "function" ? value(oldValue) : value;
    this.#states.set(name, newValue);
    this.#observers.forEach((fn) =>
      fn?.apply?.(this, [oldValue, newValue, name])
    );
  }

  getItem(name?: string) {
    return this.#states.get(name);
  }

  subscribe(observer: StateObserver) {
    this.#observers.add(observer);
  }
}