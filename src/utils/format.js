export function formatPrice(value) {
  return `${new Intl.NumberFormat("en-US").format(value)} ج.م`;
}