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
};
