import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Dashboard from "./pages/Dashboard"
import Invoices from "./pages/Invoices"
import Layout from "./pages/Layout"
import Products from "./pages/Products"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ViewProducts from "./pages/products/ViewProducts"

const queryClient = new QueryClient();
// TODO: consider persister.
// const persister = createSyncStoragePersister({
//   storage: window.localStorage,
// })

function App() {  

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="/products/view" element={<ViewProducts />} />
              <Route path="/products/add" element={<Products />} />              
              <Route path="/invoices" element={<Invoices />} />
            </Route>
          </Routes>
        
        </BrowserRouter>
      </QueryClientProvider>
    </>
  )
};

export default App;
