export interface BugTrackerConfig {
  _id: string;
  name?: string;
  type?: string;
  url?: string;
  projectKey?: string;
  enabled?: boolean;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface IssueExportResult {
  exported?: number;
  failed?: number;
  results?: unknown[];
  [key: string]: unknown;
}
