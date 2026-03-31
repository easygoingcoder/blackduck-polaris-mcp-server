import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PolarisClient } from "../client/polaris-client.js";
import { registerPortfolioTools } from "./portfolio.js";
import { registerFindingsTools } from "./findings.js";
import { registerTestsTools } from "./tests.js";
import { registerReportsTools } from "./reports.js";
import { registerPoliciesTools } from "./policies.js";
import { registerScmTools } from "./scm.js";
import { registerBugTrackingTools } from "./bug-tracking.js";
import { registerAuditTools } from "./audit.js";
import { registerIamTools } from "./iam.js";
import { registerNotificationTools } from "./notifications.js";

export function registerAllTools(server: McpServer, client: PolarisClient): void {
  registerPortfolioTools(server, client);
  registerFindingsTools(server, client);
  registerTestsTools(server, client);
  registerReportsTools(server, client);
  registerPoliciesTools(server, client);
  registerScmTools(server, client);
  registerBugTrackingTools(server, client);
  registerAuditTools(server, client);
  registerIamTools(server, client);
  registerNotificationTools(server, client);
}
