import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerNotificationTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_get_notification_preferences",
    "Get organization-level notification preferences (email, Slack channels)",
    {},
    async () => {
      const result = await client.get("/api/notification/organization-preferences");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_update_notification_preferences",
    "Update organization-level notification preferences",
    {
      preferences: z.record(z.unknown()).describe("Notification preferences object to update"),
    },
    async (params) => {
      const result = await client.patch("/api/notification/organization-preferences", params.preferences);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_get_notification_subscriptions",
    "Get current user's event group notification subscriptions",
    {},
    async () => {
      const result = await client.get("/api/notification/subscriptions/event-groups");
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
