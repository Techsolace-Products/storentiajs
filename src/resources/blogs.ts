import { BaseResource } from './base';
import {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  UUID,
  PaginationInput,
  PageInfo,
} from '../types';

/**
 * Blog resource for managing blog posts
 *
 * @example
 * ```js
 * const post = await storentia.blogs.get('post-id');
 * const { data } = await storentia.blogs.list();
 * const newPost = await storentia.blogs.create({ title: 'Hello World', content: '...' });
 * ```
 */
export class BlogResource extends BaseResource {
  /**
   * Fetch a single blog post by ID
   * @param id - Blog post ID
   * @returns Blog post with full details
   */
  async get(id: UUID): Promise<BlogPost> {
    const query = `
      query GetBlogPost($id: UUID!) {
        blogPost(id: $id) {
          id
          title
          imageId
          content
          createdAt
          updatedAt
        }
      }
    `;
    const res = await this._graphql<{ blogPost: BlogPost }>(query, { id });
    return res.blogPost;
  }

  /**
   * List blog posts with pagination
   * @param params - Pagination options
   * @returns Array of blog posts and pagination info
   */
  async list(params: {
    pagination?: PaginationInput;
  } = {}): Promise<{ data: BlogPost[]; pageInfo: PageInfo }> {
    const query = `
      query ListBlogPosts($pagination: PaginationInput) {
        listBlogPosts(pagination: $pagination) {
          data {
            id
            title
            imageId
            createdAt
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
      listBlogPosts: { data: BlogPost[]; pageInfo: PageInfo };
    }>(query, params);
    return res.listBlogPosts;
  }

  /**
   * Create a new blog post
   * @param input - Blog post data (title, content, imageId, etc.)
   * @returns Created blog post
   */
  async create(input: CreateBlogPostInput): Promise<BlogPost> {
    const query = `
      mutation CreateBlogPost($input: CreateBlogPostInput!) {
        createBlogPost(input: $input) {
          id
          title
        }
      }
    `;
    const res = await this._graphql<{ createBlogPost: BlogPost }>(query, {
      input,
    });
    return res.createBlogPost;
  }

  /**
   * Update a blog post
   * @param id - Blog post ID
   * @param input - Fields to update
   * @returns Updated blog post
   */
  async update(id: UUID, input: UpdateBlogPostInput): Promise<BlogPost> {
    const query = `
      mutation UpdateBlogPost($id: UUID!, $input: UpdateBlogPostInput!) {
        updateBlogPost(id: $id, input: $input) {
          id
          title
        }
      }
    `;
    const res = await this._graphql<{ updateBlogPost: BlogPost }>(query, {
      id,
      input,
    });
    return res.updateBlogPost;
  }

  /**
   * Delete a blog post
   * @param id - Blog post ID
   * @returns true if deletion was successful
   */
  async delete(id: UUID): Promise<boolean> {
    const query = `
      mutation DeleteBlogPost($id: UUID!) {
        deleteBlogPost(id: $id)
      }
    `;
    const res = await this._graphql<{ deleteBlogPost: boolean }>(query, { id });
    return res.deleteBlogPost;
  }
}
