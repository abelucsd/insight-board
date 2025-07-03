import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MantineProvider } from '@mantine/core';

import Dashboard from "./pages/Dashboard"
import Layout from "./pages/Layout"
import LoadProducts from "./pages/products/LoadProducts"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ViewProducts from "./pages/products/ViewProducts"
import CreateProduct from "./pages/products/CreateProduct"
import ViewInvoices from "./pages/invoices/ViewInvoices"
import LoadInvoices from "./pages/invoices/LoadInvoices"
import { useEffect } from "react"
import ViewCustomers from "./pages/customers/ViewCustomers";
import LoadCustomers from "./pages/customers/LoadCustomers";

const queryClient = new QueryClient();
// TODO: consider persister.
// const persister = createSyncStoragePersister({
//   storage: window.localStorage,
// })

function App() {  

  useEffect(() => {
    document.title = "Insight Board";
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/products/view" element={<ViewProducts />} />
                <Route path="/products/add" element={<CreateProduct />} />              
                <Route path="/products/add-batch" element={<LoadProducts />} />              
                <Route path="/invoices/view" element={<ViewInvoices />} />
                <Route path="/invoices/add-batch" element={<LoadInvoices />} />
                <Route path="/customers/view" element={<ViewCustomers />} />
                <Route path="/customers/add-batch" element={<LoadCustomers />} />
              </Route>
            </Routes>
          
          </BrowserRouter>
        </MantineProvider>
      </QueryClientProvider>
    </>
  )
};

export default App;
