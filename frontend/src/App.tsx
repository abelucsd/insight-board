import Dashboard from "./pages/Dashboard"
import Layout from "./pages/Layout"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {  

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
