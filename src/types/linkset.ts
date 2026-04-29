export interface Link {
  id: string;
  linkSetId: string;
  name: string;
  url: string;
  pageId?: string;
  position: number;
  parentLinkId?: string;
  children?: Link[];
  createdAt: string;
}

export interface LinkSet {
  id: string;
  storeId: string;
  name: string;
  description: string;
  position: number;
  links: Link[];
  createdAt: string;
}

export interface CreateLinkSetInput {
  storeId: string;
  name: string;
  description: string;
}

export interface UpdateLinkSetInput {
  name?: string;
  description?: string;
  position?: number;
}

export interface CreateLinkInput {
  linkSetId: string;
  name: string;
  url: string;
  position: number;
  parentLinkId?: string;
  pageId?: string;
}

export interface UpdateLinkInput {
  name?: string;
  url?: string;
  position?: number;
}
