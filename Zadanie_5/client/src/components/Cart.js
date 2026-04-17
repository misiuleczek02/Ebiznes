import React from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, totalAmount } = useShop();

    return (
        <div>
            <h2>Twój Koszyk</h2>
            <Link to="/">Wróć do produktów</Link>
            {cart.length === 0 ? (
                <p>Koszyk jest pusty.</p>
            ) : (
                <>
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index}>{item.name} - {item.price} PLN</li>
                        ))}
                    </ul>
                    <h3>Suma: {totalAmount} PLN</h3>
                    <Link to="/payment">
                        <button>Przejdź do płatności</button>
                    </Link>
                </>
            )}
        </div>
    );
};

export default Cart;