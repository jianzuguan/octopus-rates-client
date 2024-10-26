export function priceToColourClass(prefix: string, price: number) {
  if (price < 0)
    return `${prefix}-price-earning dark:${prefix}-price-earning-dark`

  if (price < 0.00001)
    return `${prefix}-price-free dark:${prefix}-price-free-dark`

  if (price < 16) return `${prefix}-price-cheap dark:${prefix}-price-cheap-dark`

  if (price < 25)
    return `${prefix}-price-alright dark:${prefix}-price-alright-dark`
  
  return `${prefix}-price-expensive dark:${prefix}-price-expensive-dark`
}
