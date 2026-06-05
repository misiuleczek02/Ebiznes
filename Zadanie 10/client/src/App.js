import React, { useEffect, useState } from "react";
import { fetchProducts, fetchCategories, API_URL } from "./api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => setError("Nie udalo sie pobrac kategorii"));
  }, []);

  useEffect(() => {
    fetchProducts(category)
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch(() => setError("Nie udalo sie pobrac produktow z serwera"));
  }, [category]);

  const addToCart = (product) =>
    setCart((prev) => [...prev, product]);

  const total = cart
    .reduce((sum, p) => sum + p.price, 0)
    .toFixed(2);

  return (
    <main className="container">
      <h1 data-testid="title">Sklep — Zadanie 10</h1>
      <p className="api-info" data-testid="api-url">
        API: {API_URL}
      </p>

      {error && (
        <p className="error" data-testid="error">
          {error}
        </p>
      )}

      <div className="filters">
        <button
          data-testid="filter-all"
          onClick={() => setCategory("")}
          className={category === "" ? "active" : ""}
        >
          Wszystkie
        </button>
        {categories.map((c) => (
          <button
            key={c}
            data-testid={`filter-${c}`}
            onClick={() => setCategory(c)}
            className={category === c ? "active" : ""}
          >
            {c}
          </button>
        ))}
      </div>

      <ul className="products" data-testid="product-list">
        {products.map((p) => (
          <li key={p.id} className="product" data-testid={`product-${p.id}`}>
            <span className="name">{p.name}</span>
            <span className="category">{p.category}</span>
            <span className="price">{p.price.toFixed(2)} zl</span>
            <button data-testid={`add-${p.id}`} onClick={() => addToCart(p)}>
              Dodaj do koszyka
            </button>
          </li>
        ))}
      </ul>

      <div className="cart" data-testid="cart">
        <h2>Koszyk ({cart.length})</h2>
        <p data-testid="cart-total">Razem: {total} zl</p>
      </div>
    </main>
  );
}
