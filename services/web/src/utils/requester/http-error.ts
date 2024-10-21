/**
 * Error indicated in an HTTP response.
 *
 * This error does not mean that the HTTP request itself failed -
 * The request has been sent, and the response has been received,
 * but the response indicates a 4xx or 5xx error.
 *
 * Should the HTTP request itself fail, the error would be thrown
 * by the `fetch` function, which is of type `Error`.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
