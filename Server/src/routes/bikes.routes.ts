import { Router } from "express";
import { BikesController } from "../controllers/bikes.controller";
import { requireAuth, requireAdmin } from "../utils";

const router = Router();
const c = new BikesController();

// user
router.get("/list", requireAuth, c.list);
router.get("/:id", requireAuth, c.getById);

// admin
router.post("/new", requireAuth, requireAdmin, c.create);
router.put("/:id", requireAuth, requireAdmin, c.update);
router.put("/:id/status", requireAuth, requireAdmin, c.changeStatus);
router.delete("/:id", requireAuth, requireAdmin, c.remove);

export default router;
