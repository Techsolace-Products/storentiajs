import { BaseResource } from './base';
import {
  Page,
  CreatePageInput,
  UpdatePageInput,
  UUID,
  PaginationInput,
  PageInfo,
} from '../types';

/**
 * Page resource for managing static pages
 *
 * @example
 * ```js
 * const page = await storentia.pages.get('page-id');
 * const { data } = await storentia.pages.list();
 * const newPage = await storentia.pages.create({ pageTitle: 'About Us', content: '...' });
 * ```
 */
export class PageResource extends BaseResource {
  /**
   * Fetch a single page by ID
   * @param id - Page ID
   * @returns Page with full details
   */
  async get(id: UUID): Promise<Page> {
    const query = `
      query GetPage($id: UUID!) {
        page(id: $id) {
          id
          pageTitle
          content
          createdAt
          updatedAt
        }
      }
    `;
    const res = await this._graphql<{ page: Page }>(query, { id });
    return res.page;
  }

  /**
   * List pages with pagination
   * @param params - Pagination options
   * @returns Array of pages and pagination info
   */
  async list(params: {
    pagination?: PaginationInput;
  } = {}): Promise<{ data: Page[]; pageInfo: PageInfo }> {
    const query = `
      query ListPages($pagination: PaginationInput) {
        listPages(pagination: $pagination) {
          data {
            id
            pageTitle
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
      listPages: { data: Page[]; pageInfo: PageInfo };
    }>(query, params);
    return res.listPages;
  }

  /**
   * Create a new page
   * @param input - Page data (pageTitle, content, etc.)
   * @returns Created page
   */
  async create(input: CreatePageInput): Promise<Page> {
    const query = `
      mutation CreatePage($input: CreatePageInput!) {
        createPage(input: $input) {
          id
          pageTitle
        }
      }
    `;
    const res = await this._graphql<{ createPage: Page }>(query, {
      input,
    });
    return res.createPage;
  }

  /**
   * Update a page
   * @param id - Page ID
   * @param input - Fields to update
   * @returns Updated page
   */
  async update(id: UUID, input: UpdatePageInput): Promise<Page> {
    const query = `
      mutation UpdatePage($id: UUID!, $input: UpdatePageInput!) {
        updatePage(id: $id, input: $input) {
          id
          pageTitle
        }
      }
    `;
    const res = await this._graphql<{ updatePage: Page }>(query, {
      id,
      input,
    });
    return res.updatePage;
  }

  /**
   * Delete a page
   * @param id - Page ID
   * @returns true if deletion was successful
   */
  async delete(id: UUID): Promise<boolean> {
    const query = `
      mutation DeletePage($id: UUID!) {
        deletePage(id: $id)
      }
    `;
    const res = await this._graphql<{ deletePage: boolean }>(query, { id });
    return res.deletePage;
  }
}
