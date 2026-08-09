export const isUntypedResponseLoggingEnabled = () =>
  process.env.REACT_APP_LOG_UNTYPED_RESPONSES === "true" ||
  process.env.REACT_APP_LOG_UNTYPED_RESPONSES === "True";

export const logUntypedResponse = <T = unknown>(source: string, response: unknown): T => {
  if (isUntypedResponseLoggingEnabled()) {
    console.warn(`[untyped-response] ${source}: no TypeScript type defined for this API response yet`, response);
  }
  return response as T;
};
