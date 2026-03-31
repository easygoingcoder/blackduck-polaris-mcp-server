import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerPortfolioTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_list_portfolios",
    "List all portfolios the authenticated user has access to",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/portfolios", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_applications",
    "List applications within a portfolio",
    {
      portfolioId: z.string().describe("Portfolio ID"),
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated(
        `/api/portfolios/${params.portfolioId}/applications`,
        { _limit: params._limit, _offset: params._offset }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_application",
    "Create a new application within a portfolio",
    {
      portfolioId: z.string().describe("Portfolio ID"),
      name: z.string().describe("Application name"),
      description: z.string().optional().describe("Application description"),
    },
    async (params) => {
      const result = await client.post(`/api/portfolios/${params.portfolioId}/applications`, {
        name: params.name,
        description: params.description,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_update_application",
    "Update an existing application",
    {
      portfolioId: z.string().describe("Portfolio ID"),
      applicationId: z.string().describe("Application ID"),
      name: z.string().optional().describe("New application name"),
      description: z.string().optional().describe("New description"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.name !== undefined) body.name = params.name;
      if (params.description !== undefined) body.description = params.description;
      const result = await client.patch(
        `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}`,
        body
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_delete_application",
    "Delete an application from a portfolio",
    {
      portfolioId: z.string().describe("Portfolio ID"),
      applicationId: z.string().describe("Application ID"),
    },
    async (params) => {
      await client.delete(`/api/portfolios/${params.portfolioId}/applications/${params.applicationId}`);
      return { content: [{ type: "text", text: "Application deleted successfully." }] };
    }
  );

  server.tool(
    "polaris_list_projects",
    "List projects within an application",
    {
      portfolioId: z.string().describe("Portfolio ID"),
      applicationId: z.string().describe("Application ID"),
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated(
        `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects`,
        { _limit: params._limit, _offset: params._offset }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_project",
    "Create a new project within an application",
    {
      portfolioId: z.string().describe("Portfolio ID"),
      applicationId: z.string().describe("Application ID"),
      name: z.string().describe("Project name"),
      description: z.string().optional().describe("Project description"),
    },
    async (params) => {
      const result = await client.post(
        `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects`,
        { name: params.name, description: params.description }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_branches",
    "List branches within a project",
    {
      portfolioId: z.string().describe("Portfolio ID"),
      applicationId: z.string().describe("Application ID"),
      projectId: z.string().describe("Project ID"),
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated(
        `/api/portfolios/${params.portfolioId}/applications/${params.applicationId}/projects/${params.projectId}/branches`,
        { _limit: params._limit, _offset: params._offset }
      );
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
