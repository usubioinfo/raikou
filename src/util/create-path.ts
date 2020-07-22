export const createPath = (...args: string[]) => {
  return args.reduce((prev, current) => prev + '/' + current);
}
