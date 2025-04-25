import mongoose from "mongoose";
import { MongoClient, Db, ServerApiVersion } from "mongodb";
import { config } from "../config/config";
import { createLogger } from "../utils/logger";

const logger = createLogger('db.ts');


export const getDb = async (): Promise<Db | undefined> => {
  
  if (!config.db.mongodbUri) {  
    throw new Error(`MongoDB URI is not defined in the config`);
  }  
  
  await mongoose.connect(
    config.db.mongodbUri
  )

  logger.info(`[getDB] Connected to database: ${mongoose.connection.db?.databaseName}`);  

  
  return mongoose.connection.db;  
};