import { BaseResource } from './base';
import {
  Metafield,
  MetafieldDefinition,
  MetafieldDefinitionInput,
  MetafieldInput,
  MetafieldOwnerType,
  UUID,
} from '../types';

const DEFINITION_FIELDS = `
  fragment MetafieldDefinitionFields on MetafieldDefinition {
    id
    storeId
    ownerType
    namespace
    key
    name
    description
    type
    validations
    createdAt
    updatedAt
  }
`;

const METAFIELD_FIELDS = `
  fragment MetafieldFields on Metafield {
    id
    storeId
    ownerType
    ownerId
    namespace
    key
    value
    type
    createdAt
    updatedAt
  }
`;

/**
 * Metafields: custom typed key/value data attached to products, variants,
 * collections, customers, orders, or the store itself.
 *
 * @example
 * ```js
 * // Define a "care instructions" field on products
 * await storentia.metafields.createDefinition({
 *   storeId,
 *   ownerType: MetafieldOwnerType.PRODUCT,
 *   namespace: 'custom',
 *   key: 'care_instructions',
 *   name: 'Care Instructions',
 *   type: MetafieldType.MULTI_LINE_TEXT,
 * });
 *
 * // Set it on a product (upsert by ownerType+ownerId+namespace+key)
 * await storentia.metafields.set([{
 *   ownerType: MetafieldOwnerType.PRODUCT,
 *   ownerId: productId,
 *   namespace: 'custom',
 *   key: 'care_instructions',
 *   value: 'Machine wash cold',
 *   type: MetafieldType.MULTI_LINE_TEXT,
 * }]);
 *
 * // Read them back
 * const fields = await storentia.metafields.list(MetafieldOwnerType.PRODUCT, productId);
 * ```
 */
export class MetafieldResource extends BaseResource {
  /**
   * List metafield definitions for an owner type.
   * @param ownerType - Resource kind the definitions apply to
   * @param storeId - Optional store scope (defaults to the token's store)
   */
  async listDefinitions(
    ownerType: MetafieldOwnerType,
    storeId?: UUID
  ): Promise<MetafieldDefinition[]> {
    const query = `
      ${DEFINITION_FIELDS}
      query MetafieldDefinitions($storeId: UUID, $ownerType: MetafieldOwnerType!) {
        metafieldDefinitions(storeId: $storeId, ownerType: $ownerType) {
          ...MetafieldDefinitionFields
        }
      }
    `;
    const res = await this._graphql<{ metafieldDefinitions: MetafieldDefinition[] }>(
      query,
      { storeId, ownerType }
    );
    return res.metafieldDefinitions;
  }

  /**
   * Create a metafield definition (the schema for a custom field).
   * @param input - Definition data (storeId, ownerType, namespace, key, name, type)
   */
  async createDefinition(
    input: MetafieldDefinitionInput
  ): Promise<MetafieldDefinition> {
    const mutation = `
      ${DEFINITION_FIELDS}
      mutation MetafieldDefinitionCreate($input: MetafieldDefinitionInput!) {
        metafieldDefinitionCreate(input: $input) {
          ...MetafieldDefinitionFields
        }
      }
    `;
    const res = await this._graphql<{
      metafieldDefinitionCreate: MetafieldDefinition;
    }>(mutation, { input });
    return res.metafieldDefinitionCreate;
  }

  /**
   * Delete a metafield definition.
   * @param id - Definition ID
   * @param storeId - Optional store scope
   */
  async deleteDefinition(id: UUID, storeId?: UUID): Promise<boolean> {
    const mutation = `
      mutation MetafieldDefinitionDelete($storeId: UUID, $id: UUID!) {
        metafieldDefinitionDelete(storeId: $storeId, id: $id)
      }
    `;
    const res = await this._graphql<{ metafieldDefinitionDelete: boolean }>(
      mutation,
      { storeId, id }
    );
    return res.metafieldDefinitionDelete;
  }

  /**
   * List metafield values on a single owner record.
   * @param ownerType - Resource kind
   * @param ownerId - ID of the owning record
   * @param storeId - Optional store scope
   */
  async list(
    ownerType: MetafieldOwnerType,
    ownerId: UUID,
    storeId?: UUID
  ): Promise<Metafield[]> {
    const query = `
      ${METAFIELD_FIELDS}
      query Metafields($storeId: UUID, $ownerType: MetafieldOwnerType!, $ownerId: UUID!) {
        metafields(storeId: $storeId, ownerType: $ownerType, ownerId: $ownerId) {
          ...MetafieldFields
        }
      }
    `;
    const res = await this._graphql<{ metafields: Metafield[] }>(query, {
      storeId,
      ownerType,
      ownerId,
    });
    return res.metafields;
  }

  /**
   * Upsert metafield values. Matches on (ownerType, ownerId, namespace, key) —
   * existing values are overwritten, new ones created.
   * @param metafields - Values to set
   * @param storeId - Optional store scope
   */
  async set(metafields: MetafieldInput[], storeId?: UUID): Promise<Metafield[]> {
    const mutation = `
      ${METAFIELD_FIELDS}
      mutation MetafieldsSet($storeId: UUID, $metafields: [MetafieldInput!]!) {
        metafieldsSet(storeId: $storeId, metafields: $metafields) {
          ...MetafieldFields
        }
      }
    `;
    const res = await this._graphql<{ metafieldsSet: Metafield[] }>(mutation, {
      storeId,
      metafields,
    });
    return res.metafieldsSet;
  }

  /**
   * Delete a single metafield value.
   * @param id - Metafield ID
   * @param storeId - Optional store scope
   */
  async delete(id: UUID, storeId?: UUID): Promise<boolean> {
    const mutation = `
      mutation MetafieldDelete($storeId: UUID, $id: UUID!) {
        metafieldDelete(storeId: $storeId, id: $id)
      }
    `;
    const res = await this._graphql<{ metafieldDelete: boolean }>(mutation, {
      storeId,
      id,
    });
    return res.metafieldDelete;
  }
}
