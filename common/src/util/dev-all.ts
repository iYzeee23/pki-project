import { spawn } from "node:child_process";

function openTerminal(title: string, command: string) {
  spawn(
    "cmd",
    [
      "/c",
      "start",
      `"${title}"`,
      "cmd",
      "/k",
      command
    ],
    {
      shell: true,
      stdio: "inherit"
    }
  );
}

openTerminal("DEV SERVER", "npm run dev:server");
openTerminal("DEV MOBILE", "npm run dev:mobile");
openTerminal("DEV WEB", "npm run dev:web");
