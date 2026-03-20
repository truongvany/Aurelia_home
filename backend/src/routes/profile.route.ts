import { Router } from "express";
import {
  getMyMembership,
  getMyProfile,
  getVouchers,
  joinMembership,
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
router.get("/membership", getMyMembership);
router.post("/membership/enroll", joinMembership);
router.get("/vouchers", getVouchers);

export default router;
