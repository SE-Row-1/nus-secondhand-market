declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Base URL for browser to access backend API.
       *
       * Required.
       *
       * @note Do not include a trailing slash.
       * @example https://nshm.shop
       */
      NEXT_PUBLIC_API_BASE_URL: string;

      /**
       * Base URL for web service to access backend API.
       *
       * Required.
       *
       * @note Do not include a trailing slash.
       * @example http://service-registry:8761
       */
      API_BASE_URL: string;
    }
  }
}

export {};
