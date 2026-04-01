# blackduck-polaris-mcp-server

[![npm version](https://img.shields.io/npm/v/blackduck-polaris-mcp-server.svg)](https://www.npmjs.com/package/blackduck-polaris-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

The most comprehensive MCP (Model Context Protocol) server for **Black Duck Polaris**. Trigger SAST/SCA/DAST scans, query findings, triage issues, generate and download reports (SBOM, SPDX, CycloneDX), manage policies, and more — all from your AI coding assistant.

## Works With

Claude Code | Claude Desktop | GitHub Copilot | Copilot CLI | OpenCode | Cursor | Windsurf | VS Code (MCP extensions) | any MCP-compatible AI tool

## Quick Start

### Prerequisites

You need a Polaris API token. Generate one at **Profile > Account > Access Tokens** in your Polaris instance.

### Claude Code

```bash
claude mcp add blackduck-polaris -e POLARIS_URL=https://your-instance.polaris.blackduck.com -e POLARIS_API_TOKEN=your-token -- npx blackduck-polaris-mcp-server
```

### Claude Desktop (`claude_desktop_config.json`)

```json
{
  "mcpServers": {
    "blackduck-polaris": {
      "command": "npx",
      "args": ["blackduck-polaris-mcp-server"],
      "env": {
        "POLARIS_URL": "https://your-instance.polaris.blackduck.com",
        "POLARIS_API_TOKEN": "your-token"
      }
    }
  }
}
```

### VS Code (`.vscode/mcp.json`)

```json
{
  "servers": {
    "blackduck-polaris": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "blackduck-polaris-mcp-server"],
      "env": {
        "POLARIS_URL": "https://your-instance.polaris.blackduck.com",
        "POLARIS_API_TOKEN": "your-token"
      }
    }
  }
}
```

### Cursor (`.cursor/mcp.json` or `~/.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "blackduck-polaris": {
      "command": "npx",
      "args": ["-y", "blackduck-polaris-mcp-server"],
      "env": {
        "POLARIS_URL": "https://your-instance.polaris.blackduck.com",
        "POLARIS_API_TOKEN": "your-token"
      }
    }
  }
}
```

### GitHub Copilot CLI

**Option 1 — Config file (`~/.copilot/mcp-config.json`):**

```json
{
  "mcpServers": {
    "blackduck-polaris": {
      "type": "local",
      "command": "npx",
      "args": ["blackduck-polaris-mcp-server"],
      "env": {
        "POLARIS_URL": "https://your-instance.polaris.blackduck.com",
        "POLARIS_API_TOKEN": "your-token"
      }
    }
  }
}
```

**Option 2 — Inline for a single session:**

```bash
copilot --additional-mcp-config '{"blackduck-polaris":{"type":"local","command":"npx","args":["blackduck-polaris-mcp-server"],"env":{"POLARIS_URL":"https://your-instance.polaris.blackduck.com","POLARIS_API_TOKEN":"your-token"}}}'
```

### OpenCode

**Option 1 — Interactive:** Run `opencode mcp add` and follow the prompts.

**Option 2 — Config file (`~/.config/opencode/opencode.json` or `opencode.json` in project root):**

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "blackduck-polaris": {
      "type": "local",
      "enabled": true,
      "command": ["npx", "-y", "blackduck-polaris-mcp-server"],
      "environment": {
        "POLARIS_URL": "https://your-instance.polaris.blackduck.com",
        "POLARIS_API_TOKEN": "your-token"
      }
    }
  }
}
```

## Features — 66 Tools Across 10 Domains

### Portfolio Navigation (8 tools)

| Tool | Description |
|------|-------------|
| `polaris_list_portfolios` | List all portfolios |
| `polaris_list_applications` | List applications in a portfolio |
| `polaris_create_application` | Create new application |
| `polaris_update_application` | Update application |
| `polaris_delete_application` | Delete application |
| `polaris_list_projects` | List projects in an application |
| `polaris_create_project` | Create new project |
| `polaris_list_branches` | List branches in a project |

