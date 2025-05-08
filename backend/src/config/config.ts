import dotenv from 'dotenv';

dotenv.config();

interface DBConfig {
  mongodbUri: string;
  name: string;
};

interface Config {
  port: number;
  nodeEnv: string;
  db: DBConfig;
};

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  db: {
    mongodbUri: process.env.MONGO_URI || 'mongodb://localhost:27017',
    name: process.env.DB_NAME || 'ecommerce',
  }
};