export class RealmStates {
  constructor(initial = {}, fn: (states: RealmStates) => void) {
    return new Proxy(initial, {
      set: (target, key, value) => {
        Reflect.set(target, key, value);
        return true;
      },
      get: (target, key) => Reflect.get(target, key),
    });
  }
}
