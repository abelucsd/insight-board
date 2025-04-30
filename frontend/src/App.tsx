import Dashboard from "./pages/Dashboard"
import Invoices from "./pages/Invoices"
import Layout from "./pages/Layout"
import Products from "./pages/Products"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/invoices" element={<Invoices />} />
          </Route>
        </Routes>
      
      </BrowserRouter>
    </>
  )
};

export default App;
