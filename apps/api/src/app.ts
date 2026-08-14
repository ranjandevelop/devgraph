import express from "express";
import cors from "cors";
import helmet from "helmet";

import { driver } from "./db/driver";
import packageRoutes from "./routes/packageRoutes";
import graphRoutes from "./routes/graphRoutes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    await driver.verifyConnectivity();

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(503).json({
      status: "error",
      database: "unavailable",
    });
  }
});

app.use("/api/packages", packageRoutes);
app.use("/api/graph", graphRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
