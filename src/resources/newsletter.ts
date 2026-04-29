import { BaseResource } from './base';
import { NewsletterSubscriber, SubscribeInput, NewsletterPagination, NewsletterResponse } from '../types';

export class NewsletterResource extends BaseResource {
  async subscribe(input: SubscribeInput): Promise<NewsletterResponse> {
    const mutation = `
      mutation SubscribeToNewsletter($email: String!) {
        subscribeToNewsletter(input: { email: $email }) {
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

  async unsubscribe(email: string): Promise<NewsletterResponse> {
    const mutation = `
      mutation UnsubscribeFromNewsletter($email: String!) {
        unsubscribeFromNewsletter(email: $email) {
          success
          message
          email
        }
      }
    `;
    return this._graphql<{ unsubscribeFromNewsletter: NewsletterResponse }>(
      mutation,
      { email }
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

  async listSubscribers(pagination: NewsletterPagination = { limit: 20, offset: 0 }): Promise<NewsletterSubscriber[]> {
    const query = `
      query GetNewsletterSubscribers($limit: Int!, $offset: Int!) {
        newsLetterSubscribers(pagination: { limit: $limit, offset: $offset }) {
          id
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
      pagination as unknown as Record<string, unknown>
    ).then((res) => res.newsLetterSubscribers);
  }

  async isSubscribed(email: string): Promise<boolean> {
    const query = `
      query CheckNewsletterSubscription($email: String!) {
        isNewsletterSubscribed(email: $email)
      }
    `;
    return this._graphql<{ isNewsletterSubscribed: boolean }>(query, { email }).then(
      (res) => res.isNewsletterSubscribed
    );
  }
}
