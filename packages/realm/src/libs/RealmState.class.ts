import { MixedDataType } from "../constants/data";
import { JSONSafeStringify, JSONparse, JSONstringify } from "../utils/json";
import {
  addSet,
  createMap,
  createSet,
  forEach,
  forEachMap,
  getMap,
  setMap,
} from "../utils/object";

export enum StateStorage {
  MEMORY = "memory",
  LOCAL = "localStorage",
  SESSION = "sessionStorage",
}

type StateValue = Map<string, unknown>;

type StateObserver = (
  stateName: string,
  newValue: unknown,
  prevValue: unknown
) => Promise<void> | void;

type StateFunction<T> = (prevValue: unknown) => T;

export class RealmState {
  #states: StateValue;
  #observers: Set<StateObserver>;

  constructor() {
    this.#states = createMap();
    this.#observers = createSet();
  }

  set<T>(
    stateName: string,
    value: StateFunction<T> | T,
    storage?: StateStorage
  ) {
    const prevValue = getMap(this.#states, stateName);
    const newValue =
      typeof value === "function"
        ? (value as StateFunction<T>)(prevValue)
        : value;
    if (storage !== StateStorage.MEMORY) {
      window?.[storage]?.setItem(
        stateName,
        JSONSafeStringify(newValue as MixedDataType)
      );
    }
    setMap(this.#states, stateName, newValue);
    forEach(this.#observers, (fn) =>
      fn?.apply?.(this, [stateName, newValue, prevValue])
    );
  }

  get<T>(name?: string, storage?: StateStorage) {
    if (storage !== StateStorage.MEMORY) {
      const value = window?.[storage]?.getItem(name);
      if (value !== undefined) return JSONparse(JSONstringify(value));
    }
    return getMap(this.#states, name) as T;
  }

  async subscribe(observer: StateObserver) {
    this.#observe(observer);
    addSet(this.#observers, observer);
  }

  #observe(observer?: StateObserver) {
    forEachMap(this.#states, (value, stateName) =>
      observer?.apply?.(this, [stateName, value])
    );
  }
}
