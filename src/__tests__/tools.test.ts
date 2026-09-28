import { describe, it, expect } from "vitest";
import { TOOLS, handleToolCall } from "../mcp/tools.js";
import { LablabClient } from "../client.js";

describe("TOOLS definition", () => {
  it("registers all expected MCP tools", () => {
    const toolNames = TOOLS.map((t) => t.name);
    expect(toolNames).toContain("check_my_status");
    expect(toolNames).toContain("get_user_profile");
    expect(toolNames).toContain("list_hackathons");
    expect(toolNames).toContain("get_hackathon_details");
    expect(toolNames).toContain("brainstorm_ideas");
    expect(toolNames).toContain("scaffold_project");
    expect(toolNames).toContain("get_submission_guidelines");
  });
});

describe("handleToolCall", () => {
  const client = new LablabClient("WilliamA");

  it("returns submission guidelines without error", async () => {
    const res = await handleToolCall("get_submission_guidelines", {}, client);
    expect(res.isError).toBeFalsy();
    const data = JSON.parse(res.content[0].text);
    expect(data.deliverablesChecklist).toBeDefined();
    expect(data.deliverablesChecklist.length).toBeGreaterThan(0);
  });

  it("handles unknown tool gracefully", async () => {
    const res = await handleToolCall("non_existent_tool", {}, client);
    expect(res.isError).toBe(true);
    expect(res.content[0].text).toContain("Unknown tool");
  });
});
