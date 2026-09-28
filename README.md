# Lablab.ai Model Context Protocol (MCP) Server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B%20%7C%2022%2B-green?logo=node.js)](https://nodejs.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Protocol-purple)](https://modelcontextprotocol.io/)

Official Model Context Protocol (MCP) server for [Lablab.ai](https://lablab.ai). Connect AI assistants and coding agents directly to Lablab.ai hackathons, builder profile tracking, live event details, intelligent brainstorming, and project scaffolding.

---

## ✨ Features

* **⚡ Builder Status & Profile Tracking**: Inspect points, rank, active hackathons, and recent project submissions without needing API keys.
* **🎯 Live Event Intelligence**: Query active and upcoming AI hackathons, deadlines, countdown timers, prize pools ($ cash & credits), and sponsor APIs.
* **🧠 Competition-Grade Brainstorming**: Generate tailored, high-scoring hackathon project concepts with architectural diagrams (Mermaid), API integration blueprints, and 48-hour build plans.
* **🛠️ Automated Project Scaffolding**: Generate hackathon-ready repository boilerplates complete with README templates optimized for Lablab.ai judging rubrics.
* **📜 Official Guidelines & Rules**: Retrieve submission checklists, video pitch recommendations, and judging criteria directly into your AI context.

---

## 🚀 Quick Start

### Running with NPX
```bash
npx lablab-mcp
```

### CLI Mode (Direct Terminal Inspection)
You can also run `lablab-mcp` directly as a CLI tool:
```bash
# Check your builder status & active hackathons
npx lablab-mcp --status WilliamA

# List all featured and live hackathons
npx lablab-mcp --hackathons

# Brainstorm ideas for a specific hackathon
npx lablab-mcp --brainstorm assemblyai-voice-agent-hackathon

# Print official submission guidelines
npx lablab-mcp --guidelines
```

---

## ⚙️ Installation & Configuration

### 1. Claude Desktop
Add to your `claude_desktop_config.json` (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "lablab": {
      "command": "npx",
      "args": ["-y", "lablab-mcp"],
      "env": {
        "LABLAB_USER": "WilliamA"
      }
    }
  }
}
```

### 2. Antigravity / Gemini CLI
Add to your `mcp_config.json`:

```json
{
  "mcpServers": {
    "lablab": {
      "command": "node",
      "args": ["/home/agent/orca/lablab-mcp/dist/index.js"],
      "env": {
        "LABLAB_USER": "WilliamA"
      }
    }
  }
}
```

### 3. Cursor / Windsurf
Add to `.cursor/mcp.json` or your global MCP settings:

```json
{
  "mcpServers": {
    "lablab": {
      "command": "npx",
      "args": ["-y", "lablab-mcp"]
    }
  }
}
```

---

## 🛠️ MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `check_my_status` | `username` *(optional)* | Quick check of your active hackathons, deadlines, point totals, and recent project submissions. |
| `get_user_profile` | `username` *(optional)* | Full builder profile: bio, stats, rank, GitHub, website, enrolled events, and submissions. |
| `list_hackathons` | `limit` *(optional, default: 10)* | Lists live, upcoming, and featured AI hackathons on Lablab.ai. |
| `get_hackathon_details` | `hackathon_slug` *(required)* | Comprehensive event details: deadlines, prize breakdown, sponsor technologies, schedule, rules, and teams. |
| `brainstorm_ideas` | `hackathon_slug` *(req)*, `focus_areas`, `complexity`, `team_size` | Generates 3-4 structured, competition-grade project concepts tailored for judging pillars. |
| `scaffold_project` | `project_name` *(req)*, `hackathon_slug` *(req)*, `idea_title` *(req)*, `description` *(req)*, `primary_tech`, `target_dir` | Automatically scaffolds a complete hackathon repository directory with README, env, and boilerplate code. |
| `get_submission_guidelines` | *(none)* | Returns official project submission requirements, video pitch tips, and evaluation rubrics. |

---

## 📦 MCP Resources & Prompts

### Resources
* `lablab://profile/me` — Live JSON representation of your profile, active hackathons, and submissions.
* `lablab://hackathons/active` — Live JSON list of active/upcoming hackathons.
* `lablab://guidelines` — Official Lablab.ai submission checklist and evaluation criteria.

### Prompts
* `hackathon_brainstorm` — Interactive prompt guiding an AI agent through concept selection, architecture design, and sprint milestones for any Lablab hackathon.
* `submission_pitch_script` — Crafts a 2.5-minute video pitch script highlighting the problem statement, live demo cues, and sponsor API usage.

---

## 💻 Development

### Setup & Build
```bash
# Clone repository
git clone https://github.com/WilliamAxelC/lablab-mcp.git
cd lablab-mcp

# Install dependencies
pnpm install

# Run unit tests
pnpm test

# Build production bundle
pnpm build
```

---

## 📄 License

MIT License © 2026 [William Axel Cuangdinata](https://github.com/WilliamAxelC)
