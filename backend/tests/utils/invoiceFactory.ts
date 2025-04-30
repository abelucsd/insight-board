import { faker } from '@faker-js/faker';
import { IInvoice } from '../../src/models/invoice';

function createInvoice(): IInvoice {
  const price = faker.number.int({ min: 5, max: 100 });
  const quantity = faker.number.int({ min: 1, max: 20 });
  const revenue = price * quantity;
  const totalCost = faker.number.int({ min: 1, max: price });
  const profit = revenue - totalCost;

  return {
    _id: faker.string.uuid(),
    customer: faker.internet.username(),
    itemName: faker.commerce.productName(),
    itemNumber: faker.number.int(),
    price,
    date: faker.date.past({ years: 1, refDate: new Date() }).toISOString(),
    quantity,
    revenue,
    totalCost,
    profit,
    location: faker.location.state({ abbreviated: true }),
  };
};

export function createInvoices(count: number): IInvoice[] {
  return Array.from({ length: count }, () => createInvoice());
};