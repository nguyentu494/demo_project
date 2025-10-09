import { Product, ProductFetch, ProductResponse } from "@/types/implements/Product";
import { NextResponse } from "next/server";

export const revalidate = 60; // cache 60s

export async function GET() {
  const res = await fetch("https://dummyjson.com/products");
  const data = (await res.json()) as ProductResponse;
  const products = data.products;

  const simplified = products.map((p: Product) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    thumbnail: p.thumbnail,
    rating: p.rating,
  }));

  return NextResponse.json({ products: simplified });
}
