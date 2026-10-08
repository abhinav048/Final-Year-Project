import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { initDatabase } from "./db.js";
import { router } from "./routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Database & Seeds
initDatabase();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "*"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads serving (IPFS gateway fallback)
const uploadsDir = path.resolve(process.cwd(), "uploads");
app.use("/uploads", express.static(uploadsDir));

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "healthy",
    service: "SeedSure Backend API & Cache",
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use("/api", router);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("SeedSure Server Error:", err);
  res.status(500).json({
    success: false,
    error: err.message || "Internal server error"
  });
});

app.listen(PORT, () => {
  console.log(`\n🌾 SeedSure Backend running at: http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available at: http://localhost:${PORT}/api`);
  console.log(`🌱 Static IPFS/Upload Gateway: http://localhost:${PORT}/uploads\n`);
});
