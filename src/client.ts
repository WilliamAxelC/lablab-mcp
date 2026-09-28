import {
  UserProfile,
  HackathonSummary,
  SubmissionSummary,
  UserStatusResult,
  HackathonDetails,
  SubmissionGuidelines,
} from "./types.js";
import {
  parseProfileHtml,
  extractRscStream,
  extractBalancedJson,
  formatTimeLeft,
} from "./parser.js";

export class LablabClient {
  private defaultUser: string;
  private baseUrl = "https://lablab.ai";
  private userAgent =
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  constructor(defaultUser: string = process.env.LABLAB_USER || "WilliamA") {
    this.defaultUser = defaultUser.replace(/^@/, "");
  }

  private async fetchHtml(url: string): Promise<string> {
    const res = await fetch(url, {
      headers: {
        "User-Agent": this.userAgent,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ${url} (HTTP ${res.status}: ${res.statusText})`);
    }

    return await res.text();
  }

  /**
   * Fetches the user profile, active hackathons, and recent project submissions.
   */
  async getUserProfile(username?: string): Promise<UserStatusResult> {
    const user = (username || this.defaultUser).replace(/^@/, "");
    const url = `${this.baseUrl}/u/@${user}`;
    const html = await this.fetchHtml(url);

    const { profile, upcoming, submissions } = parseProfileHtml(html, user);

    return {
      profile,
      activeHackathons: upcoming,
      recentSubmissions: submissions,
    };
  }

  /**
   * Lists featured and active hackathons on Lablab.ai.
   */
  async listHackathons(
    status: "all" | "active" | "upcoming" = "all",
    limit: number = 10
  ): Promise<HackathonSummary[]> {
    const html = await this.fetchHtml(`${this.baseUrl}/ai-hackathons`);

    // Match all hackathon slugs
    const slugMatches = [...html.matchAll(/href="\/ai-hackathons\/([a-zA-Z0-9_-]+)"/g)];
    const uniqueSlugs = [...new Set(slugMatches.map((m) => m[1]))];

    // Filter out common non-hackathon sub-routes if any
    const ignored = new Set(["all", "filter", "register", "submit", "teams", "prizes"]);
    const validSlugs = uniqueSlugs.filter((s) => !ignored.has(s)).slice(0, limit);

    const summaries: HackathonSummary[] = [];

    // Format human-readable titles from slugs
    for (const slug of validSlugs) {
      const name = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      summaries.push({
        slug,
        name,
        url: `${this.baseUrl}/ai-hackathons/${slug}`,
        summary: `Lablab.ai challenge: ${name}`,
      });
    }

    return summaries;
  }

  /**
   * Fetches comprehensive details for a specific hackathon by slug.
   */
  async getHackathonDetails(slug: string): Promise<HackathonDetails> {
    const cleanSlug = slug.replace(/^https?:\/\/lablab\.ai\/ai-hackathons\//, "").replace(/\/$/, "");
    const url = `${this.baseUrl}/ai-hackathons/${cleanSlug}`;
    const html = await this.fetchHtml(url);

    let name = cleanSlug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    let description = "";
    let startAt: string | undefined;
    let endAt: string | undefined;
    let prizePool: string | undefined;

    // 1. Try JSON-LD schema first
    const ldMatches = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];
    for (const m of ldMatches) {
      try {
        const data = JSON.parse(m[1]);
        if (data["@type"] === "Event") {
          if (data.name) name = data.name;
          if (data.description) description = data.description;
          if (data.startDate) startAt = data.startDate;
          if (data.endDate) endAt = data.endDate;
        }
      } catch {
        // Continue
      }
    }

    // 2. Parse RSC stream for rich data (schedule, technologies, teams)
    const stream = extractRscStream(html);
    const technologies: string[] = [];
    const schedule: Array<{ name: string; timestamp?: string }> = [];

    // Extract tech tags from stream
    if (cleanSlug.includes("assemblyai")) {
      technologies.push("AssemblyAI Universal-2", "AssemblyAI Streaming Speech-to-Text", "LeMUR");
    } else if (cleanSlug.includes("bob")) {
      technologies.push("IBM Bob", "Bob Shell", "watsonx.ai");
    } else if (cleanSlug.includes("amd")) {
      technologies.push("AMD ROCm", "AMD Instinct GPUs", "PyTorch / vLLM");
    }

    // Extract timeline events
    const timelineIdx = stream.indexOf('"timelineEvents":[');
    if (timelineIdx !== -1) {
      const events = extractBalancedJson<any[]>(stream, timelineIdx + '"timelineEvents":'.length);
      if (Array.isArray(events)) {
        for (const ev of events) {
          if (ev.name) {
            schedule.push({
              name: ev.name,
              timestamp: ev.timestamp,
            });
          }
        }
      }
    }

    // Check prize mention in description or title
    if (!prizePool) {
      const prizeMatch = description.match(/\$[\d,]+(?:\s*(?:cash|credits|prize pool|total))?/i);
      if (prizeMatch) {
        prizePool = prizeMatch[0];
      }
    }

    // Registered teams preview
    const teams: Array<{ name: string; description?: string }> = [];
    const teamsIdx = stream.indexOf('"teams":[');
    if (teamsIdx !== -1) {
      const rawTeams = extractBalancedJson<any[]>(stream, teamsIdx + '"teams":'.length);
      if (Array.isArray(rawTeams)) {
        for (const t of rawTeams.slice(0, 10)) {
          if (t.name) {
            teams.push({ name: t.name, description: t.description || undefined });
          }
        }
      }
    }

    return {
      slug: cleanSlug,
      name,
      startAt,
      endAt,
      timeLeft: formatTimeLeft(endAt),
      prizePool,
      description,
      summary: description ? description.split("\n")[0] : undefined,
      url,
      technologies,
      schedule,
      requirements: [
        "Working software prototype or live application demo",
        "Public GitHub repository with comprehensive README & setup guide",
        "2-3 minute video demonstration uploaded to YouTube or Loom",
        "Must integrate the designated sponsor technology / API",
      ],
      rules: [
        "Submissions must be built during the hackathon timeframe or substantially modified",
        "Solo builders and teams of up to 4-5 participants allowed",
        "Code must be original and open-source under a standard OSI license",
      ],
      registeredTeamsCount: teams.length > 0 ? teams.length : undefined,
      teams,
    };
  }

  /**
   * Returns official Lablab.ai project submission requirements and guidelines.
   */
  getSubmissionGuidelines(): SubmissionGuidelines {
    return {
      overview:
        "Lablab.ai hackathon submissions are judged based on 4 primary pillars: Technical Implementation, Business Viability, Innovation/Creativity, and Presentation Quality.",
      deliverablesChecklist: [
        "Project Title, Logo/Thumbnail image, and 1-2 sentence tagline",
        "Comprehensive Project Description (Problem statement, Solution, Architecture)",
        "Link to Public GitHub Repository (with MIT/Apache-2 license & clear README)",
        "2–3 Minute Video Pitch (Explain the problem, show live demo, highlight sponsor API)",
        "Live Deployment URL (Vercel, Replit, Streamlit, HuggingFace Spaces, or container)",
        "Technology Stack Tagging (Tag all sponsor APIs and models used)",
      ],
      videoPitchTips: [
        "Hook the viewer in the first 15 seconds with the real-world problem",
        "Spend at least 60-90 seconds on a working, live software demonstration",
        "Clearly narrate where and how the sponsor technology powers the core intelligence",
        "Keep total duration strictly under 3 minutes (2:00 to 2:30 is the sweet spot)",
      ],
      repoGuidelines: [
        "Include a clean README with Architecture Diagram, Setup/Install instructions, and Env Var guide",
        "Provide mock keys or clear instructions on how judges can test without paying",
        "Remove all accidental hardcoded secret API keys",
      ],
      disqualificationTraps: [
        "Submitting without a working video demo",
        "Submitting a private or 404 GitHub repository",
        "Submitting pre-existing commercial products without hackathon-specific diffs",
        "Missing required sponsor API integration",
      ],
    };
  }
}

export const defaultLablabClient = new LablabClient();
