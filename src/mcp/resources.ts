import { Resource } from "@modelcontextprotocol/sdk/types.js";
import { LablabClient } from "../client.js";

export async function listResources(client: LablabClient): Promise<Resource[]> {
  return [
    {
      uri: "lablab://profile/me",
      name: "My Lablab.ai Profile & Status",
      mimeType: "application/json",
      description: "Active hackathons, deadlines, point totals, and recent project submissions.",
    },
    {
      uri: "lablab://hackathons/active",
      name: "Active Lablab.ai Hackathons",
      mimeType: "application/json",
      description: "List of currently active and upcoming AI hackathons on Lablab.ai.",
    },
    {
      uri: "lablab://guidelines",
      name: "Lablab.ai Submission & Judging Guidelines",
      mimeType: "application/json",
      description: "Official rules, judging rubrics, and deliverable checklists for hackathon submissions.",
    },
  ];
}

export async function readResource(
  uri: string,
  client: LablabClient
): Promise<{ contents: Array<{ uri: string; mimeType?: string; text: string }> }> {
  if (uri === "lablab://profile/me" || uri.startsWith("lablab://profile/")) {
    const username = uri === "lablab://profile/me" ? undefined : uri.replace("lablab://profile/", "");
    const profile = await client.getUserProfile(username);
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(profile, null, 2),
        },
      ],
    };
  }

  if (uri === "lablab://hackathons/active" || uri === "lablab://hackathons") {
    const hackathons = await client.listHackathons("active", 10);
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(hackathons, null, 2),
        },
      ],
    };
  }

  if (uri === "lablab://guidelines") {
    const guidelines = client.getSubmissionGuidelines();
    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: JSON.stringify(guidelines, null, 2),
        },
      ],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
}
