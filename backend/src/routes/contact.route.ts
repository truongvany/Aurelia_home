import { Router } from "express";
import { createInquiry, getInquiries } from "../controllers/contact.controller.js";

const router = Router();

router.post("/", createInquiry);
router.get("/", getInquiries);

export default router;
