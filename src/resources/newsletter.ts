import { BaseResource } from './base';
import { NewsletterSubscriber, SubscribeInput, NewsletterPagination, NewsletterResponse } from '../types';

export class NewsletterResource extends BaseResource {
  async subscribe(input: SubscribeInput): Promise<NewsletterResponse> {
    const mutation = `
      mutation Subscribe($storeId: String!, $email: String!) {
        subscribeToNewsletter(input: { storeId: $storeId, email: $email }) {
          success
          message
          email
        }
      }
    `;
    return this._graphql<{ subscribeToNewsletter: NewsletterResponse }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.subscribeToNewsletter);
  }

  async unsubscribe(storeId: string, email: string): Promise<NewsletterResponse> {
    const mutation = `
      mutation Unsubscribe($storeId: String!, $email: String!) {
        unsubscribeFromNewsletter(storeId: $storeId, email: $email) {
          success
          message
          email
        }
      }
    `;
    return this._graphql<{ unsubscribeFromNewsletter: NewsletterResponse }>(
      mutation,
      { storeId, email }
    ).then((res) => res.unsubscribeFromNewsletter);
  }

  async deleteSubscriber(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteNewsletterSubscriber($id: String!) {
        deleteNewsletterSubscriber(id: $id)
      }
    `;
    return this._graphql<{ deleteNewsletterSubscriber: boolean }>(mutation, { id }).then(
      (res) => res.deleteNewsletterSubscriber
    );
  }

  async listSubscribers(storeId: string, pagination: NewsletterPagination = { limit: 20, offset: 0 }): Promise<NewsletterSubscriber[]> {
    const query = `
      query GetSubscribers($storeId: String!, $limit: Int!, $offset: Int!) {
        newsLetterSubscribers(storeId: $storeId, pagination: { limit: $limit, offset: $offset }) {
          id
          storeId
          email
          status
          subscribedAt
          unsubscribedAt
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ newsLetterSubscribers: NewsletterSubscriber[] }>(
      query,
      { storeId, ...pagination } as unknown as Record<string, unknown>
    ).then((res) => res.newsLetterSubscribers);
  }

  async isSubscribed(storeId: string, email: string): Promise<boolean> {
    const query = `
      query CheckSubscription($storeId: String!, $email: String!) {
        isNewsletterSubscribed(storeId: $storeId, email: $email)
      }
    `;
    return this._graphql<{ isNewsletterSubscribed: boolean }>(query, { storeId, email }).then(
      (res) => res.isNewsletterSubscribed
    );
  }
}
