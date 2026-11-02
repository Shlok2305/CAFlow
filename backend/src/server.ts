import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
  })
);
app.use(express.json());

// Health check endpoint
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CAFlow backend is running!",
  });
});

// Health check endpoint Postgres
app.get("/api/v1/db-health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      success: true,
      message: "PostgreSQL connected through Prisma!",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed!",
    });
  }
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Centralized error-handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`CAFlow backend running on http://localhost:${PORT}`);
});
