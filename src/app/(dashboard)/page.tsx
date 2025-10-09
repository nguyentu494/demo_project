import Link from "next/link";

export default async function DashboardPage() {

  return (
    <div className="p-6">
      <h1 className="text-3xl text-black font-bold mb-6">Dashboard</h1>
      

      <div className="text-center mt-8">
        <Link
          href="/products"
          className="text-blue-600 hover:underline font-medium"
        >
          Example: View Products
        </Link>
      </div>
    </div>
  );
}
