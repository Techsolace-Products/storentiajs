import { UUID } from './common';

/**
 * Represents a media file in Storentia.
 */
export interface Media {
  id: UUID;
  name: string;
  fileKey: string;
  mimeType: string;
  fileSize: number;
  folderId: UUID | null;
  storeId: UUID;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

/**
 * Represents a folder in Storentia's media library.
 */
export interface Folder {
  id: UUID;
  name: string;
  parentId: UUID | null;
  storeId: UUID;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter options for fetching media in a folder.
 */
export interface MediaInFolderFilter {
  storeId?: UUID;
  folderId?: UUID | null;
}

/**
 * Filter options for fetching folders.
 */
export interface FolderFilter {
  storeId?: UUID;
  parentId?: UUID | null;
}

/**
 * Input for creating a new folder.
 */
export interface CreateFolderInput {
  storeId: UUID;
  name: string;
  parentId?: UUID;
}

/**
 * Input for uploading a media file.
 */
export interface UploadMediaInput {
  storeId: UUID;
  file: any; // Typically a File or Blob in browser, or Stream in Node
  folderId?: UUID;
}
