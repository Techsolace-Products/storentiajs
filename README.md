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
  sellingPrice: 29.99,
  originalPrice: 39.99,
  sku: 'TSHIRT-001'
});

// Update product
await storentia.products.update('product-id', {
  sellingPrice: 34.99,
  originalPrice: 44.99
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

### Customers

Auth is email-code only, not password based.

```typescript
// 1. Email the customer a one-time code
await storentia.auth.sendAuthenticationEmail('shopper@example.com', publicStoreToken);

// 2. Exchange the code for a customer JWT — this attaches the JWT to the
// SDK instance, so every call below just works
const { id, email, name, token } = await storentia.auth.verifyAuthenticationEmail(
  'shopper@example.com',
  '123456',
  publicStoreToken
);

// Current customer's profile
const me = await storentia.auth.getMe();

// Update profile fields
await storentia.auth.updateMe({ name: 'Jane Doe' });

// Addresses
const addresses = await storentia.auth.getAddresses();
const address = await storentia.auth.addAddress({
  line1: '221B Baker Street',
  city: 'London',
  postalCode: 'NW1 6XE',
  country: 'GB',
  isDefault: true,
});
await storentia.auth.updateAddress(address.id, { city: 'Manchester' });
await storentia.auth.setDefaultAddress(address.id);
await storentia.auth.deleteAddress(address.id);

// Sign out (forgets the local JWT; logoutGraphQL() also invalidates it server-side)
storentia.auth.logout();
```

### Cart

Requires customer JWT authentication.

```typescript
// Get cart
const cart = await storentia.carts.get();

// Add item to cart
const item = await storentia.carts.addItem({
  productId: 'product-id',
  quantity: 1
});

// Update cart item quantity
await storentia.carts.updateItem({
  cartItemId: 'cart-item-id',
  quantity: 5
});

// Remove item from cart
await storentia.carts.removeItem('cart-item-id');

// Clear entire cart
await storentia.carts.clear();
```

### Orders & Checkout

Requires customer JWT authentication. `createOrder` places the order and opens
a gateway checkout in one call — nothing it returns is a secret, the
merchant's gateway key never leaves the platform. `checkout.provider` tells
you which gateway to open (Razorpay, Cashfree, etc.): a store only ever
returns the one it actually has configured, so branch on it rather than
assuming a specific provider.

```typescript
// Check the store can take payments before rendering a checkout button
const { available, reason } = await storentia.orders.paymentCapability(storeId);

// Create the order — returns both the order and what the browser needs
// to open the gateway widget
const { order, checkout } = await storentia.orders.createOrder({
  currency: 'INR',
  totalAmount: 199.99,
  items: [{ productId: 'product-id', quantity: 2, price: 99.99 }],
});
// checkout: { provider, appId, gatewayOrderId, publicKey, amountMinor, currency, mode }

// In the browser: open the widget for checkout.provider. Razorpay's
// Checkout.js hands back a signature you confirm immediately:
if (checkout.provider === 'Razorpay') {
  const { order: settled } = await storentia.orders.confirmPayment({
    orderId: order.id,
    gatewayOrderId: response.razorpay_order_id,
    gatewayPaymentId: response.razorpay_payment_id,
    signature: response.razorpay_signature,
  });
}
// Gateways with no client-side signature (Cashfree) skip confirmPayment
// entirely — poll getOrder(orderId) instead and let the backend's own
// reconciler settle it by asking the gateway directly.

// Get / list orders
const order = await storentia.orders.getOrder('order-id');
const orders = await storentia.orders.getOrders({ page: 1, limit: 20 });
const customerOrders = await storentia.orders.getCustomerOrders('customer-id');

// Cancel
await storentia.orders.cancelOrder('order-id');
```

See [`examples/checkout-flow.ts`](./examples/checkout-flow.ts) for the full
server-side flow and [`examples/checkout-widget.html`](./examples/checkout-widget.html)
for the browser half, which branches on `checkout.provider` to open the
right gateway's widget.

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

### Metafields

Custom typed key/value data on products, variants, collections, customers, orders, or the store.

```typescript
import { MetafieldOwnerType, MetafieldType } from '@storentia/sdk';

// Define the field once
await storentia.metafields.createDefinition({
  storeId,
  ownerType: MetafieldOwnerType.PRODUCT,
  namespace: 'custom',
  key: 'care_instructions',
  name: 'Care Instructions',
  type: MetafieldType.MULTI_LINE_TEXT,
});

// Set values (upsert by ownerType + ownerId + namespace + key)
await storentia.metafields.set([{
  ownerType: MetafieldOwnerType.PRODUCT,
  ownerId: productId,
  namespace: 'custom',
  key: 'care_instructions',
  value: 'Machine wash cold',
  type: MetafieldType.MULTI_LINE_TEXT,
}]);

// Read / list / delete
const fields = await storentia.metafields.list(MetafieldOwnerType.PRODUCT, productId);
const defs = await storentia.metafields.listDefinitions(MetafieldOwnerType.PRODUCT);
await storentia.metafields.delete(metafieldId);
await storentia.metafields.deleteDefinition(definitionId);
```

`value` is always a string on the wire — decode it according to `type`.

### Metaobjects

Standalone structured records (size charts, FAQ entries, store locations) addressed by handle.

```typescript
await storentia.metaobjects.createDefinition({
  storeId,
  type: 'size_chart',
  name: 'Size Chart',
  fieldDefinitions: [
    { key: 'region', name: 'Region', type: MetafieldType.SINGLE_LINE_TEXT, required: true },
    { key: 'chart', name: 'Chart', type: MetafieldType.JSON },
  ],
});

await storentia.metaobjects.create({
  storeId,
  definitionType: 'size_chart',
  handle: 'mens-tops-eu',
  fields: [{ key: 'region', value: 'EU' }],
});

const charts = await storentia.metaobjects.list('size_chart');
const one = await storentia.metaobjects.get(metaobjectId);
await storentia.metaobjects.update(metaobjectId, { ...input });
await storentia.metaobjects.delete(metaobjectId);
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
