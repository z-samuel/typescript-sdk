export function isIntegerString(s: string): boolean {
  const num = Number(s);
  return !isNaN(num) && parseInt(s, 10) === num;
}
