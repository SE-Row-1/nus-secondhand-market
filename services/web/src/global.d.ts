declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /**
       * How the user's browser accesses the backend API.
       * For example, "https://nshm.mrcai.dev/api".
       * Required.
       * @note Do not include a trailing slash.
       */
      NEXT_PUBLIC_API_BASE_URL: string;

      /**
       * How the web service server accesses the backend API.
       * For example, "http://service-registry:8761".
       * Required.
       * @note Do not include a trailing slash.
       */
      API_BASE_URL: string;
    }
  }
}

export {};
