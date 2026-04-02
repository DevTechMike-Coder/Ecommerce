import { Prisma, type PrismaClient } from "@prisma/client";
import { calculateCheckoutTotals, roundCurrency } from "@/lib/checkout-math";
import { prisma } from "@/lib/prisma";
import type {
  CheckoutCartItemPayload,
  CheckoutCustomerPayload,
  CheckoutRequestPayload,
} from "@/lib/checkout-types";

type OrderStatus = "PENDING" | "PENDING_PAYMENT" | "PAYMENT_PROCESSING" | "PAID";
type OrderPaymentMethod = "PAYMENT_ON_DELIVERY" | "STRIPE";

type PrismaTransaction = PrismaClient | Prisma.TransactionClient;

interface NormalizedCheckoutCustomer {
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
}

export interface CheckoutSnapshotItem {
  productId: string;
  name: string;
  quantity: number;
  unitAmount: number;
  lineTotal: number;
}

interface CheckoutSnapshot {
  items: CheckoutSnapshotItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export class CheckoutError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "CheckoutError";
    this.status = status;
  }
}

function asRecord(value: unknown, message: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new CheckoutError(message);
  }

  return value as Record<string, unknown>;
}

function readString(
  record: Record<string, unknown>,
  key: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    label?: string;
  } = {}
) {
  const label = options.label ?? key;
  const rawValue = record[key];

  if (typeof rawValue !== "string") {
    if (options.required) {
      throw new CheckoutError(`${label} is required.`);
    }

    return "";
  }

  const value = rawValue.trim();

  if (!value) {
    if (options.required) {
      throw new CheckoutError(`${label} is required.`);
    }

    return "";
  }

  if (options.min && value.length < options.min) {
    throw new CheckoutError(`${label} must be at least ${options.min} characters.`);
  }

  if (options.max && value.length > options.max) {
    throw new CheckoutError(`${label} must be ${options.max} characters or fewer.`);
  }

  return value;
}

function normalizeCartItems(value: unknown) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new CheckoutError("Your cart is empty.");
  }

  const mergedItems = new Map<string, number>();

  for (const rawItem of value) {
    const item = asRecord(rawItem, "Each cart item must be an object.");
    const id = readString(item, "id", {
      required: true,
      max: 100,
      label: "Product ID",
    });
    const quantityValue = item.quantity;
    const quantity =
      typeof quantityValue === "number" ? quantityValue : Number(quantityValue);

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new CheckoutError("Each item quantity must be a whole number greater than zero.");
    }

    if (quantity > 20) {
      throw new CheckoutError("Item quantity cannot be greater than 20.");
    }

    mergedItems.set(id, (mergedItems.get(id) ?? 0) + quantity);
  }

  if (mergedItems.size > 20) {
    throw new CheckoutError("Checkout supports up to 20 unique products at a time.");
  }

  return Array.from(mergedItems.entries()).map<CheckoutCartItemPayload>(
    ([id, quantity]) => ({
      id,
      quantity,
    })
  );
}

function normalizeCustomer(value: unknown): NormalizedCheckoutCustomer {
  const customer = asRecord(value, "Customer details are required.");

  const email = readString(customer, "email", {
    required: true,
    max: 120,
    label: "Email",
  }).toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new CheckoutError("Please enter a valid email address.");
  }

  const addressLine2 = readString(customer, "addressLine2", {
    max: 120,
    label: "Address line 2",
  });
  const state = readString(customer, "state", {
    max: 80,
    label: "State",
  });
  const postalCode = readString(customer, "postalCode", {
    max: 40,
    label: "Postal code",
  });

  return {
    name: readString(customer, "name", {
      required: true,
      min: 2,
      max: 120,
      label: "Full name",
    }),
    email,
    phone: readString(customer, "phone", {
      required: true,
      min: 7,
      max: 20,
      label: "Phone number",
    }),
    addressLine1: readString(customer, "addressLine1", {
      required: true,
      min: 5,
      max: 160,
      label: "Address line 1",
    }),
    addressLine2: addressLine2 || null,
    city: readString(customer, "city", {
      required: true,
      min: 2,
      max: 80,
      label: "City",
    }),
    state: state || null,
    postalCode: postalCode || null,
    country: readString(customer, "country", {
      required: true,
      min: 2,
      max: 80,
      label: "Country",
    }),
  };
}

function toDecimal(amount: number) {
  return new Prisma.Decimal(amount.toFixed(2));
}

async function getCheckoutSnapshot(
  tx: PrismaTransaction,
  items: CheckoutCartItemPayload[]
): Promise<CheckoutSnapshot> {
  const productIds = items.map((item) => item.id);
  const products = await tx.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
    },
  });

  if (products.length !== productIds.length) {
    throw new CheckoutError("One or more cart items no longer exist.", 404);
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  const snapshotItems = items.map<CheckoutSnapshotItem>((item) => {
    const product = productMap.get(item.id);

    if (!product) {
      throw new CheckoutError("One or more cart items could not be found.", 404);
    }

    if (product.stock < item.quantity) {
      throw new CheckoutError(
        `${product.name} only has ${product.stock} item(s) left in stock.`,
        409
      );
    }

    const unitAmount = roundCurrency(Number(product.price));

    return {
      productId: product.id,
      name: product.name,
      quantity: item.quantity,
      unitAmount,
      lineTotal: roundCurrency(unitAmount * item.quantity),
    };
  });

  return {
    items: snapshotItems,
    ...calculateCheckoutTotals(
      snapshotItems.map((item) => ({
        price: item.unitAmount,
        quantity: item.quantity,
      }))
    ),
  };
}

