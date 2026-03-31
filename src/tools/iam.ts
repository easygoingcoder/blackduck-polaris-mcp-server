import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerIamTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_list_users",
    "List users in the organization",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/ciam/users", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_user",
    "Create a new user in the organization",
    {
      email: z.string().describe("User email address"),
      name: z.string().optional().describe("User display name"),
      role: z.string().optional().describe("Organization role to assign"),
    },
    async (params) => {
      const result = await client.post("/api/ciam/users", {
        email: params.email,
        name: params.name,
        role: params.role,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_user",
    "Get details for a specific user",
    {
      userId: z.string().describe("User ID"),
    },
    async (params) => {
      const result = await client.get(`/api/ciam/users/${params.userId}`);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_update_user",
    "Update a user's details or role",
    {
      userId: z.string().describe("User ID"),
      name: z.string().optional().describe("New display name"),
      role: z.string().optional().describe("New role"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.name !== undefined) body.name = params.name;
      if (params.role !== undefined) body.role = params.role;
      const result = await client.patch(`/api/ciam/users/${params.userId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_list_groups",
    "List groups in the organization",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/ciam/groups", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_group",
    "Create a new group in the organization",
    {
      name: z.string().describe("Group name"),
      description: z.string().optional().describe("Group description"),
    },
    async (params) => {
      const result = await client.post("/api/ciam/groups", {
        name: params.name,
        description: params.description,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_current_user",
    "Get the authenticated user's information (OpenID Connect user-info)",
    {},
    async () => {
      const result = await client.get("/api/ciam/openid-connect/userinfo");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_api_token",
    "Create a new API token for the authenticated user",
    {
      name: z.string().describe("Token name/description"),
    },
    async (params) => {
      const result = await client.post("/api/ciam/tokens", {
        name: params.name,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_service_account_token",
    "Create a service account token for automation",
    {
      name: z.string().describe("Service account name"),
      role: z.string().optional().describe("Role for the service account"),
    },
    async (params) => {
      const result = await client.post("/api/ciam/service-account-tokens", {
        name: params.name,
        role: params.role,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
