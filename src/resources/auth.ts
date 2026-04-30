import { BaseResource } from './base';
import {
  AuthResponse,
  SendAuthEmailInput,
  SendAuthEmailResponse,
  VerifyAuthEmailInput,
  VerifyAuthEmailResponse,
  User,
} from '../types';

export class AuthResource extends BaseResource {
  async getToken(): Promise<AuthResponse> {
    return this.client.authenticate();
  }

  async sendAuthenticationEmail(input: SendAuthEmailInput): Promise<SendAuthEmailResponse> {
    const mutation = `
      mutation SendAuthEmail($email: String!, $name: String!) {
        sendAuthenticationEmail(input: { email: $email, name: $name }) {
          success
          message
          email
        }
      }
    `;
    return this._graphql<{ sendAuthenticationEmail: SendAuthEmailResponse }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.sendAuthenticationEmail);
  }

  async verifyAuthenticationEmail(input: VerifyAuthEmailInput): Promise<VerifyAuthEmailResponse> {
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
    return this._graphql<{ verifyAuthenticationEmail: VerifyAuthEmailResponse }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.verifyAuthenticationEmail);
  }

  async getMe(): Promise<User> {
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

  async logout(): Promise<boolean> {
    const mutation = `
      mutation Logout {
        logout
      }
    `;
    return this._graphql<{ logout: boolean }>(mutation).then((res) => res.logout);
  }
}
