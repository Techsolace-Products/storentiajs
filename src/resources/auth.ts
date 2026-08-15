import { BaseResource } from './base';
import {
  AuthResponse,
  SendAuthEmailInput,
  SendAuthEmailResponse,
  VerifyAuthEmailInput,
  VerifyAuthEmailResponse,
  User,
  UpdateMeInput,
  Address,
  AddressInput,
  UpdateAddressInput,
} from '../types';

const ADDRESS_FIELDS = `
  id
  customerId
  fullName
  phone
  line1
  line2
  city
  state
  postalCode
  country
  isDefault
  createdAt
  updatedAt
`;

export class AuthResource extends BaseResource {
  async getToken(): Promise<AuthResponse> {
    return this.client.authenticate();
  }

  // Customer auth is email-code only: sendAuthenticationEmail() then
  // verifyAuthenticationEmail(). The storefront schema exposes no password login.

  async sendAuthenticationEmail(email: string, publicStoreToken: string): Promise<SendAuthEmailResponse> {
    const mutation = `
      mutation SendAuthEmail($email: String!) {
        sendAuthenticationEmail(input: { email: $email }) {
          success
          message
          email
        }
      }
    `;

    const headers = this.client.getPublicStoreTokenHeaders(publicStoreToken);
    return this._graphql<{ sendAuthenticationEmail: SendAuthEmailResponse }>(
      mutation,
      { email },
      { headers }
    ).then((res) => res.sendAuthenticationEmail);
  }

  async verifyAuthenticationEmail(email: string, code: string, publicStoreToken: string): Promise<VerifyAuthEmailResponse> {
    const mutation = `
      mutation VerifyAuthEmail($email: String!, $code: String!) {
        verifyAuthenticationEmail(input: { email: $email, code: $code }) {
          id
          email
          name
          token
        }
      }
    `;

    const headers = this.client.getPublicStoreTokenHeaders(publicStoreToken);
    const result = await this._graphql<{ verifyAuthenticationEmail: VerifyAuthEmailResponse }>(
      mutation,
      { email, code },
      { headers }
    ).then((res) => res.verifyAuthenticationEmail);

    if (result.token) {
      this.client.setCustomerJWT(result.token);
    }

    return result;
  }

  async getMe(): Promise<User> {
    this.requireCustomerAuth();

    const query = `
      query GetMe {
        me {
          id
          email
          name
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ me: User }>(query).then((res) => res.me);
  }

  async updateMe(input: UpdateMeInput): Promise<User> {
    this.requireCustomerAuth();

    const mutation = `
      mutation UpdateMe($input: UpdateMeInput!) {
        updateMe(input: $input) {
          id
          email
          name
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ updateMe: User }>(mutation, { input }).then((res) => res.updateMe);
  }

  async getAddresses(): Promise<Address[]> {
    this.requireCustomerAuth();

    const query = `
      query GetAddresses {
        me {
          addresses {
            ${ADDRESS_FIELDS}
          }
        }
      }
    `;
    return this._graphql<{ me: { addresses: Address[] } }>(query).then((res) => res.me.addresses);
  }

  async addAddress(input: AddressInput): Promise<Address> {
    this.requireCustomerAuth();

    const mutation = `
      mutation AddAddress($input: AddressInput!) {
        addAddress(input: $input) {
          ${ADDRESS_FIELDS}
        }
      }
    `;
    return this._graphql<{ addAddress: Address }>(mutation, { input }).then((res) => res.addAddress);
  }

  async updateAddress(id: string, input: UpdateAddressInput): Promise<Address> {
    this.requireCustomerAuth();

    const mutation = `
      mutation UpdateAddress($id: UUID!, $input: UpdateAddressInput!) {
        updateAddress(id: $id, input: $input) {
          ${ADDRESS_FIELDS}
        }
      }
    `;
    return this._graphql<{ updateAddress: Address }>(mutation, { id, input }).then((res) => res.updateAddress);
  }

  async deleteAddress(id: string): Promise<boolean> {
    this.requireCustomerAuth();

    const mutation = `
      mutation DeleteAddress($id: UUID!) {
        deleteAddress(id: $id)
      }
    `;
    return this._graphql<{ deleteAddress: boolean }>(mutation, { id }).then((res) => res.deleteAddress);
  }

  async setDefaultAddress(id: string): Promise<Address> {
    this.requireCustomerAuth();

    const mutation = `
      mutation SetDefaultAddress($id: UUID!) {
        setDefaultAddress(id: $id) {
          ${ADDRESS_FIELDS}
        }
      }
    `;
    return this._graphql<{ setDefaultAddress: Address }>(mutation, { id }).then((res) => res.setDefaultAddress);
  }

  private requireCustomerAuth(): void {
    if (!this.client.isCustomerAuthenticated()) {
      throw new Error('Customer not authenticated. Call auth.verifyAuthenticationEmail() first.');
    }
  }

  logoutGraphQL(): Promise<boolean> {
    const mutation = `
      mutation Logout {
        logout
      }
    `;
    return this._graphql<{ logout: boolean }>(mutation).then((res) => res.logout);
  }

  logout(): void {
    this.client.clearCustomerJWT();
  }

  isAuthenticated(): boolean {
    return this.client.isCustomerAuthenticated();
  }
}
