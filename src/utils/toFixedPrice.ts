export function toFixedPrice(price: number) {
  return (Math.round(price * 1000) / 1000).toFixed(3)
}
