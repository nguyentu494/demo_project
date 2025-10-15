export async function generateStaticParams() {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();

  const products = data.products ?? [];

  if (!Array.isArray(products)) {
    console.error("Products is not an array:", data);
    return [];
  }

  return products.map((p: { id: number | string }) => ({
    id: String(p.id),
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`https://dummyjson.com/products/${params.id}`);
  const product = await res.json();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
