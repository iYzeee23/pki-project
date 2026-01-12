import { Router } from "express";
import { requireAuth } from "../utils";
import { GeocodeController } from "../controllers/geocode.controller";

const router = Router();
const c = new GeocodeController();

// requires auth
router.get("/reverse", requireAuth, c.reverse);

export default router;
