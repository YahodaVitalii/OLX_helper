import {
  Product,
  ProductDetails,
  ProductAdvert,
  ProductFinance,
  Laptop,
  Image,
} from '@prisma/client';

export type ExtendedProduct = Product & {
  ProductDetails: ProductDetails | null;
  ProductAdvert: ProductAdvert | null;
  ProductFinance: ProductFinance | null;
  Laptop: Laptop | null;
  images: Image[];
};
