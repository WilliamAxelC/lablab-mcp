export interface UserProfile {
  userId?: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  fullName: string;
  about?: string;
  totalPoints: number;
  rank?: string;
  location?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  avatarUrl?: string;
  profileUrl: string;
}

export interface HackathonSummary {
  slug: string;
  name: string;
  startAt?: string;
  endAt?: string;
  timeLeft?: string;
  prizePool?: string;
  summary?: string;
  description?: string;
  url: string;
}

export interface SubmissionSummary {
  title: string;
  slug: string;
  eventSlug: string;
  teamSlug?: string;
  createdAt?: string;
  url: string;
}

export interface UserStatusResult {
  profile: UserProfile;
  activeHackathons: HackathonSummary[];
  recentSubmissions: SubmissionSummary[];
}

export interface HackathonScheduleEvent {
  name: string;
  timestamp?: string;
  showTime?: boolean;
}

export interface HackathonDetails extends HackathonSummary {
  technologies: string[];
  schedule: HackathonScheduleEvent[];
  requirements: string[];
  rules: string[];
  registeredTeamsCount?: number;
  teams?: Array<{ name: string; description?: string }>;
}

export interface BrainstormIdea {
  title: string;
  elevatorPitch: string;
  targetAudience: string;
  problemStatement: string;
  solutionOverview: string;
  sponsorTechIntegration: {
    primaryTech: string;
    howItIsUsed: string;
    bonusImpact: string;
  };
  architecture: {
    frontend: string;
    backend: string;
    aiOrchestration: string;
    diagramMermaid?: string;
  };
  milestonePlan48h: {
    hours0to12: string;
    hours12to24: string;
    hours24to36: string;
    hours36to48: string;
  };
  judgingAlignment: {
    technicalDepth: string;
    businessViability: string;
    creativity: string;
    presentationDemo: string;
  };
}

export interface ScaffoldProjectOptions {
  projectName: string;
  hackathonSlug: string;
  ideaTitle: string;
  description: string;
  primaryTech?: string;
  targetDir?: string;
}

export interface ScaffoldProjectResult {
  projectDir: string;
  createdFiles: string[];
  readmePath: string;
  nextSteps: string[];
}

export interface SubmissionGuidelines {
  overview: string;
  deliverablesChecklist: string[];
  videoPitchTips: string[];
  repoGuidelines: string[];
  disqualificationTraps: string[];
}
