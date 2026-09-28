import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { LablabClient } from "../client.js";
import { generateBrainstormIdeas } from "../generators/brainstorm.js";
import { scaffoldHackathonProject } from "../generators/scaffold.js";

export const TOOLS: Tool[] = [
  {
    name: "check_my_status",
    description:
      "Quickly check what you currently have going on on Lablab.ai, including active hackathons, deadlines countdown, rank, points, and recent submissions.",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "Optional Lablab.ai username (e.g. 'WilliamA'). Defaults to configured user.",
        },
      },
    },
  },
  {
    name: "get_user_profile",
    description:
      "Fetch full details for any Lablab.ai builder profile: points, rank, bio, GitHub, social links, enrolled hackathons, and submitted projects.",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "Lablab.ai username with or without '@' (e.g., 'WilliamA').",
        },
      },
    },
  },
  {
    name: "list_hackathons",
    description:
      "List live, upcoming, and featured AI hackathons on Lablab.ai with slugs, titles, and event URLs.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of hackathons to return (default: 10).",
        },
      },
    },
  },
  {
    name: "get_hackathon_details",
    description:
      "Get comprehensive details about a specific Lablab.ai hackathon: deadlines, time remaining, prize breakdown, sponsor technologies, schedule, rules, and registered teams.",
    inputSchema: {
      type: "object",
      properties: {
        hackathon_slug: {
          type: "string",
          description:
            "Slug of the hackathon (e.g., 'assemblyai-voice-agent-hackathon', 'amd-lablab-ai-academy-challenge').",
        },
      },
      required: ["hackathon_slug"],
    },
  },
  {
    name: "brainstorm_ideas",
    description:
      "Generate high-scoring, tailored hackathon project concepts for a specific Lablab.ai event based on its sponsor technologies, problem space, and judging criteria.",
    inputSchema: {
      type: "object",
      properties: {
        hackathon_slug: {
          type: "string",
          description: "Slug of the hackathon to brainstorm for.",
        },
        focus_areas: {
          type: "array",
          items: { type: "string" },
          description: "Optional areas of interest (e.g., ['devops', 'voice-agents', 'healthcare']).",
        },
        complexity: {
          type: "string",
          enum: ["mvp", "balanced", "ambitious"],
          description: "Desired scope and complexity of the ideas (default: 'balanced').",
        },
        team_size: {
          type: "number",
          description: "Number of builders on the team (e.g., 1 for solo, 2-4 for team).",
        },
      },
      required: ["hackathon_slug"],
    },
  },
  {
    name: "scaffold_project",
    description:
      "Scaffold a complete hackathon project directory with a Lablab-ready README, architecture spec, environment config, and boilerplate code.",
    inputSchema: {
      type: "object",
      properties: {
        project_name: {
          type: "string",
          description: "Folder / repository name to create (e.g., 'voice-incident-bridge').",
        },
        hackathon_slug: {
          type: "string",
          description: "Slug of the hackathon this project is built for.",
        },
        idea_title: {
          type: "string",
          description: "Full title of the project idea.",
        },
        description: {
          type: "string",
          description: "Problem statement and description of the solution.",
        },
        primary_tech: {
          type: "string",
          description: "Primary sponsor technology / API used (e.g., 'AssemblyAI Streaming STT').",
        },
        target_dir: {
          type: "string",
          description: "Parent directory where the project folder should be created.",
        },
      },
      required: ["project_name", "hackathon_slug", "idea_title", "description"],
    },
  },
  {
    name: "get_submission_guidelines",
    description:
      "Get the official Lablab.ai hackathon submission checklist, video pitch requirements, repository criteria, and tips to maximize judging scores.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

export async function handleToolCall(
  name: string,
  args: any,
  client: LablabClient
): Promise<{ content: Array<{ type: "text"; text: string }>; isError?: boolean }> {
  try {
    switch (name) {
      case "check_my_status": {
        const result = await client.getUserProfile(args?.username);
        const { profile, activeHackathons, recentSubmissions } = result;

        const output = {
          message: `Status check for @${profile.userName}`,
          builder: {
            name: profile.fullName,
            points: profile.totalPoints,
            rank: profile.rank,
            github: profile.githubUrl,
            profileUrl: profile.profileUrl,
          },
          activeHackathons: activeHackathons.map((h) => ({
            name: h.name,
            slug: h.slug,
            deadline: h.endAt,
            timeLeft: h.timeLeft,
            url: h.url,
            summary: h.summary,
          })),
          recentSubmissions: recentSubmissions.map((s) => ({
            project: s.title,
            event: s.eventSlug,
            url: s.url,
            date: s.createdAt,
          })),
        };

        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        };
      }

      case "get_user_profile": {
        const result = await client.getUserProfile(args?.username);
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "list_hackathons": {
        const limit = typeof args?.limit === "number" ? args.limit : 10;
        const hackathons = await client.listHackathons("all", limit);
        return {
          content: [{ type: "text", text: JSON.stringify(hackathons, null, 2) }],
        };
      }

      case "get_hackathon_details": {
        if (!args?.hackathon_slug) {
          return {
            content: [{ type: "text", text: "Error: 'hackathon_slug' is required." }],
            isError: true,
          };
        }
        const details = await client.getHackathonDetails(args.hackathon_slug);
        return {
          content: [{ type: "text", text: JSON.stringify(details, null, 2) }],
        };
      }

      case "brainstorm_ideas": {
        if (!args?.hackathon_slug) {
          return {
            content: [{ type: "text", text: "Error: 'hackathon_slug' is required." }],
            isError: true,
          };
        }
        const details = await client.getHackathonDetails(args.hackathon_slug);
        const ideas = generateBrainstormIdeas(details, {
          focusAreas: args.focus_areas,
          complexity: args.complexity,
          teamSize: args.team_size,
        });

        const output = {
          hackathon: {
            name: details.name,
            slug: details.slug,
            deadline: details.endAt,
            timeLeft: details.timeLeft,
            technologies: details.technologies,
            prizePool: details.prizePool,
          },
          generatedConceptsCount: ideas.length,
          concepts: ideas,
        };

        return {
          content: [{ type: "text", text: JSON.stringify(output, null, 2) }],
        };
      }

      case "scaffold_project": {
        const result = await scaffoldHackathonProject({
          projectName: args.project_name,
          hackathonSlug: args.hackathon_slug,
          ideaTitle: args.idea_title,
          description: args.description,
          primaryTech: args.primary_tech,
          targetDir: args.target_dir,
        });

        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }

      case "get_submission_guidelines": {
        const guidelines = client.getSubmissionGuidelines();
        return {
          content: [{ type: "text", text: JSON.stringify(guidelines, null, 2) }],
        };
      }

      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error executing ${name}: ${error.message}` }],
      isError: true,
    };
  }
}
