import { ApiClient } from './core/api-client';
import { AuthResource } from './resources/auth';
import { ProductResource } from './resources/products';
import { BlogResource } from './resources/blogs';
import { PageResource } from './resources/pages';
import { CollectionResource } from './resources/collections';
import { MediaResource } from './resources/media';
import { ContactResource } from './resources/contacts';
import { NewsletterResource } from './resources/newsletter';
import { LinkSetResource } from './resources/linkset';
import { ClientConfig } from './types';

/**
 * Main Storentia SDK client. Entry point for all API operations.
 *
 * @example
 * ```js
 * const storentia = new Storentia({
 *   clientId: 'your-client-id',
 *   clientSecret: 'your-client-secret'
 * });
 *
 * const product = await storentia.products.get('product-id');
 * ```
 */
export class Storentia {
  private client: ApiClient;

  /** Access authentication operations */
  public auth: AuthResource;
  /** Access product operations (CRUD, variants, options) */
  public products: ProductResource;
  /** Access blog post operations (CRUD) */
  public blogs: BlogResource;
  /** Access page operations (CRUD) */
  public pages: PageResource;
  /** Access collection operations (CRUD, product mapping) */
  public collections: CollectionResource;
  /** Access media library operations (Upload, folders, rename, move) */
  public media: MediaResource;
  /** Access contact management operations (CRUD) */
  public contacts: ContactResource;
  /** Access newsletter subscription operations */
  public newsletter: NewsletterResource;
  /** Access link set and navigation operations (CRUD) */
  public linksets: LinkSetResource;

  /**
   * Initialize the Storentia SDK with authentication credentials
   * @param config - Configuration with clientId, clientSecret, and optional timeout
   */
  constructor(config: ClientConfig) {
    this.client = new ApiClient(config);

    this.auth = new AuthResource(this.client);
    this.products = new ProductResource(this.client);
    this.blogs = new BlogResource(this.client);
    this.pages = new PageResource(this.client);
    this.collections = new CollectionResource(this.client);
    this.media = new MediaResource(this.client);
    this.contacts = new ContactResource(this.client);
    this.newsletter = new NewsletterResource(this.client);
    this.linksets = new LinkSetResource(this.client);
  }

  /**
   * Set a manual access token (e.g., from an environment variable or external auth flow)
   * @param token - Bearer token for API authentication
   */
  setAccessToken(token: string): void {
    this.client.setAccessToken(token);
  }

  /**
   * Get the current access token if set
   * @returns Current token or null if not authenticated
   */
  getAccessToken(): string | null {
    return this.client.getAccessToken();
  }
}
