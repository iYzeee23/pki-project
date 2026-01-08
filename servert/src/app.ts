import express from "express";
import cors from "cors";
import { errorHandler } from "./utils";
import apiRoutes from "./routes/index";
import { UPLOAD_DIR } from "./image-utils";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use("/uploads", express.static(UPLOAD_DIR));

  app.get("/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", apiRoutes);

  app.use(errorHandler);

  return app;
}
