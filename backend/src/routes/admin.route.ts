import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import {
  deleteAdminProduct,
  getAdminBanks,
  getAdminCustomer,
  getAdminCustomerOrderList,
  getAdminCustomers,
  getAdminDashboard,
  getAdminMembershipRequests,
  getAdminOrder,
  getAdminStoreSettings,
  patchAdminCustomer,
  getAdminOrders,
  getAdminProduct,
  getAdminProducts,
  getAdminVouchers,
  patchAdminMembershipRequest,
  patchAdminOrderStatus,
  patchAdminPaymentStatus,
  patchAdminProduct,
  patchAdminStoreSettings,
  patchAdminVoucherDeactivate,
  postAdminVoucher,
  postAdminProduct,
  uploadAdminProductImage,
  uploadAdminProductVariantImage,
  uploadAdminProductSizeGuideImage,
  deleteAdminProductImage
} from "../controllers/admin.controller.js";
import { requireAdmin, requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Use memory storage for Cloudinary uploads
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

router.use(requireAuth, requireAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/banks", getAdminBanks);
router.get("/settings", getAdminStoreSettings);
router.patch("/settings", patchAdminStoreSettings);

router.get("/products", getAdminProducts);
router.get("/products/:productId", getAdminProduct);
router.post("/products", postAdminProduct);
router.patch("/products/:productId", patchAdminProduct);
router.delete("/products/:productId", deleteAdminProduct);
router.post("/products/:productId/images", upload.single("image"), uploadAdminProductImage);
router.post("/products/:productId/variant-images", upload.single("image"), uploadAdminProductVariantImage);
router.delete("/products/:productId/images/:imageId", deleteAdminProductImage);
router.post("/products/:productId/size-guide-image", upload.single("image"), uploadAdminProductSizeGuideImage);

router.get("/orders", getAdminOrders);
router.get("/orders/:orderId", getAdminOrder);
router.patch("/orders/:orderId/status", patchAdminOrderStatus);
router.patch("/orders/:orderId/payment-status", patchAdminPaymentStatus);

router.get("/customers", getAdminCustomers);
router.get("/customers/:customerId", getAdminCustomer);
router.get("/customers/:customerId/orders", getAdminCustomerOrderList);
router.patch("/customers/:customerId", patchAdminCustomer);

router.get("/membership-requests", getAdminMembershipRequests);
router.patch("/membership-requests/:userId/:action", patchAdminMembershipRequest);

router.get("/vouchers", getAdminVouchers);
router.post("/vouchers", postAdminVoucher);
router.patch("/vouchers/:voucherId/deactivate", patchAdminVoucherDeactivate);

export default router;
