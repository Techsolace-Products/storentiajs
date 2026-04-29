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
  storeId: string;
  name: string;
  email: string;
  message: string;
}

export interface ContactPagination {
  limit: number;
  offset: number;
}
