declare module "bun" {
  interface Env {
    /**
     * The port number that the server listens on.
     * Optional. Default to 3000.
     */
    PORT?: number;

    /**
     * The URI of the MongoDB database.
     * Format: mongodb://<username>:<password>@<host>:<port>
     * Required.
     */
    MONGO_DB_URI: string;

    /**
     * The name of the MongoDB database.
     * Required.
     */
    MONGO_DB_NAME: string;

    /**
     * The secret key for JWT decoding.
     * This should be kept the same across all services.
     * Required.
     */
    JWT_SECRET: string;
  }
}
