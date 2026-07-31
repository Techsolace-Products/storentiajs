import { BaseResource } from './base';
import {
  Metaobject,
  MetaobjectDefinition,
  MetaobjectDefinitionInput,
  MetaobjectInput,
  UUID,
} from '../types';

const DEFINITION_FIELDS = `
  fragment MetaobjectDefinitionFields on MetaobjectDefinition {
    id
    storeId
    type
    name
    fieldDefinitions {
      key
      name
      type
      required
    }
    createdAt
    updatedAt
  }
`;

const METAOBJECT_FIELDS = `
  fragment MetaobjectFields on Metaobject {
    id
    storeId
    definitionId
    handle
    fields {
      key
      value
    }
    createdAt
    updatedAt
  }
`;

/**
 * Metaobjects: standalone structured records (e.g. size charts, FAQ entries,
 * store locations) defined by a schema and addressed by handle.
 *
 * @example
 * ```js
 * await storentia.metaobjects.createDefinition({
 *   storeId,
 *   type: 'size_chart',
 *   name: 'Size Chart',
 *   fieldDefinitions: [
 *     { key: 'region', name: 'Region', type: MetafieldType.SINGLE_LINE_TEXT, required: true },
 *     { key: 'chart', name: 'Chart', type: MetafieldType.JSON },
 *   ],
 * });
 *
 * await storentia.metaobjects.create({
 *   storeId,
 *   definitionType: 'size_chart',
 *   handle: 'mens-tops-eu',
 *   fields: [{ key: 'region', value: 'EU' }],
 * });
 * ```
 */
export class MetaobjectResource extends BaseResource {
  /**
   * List all metaobject definitions.
   * @param storeId - Optional store scope
   */
  async listDefinitions(storeId?: UUID): Promise<MetaobjectDefinition[]> {
    const query = `
      ${DEFINITION_FIELDS}
      query MetaobjectDefinitions($storeId: UUID) {
        metaobjectDefinitions(storeId: $storeId) {
          ...MetaobjectDefinitionFields
        }
      }
    `;
    const res = await this._graphql<{
      metaobjectDefinitions: MetaobjectDefinition[];
    }>(query, { storeId });
    return res.metaobjectDefinitions;
  }

  /**
   * Fetch one definition by its type handle.
   * @param type - Definition type (e.g. 'size_chart')
   * @param storeId - Optional store scope
   */
  async getDefinition(
    type: string,
    storeId?: UUID
  ): Promise<MetaobjectDefinition | null> {
    const query = `
      ${DEFINITION_FIELDS}
      query MetaobjectDefinition($storeId: UUID, $type: String!) {
        metaobjectDefinition(storeId: $storeId, type: $type) {
          ...MetaobjectDefinitionFields
        }
      }
    `;
    const res = await this._graphql<{
      metaobjectDefinition: MetaobjectDefinition | null;
    }>(query, { storeId, type });
    return res.metaobjectDefinition;
  }

  /**
   * Create a metaobject definition.
   * @param input - Definition data (storeId, type, name, fieldDefinitions)
   */
  async createDefinition(
    input: MetaobjectDefinitionInput
  ): Promise<MetaobjectDefinition> {
    const mutation = `
      ${DEFINITION_FIELDS}
      mutation MetaobjectDefinitionCreate($input: MetaobjectDefinitionInput!) {
        metaobjectDefinitionCreate(input: $input) {
          ...MetaobjectDefinitionFields
        }
      }
    `;
    const res = await this._graphql<{
      metaobjectDefinitionCreate: MetaobjectDefinition;
    }>(mutation, { input });
    return res.metaobjectDefinitionCreate;
  }

  /**
   * Update a metaobject definition.
   * @param id - Definition ID
   * @param input - Replacement definition data
   * @param storeId - Optional store scope
   */
  async updateDefinition(
    id: UUID,
    input: MetaobjectDefinitionInput,
    storeId?: UUID
  ): Promise<MetaobjectDefinition> {
    const mutation = `
      ${DEFINITION_FIELDS}
      mutation MetaobjectDefinitionUpdate($storeId: UUID, $id: UUID!, $input: MetaobjectDefinitionInput!) {
        metaobjectDefinitionUpdate(storeId: $storeId, id: $id, input: $input) {
          ...MetaobjectDefinitionFields
        }
      }
    `;
    const res = await this._graphql<{
      metaobjectDefinitionUpdate: MetaobjectDefinition;
    }>(mutation, { storeId, id, input });
    return res.metaobjectDefinitionUpdate;
  }

