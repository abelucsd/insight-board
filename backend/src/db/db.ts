import { MongoClient, Db, ServerApiVersion } from "mongodb";
import { config } from "../config/config";
import { createLogger } from "../utils/logger";

const logger = createLogger('db.ts');

let dbInstance: Db | null = null;

const client = new MongoClient(config.db.mongodbUri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export const getDb = async (): Promise<Db> => {
  
    if (!config.db.mongodbUri) {  
      throw new Error(`MongoDB URI is not defined in the config`);
    }

    await client.connect();
    dbInstance = client.db(config.db.name);
    logger.info(`[getDB] Connected to database: ${config.db.name}`);    
  
  return dbInstance;
};