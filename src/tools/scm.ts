import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerScmTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_list_repos",
    "List connected SCM repositories (GitHub, GitLab, Bitbucket, Azure DevOps)",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/integrations/repos", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_repo",
    "Get details for a specific connected repository",
    {
      repoId: z.string().describe("Repository ID"),
    },
    async (params) => {
      const result = await client.get(`/api/integrations/repos/${params.repoId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_update_repo",
    "Update settings for a connected repository",
    {
      repoId: z.string().describe("Repository ID"),
      settings: z.record(z.unknown()).describe("Settings to update"),
    },
    async (params) => {
      const result = await client.patch(`/api/integrations/repos/${params.repoId}`, params.settings);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_repo_branches",
    "List branches for a connected repository",
    {
      repoId: z.string().describe("Repository ID"),
    },
    async (params) => {
      const result = await client.get(`/api/integrations/repos/${params.repoId}/branches`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_test_repo_connection",
    "Test connectivity to an SCM provider",
    {
      connectionConfig: z.record(z.unknown()).describe("Connection configuration (url, token, provider type)"),
    },
    async (params) => {
      const result = await client.post("/api/integrations/repos/test-connection", params.connectionConfig);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_bulk_import_repos",
    "Bulk import repositories from an SCM provider into Polaris",
    {
      groupId: z.string().describe("SCM group/organization ID to import from"),
      repos: z.array(z.record(z.unknown())).optional().describe("Specific repos to import (omit to import all from group)"),
    },
    async (params) => {
      const result = await client.post("/api/integrations/repos/bulk-repo-import", {
        groupId: params.groupId,
        repos: params.repos,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_scm_providers",
    "List supported SCM providers (GitHub, GitLab, Bitbucket, Azure DevOps, etc.)",
    {
      repoId: z.string().optional().describe("Repository ID to get provider info for a specific repo"),
    },
    async (params) => {
      const query: Record<string, string | undefined> = {};
      if (params.repoId) query.repositoryId = params.repoId;
      const result = await client.get("/api/integrations/repos/providers", query);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
