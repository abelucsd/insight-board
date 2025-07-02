import { faker } from '@faker-js/faker';
import { CreateInvoiceInput } from '../../src/models/invoice';

function createInvoice(): CreateInvoiceInput {
  const price = faker.number.int({ min: 5, max: 100 });
  const quantity = faker.number.int({ min: 1, max: 20 });
  const revenue = price * quantity;
  const cost = faker.number.int({ min: 1, max: price });
  const profit = revenue - cost;

  return {
    id: faker.string.ulid(),  
    customer: faker.internet.username(),
    itemName: faker.commerce.productName(),
    itemNumber: faker.string.ulid(),
    price,
    date: faker.date.past({ years: 1, refDate: new Date() }).toISOString(),
    quantity,
    revenue,
    cost,
    profit,
    location: faker.location.state({ abbreviated: true }),
  };
};

export function createInvoices(count: number): CreateInvoiceInput[] {
  return Array.from({ length: count }, () => createInvoice());
};