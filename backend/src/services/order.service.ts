import { Prisma, Product } from '@prisma/client';
import { AppError } from '../errors/app-error.js';
import { prisma } from '../lib/prisma.js';

export type CreateOrderItemInput = {
  product_id: number;
  quantity: number;
};

export type CreateOrderInput = {
  items: CreateOrderItemInput[];
};

export type OrderItemResponse = {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product_name: string;
};

export type OrderResponse = {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItemResponse[];
};

/**
 * Main orchestrator: delegates responsibilities for order creation.
 */
export async function createOrder(body: unknown): Promise<OrderResponse> {
  const { items } = parseCreateOrderInput(body);
  const quantityByProductId = aggregateItemQuantities(items);
  const productById = await fetchAndValidateProducts(quantityByProductId.keys());
  const { totalAmount, orderItemsData } = calculateOrderTotals(quantityByProductId, productById);
  const order = await saveOrderToDatabase(totalAmount, orderItemsData);

  return formatOrderResponse(order);
}

/**
 * Validates basic input payload.
 */
function parseCreateOrderInput(body: unknown): CreateOrderInput {
  if (!body || typeof body !== 'object') {
    throw new AppError('Request body must be a JSON object');
  }

  const { items } = body as { items?: unknown };

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Order must include at least one item');
  }

  const parsedItems = items.map(validateAndParseSingleItem);
  return { items: parsedItems };
}

function validateAndParseSingleItem(item: unknown, index: number): CreateOrderItemInput {
  if (!item || typeof item !== 'object') {
    throw new AppError(`Item at index ${index} is invalid`);
  }

  const { product_id: productId, quantity } = item as Record<string, unknown>;

  if (!Number.isInteger(productId) || (productId as number) <= 0) {
    throw new AppError(`Item at index ${index} has an invalid product_id`);
  }

  if (!Number.isInteger(quantity) || (quantity as number) <= 0) {
    throw new AppError(`Item at index ${index} has an invalid quantity`);
  }

  return {
    product_id: productId as number,
    quantity: quantity as number,
  };
}

/**
 * Aggregates quantities by product ID.
 */
function aggregateItemQuantities(items: CreateOrderItemInput[]): Map<number, number> {
  const quantityByProductId = new Map<number, number>();

  for (const item of items) {
    const currentQty = quantityByProductId.get(item.product_id) ?? 0;
    quantityByProductId.set(item.product_id, currentQty + item.quantity);
  }

  return quantityByProductId;
}

/**
 * Fetches products by ID and throws 404 if any are missing.
 */
async function fetchAndValidateProducts(
  productIdsIterable: IterableIterator<number>,
): Promise<Map<number, Product>> {
  const productIds = Array.from(productIdsIterable);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  if (products.length !== productIds.length) {
    const foundIds = new Set(products.map((p) => p.id));
    const missingIds = productIds.filter((id) => !foundIds.has(id));
    throw new AppError(`Products not found: ${missingIds.join(', ')}`, 404);
  }

  return new Map(products.map((p) => [p.id, p]));
}

/**
 * Calculates total amount based on DB official prices.
 */
function calculateOrderTotals(
  quantityByProductId: Map<number, number>,
  productById: Map<number, Product>,
): { totalAmount: number; orderItemsData: Prisma.OrderItemCreateManyOrderInput[] } {
  let totalAmount = 0;
  const orderItemsData: Prisma.OrderItemCreateManyOrderInput[] = [];

  for (const [productId, quantity] of quantityByProductId) {
    const product = productById.get(productId)!;
    const unitPrice = Number(product.price);

    totalAmount += unitPrice * quantity;

    orderItemsData.push({
      product_id: productId,
      quantity,
      unit_price: new Prisma.Decimal(unitPrice.toFixed(2)),
    });
  }

  // Prevent float precision errors
  totalAmount = Math.round((totalAmount + Number.EPSILON) * 100) / 100;

  return { totalAmount, orderItemsData };
}

/**
 * Persists order and its items transactionally.
 */
async function saveOrderToDatabase(
  totalAmount: number,
  orderItemsData: Prisma.OrderItemCreateManyOrderInput[],
) {
  return prisma.order.create({
    data: {
      total_amount: new Prisma.Decimal(totalAmount.toFixed(2)),
      status: 'pending',
      items: {
        createMany: {
          data: orderItemsData,
        },
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });
}

/**
 * Maps Prisma data to API response format.
 */
function formatOrderResponse(order: any): OrderResponse {
  return {
    id: order.id,
    total_amount: Number(order.total_amount),
    status: order.status,
    created_at: order.created_at.toISOString(),
    items: order.items.map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: Number(item.unit_price),
      product_name: item.product.name,
    })),
  };
}
