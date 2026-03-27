export type Side = 'buy' | 'sell';

export interface Order {
  id: string;
  side: Side;
  price: number;
  quantity: number;
  submittedAt: string;
}

export interface ExecutedTrade {
  buyOrderId: string;
  sellOrderId: string;
  executionPrice: number;
  quantity: number;
}

export interface MatchingResult {
  trades: ExecutedTrade[];
  openOrders: Order[];
}

type MutableOrder = Order & { remainingQuantity: number };

const compareOrders = (left: MutableOrder, right: MutableOrder): number => {
  if (left.price !== right.price) {
    return left.side === 'buy' ? right.price - left.price : left.price - right.price;
  }

  const leftTimestamp = Date.parse(left.submittedAt);
  const rightTimestamp = Date.parse(right.submittedAt);

  if (leftTimestamp !== rightTimestamp) {
    return leftTimestamp - rightTimestamp;
  }

  return left.id.localeCompare(right.id);
};

const assertValidOrder = (order: Order): void => {
  if (!order.id.trim()) {
    throw new Error('Order id is required.');
  }

  if (!Number.isFinite(order.price) || order.price <= 0) {
    throw new Error(`Order ${order.id} has an invalid price.`);
  }

  if (!Number.isFinite(order.quantity) || order.quantity <= 0) {
    throw new Error(`Order ${order.id} has an invalid quantity.`);
  }

  if (Number.isNaN(Date.parse(order.submittedAt))) {
    throw new Error(`Order ${order.id} has an invalid submittedAt timestamp.`);
  }
};

export const matchOrders = (orders: Order[]): MatchingResult => {
  const buyBook: MutableOrder[] = [];
  const sellBook: MutableOrder[] = [];
  const trades: ExecutedTrade[] = [];

  for (const order of orders) {
    assertValidOrder(order);

    const incomingOrder: MutableOrder = {
      ...order,
      remainingQuantity: order.quantity,
    };

    const restingBook = incomingOrder.side === 'buy' ? sellBook : buyBook;

    while (incomingOrder.remainingQuantity > 0 && restingBook.length > 0) {
      restingBook.sort(compareOrders);
      const bestRestingOrder = restingBook[0];
      const isCrossed =
        incomingOrder.side === 'buy'
          ? incomingOrder.price >= bestRestingOrder.price
          : incomingOrder.price <= bestRestingOrder.price;

      if (!isCrossed) {
        break;
      }

      const executedQuantity = Math.min(
        incomingOrder.remainingQuantity,
        bestRestingOrder.remainingQuantity,
      );

      trades.push({
        buyOrderId: incomingOrder.side === 'buy' ? incomingOrder.id : bestRestingOrder.id,
        sellOrderId: incomingOrder.side === 'sell' ? incomingOrder.id : bestRestingOrder.id,
        executionPrice: bestRestingOrder.price,
        quantity: executedQuantity,
      });

      incomingOrder.remainingQuantity -= executedQuantity;
      bestRestingOrder.remainingQuantity -= executedQuantity;

      if (bestRestingOrder.remainingQuantity === 0) {
        restingBook.shift();
      }
    }

    if (incomingOrder.remainingQuantity > 0) {
      const destinationBook = incomingOrder.side === 'buy' ? buyBook : sellBook;
      destinationBook.push(incomingOrder);
    }
  }

  const openOrders = [...buyBook, ...sellBook]
    .sort(compareOrders)
    .map(({ remainingQuantity, ...order }) => ({
      ...order,
      quantity: remainingQuantity,
    }));

  return {
    trades,
    openOrders,
  };
};
