import ProductDetail from "@/components/ProductDetail";
import { Product } from "@/types/implements/Product";
import { notFound } from "next/navigation";


export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`, {
    next: { revalidate: 60 }, 
  });

  if (!res.ok) return notFound();

  const product: Product = await res.json();

  return (
    <div className="max-w-5xl mx-auto p-6">
      <ProductDetail product={product} />
    </div>
  );
}
