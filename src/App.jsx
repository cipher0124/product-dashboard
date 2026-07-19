import { Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import PageNotFound404 from "./pages/PageNotFound404";
import AddEditProduct from "./pages/AddEditProduct";
import { ToastContainer } from "react-toastify";
import "./App.css";
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Products />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:type/:id?" element={<AddEditProduct />} />
      <Route path="*" element={<PageNotFound404 />} />
    </Routes>
     <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}
export default App;