import { AnalyticsProviderConfig, TrackPageViewParams } from "../types";

declare global {
  interface Window {
    dataLayer: any[];
  }
}

export class GoogleAnalyticsTracker {
  private config: AnalyticsProviderConfig;

  constructor(config: AnalyticsProviderConfig) {
    if (!config.measurementId) {
      throw new Error(
        "You must specify the measurement ID provided by Google Analytics. If you haven't created a property yet, please refer to the Google documentation. The measurement ID is in the format 'G-XXXXXXXXXX'."
      );
    }

    this.config = config;

    this.launch();
  }

  /**
   * Adds a custom instruction to the Google Analytics tracker.
   * @param {string} name - The name of the instruction.
   * @param {...any} args - The arguments for the instruction.
   * @returns {this} The tracker instance.
   * @memberof GoogleAnalyticsTracker
   */
  addCustomInstruction(name: string, ...args: any[]): this {
    if (typeof window !== "undefined") {
      window.dataLayer.push([name, ...args]);
    }
    return this;
  }

  /**
   * Tracks an page view with Google Analytics.
   * @param {TrackPageViewParams} [params] - The parameters for the page view.
   * @returns {this} The tracker instance.
   * @memberof GoogleAnalyticsTracker
   */
  trackPageView(params: TrackPageViewParams): this {
    const { page_location, page_title } = params;
    const url = page_location || this.getPageUrl();
    const title = page_title || this.getPageTitle();

    return this.addCustomInstruction("event", "page_view", {
      ...params,
      page_location: url,
      page_title: title,
    });
  }

  /**
   * Tracks a login event with Google Analytics.
   * @param {string} method - The method used for login (e.g., 'Google', 'Facebook', 'Email').
   * @returns {this} The tracker instance.
   * @memberof GoogleAnalyticsTracker
   */
  trackLogin(method: string): this {
    return this.addCustomInstruction("event", "login", {
      method,
    });
  }

  /**
   * Tracks a generic event with Google Analytics.
   * @param {string} name - The name of the event.
   * @param {Record<string, any>} params - The parameters for the event.
   * @returns {this} The tracker instance.
   * @memberof GoogleAnalyticsTracker
   */
  trackEvent(name: string, params: Record<string, any>): this {
    return this.addCustomInstruction("event", name, params);
  }

  /**
   * Launches the Google Analytics tracker.
   * @returns {void}
   * @private
   * @memberof GoogleAnalyticsTracker
   */
  private launch() {
    if (typeof window === "undefined") {
      console.warn(
        "Google Analytics will not work in non-browser environments."
      );
      return;
    }

    window.dataLayer = window.dataLayer || [];

    if (window.dataLayer.length !== 0) {
      return;
    }

    if (this.config.disableTracking) {
      return;
    }

    this.addCustomInstruction("js", new Date());
    this.addCustomInstruction("config", this.config.measurementId);

    this.addGoogleTrackerToDOM();
  }

  /**
   * Launches the Google Analytics tracker.
   * @returns {void}
   * @private
   * @memberof GoogleAnalyticsTracker
   */
  private addGoogleTrackerToDOM(): void {
    const doc = document;
    const scriptElement = doc.createElement("script");
    const scripts = doc.getElementsByTagName("script")[0];

    scriptElement.type = "text/javascript";
    scriptElement.async = true;
    scriptElement.defer = true;
    scriptElement.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;

    scripts?.parentNode?.insertBefore(scriptElement, scripts);
  }

  /**
   * Tracks an event with Google Analytics.
   * @param {string} eventName - The name of the event.
   * @param {any} [eventData] - The data for the event.
   * @returns {this} The tracker instance.
   * @memberof GoogleAnalyticsTracker
   */
  private getPageUrl(): string {
    if (this.config.urlTransformer) {
      return this.config.urlTransformer(window.location.href);
    }

    return window.location.href;
  }

  /**
   * Gets the page title.
   * @returns {string} The page title.
   * @private
   * @memberof GoogleAnalyticsTracker
   */
  private getPageTitle(): string {
    return window.document.title;
  }
}
