export type FeatureFlags = Record<string, string>;

export type GetFeatureFlagsResponse = { result: FeatureFlags };

export type FeatureFlagContextValue = {
  featureFlags: FeatureFlags;
};
