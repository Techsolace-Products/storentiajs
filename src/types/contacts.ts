export interface Contact {
  id: string;
  storeId: string;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'RESOLVED' | 'PENDING';
  createdAt: string;
  updatedAt?: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  message: string;
}

/** Matches the server-side `PaginationInput` (page/limit, 1-indexed). */
export interface ContactPagination {
  page?: number;
  limit?: number;
}
