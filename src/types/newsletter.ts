export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscribeInput {
  email: string;
}

export interface NewsletterPagination {
  limit: number;
  offset: number;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  email: string;
}
