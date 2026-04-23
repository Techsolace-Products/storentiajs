import { UUID } from './common';
import { Product } from './products';

export interface Collection {
  id: UUID;
  name: string;
  description?: string;
  parentId?: UUID;
  createdAt: string;
  updatedAt: string;
  products?: Partial<Product>[];
  subCollections?: Partial<Collection>[];
}

export interface CreateCollectionInput {
  name: string;
  description?: string;
  parentId?: UUID;
}

export interface UpdateCollectionInput {
  name?: string;
  description?: string;
  parentId?: UUID;
}
