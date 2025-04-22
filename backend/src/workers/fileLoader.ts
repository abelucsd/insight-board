const { parentPort, workerData } = require('worker_threads');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

import { createLogger } from "../utils/logger";
import { CustomError } from "../errors/CustomError";
import { Product, IProduct } from "../models/product";


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

export async function cleanAndValidateData(rows: Row[]): Promise<any[]> {
  const cleanedRows: any[] = [];

  // Extract schema paths
  const schemaPaths = Product.schema.paths;

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
        logger.error(`[cleanAndValidateData] ${err.message}`);
        throw err;
      }
    }

    cleanedRows.push(cleanedRow);
  }

  logger.info(`[cleanAndValidateData] Successfully cleaned ${cleanedRows.length} rows.`);
  return cleanedRows;
}


// Loaders for handling Excel, CSV, and JSON file formats
async function loadExcel(filePath: string): Promise<Row[]> {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    logger.info(`[loadExcel] Successfully read Excel file: ${filePath}`);
    return json;
  } catch (error) {
    const err = new CustomError('Failed to read Excel file', 500);
    logger.error(`[loadExcel] Error reading Excel file: ${err.message}`);                
    throw err;
  }
};

async function loadCSV(filePath: string): Promise<Row[]> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.trim().split('\n');
    const headers = lines[0].split(',');

    const rows: Row[] = lines.slice(1).map((line: string) => {
      const values = line.split(',');
      const row: Row = {};

      headers.forEach((header: string, i: number) => {
        row[header.trim()] = values[i]?.trim() ?? '';
      });

      return row;
    });

    logger.info(`[loadCSV] Successfully read CSV file: ${filePath}`);
    return rows;
  } catch (error) {
    const err = new CustomError('Failed to read CSV file', 500);
    logger.error(`[loadCSV] Error reading CSV file: ${err.message}`);
    throw err;
  }  
};

async function loadJSON(filePath: string): Promise<Row[]> {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(data);
    logger.info(`[loadJSON] Successfully read JSON file: ${filePath}`);
    return json;
  } catch (error) {
    const err = new CustomError('Failed to read JSON file', 500);
    logger.error(`[loadJSON] Error reading JSON file: ${err.message}`);    
    throw err;
  }
};


// Function to load file based on its extension
async function loadFile(filePath: string): Promise<any[]> {
  const ext = path.extname(filePath).toLowerCase();
  let rows: Row[] = [];
  switch (ext) {
    case '.xlsx':
      rows = await loadExcel(filePath);
      break;
    case '.csv':
      rows = await loadCSV(filePath);
      break;
    case '.json':
      rows = await loadJSON(filePath);
      break;
    default:
      const err = new CustomError('Unsupported file type', 400);
      logger.error(`[loadFile] Error: ${err.message}`);
      throw err;
  }
  const cleanedRows = await cleanAndValidateData(rows);
  await Product.insertMany(cleanedRows);
  logger.info(`[loadFile] Successfully loaded file: ${filePath}`);
  return rows;
};


parentPort?.on('message', async (filePath: string) => {
  try {
    const data = await loadFile(filePath);
    parentPort?.postMessage(data);
  } catch (error: any) {
    parentPort?.postMessage({ error: error.message });
  }
});