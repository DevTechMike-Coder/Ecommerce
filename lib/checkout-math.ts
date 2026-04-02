export const CHECKOUT_TAX_RATE = 0.08;

export function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateCheckoutTotals(
  items: Array<{ price: number; quantity: number }>
) {
  const subtotal = roundCurrency(
    items.reduce((total, item) => total + item.price * item.quantity, 0)
  );
  const tax = roundCurrency(subtotal * CHECKOUT_TAX_RATE);
  const total = roundCurrency(subtotal + tax);

  return {
    subtotal,
    tax,
    total,
  };
}
