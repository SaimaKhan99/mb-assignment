import { test, expect } from '@playwright/test';

import { matchOrders, type Order } from '../../src/challenge/order-matching';

test.describe('matchOrders', () => {
  test('matches two compatible orders at the resting order price', () => {
    const orders: Order[] = [
      {
        id: 'sell-1',
        side: 'sell',
        price: 101,
        quantity: 2,
        submittedAt: '2026-03-26T10:00:00.000Z',
      },
      {
        id: 'buy-1',
        side: 'buy',
        price: 103,
        quantity: 2,
        submittedAt: '2026-03-26T10:00:01.000Z',
      },
    ];

    const result = matchOrders(orders);

    expect(result.trades).toEqual([
      {
        buyOrderId: 'buy-1',
        sellOrderId: 'sell-1',
        executionPrice: 101,
        quantity: 2,
      },
    ]);
    expect(result.openOrders).toEqual([]);
  });

  test('keeps partial remainder on the book after a partial fill', () => {
    const orders: Order[] = [
      {
        id: 'sell-1',
        side: 'sell',
        price: 100,
        quantity: 5,
        submittedAt: '2026-03-26T10:00:00.000Z',
      },
      {
        id: 'buy-1',
        side: 'buy',
        price: 101,
        quantity: 2,
        submittedAt: '2026-03-26T10:00:01.000Z',
      },
    ];

    const result = matchOrders(orders);

    expect(result.trades).toHaveLength(1);
    expect(result.openOrders).toEqual([
      {
        id: 'sell-1',
        side: 'sell',
        price: 100,
        quantity: 3,
        submittedAt: '2026-03-26T10:00:00.000Z',
      },
    ]);
  });

  test('honors price-time priority when several resting orders are available', () => {
    const orders: Order[] = [
      {
        id: 'sell-early',
        side: 'sell',
        price: 100,
        quantity: 1,
        submittedAt: '2026-03-26T10:00:00.000Z',
      },
      {
        id: 'sell-late',
        side: 'sell',
        price: 100,
        quantity: 1,
        submittedAt: '2026-03-26T10:00:05.000Z',
      },
      {
        id: 'sell-worse-price',
        side: 'sell',
        price: 101,
        quantity: 1,
        submittedAt: '2026-03-26T10:00:02.000Z',
      },
      {
        id: 'buy-1',
        side: 'buy',
        price: 101,
        quantity: 3,
        submittedAt: '2026-03-26T10:00:10.000Z',
      },
    ];

    const result = matchOrders(orders);

    expect(result.trades).toEqual([
      {
        buyOrderId: 'buy-1',
        sellOrderId: 'sell-early',
        executionPrice: 100,
        quantity: 1,
      },
      {
        buyOrderId: 'buy-1',
        sellOrderId: 'sell-late',
        executionPrice: 100,
        quantity: 1,
      },
      {
        buyOrderId: 'buy-1',
        sellOrderId: 'sell-worse-price',
        executionPrice: 101,
        quantity: 1,
      },
    ]);
    expect(result.openOrders).toEqual([]);
  });

  test('rejects malformed orders', () => {
    expect(() =>
      matchOrders([
        {
          id: 'broken',
          side: 'buy',
          price: 0,
          quantity: 1,
          submittedAt: '2026-03-26T10:00:00.000Z',
        },
      ]),
    ).toThrow('Order broken has an invalid price.');
  });
});
