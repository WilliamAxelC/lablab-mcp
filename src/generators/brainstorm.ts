import { BrainstormIdea, HackathonDetails } from "../types.js";

export function generateBrainstormIdeas(
  details: HackathonDetails,
  options: {
    focusAreas?: string[];
    complexity?: "mvp" | "balanced" | "ambitious";
    teamSize?: number;
  } = {}
): BrainstormIdea[] {
  const slug = details.slug.toLowerCase();
  const complexity = options.complexity || "balanced";

  const isAssemblyAI = slug.includes("assemblyai") || slug.includes("voice");
  const isBob = slug.includes("bob");
  const isAmd = slug.includes("amd");

  const ideas: BrainstormIdea[] = [];

  if (isAssemblyAI) {
    ideas.push({
      title: "VoiceBridge: Real-Time SRE Incident Copilot",
      elevatorPitch:
        "A real-time voice copilot for war rooms that listens to engineer audio, diarizes speakers, auto-extracts incident logs and hypotheses, and triggers automated remediation scripts via LeMUR.",
      targetAudience: "Site Reliability Engineers (SREs), DevOps on-call teams, and Cloud Architects.",
      problemStatement:
        "During critical P0/P1 system outages, engineers communicate via audio calls while typing furiously. Critical hypotheses, diagnostic findings, and commands spoken verbally get lost without written post-mortem trails.",
      solutionOverview:
        "VoiceBridge streams conference audio into AssemblyAI Streaming Speech-to-Text with Speaker Diarization. As outages are discussed, LeMUR parses action items, correlates spoken errors with telemetry, and suggests or safely executes bash commands via approval gates.",
      sponsorTechIntegration: {
        primaryTech: "AssemblyAI Streaming STT & LeMUR",
        howItIsUsed:
          "Live WebSocket streaming for sub-second speech transcription; LeMUR for reasoning over transcripts, extracting timeline summaries, and identifying commands.",
        bonusImpact:
          "Demonstrates complex enterprise value with high real-time reliability and audit logging.",
      },
      architecture: {
        frontend: "Next.js 15 App Router with live audio visualizer & incident timeline",
        backend: "Node.js / Express WebSocket gateway for audio chunks",
        aiOrchestration: "AssemblyAI Universal-2 + LeMUR API + Anthropic/Claude fallback",
        diagramMermaid: `graph TD
  User((Engineer Voice)) -->|Microphone Audio| WebClient[Next.js Client]
  WebClient -->|PCM WebSocket| Server[Express Audio Gateway]
  Server -->|Bi-directional Stream| AAI[AssemblyAI Streaming STT]
  AAI -->|Live Transcript + Diarization| Server
  Server -->|Structured Context| LeMUR[AssemblyAI LeMUR]
  LeMUR -->|Incident Insights & Commands| Server
  Server -->|Live SSE/WS Updates| WebClient
  Server -->|Audit Trail Log| IncidentDB[(Incident Timeline)]`,
      },
      milestonePlan48h: {
        hours0to12: "Setup AssemblyAI streaming audio WebSocket pipeline and Next.js audio capture interface.",
        hours12to24: "Implement speaker diarization handling and real-time transcript dashboard UI.",
        hours24to36: "Connect LeMUR prompt pipeline to summarize key events, extract hypotheses, and suggest commands.",
        hours36to48: "Polish UI, record high-energy 2.5 min pitch video, deploy live demo on Vercel.",
      },
      judgingAlignment: {
        technicalDepth: "Deep usage of AssemblyAI Streaming WebSockets, low-latency audio chunking, and LeMUR LLM tasks.",
        businessViability: "Solves an expensive enterprise pain point with immediate B2B SaaS potential.",
        creativity: "Transforms passive meeting transcription into an active, command-executing co-pilot.",
        presentationDemo: "High visual and auditory impact for live pitch demonstrations.",
      },
    });

    ideas.push({
      title: "AudioDiff: Hands-Free Code Review & Voice PR Explainer",
      elevatorPitch:
        "An AI voice partner that reviews GitHub pull requests with you, verbally discussing architecture trade-offs, answering questions out loud, and drafting PR comments as you speak.",
      targetAudience: "Software Engineers, Open-Source Maintainers, and Engineering Managers.",
      problemStatement:
        "Reviewing dense code diffs on small laptops or during transit is eye-straining and cognitively exhausting. Existing AI tools only offer text-based chatbots that require constant typing.",
      solutionOverview:
        "AudioDiff renders git diffs interactively while maintaining an open duplex voice conversation. Speak questions like 'Why was the mutex removed here?', and the voice agent explains the context and reads out relevant code snippets.",
      sponsorTechIntegration: {
        primaryTech: "AssemblyAI Universal-2 & Speech-to-Text",
        howItIsUsed:
          "Accurately transcribes technical jargon, function names, and commit hashes spoken naturally by developers.",
        bonusImpact: "Accessible hands-free developer experience with high developer community appeal.",
      },
      architecture: {
        frontend: "React / Vite with syntax-highlighted git diff inspector",
        backend: "FastAPI / Python with AssemblyAI SDK and Octokit GitHub API",
        aiOrchestration: "AssemblyAI Speech-to-Text + Fast TTS (Cartesia/ElevenLabs) + LLM Code Evaluator",
        diagramMermaid: `graph TD
  Dev((Developer)) -->|Voice Query| Mic[Browser Mic]
  Mic -->|Audio Stream| AAI[AssemblyAI Streaming STT]
  AAI -->|Text Query| Orchestrator[AudioDiff Engine]
  GitHub[GitHub API] -->|PR Diff & Context| Orchestrator
  Orchestrator -->|Code Grounding + Prompt| LLM[Code Reasoning Model]
  LLM -->|Voice Answer| TTS[Edge TTS / WebAudio]
  TTS -->|Spoken Response| Dev`,
      },
      milestonePlan48h: {
        hours0to12: "Scaffold GitHub PR diff fetcher and AssemblyAI audio transcription connection.",
        hours12to24: "Implement AST/diff chunking to map user voice questions to specific code lines.",
        hours24to36: "Build conversational loop with low-latency audio response and UI highlighting.",
        hours36to48: "Package test repo with sample PRs, record demo walk-through, write comprehensive README.",
      },
      judgingAlignment: {
        technicalDepth: "Complex orchestration of code AST diff analysis, speech-to-text, and real-time audio playback.",
        businessViability: "Directly improves developer productivity and accessibility for vision-impaired engineers.",
        creativity: "Re-imagines one of the oldest developer rituals (code review) as a dynamic vocal conversation.",
        presentationDemo: "Extremely engaging video demo showing hands completely off the keyboard.",
      },
    });

    ideas.push({
      title: "PulseDoc: Voice-Driven Medical Consultation & SOAP Generator",
      elevatorPitch:
        "Ambient clinical assistant that passively listens to patient-doctor consultations and produces verified FHIR-compliant SOAP notes with clinical coding.",
      targetAudience: "Physicians, telehealth clinics, and healthcare practitioners.",
      problemStatement:
        "Doctors spend 2+ hours every evening manually writing clinical documentation and coding notes into EHR systems, leading to severe physician burnout.",
      solutionOverview:
        "PulseDoc runs on mobile or desktop during visits, using AssemblyAI's medical-grade transcription and LeMUR to structure clinical narratives into Subjective, Objective, Assessment, and Plan (SOAP) formats.",
      sponsorTechIntegration: {
        primaryTech: "AssemblyAI Speech-to-Text & LeMUR Summary/Extraction",
        howItIsUsed:
          "High accuracy medical vocabulary transcription; LeMUR handles medical entity extraction and clinical note generation.",
        bonusImpact: "Demonstrates high-accuracy transcription in specialized domains.",
      },
      architecture: {
        frontend: "Tailwind CSS / Next.js electronic health record interface",
        backend: "FastAPI with HIPAA-ready in-memory buffers",
        aiOrchestration: "AssemblyAI LeMUR + Structured JSON validation",
      },
      milestonePlan48h: {
        hours0to12: "Build patient intake and consultation recording frontend.",
        hours12to24: "Integrate AssemblyAI transcription and fine-tune LeMUR prompt for SOAP schema.",
        hours24to36: "Add interactive physician verification and PDF export.",
        hours36to48: "Create mock clinical scenarios for video demo, deploy prototype.",
      },
      judgingAlignment: {
        technicalDepth: "Medical entity recognition, structured prompt engineering, and audio processing.",
        businessViability: "Proven, massive health-tech market with clear ROI per physician.",
        creativity: "Ambient intelligence that requires zero manual clinical note-taking.",
        presentationDemo: "Compelling patient-doctor roleplay demo that resonates with judges.",
      },
    });
  } else if (isBob) {
    ideas.push({
      title: "BobSentinel: Autonomous Test Flakiness & Regression Healer",
      elevatorPitch:
        "An autonomous CI bot built on IBM Bob that detects flaky test suites, isolates nondeterministic failures, and opens self-healing pull requests with regression fixes.",
      targetAudience: "QA Engineers, DevOps, and Platform Engineering teams.",
      problemStatement:
        "Flaky tests waste millions of compute hours and developer attention. Engineers ignore CI failures because 'it usually passes on rerun'.",
      solutionOverview:
        "BobSentinel integrates into GitHub Actions, parses test failure traces, uses Bob Shell to inspect code history, and synthesizes pinpoint patches.",
      sponsorTechIntegration: {
        primaryTech: "IBM Bob / Bob Shell CLI",
        howItIsUsed: "Employs Bob Shell non-interactive mode (`bob run`) to analyze code and generate automated fixes.",
        bonusImpact: "Pushes the boundaries of autonomous SDLC agents.",
      },
      architecture: {
        frontend: "Dashboard for test stability metrics",
        backend: "Node.js GitHub Webhook listener + Bob Shell runner",
        aiOrchestration: "Bob Shell + Git worktree automation",
      },
      milestonePlan48h: {
        hours0to12: "Configure GitHub Actions runner with Bob Shell API key.",
        hours12to24: "Build test log failure extractor and prompt pipeline.",
        hours24to36: "Implement automated branch creation and PR opening.",
        hours36to48: "Document architecture, record video demo, finalize submission.",
      },
      judgingAlignment: {
        technicalDepth: "Deep integration with Bob Shell CLI and CI/CD pipelines.",
        businessViability: "Saves cloud CI compute costs and unblocks engineering velocity.",
        creativity: "Turns passive test reporting into active self-healing remediation.",
        presentationDemo: "Shows a failing CI pipeline turn green automatically via a Bob PR.",
      },
    });
  } else {
    // General AI / AMD / Infra hackathon ideas
    ideas.push({
      title: "OmniAgent: Multi-Modal Edge Orchestrator",
      elevatorPitch:
        "High-performance edge AI agent that routes complex tasks dynamically between local lightweight models and powerful cloud reasoning engines.",
      targetAudience: "Developers building latency-critical, privacy-conscious AI applications.",
      problemStatement:
        "Cloud LLMs introduce latency and data privacy risks, while local models lack general reasoning. Developers struggle to blend both seamlessly.",
      solutionOverview:
        "OmniAgent provides a unified MCP server and client gateway that profiles prompt complexity and dispatches sub-tasks to the optimal hardware backend.",
      sponsorTechIntegration: {
        primaryTech: details.technologies[0] || "Hardware Accelerated AI Engine",
        howItIsUsed: "Leverages sponsor infrastructure for low-latency local inference.",
        bonusImpact: "Demonstrates measurable latency and cost improvements.",
      },
      architecture: {
        frontend: "Interactive benchmark & chat interface",
        backend: "Rust or Node.js high-throughput gateway",
        aiOrchestration: "Hybrid local/cloud dispatch router",
      },
      milestonePlan48h: {
        hours0to12: "Set up benchmark harness and model connection layer.",
        hours12to24: "Build prompt complexity classifier and routing engine.",
        hours24to36: "Add performance telemetry and live comparison UI.",
        hours36to48: "Create benchmark charts, record presentation video, publish repo.",
      },
      judgingAlignment: {
        technicalDepth: "Quantifiable performance metrics and multi-model routing.",
        businessViability: "Substantial cost savings for enterprise AI deployments.",
        creativity: "Innovative hardware-aware agent routing.",
        presentationDemo: "Live side-by-side speed and latency benchmarks.",
      },
    });
  }

  return ideas;
}
