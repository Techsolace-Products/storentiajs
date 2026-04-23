import { UUID } from './common';

export interface Page {
  id: UUID;
  pageTitle: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePageInput {
  pageTitle: string;
  content: string;
}

export interface UpdatePageInput {
  pageTitle?: string;
  content?: string;
}
