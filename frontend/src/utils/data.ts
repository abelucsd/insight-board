// export const API_URL = import.meta.env.VITE_API_URL;
export const API_URL = 'http://localhost:3000/api';

export { default as avatarImg }  from '../assets/images/avatar.jpg';
export const logo = "LOGO";
export const adminName = 'Blue Water';


export const navItems = [
    {name: "Dashboard", link: "/"},        
];

export const productsDropdownLinks = [
    {name: "View Products", link: "/products/view"},
    {name: "Add Product", link: "/products/add"},
    {name: "Add Batch Products", link: "/products/add-batch"},
]

export const invoiceDropdownLinks = [
    {name: "View Invoices", link: "/invoices/view"},
    {name: "Add Batch Invoices", link: "/invoices/add-batch"},
]

export const customerDropdownLinks = [
    {name: "View Customers", link: "/customers/view"},
    {name: "Add Customer", link: "/customers/add"},
    {name: "Add Batch Customer", link: "/customers/add-batch"},
]


export const userMenuList = [
    "Sign Out",
];


// Test Products
export const products = [
  { name: 'Teddy Bear', price: 29.99, stock: 10 },
  { name: 'Panda Plush', price: 19.99, stock: 5 },
  { name: 'Giraffe Toy', price: 24.99, stock: 12 },
  { name: 'Lion Toy', price: 21.49, stock: 3 },
  { name: 'Elephant Plush', price: 26.95, stock: 8 },
  { name: 'Rabbit Toy', price: 18.99, stock: 7 },
  { name: 'Fox Plush', price: 27.99, stock: 6 },
  { name: 'Koala Bear', price: 30.99, stock: 4 },
  { name: 'Dinosaur Plush', price: 32.0, stock: 2 },
];