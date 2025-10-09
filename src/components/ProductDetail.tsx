"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductDetail({ product }: { product: any }) {
  const [activeImg, setActiveImg] = useState(product.thumbnail);

  return (
    <div className="grid md:grid-cols-2 gap-8 bg-white rounded-xl shadow p-6">
      {/* Left: Product Images */}
      <div>
        <div className="relative w-full h-80 mb-4">
          <Image
            src={activeImg}
            alt={product.title}
            fill
            className="object-contain rounded-lg bg-gray-50"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {[product.thumbnail, ...(product.images || [])].map(
            (img: string, i: number) => (
              <button
                key={i}
                onClick={() => setActiveImg(img)}
                className={`relative h-20 w-20 flex-shrink-0 border rounded-lg overflow-hidden ${
                  activeImg === img
                    ? "border-blue-500 ring-2 ring-blue-400"
                    : "border-gray-200"
                }`}
              >
                <Image
                  src={img}
                  alt={`thumb-${i}`}
                  fill
                  className="object-cover"
                />
              </button>
            )
          )}
        </div>
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col space-y-3">
        <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
        <p className="text-gray-500">{product.brand}</p>
        <p className="text-yellow-500 font-medium">⭐ {product.rating}</p>

        <div className="text-3xl font-semibold text-blue-600">
          ${product.price}
        </div>

        <p className="text-gray-700 leading-relaxed">{product.description}</p>

        <div className="mt-4 space-y-1 text-sm text-gray-600">
          <p>
            <span className="font-medium">Stock:</span> {product.stock}
          </p>
          <p>
            <span className="font-medium">Warranty:</span>{" "}
            {product.warrantyInformation}
          </p>
          <p>
            <span className="font-medium">Shipping:</span>{" "}
            {product.shippingInformation}
          </p>
          <p>
            <span className="font-medium">Return Policy:</span>{" "}
            {product.returnPolicy}
          </p>
        </div>

        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
