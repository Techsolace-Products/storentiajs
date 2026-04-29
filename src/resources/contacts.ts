import { BaseResource } from './base';
import { Contact, CreateContactInput, ContactPagination } from '../types';

export class ContactResource extends BaseResource {
  async create(input: CreateContactInput): Promise<Contact> {
    const mutation = `
      mutation CreateContact($name: String!, $email: String!, $message: String!) {
        createContact(input: { name: $name, email: $email, message: $message }) {
          id
          name
          email
          message
          status
          createdAt
        }
      }
    `;
    return this._graphql<{ createContact: Contact }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.createContact);
  }

  async list(pagination: ContactPagination = { limit: 10, offset: 0 }): Promise<Contact[]> {
    const query = `
      query GetContacts($limit: Int!, $offset: Int!) {
        contacts(pagination: { limit: $limit, offset: $offset }) {
          id
          name
          email
          message
          status
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ contacts: Contact[] }>(
      query,
      pagination as unknown as Record<string, unknown>
    ).then((res) => res.contacts);
  }

  async getById(id: string): Promise<Contact> {
    const query = `
      query GetContactById($id: String!) {
        contactById(id: $id) {
          id
          name
          email
          message
          status
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ contactById: Contact }>(query, { id }).then(
      (res) => res.contactById
    );
  }

  async updateStatus(id: string, status: 'NEW' | 'RESOLVED' | 'PENDING'): Promise<Contact> {
    const mutation = `
      mutation UpdateContactStatus($id: String!, $status: String!) {
        updateContactStatus(id: $id, status: $status) {
          id
          status
          updatedAt
        }
      }
    `;
    return this._graphql<{ updateContactStatus: Contact }>(mutation, { id, status }).then(
      (res) => res.updateContactStatus
    );
  }

  async delete(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteContact($id: String!) {
        deleteContact(id: $id)
      }
    `;
    return this._graphql<{ deleteContact: boolean }>(mutation, { id }).then(
      (res) => res.deleteContact
    );
  }
}
