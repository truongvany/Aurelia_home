import { Router } from "express";
import {
  getMyProfile,
  patchMyProfile,
  patchStyleProfile
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", getMyProfile);
router.get("/me", getMyProfile);
router.patch("/", patchMyProfile);
router.patch("/me", patchMyProfile);
router.patch("/me/style", patchStyleProfile);

export default router;
