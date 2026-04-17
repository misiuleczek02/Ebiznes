import React, { createContext, useState, useContext } from 'react';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (product) => {
        setCart([...cart, product]);
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <ShopContext.Provider value={{ cart, addToCart, clearCart, totalAmount }}>
            {children}
        </ShopContext.Provider>
    );
};