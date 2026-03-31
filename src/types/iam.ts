export interface User {
  _id: string;
  email?: string;
  name?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Group {
  _id: string;
  name?: string;
  description?: string;
  memberCount?: number;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ApiToken {
  _id?: string;
  name?: string;
  token?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface UserInfo {
  sub?: string;
  email?: string;
  name?: string;
  roles?: string[];
  [key: string]: unknown;
}
