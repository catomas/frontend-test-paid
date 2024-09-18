"use server";

import { Product } from "@/interfaces/product.interface";
import axios from "axios";

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`
    );
    if (!response.data) {
      throw new Error("Failed to fetch products");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching products", error);
    throw error;
  }
};
