import axios from 'axios';

// A URL da API vem da variável de ambiente definida pelo Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exemplo de funções do serviço
export const fetchProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const fetchCategories = async () => {
  const response = await api.get('/products/categories');
  return response.data;
};

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};
