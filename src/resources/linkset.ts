import { BaseResource } from './base';
import { LinkSet, Link, CreateLinkSetInput, UpdateLinkSetInput, CreateLinkInput, UpdateLinkInput } from '../types';

export class LinkSetResource extends BaseResource {
  async createLinkSet(input: CreateLinkSetInput): Promise<LinkSet> {
    const mutation = `
      mutation CreateLinkSet($storeId: UUID!, $name: String!, $description: String!) {
        createLinkSet(input: { storeId: $storeId, name: $name, description: $description }) {
          id
          storeId
          name
          description
          position
          createdAt
        }
      }
    `;
    return this._graphql<{ createLinkSet: LinkSet }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.createLinkSet);
  }

  async updateLinkSet(id: string, input: UpdateLinkSetInput): Promise<LinkSet> {
    const mutation = `
      mutation UpdateLinkSet($id: UUID!, $name: String, $description: String, $position: Int) {
        updateLinkSet(id: $id, input: { name: $name, description: $description, position: $position }) {
          id
          name
          description
          position
        }
      }
    `;
    return this._graphql<{ updateLinkSet: LinkSet }>(mutation, { id, ...input }).then(
      (res) => res.updateLinkSet
    );
  }

  async deleteLinkSet(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteLinkSet($id: UUID!) {
        deleteLinkSet(id: $id)
      }
    `;
    return this._graphql<{ deleteLinkSet: boolean }>(mutation, { id }).then(
      (res) => res.deleteLinkSet
    );
  }

  async createLink(input: CreateLinkInput): Promise<Link> {
    const mutation = `
      mutation CreateLink($linkSetId: UUID!, $name: String!, $url: String!, $position: Int!, $parentLinkId: UUID, $pageId: UUID) {
        createLink(input: { linkSetId: $linkSetId, name: $name, url: $url, position: $position, parentLinkId: $parentLinkId, pageId: $pageId }) {
          id
          linkSetId
          name
          url
          position
          parentLinkId
          createdAt
        }
      }
    `;
    return this._graphql<{ createLink: Link }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.createLink);
  }

  async updateLink(id: string, input: UpdateLinkInput): Promise<Link> {
    const mutation = `
      mutation UpdateLink($id: UUID!, $name: String, $url: String, $position: Int) {
        updateLink(id: $id, input: { name: $name, url: $url, position: $position }) {
          id
          name
          url
          position
        }
      }
    `;
    return this._graphql<{ updateLink: Link }>(mutation, { id, ...input }).then(
      (res) => res.updateLink
    );
  }

  async deleteLink(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteLink($id: UUID!) {
        deleteLink(id: $id)
      }
    `;
    return this._graphql<{ deleteLink: boolean }>(mutation, { id }).then(
      (res) => res.deleteLink
    );
  }

  async getLinkSet(id: string): Promise<LinkSet> {
    const query = `
      query GetLinkSet($id: UUID!) {
        linkSet(id: $id) {
          id
          storeId
          name
          description
          position
          links {
            id
            name
            url
            position
            parentLinkId
            children {
              id
              name
              url
              position
            }
          }
        }
      }
    `;
    return this._graphql<{ linkSet: LinkSet }>(query, { id }).then(
      (res) => res.linkSet
    );
  }

  async getLinkSetsByStore(storeId: string): Promise<LinkSet[]> {
    const query = `
      query GetLinkSetsByStore($storeId: UUID!) {
        linkSetsByStore(storeId: $storeId) {
          id
          name
          description
          position
          links {
            id
            name
            url
            position
            parentLinkId
            children {
              id
              name
              url
              position
            }
          }
        }
      }
    `;
    return this._graphql<{ linkSetsByStore: LinkSet[] }>(query, { storeId }).then(
      (res) => res.linkSetsByStore
    );
  }

  async getLink(id: string): Promise<Link> {
    const query = `
      query GetLink($id: UUID!) {
        link(id: $id) {
          id
          linkSetId
          name
          url
          pageId
          position
          parentLinkId
          children {
            id
            name
            url
          }
          createdAt
        }
      }
    `;
    return this._graphql<{ link: Link }>(query, { id }).then(
      (res) => res.link
    );
  }
}
