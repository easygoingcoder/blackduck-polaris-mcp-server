export interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

export class PolarisApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly statusText: string,
    public readonly body: string,
    public readonly path: string
  ) {
    super(`Polaris API error ${statusCode} (${statusText}) on ${path}: ${body}`);
    this.name = "PolarisApiError";
  }
}
