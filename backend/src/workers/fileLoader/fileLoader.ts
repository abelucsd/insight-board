import fs from 'fs';
import path from 'path';
import mongoose, { SchemaType } from 'mongoose';

import { createLogger } from "../../utils/logger";
import { CustomError } from "../../errors/CustomError";
import { Product } from "../../models/product";
import { getDb } from '../../db/db';
import { Invoice } from '../../models/invoice';
import { Visit } from '../../models/visit';


const logger = createLogger('fileLoader.ts');

type Row = Record<string, string>;


/**
 * Converts a string like "Category Name" or "category_name" to camelCase.
 */
function toCamelCase(header: string): string {
  return header
    .replace(/[_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^./, (str) => str.toLowerCase());
}

export async function cleanAndValidateData(
  rows: Row[], fileCategory: string
) : Promise<any[]> {
  const cleanedRows: any[] = [];

  // Extract schema paths  
  let schemaPaths: Record<string, SchemaType> = {};
  switch (fileCategory) {
    case 'product':
      schemaPaths = Product.schema.paths;
      break;
    case 'invoice':
      schemaPaths = Invoice.schema.paths;
      break;
    case 'visit':
      schemaPaths = Visit.schema.paths;
      break;
    default:
      const err = new CustomError('Unsupported category type', 500);
      throw err;
  }


  // Get required fields
  const requiredFields = Object.keys(schemaPaths).filter(
    (key) => schemaPaths[key].isRequired
  );

  for (const [rowIndex, row] of rows.entries()) {
    const cleanedRow: Record<string, any> = {};

    for (const [rawKey, rawValue] of Object.entries(row)) {
      const key = toCamelCase(rawKey.trim());
      let value: any = rawValue.trim();

      // Clean value by inferring schema type
      if (schemaPaths[key]) {
        // instance - Mongoose property that tells the field type.
        const schemaType = schemaPaths[key].instance;

        switch (schemaType) {
          case 'Number':
            value = Number(value);
            if (isNaN(value)) {
              throw new CustomError(`Row ${rowIndex + 1}: Invalid number for field "${key}"`, 400);
            }
            break;
          case 'Boolean':
            value = value.toLowerCase() === 'true' || value === '1';
            break;
          case 'String':
            value = value.toString();
            break;
        }

        cleanedRow[key] = value;
      }
    }

    // Check for missing required fields
    for (const field of requiredFields) {
      if (cleanedRow[field] === undefined || cleanedRow[field] === '') {
        const err = new CustomError(`Row ${rowIndex + 1}: Missing required field "${field}"`, 400);        
        throw err;
      }
    }

    cleanedRows.push(cleanedRow);
  }

  logger.info(`[cleanAndValidateData] Successfully cleaned ${cleanedRows.length} rows.`);
  return cleanedRows;
}


export async function loadCSV(filePath: string): Promise<Row[]> {
  try {    
    const data = await fs.readFileSync(filePath, 'utf8');    
    const lines = data.trim().split('\n');
    const headersRaw = lines[0].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
    const headers = headersRaw.map(h => h.replace(/^"|"$/g, '').trim());


    const rows: Row[] = lines.slice(1).map((line: string) => {
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanedValues = values.map(v => v.replace(/^"|"$/g, '').trim());
      const row: Row = {};

      headers.forEach((header: string, i: number) => {
        row[header.trim()] = cleanedValues[i]?.trim() ?? '';
      });

      return row;
    });

    logger.info(`[loadCSV] Successfully read CSV file: ${filePath}`);
    return rows;
  } catch (error) {
    const err = new CustomError('Failed to read CSV file', 500);    
    throw err;
  }  
};

export async function loadJSON(filePath: string): Promise<Row[]> {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    logger.info(`[loadJSON] Successfully read JSON file: ${filePath}`);
    return json;
  } catch (error) {
    const err = new CustomError('Failed to read JSON file', 500);    
    throw err;
  }
};


// Function to load file based on its extension
// TODO: Add JSON functionality.
export async function loadFile(
  filePath: string, fileCategory: string
) : Promise<any[]> {

  const ext = path.extname(filePath).toLowerCase();
  let rows: Row[] = [];
  logger.info(`[loadFile] File path: ${filePath}`);

  switch (ext) {
    case '.csv':
      rows = await loadCSV(filePath);
      break;    
    default:
      const err = new CustomError('Unsupported file type', 400);      
      throw err;
  }

  const cleanedRows = await cleanAndValidateData(rows, fileCategory);
  
  await getDb();  

  switch (fileCategory){
    case 'product':
      await Product.insertMany(cleanedRows);
      break
    case 'invoice':
      await Invoice.insertMany(cleanedRows);
      break
    case 'visit':
      await Visit.insertMany(cleanedRows);
      break;
    default:
      const err = new CustomError('Unsupported file type', 400);      
      throw err;
  }  

  await mongoose.disconnect();
  logger.info(`[loadFile] Successfully loaded file: ${filePath}`);
  return rows;
};
