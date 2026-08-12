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
