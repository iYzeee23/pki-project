import { Router } from "express";
import multer from "multer";
import { UsersController } from "../controllers/users.controller";
import { requireAuth } from "../utils";

const router = Router();
const c = new UsersController();

const upload = multer({ storage: multer.memoryStorage() });

// doesn't require auth
router.post("/register", upload.single("file"), c.register);
router.post("/login", c.login);

// requires auth
router.get("/me", requireAuth, c.me);
router.put("/me/update", requireAuth, upload.single("file"), c.updateMe);
router.put("/me/password", requireAuth, c.changePassword);

export default router;
