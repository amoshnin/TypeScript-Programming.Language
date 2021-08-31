export const isNumber = (n: any) => {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}
