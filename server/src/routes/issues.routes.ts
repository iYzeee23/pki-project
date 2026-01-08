import { Router } from "express";
import { IssuesController } from "../controllers/issues.controller";
import { requireAuth, requireAdmin } from "../utils";

const router = Router();
const c = new IssuesController();

// user
router.post("/", requireAuth, c.create);
router.get("/mine", requireAuth, c.myList);
router.get("/:id", requireAuth, c.getById);

// admin
router.get("/", requireAuth, requireAdmin, c.listAll);

export default router;
