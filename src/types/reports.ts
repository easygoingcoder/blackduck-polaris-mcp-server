export interface ReportType {
  _id?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

export interface Report {
  _id: string;
  reportType?: string;
  status?: string;
  createdAt?: string;
  completedAt?: string;
  parameters?: Record<string, unknown>;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}
