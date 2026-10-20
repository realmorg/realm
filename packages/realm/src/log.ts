const PREFIX = "[realm]";
const warned = new Set<string>();

export const report = (error: unknown) => console.error(PREFIX, error);

export const warn = (message: string) => {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(PREFIX, message);
};
