import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerBugTrackingTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_list_bugtracker_configs",
    "List bug tracker integration configurations (Jira, Azure DevOps)",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/integrations/bugtracking/configurations", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_bugtracker_config",
    "Create a new Jira or Azure DevOps integration configuration",
    {
      name: z.string().describe("Configuration name"),
      type: z.string().describe("Integration type ('JIRA' or 'AZURE_DEVOPS')"),
      url: z.string().describe("Bug tracker URL"),
      credentials: z.record(z.unknown()).describe("Authentication credentials (token, username, etc.)"),
      projectKey: z.string().optional().describe("Default project key for ticket creation"),
      issueType: z.string().optional().describe("Default issue type"),
    },
    async (params) => {
      const result = await client.post("/api/integrations/bugtracking/configurations", {
        name: params.name,
        type: params.type,
        url: params.url,
        credentials: params.credentials,
        projectKey: params.projectKey,
        issueType: params.issueType,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_update_bugtracker_config",
    "Update an existing bug tracker integration configuration",
    {
      configurationId: z.string().describe("Configuration ID"),
      updates: z.record(z.unknown()).describe("Fields to update"),
    },
    async (params) => {
      const result = await client.patch(
        `/api/integrations/bugtracking/configurations/${params.configurationId}`,
        params.updates
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_export_issues_to_tracker",
    "Export security issues to Jira or Azure DevOps as tickets",
    {
      configurationId: z.string().describe("Bug tracker configuration ID"),
      issueIds: z.array(z.string()).describe("Issue IDs to export"),
    },
    async (params) => {
      const result = await client.post(
        `/api/integrations/bugtracking/configurations/${params.configurationId}/issues-export`,
        { issueIds: params.issueIds }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_test_jira_connection",
    "Test connectivity to a Jira instance",
    {
      url: z.string().describe("Jira instance URL"),
      credentials: z.record(z.unknown()).describe("Jira credentials (token, username)"),
    },
    async (params) => {
      const result = await client.post("/api/integrations/bugtracking/jira/test-connection", {
        url: params.url,
        credentials: params.credentials,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
