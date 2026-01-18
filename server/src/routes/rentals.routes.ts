import { Router } from "express";
import { RentalsController } from "../controllers/rentals.controller";
import { requireAuth, requireAdmin } from "../utils";

const router = Router();
const c = new RentalsController();

// user
router.post("/start", requireAuth, c.start);
router.get("/active", requireAuth, c.active);
router.put("/finish", requireAuth, c.finish);
router.get("/history", requireAuth, c.history);
router.get("/:id", requireAuth, c.getById);

// admin
router.get("/admin/list", requireAuth, requireAdmin, c.list);

export default router;
