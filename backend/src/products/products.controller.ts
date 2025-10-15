import { Controller, Get } from '@nestjs/common';

interface Product {
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
}

interface ProductResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

@Controller('products')
export class ProductsController {
  @Get()
  async getProducts() {
    try {
      // Fetch from external API (DummyJSON)
      const response = await fetch('https://dummyjson.com/products');
      const data = (await response.json()) as ProductResponse;
      
      // Simplify the response to match frontend expectations
      const simplified = data.products.map((p: Product) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        thumbnail: p.thumbnail,
        rating: p.rating,
      }));

      return { 
        products: simplified 
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch products',
        message: error.message,
      };
    }
  }
}