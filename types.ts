export enum ReportType {
  PROBLEM = 'Problem',
  SUGGESTION = 'Suggestion'
}

export enum IssueCategory {
  MAINTENANCE = 'Maintenance',
  PLUMBING = 'Plumbing',
  ELECTRICAL = 'Electrical',
  IT = 'IT & Network',
  SECURITY = 'Security',
  CLEANLINESS = 'Cleanliness',
  OTHER = 'Other'
}

export enum IssuePriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export enum IssueStatus {
  OPEN = 'Open',
  IN_PROGRESS = 'In Progress',
  RESOLVED = 'Resolved'
}

export interface IssueReport {
  id: string;
  type: ReportType;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  status: IssueStatus;
  location: string;
  department: string;
  createdAt: number;
  aiConfidence: number;
  assignedTo?: string;
  resolvedAt?: number;
}

export interface AIAnalysisResult {
  type: ReportType;
  category: IssueCategory;
  priority: IssuePriority;
  summary: string;
  location: string;
  department: string;
  confidence: number;
}

export type ViewState = 'landing' | 'report' | 'feed' | 'admin' | 'authority';