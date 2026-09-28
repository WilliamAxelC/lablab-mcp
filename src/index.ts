import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { fileURLToPath } from "node:url";
import { createLablabServer } from "./mcp/server.js";
import { defaultLablabClient } from "./client.js";
import { generateBrainstormIdeas } from "./generators/brainstorm.js";

export * from "./types.js";
export * from "./client.js";
export * from "./parser.js";
export * from "./mcp/tools.js";
export * from "./mcp/resources.js";
export * from "./mcp/prompts.js";
export * from "./mcp/server.js";
export * from "./generators/brainstorm.js";
export * from "./generators/scaffold.js";

export async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--version") || args.includes("-v")) {
    console.log("lablab-mcp v1.0.0");
    process.exit(0);
  }

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
⚡ Lablab.ai Model Context Protocol (MCP) Server

Usage:
  npx lablab-mcp [options]
  node dist/index.js [options]

Modes:
  (default)           Run as an MCP server over stdio
  --status [user]     CLI check: display builder profile, points, and active hackathons
  --hackathons        CLI check: list active/upcoming hackathons
  --brainstorm <slug> CLI check: generate ideas for a hackathon
  --guidelines        CLI check: print official submission checklist

Options:
  -v, --version       Show server version
  -h, --help          Show this help message

Environment Variables:
  LABLAB_USER         Default Lablab.ai username (default: 'WilliamA')
`);
    process.exit(0);
  }

  // CLI shortcuts for human convenience
  if (args.includes("--status")) {
    const userIdx = args.indexOf("--status") + 1;
    const username = args[userIdx] && !args[userIdx].startsWith("-") ? args[userIdx] : undefined;
    const res = await defaultLablabClient.getUserProfile(username);
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  }

  if (args.includes("--hackathons")) {
    const hackathons = await defaultLablabClient.listHackathons("all", 10);
    console.log(JSON.stringify(hackathons, null, 2));
    process.exit(0);
  }

  if (args.includes("--brainstorm")) {
    const slugIdx = args.indexOf("--brainstorm") + 1;
    const slug = args[slugIdx];
    if (!slug) {
      console.error("Error: --brainstorm requires a hackathon slug.");
      process.exit(1);
    }
    const details = await defaultLablabClient.getHackathonDetails(slug);
    const ideas = generateBrainstormIdeas(details);
    console.log(JSON.stringify({ hackathon: details.name, concepts: ideas }, null, 2));
    process.exit(0);
  }

  if (args.includes("--guidelines")) {
    const guidelines = defaultLablabClient.getSubmissionGuidelines();
    console.log(JSON.stringify(guidelines, null, 2));
    process.exit(0);
  }

  // Default: Run as standard MCP stdio server
  const server = createLablabServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("[lablab-mcp] Server running on stdio.");
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1];
const isDirectRun =
  invokedFile &&
  (currentFile === invokedFile ||
    invokedFile.endsWith("lablab-mcp") ||
    invokedFile.endsWith("dist/index.js") ||
    invokedFile.endsWith("src/index.ts"));

if (isDirectRun) {
  main().catch((error) => {
    console.error("[lablab-mcp] Fatal error:", error);
    process.exit(1);
  });
}