### Findings & Triage (10 tools)

| Tool | Description |
|------|-------------|
| `polaris_list_issues` | Query issues with RSQL filter (severity, tool, CWE, status) |
| `polaris_get_issue` | Get full issue details |
| `polaris_get_triage_history` | View triage audit trail |
| `polaris_get_detection_history` | View detection change history |
| `polaris_triage_issue` | Dismiss, change severity, assign, update status |
| `polaris_list_occurrences` | List issue occurrences with filter |
| `polaris_get_occurrence_snippet` | Get vulnerable source code snippet |
| `polaris_get_remediation` | AI-assisted remediation guidance (Black Duck Assist) |
| `polaris_submit_remediation_feedback` | Feedback on AI remediation quality |
| `polaris_get_issue_counts` | Aggregated issue counts by severity/type |

### Scans / Test Management (8 tools)

| Tool | Description |
|------|-------------|
| `polaris_trigger_scan` | **Trigger SAST/SCA/DAST scan on a branch** |
| `polaris_list_tests` | List scans with filter |
| `polaris_get_test` | Get scan status (QUEUED, RUNNING, COMPLETED, FAILED) |
| `polaris_cancel_test` | Cancel a running scan |
| `polaris_get_test_metrics` | Issue counts and metrics for a scan |
| `polaris_get_test_comments` | Get scan comments |
| `polaris_list_test_artifacts` | List scan artifacts |
| `polaris_create_test_artifact` | Upload artifact for external analysis |

### Reports (6 tools)

| Tool | Description |
|------|-------------|
| `polaris_list_report_types` | List all report types |
| `polaris_generate_report` | **Generate report (SBOM, SPDX, CycloneDX, executive summary, etc.)** |
| `polaris_list_reports` | List generated reports |
| `polaris_get_report_status` | Check report generation status |
| `polaris_download_report` | **Download completed report** |
| `polaris_delete_report` | Delete a report |

**Supported report types:** Developer Detail SCA, Developer Detail Static, Developer Detail Dynamic, Executive Summary, Issue Overview, Issue Summary, Security Audit, SBOM, SPDX v2.3, CycloneDX v1.4, CycloneDX v1.6, Standard Compliance, Standard Compliance Detail, Test Summary

### Policies (7 tools)

| Tool | Description |
|------|-------------|
| `polaris_list_issue_policies` | List issue policies |
| `polaris_create_issue_policy` | Create policy (build break, email, Jira ticket) |
| `polaris_update_issue_policy` | Update policy |
| `polaris_delete_issue_policy` | Delete policy |
| `polaris_list_scheduling_policies` | List test scheduling policies |
| `polaris_create_scheduling_policy` | Create automated scan schedule |
| `polaris_assign_policy` | Assign policy to project/application/branch |

### SCM / Repository Integration (7 tools)

| Tool | Description |
|------|-------------|
| `polaris_list_repos` | List connected repositories |
| `polaris_get_repo` | Get repository details |
| `polaris_update_repo` | Update repository settings |
| `polaris_list_repo_branches` | List repository branches |
| `polaris_test_repo_connection` | Test SCM connectivity |
| `polaris_bulk_import_repos` | Bulk import repos from SCM |
| `polaris_list_scm_providers` | List supported SCM providers |

### Bug Tracking Integration (5 tools)

| Tool | Description |
|------|-------------|
| `polaris_list_bugtracker_configs` | List Jira/Azure DevOps configurations |
| `polaris_create_bugtracker_config` | Create bug tracker integration |
| `polaris_update_bugtracker_config` | Update integration config |
| `polaris_export_issues_to_tracker` | **Export issues to Jira/Azure DevOps** |
| `polaris_test_jira_connection` | Test Jira connectivity |

