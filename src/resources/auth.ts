import { BaseResource } from './base';
import {
  AuthResponse,
  SendAuthEmailInput,
  SendAuthEmailResponse,
  VerifyAuthEmailInput,
  VerifyAuthEmailResponse,
  User,
  CustomerAuthResponse,
} from '../types';

export class AuthResource extends BaseResource {
  async getToken(): Promise<AuthResponse> {
    return this.client.authenticate();
  }

  async authenticate(email: string, password: string, publicStoreToken: string): Promise<CustomerAuthResponse> {
    const mutation = `
      mutation Authenticate($email: String!, $password: String!) {
        authenticate(input: { email: $email, password: $password }) {
          id
          email
          name
          token
        }
      }
    `;

    const headers = this.client.getPublicStoreTokenHeaders(publicStoreToken);
    const result = await this._graphql<{ authenticate: CustomerAuthResponse }>(
      mutation,
      { email, password },
      { headers }
    ).then((res) => res.authenticate);

    if (result.token) {
      this.client.setCustomerJWT(result.token);
    }

    return result;
  }

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
    if (!this.client.isCustomerAuthenticated()) {
      throw new Error('Customer not authenticated. Call authenticate() first.');
    }

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