async function createOrderRecord(
  tx: PrismaTransaction,
  input: {
    userId: string;
    customer: NormalizedCheckoutCustomer;
    snapshot: CheckoutSnapshot;
    paymentMethod: OrderPaymentMethod;
    status: OrderStatus;
  }
) {
  return tx.order.create({
    data: {
      userId: input.userId,
      status: input.status,
      paymentMethod: input.paymentMethod,
      customerName: input.customer.name,
      customerEmail: input.customer.email,
      customerPhone: input.customer.phone,
      addressLine1: input.customer.addressLine1,
      addressLine2: input.customer.addressLine2,
      city: input.customer.city,
      state: input.customer.state,
      postalCode: input.customer.postalCode,
      country: input.customer.country,
      totalAmount: toDecimal(input.snapshot.total),
      orderItems: {
        create: input.snapshot.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: toDecimal(item.unitAmount),
        })),
      },
    },
  });
}

export function normalizeCheckoutPayload(
  payload: unknown
): CheckoutRequestPayload & { customer: CheckoutCustomerPayload } {
  const record = asRecord(payload, "Checkout payload is required.");
  const items = normalizeCartItems(record.items);
  const customer = normalizeCustomer(record.customer);

  return {
    items,
    customer: {
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      addressLine1: customer.addressLine1,
      addressLine2: customer.addressLine2 ?? undefined,
      city: customer.city,
      state: customer.state ?? undefined,
      postalCode: customer.postalCode ?? undefined,
      country: customer.country,
    },
  };
}

export function resolveCheckoutError(error: unknown) {
  if (error instanceof CheckoutError) {
    return {
      message: error.message,
      status: error.status,
    };
  }

  console.error("Checkout Error:", error);

  return {
    message: "Something went wrong while processing checkout.",
    status: 500,
  };
}

export async function createCashOnDeliveryOrder(input: {
  userId: string;
  payload: CheckoutRequestPayload;
}) {
  const customer = normalizeCustomer(input.payload.customer);

  return prisma.$transaction(async (tx) => {
    const snapshot = await getCheckoutSnapshot(tx, input.payload.items);

    for (const item of snapshot.items) {
      const updatedProduct = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count !== 1) {
        throw new CheckoutError(
          `${item.name} is no longer available in the requested quantity.`,
          409
        );
      }
    }

    const order = await createOrderRecord(tx, {
      userId: input.userId,
      customer,
      snapshot,
      paymentMethod: "PAYMENT_ON_DELIVERY",
      status: "PENDING",
    });

    return {
      order,
      snapshot,
    };
  });
}

export async function createStripeDraftOrder(input: {
  userId: string;
  payload: CheckoutRequestPayload;
}) {
  const customer = normalizeCustomer(input.payload.customer);

  return prisma.$transaction(async (tx) => {
    const snapshot = await getCheckoutSnapshot(tx, input.payload.items);
    const order = await createOrderRecord(tx, {
      userId: input.userId,
      customer,
      snapshot,
      paymentMethod: "STRIPE",
      status: "PENDING_PAYMENT",
    });

    return {
      order,
      snapshot,
    };
  });
}

export async function deleteStripeDraftOrder(orderId: string, userId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.orderItem.deleteMany({
      where: {
        orderId,
      },
    });

    await tx.order.deleteMany({
      where: {
        id: orderId,
        userId,
        paymentMethod: "STRIPE",
        status: "PENDING_PAYMENT",
      },
    });
  });
}

export async function finalizeStripeOrder(input: {
  orderId: string;
  sessionId: string;
  userId: string;
}) {
  return prisma.$transaction(async (tx) => {
    const lockedOrder = await tx.order.updateMany({
      where: {
        id: input.orderId,
        userId: input.userId,
        paymentMethod: "STRIPE",
        status: "PENDING_PAYMENT",
      },
      data: {
        status: "PAYMENT_PROCESSING",
        paymentReference: input.sessionId,
      },
    });

    if (lockedOrder.count === 0) {
      const existingOrder = await tx.order.findUnique({
        where: {
          id: input.orderId,
        },
      });

      if (!existingOrder || existingOrder.userId !== input.userId) {
        throw new CheckoutError("Order not found.", 404);
      }

      if (existingOrder.status === "PAID") {
        return existingOrder;
      }

      throw new CheckoutError("This order is already being finalized. Please refresh shortly.", 409);
    }

    const order = await tx.order.findUnique({
      where: {
        id: input.orderId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!order || order.userId !== input.userId) {
      throw new CheckoutError("Order not found.", 404);
    }

    for (const item of order.orderItems) {
      if (item.product.stock < item.quantity) {
        throw new CheckoutError(
          `${item.product.name} is no longer available in the requested quantity.`,
          409
        );
      }
    }

    for (const item of order.orderItems) {
      const updatedProduct = await tx.product.updateMany({
        where: {
          id: item.productId,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count !== 1) {
        throw new CheckoutError(
          `${item.product.name} is no longer available in the requested quantity.`,
          409
        );
      }
    }

    return tx.order.update({
      where: {
        id: order.id,
      },
      data: {
        status: "PAID",
        paymentReference: input.sessionId,
      },
    });
  });
}
