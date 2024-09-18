"use client";

import { fetchProducts } from "@/actions/products-actions";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { Product } from "@/interfaces/product.interface";

export const ListProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    const fetchedProducts = await fetchProducts();
    setProducts(fetchedProducts);
  };

  useEffect(() => {
    loadProducts();
  }, []);
  return (
    <div className="py-8">
      <h1 className="py-4 font-bold text-4xl text-white text-center drop-shadow-lg">
        List of Products
      </h1>
      {/* <div className="py-4">
        <input
          type="text"
          placeholder="Filter by name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 mr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          placeholder="Filter by country"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 mr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}
      <ul className="grid  sm:grid-cols-1  md:grid-cols-2 xl:grid-cols-3 gap-6 py-4">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </ul>
    </div>
  );
};
