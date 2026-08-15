import type { Product } from '@prisma/client';
import { prisma } from '../lib/prisma.js';

export type ProductResponse = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_filename: string;
};

function toProductResponse(product: Product): ProductResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    category: product.category,
    image_filename: product.image_filename,
  };
}

export async function listProducts(category?: string): Promise<ProductResponse[]> {
  const products = await prisma.product.findMany({
    where: category
      ? {
          category: {
            equals: category,
          },
        }
      : undefined,
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return products.map(toProductResponse);
}

export async function listCategories(): Promise<string[]> {
  const groups = await prisma.product.groupBy({
    by: ['category'],
    orderBy: { category: 'asc' },
  });

  return groups.map((group) => group.category);
}

export async function getBestsellers(): Promise<ProductResponse[]> {
  const topItems = await prisma.orderItem.groupBy({
    by: ['product_id'],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 4,
  });

  const productIds = topItems.map((item) => item.product_id);

  if (productIds.length === 0) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const sortedProducts = topItems
    .map((item) => products.find((p) => p.id === item.product_id))
    .filter((p): p is Product => p !== undefined);

  return sortedProducts.map(toProductResponse);
}

export async function getRecommendations(productId: number): Promise<ProductResponse | null> {
  const ordersWithProduct = await prisma.orderItem.findMany({
    where: { product_id: productId },
    select: { order_id: true },
  });

  const orderIds = ordersWithProduct.map((item) => item.order_id);

  if (orderIds.length === 0) return null;

  const topRecommended = await prisma.orderItem.groupBy({
    by: ['product_id'],
    where: {
      order_id: { in: orderIds },
      product_id: { not: productId },
    },
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: 'desc',
      },
    },
    take: 1,
  });

  if (topRecommended.length === 0) return null;

  const recommendedProduct = await prisma.product.findUnique({
    where: { id: topRecommended[0].product_id },
  });

  return recommendedProduct ? toProductResponse(recommendedProduct) : null;
}

