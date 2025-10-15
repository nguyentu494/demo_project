import Search from "@/components/ProductFilters";
import { getProducts } from "@/api/products/getProducts";

export default async function DashboardPage() {
  const { products } = await getProducts();

  return (
    <div>
      <h1 className="text-3xl text-black font-bold mb-6">Top Products</h1>
      <Search product={products} />
    </div>
  );
}
