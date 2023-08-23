export const logger = (messsages: unknown[], type: string = "log") =>
  console[type](...messsages);
