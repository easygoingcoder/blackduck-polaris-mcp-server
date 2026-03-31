import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { PolarisClient } from "../client/polaris-client.js";

export function registerPoliciesTools(server: McpServer, client: PolarisClient): void {
  server.tool(
    "polaris_list_issue_policies",
    "List issue policies — post-scan rules that trigger actions like build breaks, email notifications, or Jira tickets",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/policies/issue-policies", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_issue_policy",
    "Create an issue policy with rules and actions (SEND_EMAIL, BREAK_THE_BUILD, CREATE_BUNDLE_JIRA_TICKET)",
    {
      name: z.string().describe("Policy name"),
      description: z.string().optional().describe("Policy description"),
      rules: z.array(z.record(z.unknown())).describe("Policy rules — conditions that trigger the policy"),
      actions: z.array(z.record(z.unknown())).describe("Actions to execute (e.g. [{type: 'BREAK_THE_BUILD'}])"),
      enabled: z.boolean().optional().describe("Whether the policy is active (default true)"),
    },
    async (params) => {
      const result = await client.post("/api/policies/issue-policies", {
        name: params.name,
        description: params.description,
        rules: params.rules,
        actions: params.actions,
        enabled: params.enabled ?? true,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_update_issue_policy",
    "Update an existing issue policy",
    {
      policyId: z.string().describe("Policy ID"),
      name: z.string().optional().describe("New policy name"),
      description: z.string().optional().describe("New description"),
      rules: z.array(z.record(z.unknown())).optional().describe("Updated rules"),
      actions: z.array(z.record(z.unknown())).optional().describe("Updated actions"),
      enabled: z.boolean().optional().describe("Enable or disable the policy"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.name !== undefined) body.name = params.name;
      if (params.description !== undefined) body.description = params.description;
      if (params.rules !== undefined) body.rules = params.rules;
      if (params.actions !== undefined) body.actions = params.actions;
      if (params.enabled !== undefined) body.enabled = params.enabled;
      const result = await client.put(`/api/policies/issue-policies/${params.policyId}`, body);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_delete_issue_policy",
    "Delete an issue policy",
    {
      policyId: z.string().describe("Policy ID"),
    },
    async (params) => {
      await client.delete(`/api/policies/issue-policies/${params.policyId}`);
      return { content: [{ type: "text", text: "Issue policy deleted successfully." }] };
    }
  );

  server.tool(
    "polaris_list_scheduling_policies",
    "List test scheduling policies — automated scan schedules for projects",
    {
      _limit: z.number().optional().describe("Max results to return (default 25)"),
      _offset: z.number().optional().describe("Offset for pagination (default 0)"),
    },
    async (params) => {
      const result = await client.getPaginated("/api/policies/test-scheduling-policies", {
        _limit: params._limit,
        _offset: params._offset,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_create_scheduling_policy",
    "Create a test scheduling policy to automate scans on a schedule",
    {
      name: z.string().describe("Policy name"),
      description: z.string().optional().describe("Policy description"),
      schedule: z.record(z.unknown()).describe("Schedule configuration (cron or interval-based)"),
      scanTypes: z.array(z.string()).optional().describe("Scan types to run (SAST, SCA, DAST)"),
    },
    async (params) => {
      const result = await client.post("/api/policies/test-scheduling-policies", {
        name: params.name,
        description: params.description,
        schedule: params.schedule,
        scanTypes: params.scanTypes,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "polaris_assign_policy",
    "Assign a policy to a project, application, or branch",
    {
      policyId: z.string().describe("Policy ID to assign"),
      targetId: z.string().describe("Target entity ID (project, application, or branch)"),
      targetType: z.string().describe("Target type (e.g. 'PROJECT', 'APPLICATION', 'BRANCH')"),
    },
    async (params) => {
      const result = await client.post("/api/policies/assignments", {
        policyId: params.policyId,
        targetId: params.targetId,
        targetType: params.targetType,
      });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }
  );
}
