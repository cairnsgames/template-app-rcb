export type Viewport = {
  width: number;
  height: number;
};

export type ViewportName = string;

export type ScreenDef = {
  name: string;
  path: string;
  /** Must be captured while logged out — runs before the setup/login step. Defaults to false. */
  public?: boolean;
  /** Restrict this screen to a subset of the configured viewports. Defaults to all viewports. */
  viewports?: ViewportName[];
};

export type ComparisonConfig = {
  pixelThreshold: number;
  maxDifferencePercent: number;
};

export type ScreenConfig = {
  baseUrl: string;
  viewports: Record<ViewportName, Viewport>;
  comparison: ComparisonConfig;
  /** Path (relative to screen-tests/) to a module exporting a `setup(page)` function. */
  setup?: string;
  screens: ScreenDef[];
};

export type ScreenStatus = "passed" | "failed" | "new";

export type ScreenResult = {
  screen: string;
  path: string;
  viewport: {
    name: string;
    width: number;
    height: number;
  };
  status: ScreenStatus;
  differencePercent: number;
  dimensionMismatch?: boolean;
  baselineImage: string;
  currentImage: string;
  diffImage?: string;
};

export type ScreenReport = {
  generatedAt: string;
  summary: {
    total: number;
    passed: number;
    failed: number;
    new: number;
  };
  results: ScreenResult[];
};
