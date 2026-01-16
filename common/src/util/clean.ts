import { rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
rmSync("node_modules", { recursive: true, force: true });
rmSync("package-lock.json", { force: true });
rmSync("tsconfig.tsbuildinfo", { force: true });
