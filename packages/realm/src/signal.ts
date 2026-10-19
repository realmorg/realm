export const childController = (parent: AbortSignal) => {
  const controller = new AbortController();
  parent.addEventListener("abort", () => controller.abort(parent.reason), {
    signal: controller.signal,
  });
  return controller;
};
