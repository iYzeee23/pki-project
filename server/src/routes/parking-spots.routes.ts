import { Router } from "express";
import { ParkingSpotsController } from "../controllers/parking-spots.controller";
import { requireAuth, requireAdmin } from "../utils";

const router = Router();
const c = new ParkingSpotsController();

// user
router.get("/", requireAuth, c.list);
router.get("/nearest", requireAuth, c.nearest);
router.get("/:id", requireAuth, c.getById);

// admin
router.post("/create", requireAuth, requireAdmin, c.create);
router.put("/update/:id", requireAuth, requireAdmin, c.update);
router.delete("/remove/:id", requireAuth, requireAdmin, c.remove);

export default router;
