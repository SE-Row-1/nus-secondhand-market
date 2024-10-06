declare module "bun" {
  interface Env {
    /**
     * The port number that the server listens on.
     * Optional. Default to 3000.
     */
    PORT?: number;

    /**
     * The secret key for JWT decoding.
     * Required.
     */
    JWT_SECRET: string;

    /**
     * The URI of the MongoDB database.
     * Format: mongodb://<username>:<password>@<host>:<port>
     * Required.
     */
    MONGO_URI: string;

    /**
     * The name of the MongoDB database.
     * Required.
     */
    MONGO_DB_NAME: string;

    /**
     * The access key ID for the S3 bucket.
     * Required.
     */
    S3_ACCESS_KEY_ID: string;

    /**
     * The secret access key for the S3 bucket.
     * Required.
     */
    S3_SECRET_ACCESS_KEY: string;

    /**
     * The name of the S3 bucket.
     * Required.
     */
    S3_BUCKET_NAME: string;

    /**
     * The region of the S3 bucket.
     * Required.
     */
    S3_REGION: string;
  }
}