### Audit (3 tools)

| Tool | Description |
|------|-------------|
| `polaris_get_audit_logs` | Query audit logs (category, user, date range) |
| `polaris_export_audit_logs` | Export audit logs as CSV |
| `polaris_list_audit_categories` | List audit event categories |

### Identity & Access Management (9 tools)

| Tool | Description |
|------|-------------|
| `polaris_list_users` | List organization users |
| `polaris_create_user` | Create user |
| `polaris_get_user` | Get user details |
| `polaris_update_user` | Update user role/details |
| `polaris_list_groups` | List groups |
| `polaris_create_group` | Create group |
| `polaris_get_current_user` | Get authenticated user info |
| `polaris_create_api_token` | Create API token |
| `polaris_create_service_account_token` | Create service account token |

### Notifications (3 tools)

| Tool | Description |
|------|-------------|
| `polaris_get_notification_preferences` | Get org notification preferences |
| `polaris_update_notification_preferences` | Update notification preferences |
| `polaris_get_notification_subscriptions` | Get user event subscriptions |

## Example Workflows

### Scan a branch and review findings

```
You: Trigger a SAST and SCA scan on the main branch of project X
AI: [calls polaris_trigger_scan] Scan triggered, test ID: abc-123

You: Check the scan status
AI: [calls polaris_get_test] Status: COMPLETED. 12 new issues found.

You: Show me the critical issues
AI: [calls polaris_list_issues with severity filter] Found 3 critical issues...

You: Show me the code for the first one
AI: [calls polaris_get_occurrence_snippet] Here's the vulnerable code at line 42...

You: Get remediation advice
AI: [calls polaris_get_remediation] Black Duck Assist suggests...
```

### Generate a compliance report

```
You: Generate an SPDX report for application Y
AI: [calls polaris_generate_report] Report queued, ID: rpt-456

You: Is it ready?
AI: [calls polaris_get_report_status] Status: COMPLETED

You: Download it
AI: [calls polaris_download_report] Here's your SPDX v2.3 report...
```

### Export issues to Jira

```
You: Show me all high-severity SAST issues
AI: [calls polaris_list_issues] Found 8 high-severity SAST issues

You: Export the first 3 to Jira
AI: [calls polaris_export_issues_to_tracker] 3 issues exported to Jira
```

## Comparison with Existing MCP Servers

| Feature | This Server | mtgibbs/polaris-mcp | @black-duck/mcp-server |
|---------|:-----------:|:-------------------:|:----------------------:|
| Portfolio navigation | Full CRUD | Read only | - |
| Issue querying | RSQL filters | Basic | - |
| Issue triage | Dismiss/assign/severity | - | - |
| AI remediation | Read + feedback | Read only | - |
| **Trigger scans** | **SAST/SCA/DAST** | **-** | **Local only** |
| **Report generation** | **14 types** | **-** | **-** |
| **Report download** | **PDF/JSON/XML** | **-** | **-** |
| **Policy management** | **Full CRUD** | **-** | **-** |
| SCM integration | Full | - | - |
| Bug tracker export | Jira/ADO | - | - |
| Audit logs | Query + CSV export | - | - |
| IAM | Users/groups/tokens | - | - |
| Notifications | Preferences | - | - |
| **Total tools** | **66** | **~10** | **~3** |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `POLARIS_URL` | Yes | Your Polaris instance URL (e.g., `https://polaris.blackduck.com`) |
| `POLARIS_API_TOKEN` | Yes | API token from Profile > Account > Access Tokens |

## Development

```bash
git clone https://github.com/your-username/blackduck-polaris-mcp-server.git
cd blackduck-polaris-mcp-server
npm install
npm run build
npm start
```

### Testing with MCP Inspector

```bash
POLARIS_URL=https://... POLARIS_API_TOKEN=... npx @modelcontextprotocol/inspector node build/index.js
```

## License

MIT
