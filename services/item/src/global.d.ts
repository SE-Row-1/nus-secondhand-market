declare module "bun" {
  interface Env {
    /**
     * Port number for the server to listen on.
     *
     * Optional. Default to 3000.
     */
    PORT?: number;

    /**
     * Secret key for decoding JWT tokens.
     *
     * This key should remain the same across all microservices.
     *
     * Required.
     */
    JWT_SECRET_KEY: string;

    /**
     * URI of MongoDB server.
     *
     * Format: mongodb://<username>:<password>@<host>:<port>
     *
     * Required.
     */
    MONGO_URI: string;

    /**
     * Name of MongoDB database.
     *
     * Required.
     */
    MONGO_DB_NAME: string;

    /**
     * AWS access key ID.
     *
     * Required.
     */
    AWS_ACCESS_KEY_ID: string;

    /**
     * AWS secret access key.
     *
     * Required.
     */
    AWS_SECRET_ACCESS_KEY: string;

    /**
     * AWS region, to which S3 client will send requests.
     *
     * Required.
     */
    AWS_REGION: string;

    /**
     * S3 bucket name.
     *
     * Required.
     */
    S3_BUCKET_NAME: string;
  }
}
