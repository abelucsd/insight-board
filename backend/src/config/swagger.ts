import fs from 'fs';
import path from 'path';
const yaml = require('js-yaml');

// swagger docs
const docsPath = path.join(__dirname, '../../docs/index.yaml')
export const swaggerDocument = yaml.load(fs.readFileSync(docsPath, 'utf8'));

const productPaths = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/paths/products.yaml'), 'utf8'))
const categoryPaths = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/paths/category.yaml'), 'utf8'))
const invoicePaths = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/paths/invoice.yaml'), 'utf8'))
const invoiceAnalyticsPaths = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/paths/invoiceAnalytics.yaml'), 'utf8'))

const productComponents = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/components/schemas/product.yaml'), 'utf8'))
const categoryComponents = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/components/schemas/category.yaml'), 'utf8'))
const invoiceComponents = yaml.load(fs.readFileSync(path.join(__dirname, '../../docs/components/schemas/invoice.yaml'), 'utf8'))

swaggerDocument.paths = {
  ...productPaths,
  ...categoryPaths,
  ...invoicePaths,
  ...invoiceAnalyticsPaths,
};
swaggerDocument.components = {
  schemas:{
    ...productComponents,
    ...categoryComponents,
    ...invoiceComponents,
  }
};
