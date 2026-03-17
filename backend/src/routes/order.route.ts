import { Router } from "express";
import { createOrder, getMyOrder, listMyOrders } from "../controllers/order.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(requireAuth);
router.post("/", createOrder);
router.get("/", listMyOrders);
router.get("/:orderId", getMyOrder);

export default router;
