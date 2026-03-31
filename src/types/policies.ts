export interface IssuePolicy {
  _id: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  rules?: unknown[];
  actions?: unknown[];
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TestSchedulingPolicy {
  _id: string;
  name?: string;
  description?: string;
  schedule?: unknown;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface PolicyAssignment {
  _id?: string;
  policyId?: string;
  targetId?: string;
  targetType?: string;
  [key: string]: unknown;
}

export interface PolicyAction {
  _id?: string;
  name?: string;
  type?: string;
  [key: string]: unknown;
}
