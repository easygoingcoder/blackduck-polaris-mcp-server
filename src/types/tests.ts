export interface Test {
  _id: string;
  status?: string;
  testType?: string;
  projectId?: string;
  branchId?: string;
  createdAt?: string;
  updatedAt?: string;
  completedAt?: string;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TestMetrics {
  testId?: string;
  totalIssues?: number;
  criticalCount?: number;
  highCount?: number;
  mediumCount?: number;
  lowCount?: number;
  [key: string]: unknown;
}

export interface TestArtifact {
  _id?: string;
  name?: string;
  type?: string;
  size?: number;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TestComment {
  _id?: string;
  text?: string;
  createdBy?: string;
  createdAt?: string;
  [key: string]: unknown;
}
