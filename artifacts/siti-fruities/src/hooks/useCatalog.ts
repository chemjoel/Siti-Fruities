import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import type { Category, Product, ProductType } from '@/types/domain';

export interface CatalogProductOptionChoice {
  value: string;
  priceModifier?: number;
}

export interface CatalogProductOption {
  name: string;
  choices: CatalogProductOptionChoice[];
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  ingredients: string | null;
  basePrice: number;
  imageUrl: string | null;
  productType: ProductType;
  isAvailable: boolean;
  options: CatalogProductOption[];
}

function normalizeProduct(product: Product): CatalogProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description ?? '',
    ingredients: product.ingredients,
    basePrice: product.base_price,
    imageUrl: product.image_url,
    productType: product.product_type,
    isAvailable: product.is_available,
    options: (product.options ?? []).map((option) => ({
      name: option.name,
      choices: option.choices.map((choice) => ({
        value: choice.value,
        priceModifier: choice.price_modifier,
      })),
    })),
  };
}

export function useCategories(): {
  data: Category[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useProductsByCategory(slug: string): {
  data: CatalogProduct[] | undefined;
  isLoading: boolean;
  isError: boolean;
} {
  const query = useQuery({
    queryKey: ['products', 'category', slug],
    queryFn: async () => (await productService.getProductsByCategory(slug)).map(normalizeProduct),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
