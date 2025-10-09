import Search from "@/components/ProductFilters";
import { GET } from "../../api/products/route";

export default async function DashboardPage() {
  const res = await GET();

  if (!res.ok) throw new Error("Failed to fetch products");

  const { products } = await res.json();

  return (
    <div>
      <h1 className="text-3xl text-black font-bold mb-6">Top Products</h1>
      <Search product={products} />
    </div>
  );
}
