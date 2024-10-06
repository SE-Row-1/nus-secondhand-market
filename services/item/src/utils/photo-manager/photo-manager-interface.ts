export interface PhotoManager {
  save: (photo: File) => Promise<string>;
  remove: (photoUrl: string) => Promise<void>;
}
