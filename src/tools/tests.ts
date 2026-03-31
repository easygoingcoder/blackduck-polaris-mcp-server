import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerTestsTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_trigger_scan",
    "Trigger a SAST, SCA, DAST, or EXTERNAL_ANALYSIS scan on a specific branch. Returns immediately with test ID — use polaris_get_test to poll status",
    {
      projectId: z.string().describe("Project ID to scan"),
      branchId: z.string().describe("Branch ID to scan"),
      scanTypes: z.array(z.enum(["SAST", "SCA", "DAST", "EXTERNAL_ANALYSIS"])).describe("Types of scan to run"),
    },
    async (params) => {
      const result = await client.post("/api/tests", {
        projectId: params.projectId,
        branchId: params.branchId,
        scanTypes: params.scanTypes,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_tests",
    "List tests/scans with optional RSQL filter. Filter by status, project, branch, scan type",
    {
      _filter: z.string().optional().describe("RSQL filter (e.g. status='COMPLETED',projectId=='<id>')"),
      _sort: z.string().optional().describe("Sort field and direction"),
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/tests", {
        _filter: params._filter,
        _sort: params._sort,
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_test",
    "Get test/scan details including current status (QUEUED, RUNNING, COMPLETED, FAILED, CANCELLED)",
    {
      testId: z.string().describe("Test ID"),
    },
    async (params) => {
      const result = await client.get(`/api/tests/${params.testId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_cancel_test",
    "Cancel a running or queued test/scan",
    {
      testId: z.string().describe("Test ID to cancel"),
    },
    async (params) => {
      const result = await client.patch(`/api/tests/${params.testId}`, {
        _action: "CANCEL",
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_test_metrics",
    "Get metrics for a completed test — issue counts by severity, new vs existing issues",
    {
      testId: z.string().describe("Test ID"),
    },
    async (params) => {
      const result = await client.get(`/api/tests/${params.testId}/test-metrics`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_test_comments",
    "Get comments on a test/scan",
    {
      testId: z.string().describe("Test ID"),
    },
    async (params) => {
      const result = await client.get(`/api/tests/${params.testId}/comments`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_test_artifacts",
    "List artifacts from a test/scan (logs, intermediate results)",
    {
      testId: z.string().describe("Test ID"),
    },
    async (params) => {
      const result = await client.get(`/api/tests/${params.testId}/artifacts`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_test_artifact",
    "Upload a test artifact (for EXTERNAL_ANALYSIS scans)",
    {
      testId: z.string().describe("Test ID"),
      name: z.string().describe("Artifact name"),
      type: z.string().describe("Artifact type"),
      content: z.string().describe("Artifact content (base64 encoded for binary)"),
    },
    async (params) => {
      const result = await client.post("/api/tests/artifacts", {
        testId: params.testId,
        name: params.name,
        type: params.type,
        content: params.content,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
