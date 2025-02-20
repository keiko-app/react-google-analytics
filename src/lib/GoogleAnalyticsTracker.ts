import { AnalyticsProviderConfig, TrackPageViewParams } from "../types";

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any) => void;
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

    this.log("Initializing Google Analytics tracker...");
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
      this.log(`Adding custom instruction: ${name}, with args: ${args}`);
      window.gtag(name, ...args);
    } else {
      this.log(`\`window\` is undefined. Skipping instruction.`);
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

    this.log(
      `Tracking page view for URL: ${url}, with title: ${title} and additional params: ${params}`
    );

    this.addCustomInstruction("config", this.config.measurementId, {
      send_page_view: false,
      page_referrer: document.referrer,
      page_location: url,
      debug_mode: !!this.config.debug,
      update: true,
    });
    this.addCustomInstruction("event", "page_view", {
      ...params,
      page_location: url,
      page_title: title,
    });

    return this;
  }

  /**
   * Tracks a login event with Google Analytics.
   * @param {string} method - The method used for login (e.g., 'Google', 'Facebook', 'Email').
   * @returns {this} The tracker instance.
   * @memberof GoogleAnalyticsTracker
   */
  trackLogin(method: string): this {
    this.log(`Tracking login event with method: ${method}`);
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
    this.log(`Tracking generic event with name: ${name} and params: ${params}`);
    return this.addCustomInstruction("event", name, params);
  }

  /**
   * Launches the Google Analytics tracker.
   * @returns {void}
   * @private
   * @memberof GoogleAnalyticsTracker
   */
  private launch() {
    this.addGoogleTrackerToDOM();

    if (typeof window === "undefined") {
      console.warn(
        "Google Analytics will not work in non-browser environments."
      );
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    if (window.dataLayer.length !== 0) {
      this.log("The dataLayer array already exists. Skipping initialization.");
      return;
    }

    if (this.config.disableTracking) {
      this.log("Tracking is disabled. Skipping initialization.");
      return;
    }

    const now = new Date();
    this.log(
      `Launching Google Analytics tracker at ${now.toISOString()} with measurement ID: ${
        this.config.measurementId
      }`
    );
    this.addCustomInstruction("js", now);
    this.addCustomInstruction("config", this.config.measurementId, {
      send_page_view: false,
      debug_mode: !!this.config.debug,
    });
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

    this.log("Adding Google Analytics tracker to the DOM...");
    this.log(`Script URL: ${scriptElement.src}`);
    this.log(
      `Found scripts parentNode? ${!!scripts?.parentNode ? "Yes" : "No"}`
    );

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
    this.log("Automatically getting the page URL...");
    if (this.config.urlTransformer) {
      this.log("Using the URL transformer function.");
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
    this.log("Automatically getting the page title...");
    return window.document.title;
  }

  /**
   * Logs a message to the console.
   * @param {string} message - The message to log.
   * @returns {void}
   * @private
   * @memberof GoogleAnalyticsTracker
   */
  private log(message: string): void {
    if (!!this.config.verbose) {
      console.log(`[Keiko-Analytics-Tracker] ${message}`);
    }
  }
}
