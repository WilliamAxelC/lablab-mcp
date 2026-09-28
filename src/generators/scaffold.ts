import fs from "node:fs/promises";
import path from "node:path";
import { ScaffoldProjectOptions, ScaffoldProjectResult } from "../types.js";

export async function scaffoldHackathonProject(
  options: ScaffoldProjectOptions
): Promise<ScaffoldProjectResult> {
  const targetRoot = options.targetDir || process.cwd();
  const projectDir = path.resolve(targetRoot, options.projectName);

  await fs.mkdir(projectDir, { recursive: true });
  await fs.mkdir(path.join(projectDir, "src"), { recursive: true });

  const createdFiles: string[] = [];

  // 1. README.md formatted to Lablab.ai guidelines
  const readmeContent = `# ${options.ideaTitle}

> **Built for [Lablab.ai - ${options.hackathonSlug}](https://lablab.ai/ai-hackathons/${options.hackathonSlug})**

## 💡 Overview & Problem Statement
${options.description}

### The Problem
Traditional workflows suffer from fragmentation and manual overhead. Developers and users lose critical time context-switching between tools, leading to reduced productivity and human error.

### The Solution
**${options.ideaTitle}** bridges this gap by providing an intelligent, automated solution powered by state-of-the-art AI.

---

## 🛠️ Technology Stack & Sponsor Integration
* **Primary AI Technology**: ${options.primaryTech || "Designated Hackathon API"}
* **Backend / Engine**: Node.js / TypeScript
* **Frontend / UI**: Modern Web UI
* **Deployment**: Cloud Native / Containerized

### How We Used the Sponsor API
Our project deeply integrates the sponsor technology into the core loop:
1. Receives inputs and validates payload constraints.
2. Streams data directly to the sponsor API for high-speed processing.
3. Synthesizes outputs into actionable user feedback.

---

## 🏗️ Architecture
\`\`\`text
[ User / Client ] ---> [ API Gateway / Frontend ]
                              |
                              v
                      [ Core AI Engine ]
                              |
                +-------------+-------------+
                |                           |
                v                           v
      [ Sponsor AI API ]          [ Local Store / Cache ]
\`\`\`

---

## 🚀 Getting Started

### Prerequisites
* Node.js v20+ or v22+
* Package manager: \`pnpm\` or \`npm\`
* API Keys (see \`.env.example\`)

### Installation & Run
\`\`\`bash
# 1. Clone repository
git clone https://github.com/WilliamAxelC/${options.projectName}.git
cd ${options.projectName}

# 2. Install dependencies
pnpm install

# 3. Configure environment
cp .env.example .env

# 4. Start development server
pnpm dev
\`\`\`

---

## 🎥 Video Pitch & Demo
* **YouTube / Loom Link**: [Insert 2-3 minute video link here]
* **Live Demo**: [Insert live application URL here]

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
`;

  const readmePath = path.join(projectDir, "README.md");
  await fs.writeFile(readmePath, readmeContent, "utf-8");
  createdFiles.push("README.md");

  // 2. .env.example
  const envContent = `# Lablab.ai Hackathon Configuration
PORT=3000
NODE_ENV=development

# Sponsor API Credentials
SPONSOR_API_KEY=your_api_key_here
`;
  await fs.writeFile(path.join(projectDir, ".env.example"), envContent, "utf-8");
  createdFiles.push(".env.example");

  // 3. package.json
  const pkgContent = JSON.stringify(
    {
      name: options.projectName,
      version: "0.1.0",
      description: options.description,
      type: "module",
      scripts: {
        dev: "tsx watch src/index.ts",
        build: "tsc",
        start: "node dist/index.js",
      },
      dependencies: {
        dotenv: "^16.4.7",
      },
      devDependencies: {
        "@types/node": "^22.13.9",
        tsx: "^4.19.3",
        typescript: "^5.7.3",
      },
    },
    null,
    2
  );
  await fs.writeFile(path.join(projectDir, "package.json"), pkgContent, "utf-8");
  createdFiles.push("package.json");

  // 4. src/index.ts
  const srcIndexContent = `import dotenv from "dotenv";
dotenv.config();

console.log("==================================================");
console.log("  🚀 ${options.ideaTitle} - Starting Up...");
console.log("  Built for Lablab.ai: ${options.hackathonSlug}");
console.log("==================================================");

async function main() {
  console.log("Initializing core engine and verifying API connectivity...");
}

main().catch(console.error);
`;
  await fs.writeFile(path.join(projectDir, "src/index.ts"), srcIndexContent, "utf-8");
  createdFiles.push("src/index.ts");

  // 5. .gitignore
  const gitignoreContent = `node_modules/
dist/
.env
*.log
.DS_Store
`;
  await fs.writeFile(path.join(projectDir, ".gitignore"), gitignoreContent, "utf-8");
  createdFiles.push(".gitignore");

  return {
    projectDir,
    createdFiles,
    readmePath,
    nextSteps: [
      `cd ${options.projectName}`,
      "pnpm install",
      "cp .env.example .env (and set your API keys)",
      "pnpm dev",
    ],
  };
}
