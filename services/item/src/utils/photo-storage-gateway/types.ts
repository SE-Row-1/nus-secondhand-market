/**
 * Gateway to external photo storage service.
 */
export interface PhotoStorageGateway {
  save: (photo: File) => Promise<string>;
  remove: (photoUrl: string) => Promise<void>;
}
