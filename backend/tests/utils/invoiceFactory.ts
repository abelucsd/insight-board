import { faker } from '@faker-js/faker';
import { CreateInvoiceInput } from '../../src/models/invoice';

function createInvoice(): CreateInvoiceInput {  
  const price = faker.number.int({ min: 5, max: 100 });
  const quantity = faker.number.int({ min: 1, max: 20 });
  const revenue = price * quantity;
  const totalCost = faker.number.int({ min: 1, max: price });
  const cost = price * 0.4;
  const profit = revenue - totalCost;

  return {
    id: faker.string.ulid(),
    customer: faker.internet.username(),    
    date: faker.date.past({ years: 1, refDate: new Date() }).toISOString(),
    location: faker.location.state({ abbreviated: true }),
    items: [{
      id: faker.string.ulid(),
      name: faker.commerce.productName(),
      salePrice: price,
      quantity,
      revenue,
      cost,
      profit,
    }],
    totalRevenue: revenue,
    totalCost: cost,
    totalProfit: profit,
  };
};

export function createInvoices(count: number): CreateInvoiceInput[] {
  return Array.from({ length: count }, () => createInvoice());
};