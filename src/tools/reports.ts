import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerReportsTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_list_report_types",
    "List all available report types: Developer detail SCA/Static/Dynamic, Executive summary, Issue overview/summary, Security audit, SBOM, SPDX v2.3, CycloneDX v1.4/v1.6, Standard compliance, Test summary",
    {},
    async () => {
      const result = await client.get("/api/insights/reports/report-types");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_generate_report",
    "Generate a report. Returns immediately with report ID — use polaris_get_report_status to poll. Supported types: developer-detail-sca, developer-detail-static, executive-summary, issue-overview, issue-summary, security-audit, sbom, spdx-v2.3, cyclonedx-v1.4, cyclonedx-v1.6, standard-compliance, standard-compliance-detail, test-summary, developer-detail-dynamic",
    {
      reportType: z.string().describe("Report type slug (e.g. 'sbom', 'executive-summary', 'spdx-v2.3', 'cyclonedx-v1.6')"),
      parameters: z.record(z.unknown()).describe("Report parameters — varies by type. Common: applicationIds, projectIds, branchIds, toolTypes, severities"),
    },
    async (params) => {
      const result = await client.post(
        `/api/insights/reports/${params.reportType}/_actions/run`,
        params.parameters
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_reports",
    "List previously generated reports with optional filters",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/insights/reports", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_report_status",
    "Check the status of a report generation job (PENDING, RUNNING, COMPLETED, FAILED)",
    {
      reportId: z.string().describe("Report ID"),
    },
    async (params) => {
      const result = await client.get(`/api/insights/reports/${params.reportId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_download_report",
    "Download a completed report. Returns the report content (text for JSON/XML formats like SPDX/CycloneDX, base64 for binary formats like PDF)",
    {
      reportId: z.string().describe("Report ID"),
    },
    async (params) => {
      const result = await client.downloadBinary(
        `/api/insights/reports/${params.reportId}/_actions/download`
      );

      const isText =
        result.contentType.includes("json") ||
        result.contentType.includes("xml") ||
        result.contentType.includes("csv") ||
        result.contentType.includes("text");

      if (isText) {
        return {
          content: [
            {
              type: "text",
              text: result.content.toString("utf-8"),
            },
          ],
        };
      }

      const sizeWarning =
        result.content.length > 5 * 1024 * 1024
          ? "\n\n⚠️ Report is large (>5MB). Consider downloading directly via the Polaris API."
          : "";

      return {
        content: [
          {
            type: "text",
            text: `Report downloaded (${result.contentType}, ${result.content.length} bytes${result.filename ? `, filename: ${result.filename}` : ""}).\n\nBase64 content:\n${result.content.toString("base64")}${sizeWarning}`,
          },
        ],
      };
    }
  );

  server.tool(
    "polaris_delete_report",
    "Delete a generated report",
    {
      reportId: z.string().describe("Report ID"),
    },
    async (params) => {
      await client.delete(`/api/insights/reports/${params.reportId}`);
      return { content: [{ type: "text", text: "Report deleted successfully." }] };
    }
  );
}
