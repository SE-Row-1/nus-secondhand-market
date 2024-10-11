/**
 * Manage photo storage.
 */
export interface PhotoManager {
  /**
   * Save a photo file and return its URL.
   */
  save: (photo: File) => Promise<string>;

  /**
   * Remove a photo by its URL.
   */
  remove: (photoUrl: string) => Promise<void>;
}
