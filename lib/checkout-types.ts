export type CheckoutPaymentOption = "paymentOnDelivery" | "stripe";

export interface CheckoutCartItemPayload {
  id: string;
  quantity: number;
}

export interface CheckoutCustomerPayload {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

export interface CheckoutRequestPayload {
  items: CheckoutCartItemPayload[];
  customer: CheckoutCustomerPayload;
}
