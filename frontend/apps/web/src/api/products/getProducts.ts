import { Product, ProductResponse } from "@/types/implements/Product";

export async function getProducts(): Promise<{ products: Product[] }> {
  const res = await fetch("https://dummyjson.com/products");
  const data = (await res.json()) as ProductResponse;
  const products = data.products;

  const simplified = products.map((p: Product) => ({...p}));

  return { products: simplified };
}
