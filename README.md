# Storentia Node.js SDK

Official Node.js SDK for the Storentia API.

## Features

- **Type-safe**: Written in TypeScript with full type definitions.
- **Modern**: Uses `fetch` and supports ES Modules and CommonJS.
- **Configurable**: Easily customize base URL, timeouts, and headers.
- **Robust Error Handling**: Dedicated `ApiError` class for handling API failures.

## Installation

```bash
npm install @storentia/sdk
```

## Getting Started

To begin using the Storentia SDK, you'll need an API key from your Storentia dashboard.

### Initializing the Client

```typescript
import { StorentiaClient } from '@storentia/sdk';

const client = new StorentiaClient({
  apiKey: 'YOUR_API_KEY',
  baseUrl: 'https://apis.storentia.com', // Optional: defaults to Storentia production API
  timeout: 30000, // Optional: defaults to 30s
});
```

### Extending the Client

The `StorentiaClient` provides a robust base for interacting with the Storentia API. You can extend it to create specific resource clients for your application:

```typescript
import { StorentiaClient, RequestOptions } from '@storentia/sdk';

export class MyStorentiaClient extends StorentiaClient {
  public async getProducts(options?: RequestOptions) {
    return this.get('/v1/products', options);
  }

  public async createOrder(orderData: any, options?: RequestOptions) {
    return this.post('/v1/orders', orderData, options);
  }
}
```

## Configuration

The `StorentiaClient` constructor accepts a `ClientConfig` object:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | **Required** | Your Storentia API key. |
| `baseUrl` | `string` | `https://apis.storentia.com` | The base URL for the API. |
| `timeout` | `number` | `30000` | Request timeout in milliseconds. |

## Error Handling

The SDK throws an `ApiError` when the API returns a non-2xx response. You can handle these errors as follows:

```typescript
import { StorentiaClient, ApiError } from '@storentia/sdk';

try {
  const products = await client.getProducts();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error (${error.statusCode}): ${error.message}`);
  } else {
    console.error('An unexpected error occurred:', error);
  }
}
```

## Development

### Building the Project

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
