import { UserProfile, HackathonSummary, SubmissionSummary } from "./types.js";

export function extractRscStream(html: string): string {
  const matches = [...html.matchAll(/self\.__next_f\.push\(\[1,"(.*?)"\]\)/g)];
  return matches
    .map((m) => m[1])
    .join("")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .replace(/\\n/g, "\n");
}

export function extractBalancedJson<T = any>(str: string, startIdx: number): T | null {
  let depth = 0;
  let inString = false;
  let escape = false;
  let jsonStart = -1;

  for (let i = startIdx; i < str.length; i++) {
    const char = str[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{" || char === "[") {
      if (depth === 0) jsonStart = i;
      depth++;
    } else if (char === "}" || char === "]") {
      depth--;
      if (depth === 0 && jsonStart !== -1) {
        const jsonText = str.slice(jsonStart, i + 1);
        try {
          return JSON.parse(jsonText);
        } catch {
          // If JSON parse fails due to raw control characters, sanitize
          try {
            const sanitized = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, (c) => {
              if (c === "\n") return "\\n";
              if (c === "\r") return "\\r";
              if (c === "\t") return "\\t";
              return "";
            });
            return JSON.parse(sanitized);
          } catch {
            return null;
          }
        }
      }
    }
  }

  return null;
}

export function formatTimeLeft(isoString?: string): string {
  if (!isoString) return "TBA";
  try {
    const target = new Date(isoString).getTime();
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) return "Ended";

    const totalHours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    }
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  } catch {
    return isoString;
  }
}

export function parseProfileHtml(html: string, fallbackUsername: string): {
  profile: UserProfile;
  upcoming: HackathonSummary[];
  submissions: SubmissionSummary[];
} {
  const stream = extractRscStream(html);

  let rawProfile: any = {};
  const profMarker = stream.indexOf('"profile":{"firstName":');
  if (profMarker !== -1) {
    const extracted = extractBalancedJson(stream, profMarker + '"profile":'.length);
    if (extracted) rawProfile = extracted;
  }

  let rawUpcoming: any[] = [];
  const upMarker = stream.indexOf('"upcomingHackathons":[');
  if (upMarker !== -1) {
    const extracted = extractBalancedJson<any[]>(stream, upMarker + '"upcomingHackathons":'.length);
    if (Array.isArray(extracted)) rawUpcoming = extracted;
  }

  let rawSubmissions: any[] = [];
  const subMarker = stream.indexOf('"submissions":[');
  if (subMarker !== -1) {
    const extracted = extractBalancedJson<any[]>(stream, subMarker + '"submissions":'.length);
    if (Array.isArray(extracted)) rawSubmissions = extracted;
  }

  const cleanUser = fallbackUsername.replace(/^@/, "");
  const firstName = rawProfile.firstName || "";
  const lastName = rawProfile.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || cleanUser;

  const profile: UserProfile = {
    userId: rawProfile.userId,
    userName: cleanUser,
    firstName: rawProfile.firstName,
    lastName: rawProfile.lastName,
    fullName,
    about: rawProfile.about,
    totalPoints: rawProfile.totalPoints || 0,
    rank: rawProfile.totalPoints ? "Hacker" : undefined,
    location: rawProfile.location,
    githubUrl: rawProfile.githubUrl,
    linkedinUrl: rawProfile.linkedinUrl,
    websiteUrl: rawProfile.personalwebsiteUrl,
    avatarUrl: rawProfile.picture,
    profileUrl: `https://lablab.ai/u/@${cleanUser}`,
  };

  const upcoming: HackathonSummary[] = rawUpcoming.map((h: any) => ({
    slug: h.slug,
    name: h.name || h.slug,
    startAt: h.startAt,
    endAt: h.endAt,
    timeLeft: formatTimeLeft(h.endAt),
    summary: (h.description || "").split("\n")[0] || undefined,
    description: h.description,
    url: `https://lablab.ai/ai-hackathons/${h.slug}`,
  }));

  const submissions: SubmissionSummary[] = rawSubmissions.map((s: any) => {
    const team = s.team || {};
    const sub = team.submission || {};
    const eventSlug = s.event?.slug || "";
    const teamSlug = team.slug || "";
    const subSlug = sub.slug || "";
    return {
      title: sub.title || "Untitled",
      slug: subSlug,
      eventSlug,
      teamSlug,
      createdAt: sub.createdAt,
      url: `https://lablab.ai/ai-hackathons/${eventSlug}/${teamSlug}/${subSlug}`,
    };
  });

  return { profile, upcoming, submissions };
}
