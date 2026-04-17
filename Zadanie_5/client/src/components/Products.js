import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Products = () => {
    const [products, setProducts] = useState([]);
    const { addToCart, cart } = useShop();

    useEffect(() => {
        axios.get('http://localhost:8080/api/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Błąd pobierania produktów:", err));
    }, []);

    return (
        <div>
            <h2>Produkty</h2>
            <Link to="/cart">Idź do koszyka ({cart.length})</Link>
            <ul>
                {products.map(p => (
                    <li key={p.id} style={{ marginBottom: '10px' }}>
                        {p.name} - {p.price} PLN{' '}
                        <button onClick={() => addToCart(p)}>Dodaj do koszyka</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;