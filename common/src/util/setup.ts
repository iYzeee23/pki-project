import { execSync } from "node:child_process";

const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";

const steps = [
  { name: "clean:all", cmd: "npm run clean:all" },
  { name: "install:all", cmd: "npm run install:all" },
  { name: "build:common", cmd: "npm run build:common" },
  { name: "typecheck:all", cmd: "npm run typecheck:all" },
];

try {
  for (const step of steps) {
    console.log(`\n${GREEN}> Running ${step.name}...${RESET}`);
    execSync(step.cmd, { stdio: "inherit" });
  }

  console.log(`\n${GREEN}Setup successfully finished!${RESET}\n`);
}
catch {
  console.error(`\n${RED}Setup failed!${RESET}\n`);
  process.exit(1);
}
