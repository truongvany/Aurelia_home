import { Router } from "express";
import multer from "multer";
import { createOrder, getMyOrder, listMyOrders } from "../controllers/order.controller.js";
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
router.post("/", upload.single("proofImage"), createOrder);
router.get("/", listMyOrders);
router.get("/:orderId", getMyOrder);

export default router;
