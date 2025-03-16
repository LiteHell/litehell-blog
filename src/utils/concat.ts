export default function concat<T>(arr: T[][]): T[] {
  return arr.reduce((pv, cv) => {
    return pv.concat(cv);
  }, [] as T[]);
}
