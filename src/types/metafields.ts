import { UUID } from './common';

export enum MetafieldOwnerType {
  PRODUCT = 'PRODUCT',
  PRODUCT_VARIANT = 'PRODUCT_VARIANT',
  COLLECTION = 'COLLECTION',
  CUSTOMER = 'CUSTOMER',
  ORDER = 'ORDER',
  STORE = 'STORE',
}

export enum MetafieldType {
  SINGLE_LINE_TEXT = 'SINGLE_LINE_TEXT',
  MULTI_LINE_TEXT = 'MULTI_LINE_TEXT',
  NUMBER_INTEGER = 'NUMBER_INTEGER',
  NUMBER_DECIMAL = 'NUMBER_DECIMAL',
  BOOLEAN = 'BOOLEAN',
  JSON = 'JSON',
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  URL = 'URL',
  COLOR = 'COLOR',
  RATING = 'RATING',
  MONEY = 'MONEY',
}

export interface MetafieldDefinition {
  id: UUID;
  storeId: UUID;
  ownerType: MetafieldOwnerType;
  namespace: string;
  key: string;
  name: string;
  description?: string | null;
  type: MetafieldType;
  validations?: unknown;
  createdAt: string;
  updatedAt: string;
}

export interface Metafield {
  id: UUID;
  storeId: UUID;
  ownerType: MetafieldOwnerType;
  ownerId: UUID;
  namespace: string;
  key: string;
  /** Always a string on the wire — decode per `type` (see `parseMetafieldValue`). */
  value: string;
  type: MetafieldType;
  createdAt: string;
  updatedAt: string;
}

export interface MetafieldDefinitionInput {
  storeId: UUID;
  ownerType: MetafieldOwnerType;
  namespace: string;
  key: string;
  name: string;
  description?: string;
  type: MetafieldType;
  validations?: unknown;
}

export interface MetafieldInput {
  ownerType: MetafieldOwnerType;
  ownerId: UUID;
  namespace: string;
  key: string;
  value: string;
  type: MetafieldType;
}
