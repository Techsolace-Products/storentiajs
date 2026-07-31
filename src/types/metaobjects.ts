import { UUID } from './common';
import { MetafieldType } from './metafields';

export interface MetaobjectFieldDefinition {
  key: string;
  name: string;
  type: MetafieldType;
  required: boolean;
}

export interface MetaobjectDefinition {
  id: UUID;
  storeId: UUID;
  type: string;
  name: string;
  fieldDefinitions: MetaobjectFieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface MetaobjectField {
  key: string;
  value: string;
}

export interface Metaobject {
  id: UUID;
  storeId: UUID;
  definitionId: UUID;
  handle: string;
  fields: MetaobjectField[];
  createdAt: string;
  updatedAt: string;
}

export interface MetaobjectFieldDefinitionInput {
  key: string;
  name: string;
  type: MetafieldType;
  required?: boolean;
}

export interface MetaobjectDefinitionInput {
  storeId: UUID;
  type: string;
  name: string;
  fieldDefinitions: MetaobjectFieldDefinitionInput[];
}

export interface MetaobjectFieldInput {
  key: string;
  value: string;
}

export interface MetaobjectInput {
  storeId: UUID;
  definitionType: string;
  handle: string;
  fields: MetaobjectFieldInput[];
}
