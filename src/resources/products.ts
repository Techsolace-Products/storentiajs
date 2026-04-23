import { BaseResource } from './base';
import {
  Product,
  ProductStatus,
  PaginationInput,
  PageInfo,
  InventoryItem,
  CreateProductInput,
  UpdateProductInput,
  CreateProductVariantInput,
  UpdateProductVariantInput,
  AddProductOptionInput,
  UpdateProductOptionInput,
  AddProductOptionValueInput,
  UUID,
  ProductVariant,
  ProductOption,
  ProductOptionValue,
} from '../types';

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    title
    description
    price
    status
    sku
    stock
    udf1
    udf2
    createdAt
    updatedAt
  }
`;

const VARIANT_FIELDS = `
  fragment VariantFields on ProductVariant {
    id
    productId
    title
    price
    sku
    stock
    mediaIds
  }
`;

const MEDIA_FIELDS = `
  fragment MediaFields on Media {
    id
    name
    fileKey
    mimeType
    fileSize
  }
`;

/**
 * Product resource for managing e-commerce products, variants, options, and collections
 *
 * @example
 * ```js
 * // Get a single product
 * const product = await storentia.products.get('product-id');
 *
 * // List all products
 * const { data, pageInfo } = await storentia.products.list();
 *
 * // Create a product
 * const newProduct = await storentia.products.create({
 *   title: 'T-Shirt',
 *   price: 29.99,
 *   sku: 'TSHIRT-001'
 * });
 * ```
 */
export class ProductResource extends BaseResource {
  /**
   * Fetch a single product by ID with all related data (media, variants, options)
   * @param id - Product ID
   * @returns Product with full details
   */
  async get(id: UUID): Promise<Product> {
    const query = `
      ${PRODUCT_FIELDS}
      ${MEDIA_FIELDS}
      ${VARIANT_FIELDS}
      query GetProduct($id: UUID!) {
        product(id: $id) {
          ...ProductFields
          media { ...MediaFields }
          collections { id name }
          options {
            id
            name
            position
            values { id value metadata }
          }
          variants {
            ...VariantFields
            optionValues { id value }
          }
        }
      }
    `;
    const res = await this._graphql<{ product: Product }>(query, { id });
    return res.product;
  }

  /**
   * List products with optional filtering and pagination
   * @param params - Filter and pagination options
   * @param params.status - Filter by product status (e.g., 'ACTIVE', 'DRAFT')
   * @param params.pagination - Pagination options (page, limit)
   * @returns Array of products and pagination info
   */
  async list(params: {
    status?: ProductStatus;
    pagination?: PaginationInput;
  } = {}): Promise<{ data: Product[]; pageInfo: PageInfo }> {
    const query = `
      ${PRODUCT_FIELDS}
      query ListProducts($status: ProductStatus, $pagination: PaginationInput) {
        listProducts(status: $status, pagination: $pagination) {
          data {
            ...ProductFields
            media { id name fileKey }
          }
          pageInfo {
            total
            hasNextPage
            totalPages
          }
        }
      }
    `;
    const res = await this._graphql<{
      listProducts: { data: Product[]; pageInfo: PageInfo };
    }>(query, params);
    return res.listProducts;
  }

  /**
   * List inventory across all products and variants
   * @param params - Pagination options
   * @returns Array of inventory items and pagination info
   */
  async listInventory(params: {
    pagination?: PaginationInput;
  } = {}): Promise<{ data: InventoryItem[]; pageInfo: PageInfo }> {
    const query = `
      query ListInventory($pagination: PaginationInput) {
        listInventory(pagination: $pagination) {
          data {
            id
            productId
            productTitle
            variantTitle
            sku
            stock
            price
            status
          }
          pageInfo {
            total
            hasNextPage
          }
        }
      }
    `;
    const res = await this._graphql<{
      listInventory: { data: InventoryItem[]; pageInfo: PageInfo };
    }>(query, params);
    return res.listInventory;
  }

  /**
   * Create a new product
   * @param input - Product data (title, price, sku, etc.)
   * @returns Created product
   */
  async create(input: CreateProductInput): Promise<Product> {
    const query = `
      mutation CreateProduct($input: CreateProductInput!) {
        createProduct(input: $input) {
          id
          title
          status
        }
      }
    `;
    const res = await this._graphql<{ createProduct: Product }>(query, {
      input,
    });
    return res.createProduct;
  }

  /**
   * Update an existing product
   * @param id - Product ID
   * @param input - Fields to update
   * @returns Updated product
   */
  async update(id: UUID, input: UpdateProductInput): Promise<Product> {
    const query = `
      mutation UpdateProduct($id: UUID!, $input: UpdateProductInput!) {
        updateProduct(id: $id, input: $input) {
          id
          title
          price
          status
        }
      }
    `;
    const res = await this._graphql<{ updateProduct: Product }>(query, {
      id,
      input,
    });
    return res.updateProduct;
  }

  /**
   * Delete a product
   * @param id - Product ID
   * @returns true if deletion was successful
   */
  async delete(id: UUID): Promise<boolean> {
    const query = `
      mutation DeleteProduct($id: UUID!) {
        deleteProduct(id: $id)
      }
    `;
    const res = await this._graphql<{ deleteProduct: boolean }>(query, { id });
    return res.deleteProduct;
  }

  /**
   * Generate product variants from product options
   * @param productId - Product ID
   * @returns Array of generated variants
   */
  async generateVariants(productId: UUID): Promise<ProductVariant[]> {
    const query = `
      mutation GenerateVariants($productId: UUID!) {
        generateProductVariants(productId: $productId) {
          id
          title
          sku
          price
        }
      }
    `;
    const res = await this._graphql<{
      generateProductVariants: ProductVariant[];
    }>(query, { productId });
    return res.generateProductVariants;
  }

  /**
   * Create a new product variant
   * @param input - Variant data (title, price, sku, etc.)
   * @returns Created variant
   */
  async createVariant(
    input: CreateProductVariantInput
  ): Promise<ProductVariant> {
    const query = `
      mutation CreateVariant($input: CreateProductVariantInput!) {
        createProductVariant(input: $input) {
          id
          title
          sku
        }
      }
    `;
    const res = await this._graphql<{ createProductVariant: ProductVariant }>(
      query,
      { input }
    );
    return res.createProductVariant;
  }

  /**
   * Update a product variant
   * @param id - Variant ID
   * @param input - Fields to update
   * @returns Updated variant
   */
  async updateVariant(
    id: UUID,
    input: UpdateProductVariantInput
  ): Promise<ProductVariant> {
    const query = `
      mutation UpdateVariant($id: UUID!, $input: UpdateProductVariantInput!) {
        updateProductVariant(id: $id, input: $input) {
          id
          title
          stock
        }
      }
    `;
    const res = await this._graphql<{ updateProductVariant: ProductVariant }>(
      query,
      { id, input }
    );
    return res.updateProductVariant;
  }

  /**
   * Delete a product variant
   * @param id - Variant ID
   * @returns true if deletion was successful
   */
  async deleteVariant(id: UUID): Promise<boolean> {
    const query = `
      mutation DeleteVariant($id: UUID!) {
        deleteProductVariant(id: $id)
      }
    `;
    const res = await this._graphql<{ deleteProductVariant: boolean }>(query, {
      id,
    });
    return res.deleteProductVariant;
  }

  /**
   * Add an option to a product (e.g., "Color", "Size")
   * @param input - Option data (productId, name, etc.)
   * @returns Created option
   */
  async addOption(input: AddProductOptionInput): Promise<ProductOption> {
    const query = `
      mutation AddOption($input: AddProductOptionInput!) {
        addProductOption(input: $input) {
          id
          name
          position
        }
      }
    `;
    const res = await this._graphql<{ addProductOption: ProductOption }>(query, {
      input,
    });
    return res.addProductOption;
  }

  /**
   * Update a product option
   * @param id - Option ID
   * @param input - Fields to update
   * @returns Updated option
   */
  async updateOption(
    id: UUID,
    input: UpdateProductOptionInput
  ): Promise<ProductOption> {
    const query = `
      mutation UpdateOption($id: UUID!, $input: UpdateProductOptionInput!) {
        updateProductOption(id: $id, input: $input) {
          id
          name
        }
      }
    `;
    const res = await this._graphql<{ updateProductOption: ProductOption }>(
      query,
      { id, input }
    );
    return res.updateProductOption;
  }

  /**
   * Delete a product option
   * @param id - Option ID
   * @returns true if deletion was successful
   */
  async deleteOption(id: UUID): Promise<boolean> {
    const query = `
      mutation DeleteOption($id: UUID!) {
        deleteProductOption(id: $id)
      }
    `;
    const res = await this._graphql<{ deleteProductOption: boolean }>(query, {
      id,
    });
    return res.deleteProductOption;
  }

  /**
   * Add a value to a product option (e.g., "Red", "Blue" for Color option)
   * @param input - Option value data (optionId, value, etc.)
   * @returns Created option value
   */
  async addOptionValue(
    input: AddProductOptionValueInput
  ): Promise<ProductOptionValue> {
    const query = `
      mutation AddOptionValue($input: AddProductOptionValueInput!) {
        addProductOptionValue(input: $input) {
          id
          value
          metadata
        }
      }
    `;
    const res = await this._graphql<{
      addProductOptionValue: ProductOptionValue;
    }>(query, { input });
    return res.addProductOptionValue;
  }

  /**
   * Delete a product option value
   * @param id - Option value ID
   * @returns true if deletion was successful
   */
  async deleteOptionValue(id: UUID): Promise<boolean> {
    const query = `
      mutation DeleteOptionValue($id: UUID!) {
        deleteProductOptionValue(id: $id)
      }
    `;
    const res = await this._graphql<{ deleteProductOptionValue: boolean }>(
      query,
      { id }
    );
    return res.deleteProductOptionValue;
  }

  /**
   * Add products to a collection
   * @param collectionId - Collection ID
   * @param productIds - Array of product IDs to add
   * @returns true if successful
   */
  async addToCollection(
    collectionId: UUID,
    productIds: UUID[]
  ): Promise<boolean> {
    const query = `
      mutation AddProductsToCollection($collectionId: UUID!, $productIds: [UUID!]!) {
        addProductsToCollection(collectionId: $collectionId, productIds: $productIds)
      }
    `;
    const res = await this._graphql<{ addProductsToCollection: boolean }>(query, {
      collectionId,
      productIds,
    });
    return res.addProductsToCollection;
  }

  /**
   * Remove products from a collection
   * @param collectionId - Collection ID
   * @param productIds - Array of product IDs to remove
   * @returns true if successful
   */
  async removeFromCollection(
    collectionId: UUID,
    productIds: UUID[]
  ): Promise<boolean> {
    const query = `
      mutation RemoveProductsFromCollection($collectionId: UUID!, $productIds: [UUID!]!) {
        removeProductsFromCollection(collectionId: $collectionId, productIds: $productIds)
      }
    `;
    const res = await this._graphql<{ removeProductsFromCollection: boolean }>(
      query,
      { collectionId, productIds }
    );
    return res.removeProductsFromCollection;
  }
}
