import axios from "axios";

export const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

const client = axios.create({ baseURL: API_URL });

export async function fetchProducts(category) {
  const params = category ? { category } : {};
  const res = await client.get("/api/products", { params });
  return res.data;
}

export async function fetchCategories() {
  const res = await client.get("/api/categories");
  return res.data;
}

export async function fetchHealth() {
  const res = await client.get("/api/health");
  return res.data;
}