  /**
   * Delete a metaobject definition.
   * @param id - Definition ID
   * @param storeId - Optional store scope
   */
  async deleteDefinition(id: UUID, storeId?: UUID): Promise<boolean> {
    const mutation = `
      mutation MetaobjectDefinitionDelete($storeId: UUID, $id: UUID!) {
        metaobjectDefinitionDelete(storeId: $storeId, id: $id)
      }
    `;
    const res = await this._graphql<{ metaobjectDefinitionDelete: boolean }>(
      mutation,
      { storeId, id }
    );
    return res.metaobjectDefinitionDelete;
  }

  /**
   * List metaobjects of a given definition type.
   * @param definitionType - Definition type handle
   * @param storeId - Optional store scope
   */
  async list(definitionType: string, storeId?: UUID): Promise<Metaobject[]> {
    const query = `
      ${METAOBJECT_FIELDS}
      query Metaobjects($storeId: UUID, $definitionType: String!) {
        metaobjects(storeId: $storeId, definitionType: $definitionType) {
          ...MetaobjectFields
        }
      }
    `;
    const res = await this._graphql<{ metaobjects: Metaobject[] }>(query, {
      storeId,
      definitionType,
    });
    return res.metaobjects;
  }

  /**
   * Fetch a single metaobject by ID.
   * @param id - Metaobject ID
   * @param storeId - Optional store scope
   */
  async get(id: UUID, storeId?: UUID): Promise<Metaobject | null> {
    const query = `
      ${METAOBJECT_FIELDS}
      query GetMetaobject($storeId: UUID, $id: UUID!) {
        metaobject(storeId: $storeId, id: $id) {
          ...MetaobjectFields
        }
      }
    `;
    const res = await this._graphql<{ metaobject: Metaobject | null }>(query, {
      storeId,
      id,
    });
    return res.metaobject;
  }

  /**
   * Create a metaobject record.
   * @param input - Record data (storeId, definitionType, handle, fields)
   */
  async create(input: MetaobjectInput): Promise<Metaobject> {
    const mutation = `
      ${METAOBJECT_FIELDS}
      mutation MetaobjectCreate($input: MetaobjectInput!) {
        metaobjectCreate(input: $input) {
          ...MetaobjectFields
        }
      }
    `;
    const res = await this._graphql<{ metaobjectCreate: Metaobject }>(mutation, {
      input,
    });
    return res.metaobjectCreate;
  }

  /**
   * Update a metaobject record.
   * @param id - Metaobject ID
   * @param input - Replacement record data
   * @param storeId - Optional store scope
   */
  async update(
    id: UUID,
    input: MetaobjectInput,
    storeId?: UUID
  ): Promise<Metaobject> {
    const mutation = `
      ${METAOBJECT_FIELDS}
      mutation MetaobjectUpdate($storeId: UUID, $id: UUID!, $input: MetaobjectInput!) {
        metaobjectUpdate(storeId: $storeId, id: $id, input: $input) {
          ...MetaobjectFields
        }
      }
    `;
    const res = await this._graphql<{ metaobjectUpdate: Metaobject }>(mutation, {
      storeId,
      id,
      input,
    });
    return res.metaobjectUpdate;
  }

  /**
   * Delete a metaobject record.
   * @param id - Metaobject ID
   * @param storeId - Optional store scope
   */
  async delete(id: UUID, storeId?: UUID): Promise<boolean> {
    const mutation = `
      mutation MetaobjectDelete($storeId: UUID, $id: UUID!) {
        metaobjectDelete(storeId: $storeId, id: $id)
      }
    `;
    const res = await this._graphql<{ metaobjectDelete: boolean }>(mutation, {
      storeId,
      id,
    });
    return res.metaobjectDelete;
  }
}
