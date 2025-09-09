import shirt1 from "@/assets/shirt-1.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import pants1 from "@/assets/pants-1.jpg";
import watch1 from "@/assets/watch-1.jpg";

export interface Product {
  id: string;
  name: string;
  category: 'shirts' | 'pants' | 'tshirts' | 'accessories';
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
}

export const products: Product[] = [];

// Function to get all products including custom ones from localStorage
export const getAllProducts = (): Product[] => {
  const savedProducts = localStorage.getItem('customProducts');
  const customProducts = savedProducts ? JSON.parse(savedProducts) : [];
  return [...products, ...customProducts];
};

export const getProductsByCategory = (category: string) => {
  const allProducts = getAllProducts();
  return allProducts.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  const allProducts = getAllProducts();
  return allProducts.find(product => product.id === id);
};

export const getFeaturedProducts = () => {
  const allProducts = getAllProducts();
  return allProducts.filter(product => product.originalPrice).slice(0, 6);
};