"use client"

import { Product } from "@/types/implements/Product";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      <div className="relative w-full h-40 mb-3">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-fill rounded-lg"
        />
      </div>
      <h3 className="font-semibold text-lg line-clamp-1 text-black">{product.title}</h3>
      <div className="text-gray-500 text-sm">⭐ {product.rating}</div>
      <div className="mt-auto text-blue-600 font-bold">${product.price}</div>
      <Link href={`/products/${product.id}`} className="text-blue-500 hover:underline">
        Details
      </Link>
    </div>
  );
}
