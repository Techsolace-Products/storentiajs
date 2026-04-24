import { UUID, PaginationInput, PageInfo } from './common';
import { Media } from './media';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export interface Product {
  id: UUID;
  title: string;
  description?: string;
  price: number;
  status: ProductStatus;
  sku?: string;
  stock?: number;
  udf1?: string;
  udf2?: string;
  createdAt: string;
  updatedAt: string;
  media?: Media[];
  collections?: { id: UUID; name: string }[];
  options?: ProductOption[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: UUID;
  productId: UUID;
  title: string;
  price: number;
  sku?: string;
  stock?: number;
  mediaIds?: UUID[];
  optionValues?: ProductOptionValue[];
}

export interface ProductOption {
  id: UUID;
  name: string;
  position: number;
  values: ProductOptionValue[];
}

export interface ProductOptionValue {
  id: UUID;
  value: string;
  metadata?: any;
}

export interface InventoryItem {
  id: UUID;
  productId: UUID;
  productTitle: string;
  variantTitle?: string;
  sku?: string;
  stock: number;
  price: number;
  status: ProductStatus;
}

export interface CreateProductInput {
  title: string;
  description?: string;
  price: number;
  status?: ProductStatus;
  sku?: string;
  stock?: number;
  mediaIds?: UUID[];
  collectionIds?: UUID[];
  udf1?: string;
  udf2?: string;
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  status?: ProductStatus;
  sku?: string;
  stock?: number;
  mediaIds?: UUID[];
  udf1?: string;
  udf2?: string;
}

export interface CreateProductVariantInput {
  productId: UUID;
  title: string;
  price: number;
  sku?: string;
  stock?: number;
  mediaIds?: UUID[];
  optionValueIds: UUID[];
}

export interface UpdateProductVariantInput {
  title?: string;
  price?: number;
  sku?: string;
  stock?: number;
  mediaIds?: UUID[];
}

export interface AddProductOptionInput {
  productId: UUID;
  name: string;
  position?: number;
}

export interface UpdateProductOptionInput {
  name?: string;
  position?: number;
}

export interface AddProductOptionValueInput {
  optionId: UUID;
  value: string;
  metadata?: any;
}
