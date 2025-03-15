export default function unique<T>(arr: T[]): T[] {
  return arr.reduce((pv, cv) => {
    if (!pv.includes(cv)) pv.push(cv);
    return pv;
  }, [] as T[]);
}
