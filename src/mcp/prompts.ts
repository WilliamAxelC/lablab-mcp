import { Prompt } from "@modelcontextprotocol/sdk/types.js";

export const PROMPTS: Prompt[] = [
  {
    name: "hackathon_brainstorm",
    description:
      "Interactive brainstorming prompt designed to generate and stress-test competitive AI hackathon ideas for a specific Lablab.ai event.",
    arguments: [
      {
        name: "hackathon_slug",
        description: "Slug of the hackathon (e.g. 'assemblyai-voice-agent-hackathon')",
        required: true,
      },
      {
        name: "focus_area",
        description: "Your domain or technical preference (e.g. 'dev tools', 'healthcare', 'voice assistant')",
        required: false,
      },
    ],
  },
  {
    name: "submission_pitch_script",
    description:
      "Generates a high-scoring 2 to 2.5 minute video demo script formatted to Lablab.ai judging criteria.",
    arguments: [
      {
        name: "project_name",
        description: "Name of your submitted project",
        required: true,
      },
      {
        name: "sponsor_tech",
        description: "The sponsor technology integrated (e.g. 'AssemblyAI Streaming STT')",
        required: true,
      },
    ],
  },
];

export function handleGetPrompt(
  name: string,
  args?: Record<string, string>
): {
  description?: string;
  messages: Array<{
    role: "user" | "assistant";
    content: { type: "text"; text: string };
  }>;
} {
  if (name === "hackathon_brainstorm") {
    const slug = args?.hackathon_slug || "active-hackathon";
    const focus = args?.focus_area ? `with a focus on ${args.focus_area}` : "";

    return {
      description: `Brainstorming session for ${slug}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `We are participating in the Lablab.ai hackathon '${slug}' ${focus}.
Please act as an elite hackathon mentor and advisor:
1. Review the required sponsor technology and judging pillars (Technical Depth, Business Viability, Creativity, Presentation).
2. Propose 3 high-impact project concepts that can be realistically built and deployed in 48 hours.
3. For the strongest concept, provide an architectural diagram, API integration plan, and a 48-hour build milestone schedule.`,
          },
        },
      ],
    };
  }

  if (name === "submission_pitch_script") {
    const project = args?.project_name || "My Hackathon Project";
    const tech = args?.sponsor_tech || "Sponsor AI API";

    return {
      description: `Video pitch script for ${project}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Write a compelling 2:30 minute video demo script for our Lablab.ai hackathon project '${project}' powered by ${tech}.
Structure:
- [0:00 - 0:25] The Hook & Real-world Problem
- [0:25 - 1:45] Live Demo Walkthrough (Screen Recording cues + Audio narration showing ${tech} in action)
- [1:45 - 2:10] Architecture & Technical Depth (Under the hood)
- [2:10 - 2:30] Business Impact, Open-Source link, and Closing call to action.`,
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
}
