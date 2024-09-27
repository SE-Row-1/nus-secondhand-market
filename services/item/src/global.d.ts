declare module "bun" {
  // See `.env.example` for details on environment variables.
  interface Env {
    PORT?: number;
    MONGO_DB_URI: string;
    MONGO_DB_NAME: string;
  }
}
