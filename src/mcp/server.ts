import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { LablabClient, defaultLablabClient } from "../client.js";
import { TOOLS, handleToolCall } from "./tools.js";
import { listResources, readResource } from "./resources.js";
import { PROMPTS, handleGetPrompt } from "./prompts.js";

export function createLablabServer(client: LablabClient = defaultLablabClient): Server {
  const server = new Server(
    {
      name: "lablab-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  // Tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await handleToolCall(request.params.name, request.params.arguments, client);
  });

  // Resources
  server.setRequestHandler(ListResourcesRequestSchema, async () => {
    const resources = await listResources(client);
    return { resources };
  });

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    return await readResource(request.params.uri, client);
  });

  // Prompts
  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return { prompts: PROMPTS };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    return handleGetPrompt(request.params.name, request.params.arguments);
  });

  return server;
}
