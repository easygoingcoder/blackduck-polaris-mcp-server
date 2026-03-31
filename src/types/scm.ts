export interface Repository {
  _id: string;
  name?: string;
  url?: string;
  provider?: string;
  status?: string;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface RepoBranch {
  _id?: string;
  name?: string;
  isDefault?: boolean;
  [key: string]: unknown;
}

export interface ScmProvider {
  _id?: string;
  name?: string;
  type?: string;
  [key: string]: unknown;
}

export interface BulkImportResult {
  status?: string;
  imported?: number;
  failed?: number;
  [key: string]: unknown;
}
