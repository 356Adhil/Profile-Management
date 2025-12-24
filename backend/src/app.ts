import express from "express";
import cors from "cors";
import path from "path";
import profileRoutes from "./routes/profile.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();

  app.use(cors({ origin: true }));
  app.use(express.json({ limit: "3mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded avatars
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.use(profileRoutes);

  app.use(errorMiddleware);
  return app;
}