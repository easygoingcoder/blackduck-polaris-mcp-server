import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerFindingsTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_list_issues",
    "List security issues. Requires either projectId or applicationId. Supports RSQL filter for severity, tool type, CWE, status, branch, and more. Example filter: severity='HIGH',toolType='SAST'",
    {
      projectId: z.string().optional().describe("Project ID (required if applicationId not set)"),
      applicationId: z.string().optional().describe("Application ID (required if projectId not set)"),
      branchId: z.string().optional().describe("Branch ID to filter issues"),
      _filter: z.string().optional().describe("RSQL filter expression (e.g. severity='HIGH',toolType='SAST')"),
      _sort: z.string().optional().describe("Sort field and direction (e.g. severity,desc)"),
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      if (!params.projectId && !params.applicationId) {
        return {
          content: [{ type: "text", text: "Error: Either projectId or applicationId must be provided." }],
          isError: true,
        };
      }
      const result = await client.getPaginated("/api/findings/issues", {
        projectId: params.projectId,
        applicationId: params.applicationId,
        branchId: params.branchId,
        _filter: params._filter,
        _sort: params._sort,
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_issue",
    "Get detailed information about a specific security issue. Requires projectId or applicationId",
    {
      issueId: z.string().describe("Issue ID"),
      projectId: z.string().optional().describe("Project ID (required if applicationId not set)"),
      applicationId: z.string().optional().describe("Application ID (required if projectId not set)"),
    },
    async (params) => {
      const result = await client.get(`/api/findings/issues/${params.issueId}`, {
        projectId: params.projectId,
        applicationId: params.applicationId,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_triage_history",
    "Get the triage/audit history for an issue — shows all status changes, dismissals, and assignments. Requires projectId or applicationId",
    {
      issueId: z.string().describe("Issue ID"),
      projectId: z.string().optional().describe("Project ID (required if applicationId not set)"),
      applicationId: z.string().optional().describe("Application ID (required if projectId not set)"),
    },
    async (params) => {
      const result = await client.get(`/api/findings/issues/${params.issueId}/triage-history`, {
        projectId: params.projectId,
        applicationId: params.applicationId,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_detection_history",
    "Get detection change history for an issue — shows when it was first/last detected and status transitions. Requires projectId or applicationId",
    {
      issueId: z.string().describe("Issue ID"),
      projectId: z.string().optional().describe("Project ID (required if applicationId not set)"),
      applicationId: z.string().optional().describe("Application ID (required if projectId not set)"),
    },
    async (params) => {
      const result = await client.get(`/api/findings/issues/${params.issueId}/detection-history`, {
        projectId: params.projectId,
        applicationId: params.applicationId,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_triage_issue",
    "Triage a security issue — dismiss, change severity, assign owner, or update status",
    {
      issueId: z.string().describe("Issue ID"),
      status: z.string().optional().describe("New status (e.g. 'DISMISSED', 'TO_FIX', 'MONITORING')"),
      severity: z.string().optional().describe("Override severity (e.g. 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW')"),
      owner: z.string().optional().describe("Assign to user (user ID or email)"),
      dismissReason: z.string().optional().describe("Reason for dismissal (e.g. 'FALSE_POSITIVE', 'INTENTIONAL', 'OTHER')"),
      comment: z.string().optional().describe("Triage comment"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.status !== undefined) body.status = params.status;
      if (params.severity !== undefined) body.severity = params.severity;
      if (params.owner !== undefined) body.owner = params.owner;
      if (params.dismissReason !== undefined) body.dismissReason = params.dismissReason;
      if (params.comment !== undefined) body.comment = params.comment;
      const result = await client.patch(`/api/findings/issues/${params.issueId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_occurrences",
    "List issue occurrences (specific code locations where issues were found). Requires either projectId or applicationId",
    {
      projectId: z.string().optional().describe("Project ID (required if applicationId not set)"),
      applicationId: z.string().optional().describe("Application ID (required if projectId not set)"),
      branchId: z.string().optional().describe("Branch ID to filter occurrences"),
      _filter: z.string().optional().describe("RSQL filter expression"),
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      if (!params.projectId && !params.applicationId) {
        return {
          content: [{ type: "text", text: "Error: Either projectId or applicationId must be provided." }],
          isError: true,
        };
      }
      const result = await client.getPaginated("/api/findings/occurrences", {
        projectId: params.projectId,
        applicationId: params.applicationId,
        branchId: params.branchId,
        _filter: params._filter,
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_occurrence_snippet",
    "Get the source code snippet for an issue occurrence — shows the vulnerable code in context",
    {
      occurrenceId: z.string().describe("Occurrence ID"),
    },
    async (params) => {
      const result = await client.get(`/api/findings/occurrences/${params.occurrenceId}/snippet`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_remediation",
    "Get AI-assisted remediation guidance for an issue occurrence (Black Duck Assist)",
    {
      occurrenceId: z.string().describe("Occurrence ID"),
    },
    async (params) => {
      const result = await client.get(`/api/findings/occurrences/${params.occurrenceId}/assist`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_submit_remediation_feedback",
    "Submit feedback on AI remediation advice quality",
    {
      occurrenceId: z.string().describe("Occurrence ID"),
      assistId: z.string().describe("Assist response ID"),
      helpful: z.boolean().describe("Whether the remediation was helpful"),
      comment: z.string().optional().describe("Additional feedback comment"),
    },
    async (params) => {
      const result = await client.patch(
        `/api/findings/occurrences/${params.occurrenceId}/assist/${params.assistId}`,
        { helpful: params.helpful, comment: params.comment }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_issue_counts",
    "Get aggregated issue counts — useful for dashboards and quick severity overviews. Requires projectId or applicationId",
    {
      projectId: z.string().optional().describe("Project ID (required if applicationId not set)"),
      applicationId: z.string().optional().describe("Application ID (required if projectId not set)"),
      branchId: z.string().optional().describe("Branch ID to filter counts"),
      _filter: z.string().optional().describe("RSQL filter to scope the counts (e.g. toolType='SAST')"),
    },
    async (params) => {
      if (!params.projectId && !params.applicationId) {
        return {
          content: [{ type: "text", text: "Error: Either projectId or applicationId must be provided." }],
          isError: true,
        };
      }
      const result = await client.get("/api/findings/issues", {
        projectId: params.projectId,
        applicationId: params.applicationId,
        branchId: params.branchId,
        _filter: params._filter,
        _limit: 0,
        _includeCount: true,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
