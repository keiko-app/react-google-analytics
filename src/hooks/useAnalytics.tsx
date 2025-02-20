import React, { ReactNode, createContext, useContext, useMemo } from "react";
import { AnalyticsProviderConfig } from "../types";
import { GoogleAnalyticsTracker } from "../lib";

type AnalyticsContextProps = {
  tracker: GoogleAnalyticsTracker;
};

const AnalyticsContext = createContext<AnalyticsContextProps>(
  {} as AnalyticsContextProps
);

/**
 * Hook to use the Analytics context.
 * @returns {AnalyticsContextProps} The analytics context value.
 */
export const useAnalytics = () => useContext(AnalyticsContext);

/**
 * Provider component for Analytics context.
 * @param {Object} props - The props for the provider.
 * @param {AnalyticsProvidersConfig} props.config - The configuration for Google Analytics tracker.
 * @param {ReactNode} props.children - The children components.
 * @returns {JSX.Element} The provider component.
 */
export const AnalyticsProvider = ({
  config,
  children,
}: {
  children: ReactNode;
  config: AnalyticsProviderConfig;
}) => {
  const tracker = useMemo(() => new GoogleAnalyticsTracker(config), [config]);
  return (
    <AnalyticsContext.Provider value={{ tracker }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
