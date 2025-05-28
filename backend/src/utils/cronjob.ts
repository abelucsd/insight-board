import { getAnalyticsQueue } from '../workers/queues/analyticsQueue';


export async function setupCronJobs() {
  const analyticsQueue = getAnalyticsQueue();

  await analyticsQueue.add(
    'monthlySales',
    {},
    {
      repeat: {
        pattern: '0 0 * * 0', // Every Sunday at midnight
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );

  await analyticsQueue.add(
    'currentMonthSales',
    {},
    {
      repeat: {
        pattern: '0 0 * * 0', // Every Sunday at midnight
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  await analyticsQueue.add(
    'monthlyRevenue',
    {},
    {
      repeat: {
        pattern: '0 0 * * 0', // Every Sunday at midnight
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  await analyticsQueue.add(
    'currentMonthRevenue',
    {},
    {
      repeat: {
        pattern: '0 0 * * 0', // Every Sunday at midnight
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  await analyticsQueue.add(
    'monthlyProfit',
    {},
    {
      repeat: {
        pattern: '0 0 * * 0', // Every Sunday at midnight
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  await analyticsQueue.add(
    'currentMonthProfit',
    {},
    {
      repeat: {
        pattern: '0 0 * * 0', // Every Sunday at midnight
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
  await analyticsQueue.add(
    'topProducts',
    {},
    {
      repeat: {
        pattern: '0 0 * * 0', // Every Sunday at midnight
      },
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};