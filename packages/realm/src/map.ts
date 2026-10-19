export const getOrCreate = <K, V>(
  map: Map<K, V> | WeakMap<K & object, V>,
  key: K,
  create: () => V,
): V => {
  const target = map as Map<K, V>;
  if (!target.has(key)) target.set(key, create());
  return target.get(key) as V;
};
