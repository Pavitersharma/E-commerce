import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';

import Homepage from './components/Homepage';
import Login from './assets/pages/Login';
import Register from './assets/pages/Register';
import Dashboard from './assets/pages/Dashboard';
import Listing from './assets/pages/Listing';
import Cart from './assets/pages/Cart';
import Checkout from './assets/pages/Checkout';
import OrderSuccess from './assets/pages/OrderSuccess';
import ProductDetail from './assets/pages/ProductDetail';
import Orders from './assets/pages/Orders';

import Header from './components/Header';
import Footer from './components/Footer';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
