declare module "bun" {
  interface Env {
    PORT?: number;
    PGHOST: string;
    PGPORT: string;
    PGDATABASE: string;
    PGUSER: string;
    PGPASSWORD: string;
    JWT_SECRET_KEY: string;
    RABBITMQ_URL: string;
    ACCOUNT_SERVICE_BASE_URL: string;
    ITEM_SERVICE_BASE_URL: string;
  }
}
