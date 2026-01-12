import { Router } from "express";

import usersRoutes from "./users.routes";
import bikesRoutes from "./bikes.routes";
import parkingSpotsRoutes from "./parking-spots.routes";
import rentalsRoutes from "./rentals.routes";
import issuesRoutes from "./issues.routes";
import imagesRoutes from "./images.routes";
import geocodeRoutes from "./geocode.routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/bikes", bikesRoutes);
router.use("/parking-spots", parkingSpotsRoutes);
router.use("/rentals", rentalsRoutes);
router.use("/issues", issuesRoutes);
router.use("/images", imagesRoutes);
router.use("/geocode", geocodeRoutes);

export default router;
