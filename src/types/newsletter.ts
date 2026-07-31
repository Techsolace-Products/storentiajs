export interface NewsletterSubscriber {
  id: string;
  storeId: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  subscribedAt: string;
  unsubscribedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface SubscribeInput {
  email: string;
}

/** Matches the server-side `PaginationInput` (page/limit, 1-indexed). */
export interface NewsletterPagination {
  page?: number;
  limit?: number;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  email: string;
}
