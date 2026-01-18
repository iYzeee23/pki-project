import { Router } from "express";
import multer from "multer";
import { ImagesController } from "../controllers/images.controller";
import { requireAuth, requireAdmin } from "../utils";

const router = Router();
const c = new ImagesController();

const upload = multer({ storage: multer.memoryStorage() });

// user
router.post("/upload", requireAuth, upload.array("files", 10), c.upload);

// admin
router.get("/fetch/:model/:id", requireAuth, requireAdmin, c.fetch);

export default router;
