export interface AuditLog {
  _id?: string;
  category?: string;
  event?: string;
  user?: string;
  timestamp?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface AuditCategory {
  _id?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}
