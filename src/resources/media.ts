import { BaseResource } from './base';
import {
  Media,
  Folder,
  MediaInFolderFilter,
  FolderFilter,
  CreateFolderInput,
  UploadMediaInput,
} from '../types';

/**
 * Resource for managing media files and folders.
 */
export class MediaResource extends BaseResource {
  /**
   * Fetch a single media item by ID
   * @param id - Media ID (UUID)
   * @returns Media item
   */
  async get(id: string): Promise<Media> {
    const query = `
      query GetMedia($id: UUID!) {
        media(id: $id) {
          id
          name
          fileKey
          mimeType
          fileSize
          folderId
          storeId
          createdAt
          updatedAt
          metadata
        }
      }
    `;
    return this._graphql<{ media: Media }>(query, { id }).then((res) => res.media);
  }

  /**
   * Fetch folders for a store or specific parent
   * @param filter - Filter options (storeId, parentId)
   * @returns List of folders
   */
  async listFolders(filter: FolderFilter = {}): Promise<Folder[]> {
    const query = `
      query GetFolders($storeId: UUID, $parentId: UUID) {
        folders(storeId: $storeId, parentId: $parentId) {
          id
          name
          parentId
          storeId
          createdAt
          updatedAt
        }
      }
    `;
    return this._graphql<{ folders: Folder[] }>(
      query,
      filter as unknown as Record<string, unknown>
    ).then((res) => res.folders);
  }

  /**
   * Fetch all media inside a specific folder
   * @param filter - Filter options (storeId, folderId)
   * @returns List of media items
   */
  async listMediaInFolder(filter: MediaInFolderFilter = {}): Promise<Media[]> {
    const query = `
      query GetMediaInFolder($storeId: UUID, $folderId: UUID) {
        mediaInFolder(storeId: $storeId, folderId: $folderId) {
          id
          name
          fileKey
          mimeType
          fileSize
          folderId
          storeId
        }
      }
    `;
    return this._graphql<{ mediaInFolder: Media[] }>(
      query,
      filter as unknown as Record<string, unknown>
    ).then((res) => res.mediaInFolder);
  }

  /**
   * Create a new folder
   * @param input - Folder creation details
   * @returns Created folder
   */
  async createFolder(input: CreateFolderInput): Promise<Folder> {
    const mutation = `
      mutation CreateFolder($storeId: UUID!, $name: String!, $parentId: UUID) {
        createFolder(storeId: $storeId, name: $name, parentId: $parentId) {
          id
          name
          parentId
        }
      }
    `;
    return this._graphql<{ createFolder: Folder }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.createFolder);
  }

  /**
   * Upload a media file
   * @param input - Upload details
   * @returns Uploaded media item
   */
  async upload(input: UploadMediaInput): Promise<Media> {
    const mutation = `
      mutation UploadMedia($storeId: UUID!, $file: Upload!, $folderId: UUID) {
        uploadMedia(storeId: $storeId, file: $file, folderId: $folderId) {
          id
          name
          fileKey
          mimeType
        }
      }
    `;
    return this._graphql<{ uploadMedia: Media }>(
      mutation,
      input as unknown as Record<string, unknown>
    ).then((res) => res.uploadMedia);
  }

  /**
   * Move media to a different folder
   * @param id - Media ID
   * @param folderId - Target folder ID
   * @returns Updated media item
   */
  async moveMedia(id: string, folderId: string | null): Promise<Media> {
    const mutation = `
      mutation MoveMedia($id: UUID!, $folderId: UUID) {
        moveMedia(id: $id, folderId: $folderId) {
          id
          folderId
        }
      }
    `;
    return this._graphql<{ moveMedia: Media }>(mutation, { id, folderId }).then(
      (res) => res.moveMedia
    );
  }

  /**
   * Move a folder to a different parent
   * @param id - Folder ID
   * @param parentId - Target parent folder ID
   * @returns Updated folder
   */
  async moveFolder(id: string, parentId: string | null): Promise<Folder> {
    const mutation = `
      mutation MoveFolder($id: UUID!, $parentId: UUID) {
        moveFolder(id: $id, parentId: $parentId) {
          id
          parentId
        }
      }
    `;
    return this._graphql<{ moveFolder: Folder }>(mutation, { id, parentId }).then(
      (res) => res.moveFolder
    );
  }

  /**
   * Rename a folder
   * @param id - Folder ID
   * @param name - New folder name
   * @returns Updated folder
   */
  async renameFolder(id: string, name: string): Promise<Folder> {
    const mutation = `
      mutation RenameFolder($id: UUID!, $name: String!) {
        renameFolder(id: $id, name: $name) {
          id
          name
        }
      }
    `;
    return this._graphql<{ renameFolder: Folder }>(mutation, { id, name }).then(
      (res) => res.renameFolder
    );
  }

  /**
   * Rename a media item
   * @param id - Media ID
   * @param name - New name
   * @returns Updated media item
   */
  async renameMedia(id: string, name: string): Promise<Media> {
    const mutation = `
      mutation RenameMedia($id: UUID!, $name: String!) {
        renameMedia(id: $id, name: $name) {
          id
          name
        }
      }
    `;
    return this._graphql<{ renameMedia: Media }>(mutation, { id, name }).then(
      (res) => res.renameMedia
    );
  }

  /**
   * Delete a media item
   * @param id - Media ID
   * @returns True if deleted
   */
  async deleteMedia(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteMedia($id: UUID!) {
        deleteMedia(id: $id)
      }
    `;
    return this._graphql<{ deleteMedia: boolean }>(mutation, { id }).then(
      (res) => res.deleteMedia
    );
  }

  /**
   * Delete a folder
   * @param id - Folder ID
   * @returns True if deleted
   */
  async deleteFolder(id: string): Promise<boolean> {
    const mutation = `
      mutation DeleteFolder($id: UUID!) {
        deleteFolder(id: $id)
      }
    `;
    return this._graphql<{ deleteFolder: boolean }>(mutation, { id }).then(
      (res) => res.deleteFolder
    );
  }
}
