import { Router } from "express";
import {
  getMyProfile,
  patchMyProfile,
  patchStyleProfile
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/me", getMyProfile);
router.patch("/me", patchMyProfile);
router.patch("/me/style", patchStyleProfile);

export default router;
