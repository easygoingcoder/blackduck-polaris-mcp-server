#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { loadConfig } from "./config.js";
import { createServer } from "./server.js";

async function main(): Promise<void> {
  try {
    const config = loadConfig();
    const server = createServer(config);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Black Duck Polaris MCP server running on stdio");
  } catch (error) {
    console.error("Failed to start server:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
