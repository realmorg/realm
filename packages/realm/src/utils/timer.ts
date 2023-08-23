export type TimerReturn = [number, () => void];

export const timerOnce = (
  handler: TimerHandler,
  timeout: number
): TimerReturn => {
  let timer = setTimeout(handler, timeout);
  return [timer, () => clearTimeout(timer)];
};

export const timerEvery = (
  handler: TimerHandler,
  timeout: number
): TimerReturn => {
  let interval = setInterval(handler, timeout);
  return [interval, () => clearInterval(interval)];
};

export const reqAnim = (handler: FrameRequestCallback): TimerReturn => {
  let req = requestAnimationFrame(handler);
  return [req, () => cancelAnimationFrame(req)];
};
