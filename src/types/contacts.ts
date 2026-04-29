export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'NEW' | 'RESOLVED' | 'PENDING';
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  message: string;
}

export interface ContactPagination {
  limit: number;
  offset: number;
}
