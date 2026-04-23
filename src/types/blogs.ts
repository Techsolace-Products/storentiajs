import { UUID } from './common';

export interface BlogPost {
  id: UUID;
  title: string;
  imageId?: UUID;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostInput {
  title: string;
  imageId?: UUID;
  content: string;
}

export interface UpdateBlogPostInput {
  title?: string;
  imageId?: UUID;
  content?: string;
}
