import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import apiRoutes from "./routes/index.js";
import { notFoundMiddleware } from "./middlewares/notFound.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

export const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server healthy",
    data: {
      uptime: process.uptime(),
      now: new Date().toISOString()
    }
  });
});

app.use("/api/v1", apiRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
