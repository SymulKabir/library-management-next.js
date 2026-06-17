export const sleep = (ms: number = 60000) =>
  new Promise((resolve) => setTimeout(resolve, ms));