export interface Portfolio {
  _id: string;
  name: string;
  description?: string;
  _links?: Record<string, unknown>;
}

export interface Application {
  _id: string;
  name: string;
  description?: string;
  portfolioId: string;
  _links?: Record<string, unknown>;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  applicationId: string;
  _links?: Record<string, unknown>;
}

export interface Branch {
  _id: string;
  name: string;
  projectId: string;
  isDefault?: boolean;
  _links?: Record<string, unknown>;
}
