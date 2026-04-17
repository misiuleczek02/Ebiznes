import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import Products from './components/Products';
import Cart from './components/Cart';
import Payments from './components/Payments';

function App() {
    return (
        <ShopProvider>
            <Router>
                <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
                    <h1>Sklep Internetowy - Zadanie 5</h1>
                    <hr />
                    <Routes>
                        <Route path="/" element={<Products />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/payment" element={<Payments />} />
                    </Routes>
                </div>
            </Router>
        </ShopProvider>
    );
}

export default App;