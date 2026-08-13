import { describe, it, mock, beforeEach } from 'node:test';
import assert from 'node:assert';

// 1. Cria os mocks
const findManyMock = mock.fn();
const createOrderMock = mock.fn();

const prismaMock = {
  product: { findMany: findManyMock },
  order: { create: createOrderMock },
};

// 2. Injeta as implementações na biblioteca (node:module resolver ou apenas mockando dinamicamente com TSX)
// Como estamos usando tsx e node --test, vamos carregar os módulos:
import { createOrder } from './order.service.js';
import { AppError } from '../errors/app-error.js';
import { prisma } from '../lib/prisma.js';

describe('Order Service - Unit Tests', () => {
  beforeEach(() => {
    // Hook no objeto real do prisma, já que no mesmo runtime é modificado
    findManyMock.mock.resetCalls();
    createOrderMock.mock.resetCalls();
    
    (prisma.product as any).findMany = findManyMock;
    (prisma.order as any).create = createOrderMock;
  });

  it('should calculate total correctly and create order', async () => {
    // 1. Setup (Mock DB data)
    findManyMock.mock.mockImplementation(async () => [
      { id: 1, price: 15.0, name: 'Burger', category: 'Food' },
      { id: 2, price: 10.0, name: 'Fries', category: 'Food' },
    ]);

    createOrderMock.mock.mockImplementation(async () => ({
      id: 100,
      total_amount: 40.0,
      status: 'pending',
      created_at: new Date(),
      items: [
        { id: 1, product_id: 1, quantity: 2, unit_price: 15.0, product: { name: 'Burger' } },
        { id: 2, product_id: 2, quantity: 1, unit_price: 10.0, product: { name: 'Fries' } },
      ],
    }));

    // 2. Action
    const payload = {
      items: [
        { product_id: 1, quantity: 2 }, // 2x 15 = 30
        { product_id: 2, quantity: 1 }, // 1x 10 = 10 -> Total 40
      ],
    };

    const result = await createOrder(payload);

    // 3. Assertions
    assert.strictEqual(findManyMock.mock.calls.length, 1);
    assert.strictEqual(createOrderMock.mock.calls.length, 1);
    assert.strictEqual(result.id, 100);
    assert.strictEqual(result.total_amount, 40.0);
  });

  it('should throw AppError if items array is empty', async () => {
    await assert.rejects(
      () => createOrder({ items: [] }),
      (err: any) => err instanceof AppError && err.message === 'Order must include at least one item'
    );
  });

  it('should throw AppError 404 if a product is not found in the DB', async () => {
    findManyMock.mock.mockImplementation(async () => []);

    await assert.rejects(
      () => createOrder({ items: [{ product_id: 999, quantity: 1 }] }),
      (err: any) => err instanceof AppError && err.message === 'Products not found: 999'
    );
  });
});
