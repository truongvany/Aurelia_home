import { Router } from "express";
import multer from "multer";
import {
  getMyMembership,
  getMyMembershipPaymentConfig,
  getMyProfile,
  getVouchers,
  joinMembership,
  patchMyProfile,
  patchStyleProfile,
  exchangeVoucher
} from "../controllers/profile.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
      return;
    }
    cb(null, true);
  }
});

router.use(requireAuth);
router.get("/", getMyProfile);
router.get("/me", getMyProfile);
router.patch("/", patchMyProfile);
router.patch("/me", patchMyProfile);
router.patch("/me/style", patchStyleProfile);
router.get("/membership", getMyMembership);
router.get("/membership/payment-config", getMyMembershipPaymentConfig);
router.post("/membership/enroll", upload.single("proofImage"), joinMembership);
router.get("/vouchers", getVouchers);
router.post("/vouchers/exchange", exchangeVoucher);

export default router;
