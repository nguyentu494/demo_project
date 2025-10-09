import { BaseResponse } from "../BaseResponse";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  stock: number;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}


export interface ProductFetch extends BaseResponse<ProductResponse[]> {}
