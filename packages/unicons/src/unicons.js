export const sets = {};

const FNV_OFFSET = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

export const chunkOf = (name, chunks) => {
  let hash = FNV_OFFSET;
  for (let index = 0; index < name.length; index++) {
    hash = Math.imul(hash ^ name.charCodeAt(index), FNV_PRIME);
  }
  return (hash >>> 0) % chunks;
};

export const chunkPath = (set, name) => `icons/${set}/${chunkOf(name, sets[set].chunks)}.js`;

// The path is built outside new URL(): Vite's dev server rewrites a template literal there into
// an eager import of every chunk file, thousands of requests before the first icon shows.
export const chunkUrl = (set, name) => new URL(chunkPath(set, name), import.meta.url).href;

const warn = (message) => console.warn(`<u-icon> ${message}`);

const loadChunk = (set, name) =>
  import(/* @vite-ignore */ chunkUrl(set, name)).then(
    (module) => module.default,
    () => warn(`could not load ${chunkUrl(set, name)}.`),
  );

export const loadIcon = async (set, name) => {
  if (!name) return "";
  if (!Object.hasOwn(sets, set)) {
    warn(`has no set "${set}". Known sets: ${Object.keys(sets).join(", ")}.`);
    return "";
  }
  const icons = await loadChunk(set, name);
  if (!icons) return "";
  if (!Object.hasOwn(icons, name)) {
    warn(`has no icon "${name}" in set "${set}".`);
    return "";
  }
  const icon = icons[name];
  const [attributes, body] = typeof icon === "string" ? [sets[set].attributes, icon] : icon;
  return `<svg ${attributes} part="svg" aria-hidden="true" focusable="false">${body}</svg>`;
};
