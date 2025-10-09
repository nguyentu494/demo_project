"use client";
import { Product } from "@/types/implements/Product";
import { useState, useMemo } from "react";
import { ProductCard } from "./ProductCard";

export default function ({ product }: { product: Product[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("none");

  const list = useMemo(() => {
    let arr = product.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase())
    );
    if (sort === "price") arr = [...arr].sort((a, b) => a.price - b.price);
    if (sort === "rating") arr = [...arr].sort((a, b) => b.rating - a.rating);
    return arr;
  }, [product, query, sort]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border rounded px-3 py-2 w-full border-gray-600"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="none">Sort</option>
          <option value="price">Price ↑</option>
          <option value="rating">Rating ↓</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
