export interface PolarisConfig {
  baseUrl: string;
  apiToken: string;
  verbose?: boolean;
}

export function loadConfig(): PolarisConfig {
  const baseUrl = process.env.POLARIS_URL;
  const apiToken = process.env.POLARIS_API_TOKEN;

  if (!baseUrl) {
    throw new Error(
      "POLARIS_URL environment variable is required. " +
        "Set it to your Polaris instance URL (e.g., https://polaris.blackduck.com)"
    );
  }

  if (!apiToken) {
    throw new Error(
      "POLARIS_API_TOKEN environment variable is required. " +
        "Generate one at Profile > Account > Access Tokens in Polaris"
    );
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiToken,
    verbose: process.env.POLARIS_VERBOSE === "true",
  };
}
