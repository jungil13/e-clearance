import express from "express";
import cors from "cors";
import path from "path";
import http from "http";

// Routes
import userRoutes from "./routes/userRoutes.js";
import clearanceRoutes from "./routes/clearanceRoutes.js";
import residentRoutes from './routes/residentRoutes.js';
import officialsRoutes from "./routes/officialsRoutes.js";

// Socket.IO
import { initSocket } from "./config/socket.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/clearances", clearanceRoutes);
app.use('/api/residents', residentRoutes);
app.use("/api/officials", officialsRoutes);

// Health check
app.get("/", (req, res) => {
  res.send({ message: "Server is running 🚀" });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

// Start server
const PORT = 5000; // hardcoded port
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
