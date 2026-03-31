export interface Issue {
  _id: string;
  name?: string;
  description?: string;
  severity?: string;
  cwe?: string;
  issueType?: string;
  toolType?: string;
  status?: string;
  firstDetected?: string;
  lastDetected?: string;
  dismissal?: {
    reason?: string;
    comment?: string;
    dismissedBy?: string;
    dismissedAt?: string;
  };
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface Occurrence {
  _id: string;
  issueId?: string;
  filePath?: string;
  lineNumber?: number;
  columnNumber?: number;
  endLineNumber?: number;
  endColumnNumber?: number;
  toolType?: string;
  severity?: string;
  _links?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CodeSnippet {
  filePath?: string;
  startLine?: number;
  endLine?: number;
  code?: string;
  [key: string]: unknown;
}

export interface TriageRecord {
  _id?: string;
  action?: string;
  comment?: string;
  createdBy?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface DetectionRecord {
  _id?: string;
  status?: string;
  detectedAt?: string;
  [key: string]: unknown;
}

export interface RemediationAssist {
  _id?: string;
  suggestion?: string;
  confidence?: string;
  [key: string]: unknown;
}
