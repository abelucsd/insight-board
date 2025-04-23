import Dashboard from "./pages/Dashboard"
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
          </Route>
        </Routes>
      
      </BrowserRouter>
    </>
  )
};

export default App;
