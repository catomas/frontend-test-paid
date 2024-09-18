"use server";

import { Product } from "@/interfaces/product.interface";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};
