import React, { useState } from 'react';
import axios from 'axios';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const Payments = () => {
    const { totalAmount, clearCart } = useShop();
    const [method, setMethod] = useState('Blik');
    const navigate = useNavigate();

    const handlePayment = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/payments', {
                amount: totalAmount,
                method: method
            });
            alert(response.data.message);
            clearCart();
            navigate('/');
        } catch (error) {
            console.error("Błąd płatności:", error);
            alert("Płatność odrzucona");
        }
    };

    return (
        <div>
            <h2>Płatność</h2>
            <p>Do zapłaty: <strong>{totalAmount} PLN</strong></p>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="Blik">BLIK</option>
                <option value="Karta">Karta Płatnicza</option>
                <option value="Przelew">Przelew bankowy</option>
            </select>
            <br /><br />
            <button onClick={handlePayment} disabled={totalAmount === 0}>
                Opłać zamówienie
            </button>
        </div>
    );
};

export default Payments;