import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
};

export default App;
