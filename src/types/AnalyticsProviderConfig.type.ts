/**
 * Configuration object for the Analytics Provider.
 */
export type AnalyticsProviderConfig = {
  /**
   * The Measurement ID for the analytics provider.
   */
  measurementId: string;

  /**
   * Optional flag to disable tracking.
   * @default false
   */
  disableTracking?: boolean;

  /**
   * Optional function to transform URLs before sending them to the analytics provider.
   * @param url - The original URL.
   * @returns The transformed URL.
   */
  urlTransformer?: (url: string) => string;

  /**
   * Optional flag to disable link tracking.
   * @default false
   */
  disableLinkTracking?: boolean;

  /**
   * Optional flag to enable verbose logging. This adds more detailed logs to the browser console.
   * @default false
   */
  verbose?: boolean;

  /**
   * Optional flag to enable debug mode. This will log all events to the browser console.
   * @default false
   */
  debug?: boolean;
};
