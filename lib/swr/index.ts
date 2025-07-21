// File: lib/swr/index.ts

/**
 * Fetcher functions and utilities for SWR
 * These functions handle the actual HTTP requests and error handling
 */

/**
 * HTTP request error with additional context
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public info?: unknown // The raw error info (parsed JSON or text)
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/**
 * Type for the response data structure expected from the API error
 */
export interface ApiErrorResponse {
  error: string;
}

/**
 * Checks if a Response is OK and throws an HttpError if not.
 * Attempts to parse the error response body to create a more informative error message.
 */
async function checkResponse(response: Response): Promise<Response> {
  if (!response.ok) {
    let errorInfo: unknown;
    let detailedMessage: string | null = null;

    try {
      // Try to parse error response as JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
          errorInfo = await response.json();
          // If the parsed JSON has an 'error' property string, use it
          if (typeof errorInfo === 'object' && errorInfo !== null && 'error' in errorInfo && typeof errorInfo.error === 'string') {
              detailedMessage = errorInfo.error;
          }
      } else {
          // If not JSON, try to get text
          errorInfo = await response.text();
          if (typeof errorInfo === 'string' && errorInfo.length > 0) {
              detailedMessage = errorInfo; // Use the text directly
          }
      }
    } catch (parseError) {
        // If parsing fails, store the error but proceed, using statusText as fallback info
        console.error("Failed to parse error response body:", parseError);
        errorInfo = response.statusText; // Fallback info
    }

    // Construct the primary error message
    const errorMessage = detailedMessage ?? `Request failed with status ${response.status}`;

    throw new HttpError(errorMessage, response.status, errorInfo);
  }

  return response;
}

/**
 * Safely parses JSON response, wrapping any parsing errors.
 * This is primarily for successful (2xx) responses that are expected to be JSON.
 */
async function parseJSON<T>(response: Response): Promise<T> {
  // Handle 204 No Content explicitly - it should not have a body.
  if (response.status === 204) {
      // Return null, undefined, or an empty object/array based on what makes sense for your application
      // when encountering a No Content response. Null is often reasonable.
      return null as T;
  }

  try {
    // response.json() efficiently parses the JSON body.
    // It will throw if the body is empty (on non-204) or not valid JSON.
    return await response.json();
  } catch (e) {
    // Wrap the parsing error in HttpError for consistency.
    // This indicates a problem with the response format even on a 2xx status.
    throw new HttpError(
      'Failed to parse JSON response',
      response.status, // Keep the original status
      e instanceof Error ? e.message : String(e)
    );
  }
}

/**
 * Basic fetcher for GET requests
 * @param url The URL to fetch from
 * @returns The parsed JSON response
 */
export async function fetcher<T>(url: string): Promise<T> {
  const response = await fetch(url);
  await checkResponse(response); // Throws HttpError on non-OK status
  return parseJSON<T>(response); // Throws HttpError on JSON parsing failure
}

/**
 * Fetcher for POST requests, compatible with SWR's mutation format
 * @param url The URL to post to
 * @param options Object containing the data to send in the arg property
 * @returns The parsed JSON response
 */
export async function postFetcher<T, TBody = unknown>(
  url: string,
  { arg }: { arg: TBody }
): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(arg),
  });

  await checkResponse(response); // Throws HttpError on non-OK status
  return parseJSON<T>(response); // Throws HttpError on JSON parsing failure
}