import { Category, Product } from '@/types/menu';
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '@/data/constants';

const KEYS = {
  CATEGORIES: 'kingburguer_categories',
  PRODUCTS: 'kingburguer_products',
};

const initialize = () => {
  const cats = localStorage.getItem(KEYS.CATEGORIES);
  const prods = localStorage.getItem(KEYS.PRODUCTS);

  if (!cats) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!prods) {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
};

initialize();

export const StorageService = {
  getCategories: (): Category[] => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : [];
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [];
  },
};
