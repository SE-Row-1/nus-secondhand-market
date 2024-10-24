declare module "bun" {
  interface Env {
    PORT?: number;
    JWT_SECRET_KEY: string;
    MONGO_URL: string;
    MONGO_DB_NAME: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;
    S3_BUCKET_NAME: string;
    SMMS_API_KEY: string;
    RABBITMQ_URL: string;
    ACCOUNT_SERVICE_BASE_URL: string;
  }
}
