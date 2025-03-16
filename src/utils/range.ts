export default function range(minInclduing: number, maxIncluding: number) {
  const result = [];

  for (let i = minInclduing; i <= maxIncluding; i++) {
    result.push(i);
  }
  return result;
}
