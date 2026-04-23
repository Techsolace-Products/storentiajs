import { BaseResource } from './base';
import {
  Collection,
  CreateCollectionInput,
  UpdateCollectionInput,
  UUID,
} from '../types';

export class CollectionResource extends BaseResource {
  async get(id: UUID): Promise<Collection> {
    const query = `
      query GetCollection($id: UUID!) {
        collection(id: $id) {
          id
          name
          description
          parentId
          createdAt
          updatedAt
          products {
            id
            title
            price
          }
          subCollections {
            id
            name
          }
        }
      }
    `;
    const res = await this._graphql<{ collection: Collection }>(query, { id });
    return res.collection;
  }

  async list(params: { parentId?: UUID } = {}): Promise<Collection[]> {
    const query = `
      query ListCollections($parentId: UUID) {
        collections(parentId: $parentId) {
          id
          name
          description
          parentId
          subCollections {
            id
            name
          }
        }
      }
    `;
    const res = await this._graphql<{ collections: Collection[] }>(query, params);
    return res.collections;
  }

  async create(input: CreateCollectionInput): Promise<Collection> {
    const query = `
      mutation CreateCollection($input: CreateCollectionInput!) {
        createCollection(input: $input) {
          id
          name
        }
      }
    `;
    const res = await this._graphql<{ createCollection: Collection }>(query, {
      input,
    });
    return res.createCollection;
  }

  async update(id: UUID, input: UpdateCollectionInput): Promise<Collection> {
    const query = `
      mutation UpdateCollection($id: UUID!, $input: UpdateCollectionInput!) {
        updateCollection(id: $id, input: $input) {
          id
          name
          description
        }
      }
    `;
    const res = await this._graphql<{ updateCollection: Collection }>(query, {
      id,
      input,
    });
    return res.updateCollection;
  }

  async delete(id: UUID): Promise<boolean> {
    const query = `
      mutation DeleteCollection($id: UUID!) {
        deleteCollection(id: $id)
      }
    `;
    const res = await this._graphql<{ deleteCollection: boolean }>(query, { id });
    return res.deleteCollection;
  }

  async addProducts(collectionId: UUID, productIds: UUID[]): Promise<boolean> {
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

  async removeProducts(collectionId: UUID, productIds: UUID[]): Promise<boolean> {
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
