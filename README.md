# Storentia Node.js SDK

Official SDK for Storentia API. Type-safe, GraphQL-powered, fully documented.

## Install

```bash
npm install @storentia/sdk
```

## Setup

```typescript
import { Storentia } from '@storentia/sdk';

const storentia = new Storentia({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
});
```

Credentials from Storentia dashboard. Auto-authenticates on first request.

## Usage

### Products

```typescript
// Get single product
const product = await storentia.products.get('product-id');

// List products
const { data, pageInfo } = await storentia.products.list({
  status: 'ACTIVE',
  pagination: { page: 1, limit: 20 }
});

// Create product
const newProduct = await storentia.products.create({
  title: 'T-Shirt',
  price: 29.99,
  sku: 'TSHIRT-001'
});

// Update product
await storentia.products.update('product-id', {
  price: 34.99
});

// Delete product
await storentia.products.delete('product-id');
```

#### Variants

```typescript
// Generate variants from options
const variants = await storentia.products.generateVariants('product-id');

// Create variant
const variant = await storentia.products.createVariant({
  productId: 'product-id',
  title: 'Red / Large',
  sku: 'TSHIRT-001-RED-L'
});

// Update variant
await storentia.products.updateVariant('variant-id', { stock: 50 });

// Delete variant
await storentia.products.deleteVariant('variant-id');
```

#### Options & Values

```typescript
// Add option (e.g., "Color")
const option = await storentia.products.addOption({
  productId: 'product-id',
  name: 'Color'
});

// Add option value (e.g., "Red")
const value = await storentia.products.addOptionValue({
  optionId: 'option-id',
  value: 'Red'
});

// Update/delete
await storentia.products.updateOption('option-id', { name: 'Colour' });
await storentia.products.deleteOptionValue('value-id');
```

#### Collections

```typescript
// Add products to collection
await storentia.products.addToCollection('collection-id', ['product-1', 'product-2']);

// Remove from collection
await storentia.products.removeFromCollection('collection-id', ['product-1']);
```

#### Inventory

```typescript
// List inventory across all products/variants
const { data, pageInfo } = await storentia.products.listInventory({
  pagination: { page: 1, limit: 50 }
});
```

### Blog Posts

```typescript
// Get/list/create/update/delete
const post = await storentia.blogs.get('post-id');
const { data, pageInfo } = await storentia.blogs.list({ pagination: { limit: 10 } });
const newPost = await storentia.blogs.create({ title: 'Hello', content: '...' });
await storentia.blogs.update('post-id', { title: 'Updated' });
await storentia.blogs.delete('post-id');
```

### Pages

```typescript
// Get/list/create/update/delete
const page = await storentia.pages.get('page-id');
const { data, pageInfo } = await storentia.pages.list();
const newPage = await storentia.pages.create({ pageTitle: 'About', content: '...' });
await storentia.pages.update('page-id', { pageTitle: 'Updated' });
await storentia.pages.delete('page-id');
```

## Error Handling

```typescript
import { ApiError } from '@storentia/sdk';

try {
  const product = await storentia.products.get('invalid-id');
} catch (err) {
  if (err instanceof ApiError) {
    console.error(`${err.statusCode}: ${err.message}`);
  }
}
```

## Authentication

SDK uses OAuth2 client credentials. Get credentials from dashboard. Auto-refreshes tokens before expiry.

Override token:
```typescript
storentia.setAccessToken('pre-obtained-token');
```

## Config

```typescript
const storentia = new Storentia({
  clientId: string,      // Required
  clientSecret: string,  // Required
  timeout: 30000         // Optional, milliseconds
});
```

## IDE Help

Hover on any method/type for docs. Full JSDoc coverage.

## Build & Test

```bash
npm run build
npm test
```

## License

MIT
