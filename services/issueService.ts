import { supabase } from '../lib/supabaseClient';
import { IssueReport, IssueStatus, IssueCategory, IssuePriority, ReportType } from '../types';

// Database row type (snake_case)
interface IssueRow {
    id: string;
    type: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    location: string;
    department: string;
    created_at: string;
    ai_confidence: number;
    assigned_to: string | null;
    resolved_at: string | null;
}

// Convert database row to TypeScript type
function rowToIssue(row: IssueRow): IssueReport {
    return {
        id: row.id,
        type: row.type as ReportType,
        title: row.title,
        description: row.description,
        category: row.category as IssueCategory,
        priority: row.priority as IssuePriority,
        status: row.status as IssueStatus,
        location: row.location,
        department: row.department,
        createdAt: new Date(row.created_at).getTime(),
        aiConfidence: row.ai_confidence,
        assignedTo: row.assigned_to || undefined,
        resolvedAt: row.resolved_at ? new Date(row.resolved_at).getTime() : undefined,
    };
}

// Convert TypeScript type to database insert format
function issueToRow(issue: IssueReport): Omit<IssueRow, 'id'> {
    return {
        type: issue.type,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        location: issue.location,
        department: issue.department,
        created_at: new Date(issue.createdAt).toISOString(),
        ai_confidence: issue.aiConfidence,
        assigned_to: issue.assignedTo || null,
        resolved_at: issue.resolvedAt ? new Date(issue.resolvedAt).toISOString() : null,
    };
}

// Fetch all issues from the database
export async function fetchAllIssues(): Promise<IssueReport[]> {
    const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching issues:', error);
        throw error;
    }

    return (data || []).map(rowToIssue);
}

// Create a new issue in the database
export async function createIssue(issue: IssueReport): Promise<IssueReport> {
    const row = issueToRow(issue);

    const { data, error } = await supabase
        .from('issues')
        .insert(row)
        .select()
        .single();

    if (error) {
        console.error('Error creating issue:', error);
        throw error;
    }

    return rowToIssue(data);
}

// Update issue status in the database
export async function updateIssueStatus(
    id: string,
    status: IssueStatus
): Promise<void> {
    const updateData: { status: string; resolved_at?: string | null } = { status };

    if (status === IssueStatus.RESOLVED) {
        updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
        .from('issues')
        .update(updateData)
        .eq('id', id);

    if (error) {
        console.error('Error updating issue status:', error);
        throw error;
    }
}
