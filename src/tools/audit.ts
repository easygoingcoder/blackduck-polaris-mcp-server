import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerAuditTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_get_audit_logs",
    "Query audit logs — filter by category, event type, user, date range. Retention: 30 days",
    {
      category: z.string().optional().describe("Filter by audit category"),
      event: z.string().optional().describe("Filter by event type"),
      user: z.string().optional().describe("Filter by user"),
      fromDate: z.string().optional().describe("Start date (yyyy-MM-dd)"),
      toDate: z.string().optional().describe("End date (yyyy-MM-dd)"),
      search: z.string().optional().describe("Free-text search"),
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/audit/logs", {
        category: params.category,
        event: params.event,
        user: params.user,
        fromDate: params.fromDate,
        toDate: params.toDate,
        search: params.search,
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_export_audit_logs",
    "Export audit logs as CSV — same filters as query",
    {
      category: z.string().optional().describe("Filter by audit category"),
      event: z.string().optional().describe("Filter by event type"),
      user: z.string().optional().describe("Filter by user"),
      fromDate: z.string().optional().describe("Start date (yyyy-MM-dd)"),
      toDate: z.string().optional().describe("End date (yyyy-MM-dd)"),
    },
    async (params) => {
      const result = await client.get<string>("/api/audit/logs/export", {
        category: params.category,
        event: params.event,
        user: params.user,
        fromDate: params.fromDate,
        toDate: params.toDate,
      });
      return { content: [{ type: "text", text: typeof result === "string" ? result : JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_audit_categories",
    "List all available audit event categories",
    {},
    async () => {
      const result = await client.get("/api/audit/categories");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
