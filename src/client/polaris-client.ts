import { PolarisConfig } from "../config.js";
import { PolarisApiError, RequestOptions, PaginatedResponse } from "./types.js";

export class PolarisClient {
  private baseUrl: string;
  private token: string;

  constructor(config: PolarisConfig) {
    this.baseUrl = config.baseUrl;
    this.token = config.apiToken;
  }

  async request<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
    const url = new URL(path, this.baseUrl);

    if (options?.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const accept = this.getAcceptHeader(path);
    const headers: Record<string, string> = {
      "Api-token": this.token,
      Accept: accept,
      ...options?.headers,
    };

    if (options?.body) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url.toString(), {
      method,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new PolarisApiError(response.status, response.statusText, body, path);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return (await response.json()) as T;
    }

    return (await response.text()) as T;
  }

  private getAcceptHeader(path: string): string {
    // Polaris uses endpoint-specific media types: application/vnd.polaris.[resource]-[version]+json
    const mediaTypeMap: [string, string][] = [
      ["/api/auth/users", "application/vnd.polaris.auth.users-1+json"],
      ["/api/auth/groups", "application/vnd.polaris.auth.groups-1+json"],
      ["/api/auth/openid-connect/userinfo", "application/vnd.polaris.auth.user-info-1+json"],
      ["/api/auth/tokens", "application/vnd.polaris.auth.tokens-1+json"],
      ["/api/auth/service-account-tokens", "application/vnd.polaris.auth.service-account-tokens-1+json"],
      ["/api/ciam/users", "*/*"],
      ["/api/ciam/groups", "*/*"],
      ["/api/ciam/openid-connect/userinfo", "application/vnd.polaris.auth.user-info-1+json"],
      ["/api/notification/organization-preferences", "application/vnd.polaris.notification.organization-preferences-1+json"],
      ["/api/notification/subscriptions", "application/vnd.polaris.notification.subscriptions-1+json"],
    ];

    for (const [prefix, mediaType] of mediaTypeMap) {
      if (path.startsWith(prefix)) {
        return `${mediaType}, application/json`;
      }
    }

    return "application/json";
  }

  async get<T>(path: string, query?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>("GET", path, { query });
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, { body });
  }

  async patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, { body });
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PUT", path, { body });
  }

  async delete(path: string): Promise<void> {
    await this.request<void>("DELETE", path);
  }

  async getPaginated<T>(
    path: string,
    query?: Record<string, string | number | boolean | undefined>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<any>(path, query);

    if (response && typeof response === "object" && "_items" in response) {
      return {
        data: response._items || [],
        meta: {
          total: response._collection?._meta?.totalCount ?? response._items?.length ?? 0,
          limit: Number(query?._limit ?? 25),
          offset: Number(query?._offset ?? 0),
        },
      };
    }

    if (response && typeof response === "object" && "data" in response) {
      return {
        data: response.data || [],
        meta: {
          total: response.meta?.total ?? response.data?.length ?? 0,
          limit: Number(query?._limit ?? 25),
          offset: Number(query?._offset ?? 0),
        },
      };
    }

    if (Array.isArray(response)) {
      return {
        data: response,
        meta: {
          total: response.length,
          limit: Number(query?._limit ?? 25),
          offset: Number(query?._offset ?? 0),
        },
      };
    }

    return {
      data: [],
      meta: { total: 0, limit: Number(query?._limit ?? 25), offset: Number(query?._offset ?? 0) },
    };
  }

  async downloadBinary(path: string): Promise<{ content: Buffer; contentType: string; filename?: string }> {
    const url = new URL(path, this.baseUrl);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Api-token": this.token,
      },
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new PolarisApiError(response.status, response.statusText, body, path);
    }

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    const disposition = response.headers.get("content-disposition") || "";
    const filenameMatch = disposition.match(/filename="?([^";\n]+)"?/);
    const filename = filenameMatch?.[1];

    const arrayBuffer = await response.arrayBuffer();
    return {
      content: Buffer.from(arrayBuffer),
      contentType,
      filename,
    };
  }
}
