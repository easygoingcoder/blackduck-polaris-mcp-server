import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { PolarisConfig } from "./config.js";
import { PolarisClient } from "./client/polaris-client.js";
import { registerAllTools } from "./tools/index.js";

export function createServer(config: PolarisConfig): McpServer {
  const server = new McpServer({
    name: "blackduck-polaris-mcp-server",
    version: "0.1.0",
  });

  const client = new PolarisClient(config);

  registerAllTools(server, client);

  return server;
}
