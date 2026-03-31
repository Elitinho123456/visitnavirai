import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import route from "./routes/route";
import hotelRoutes from "./routes/hotelRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import testeRoutes from "./routes/imageUploader";
import roleRoutes from "./routes/roleRoutes";

// DB
import db from "./db/db";

dotenv.config();

const app = express();
const port = Number(process.env.VITE_API_PORT) || 3000;
const host = process.env.API_HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Serve static images folder
app.use("/imgs", express.static(path.join(process.cwd(), "database/imgs")));

app.use("/", route);
app.use("/api/hotels", hotelRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dashboard/stats", dashboardRoutes);
app.use("/api/teste", testeRoutes);
app.use("/api/roles", roleRoutes);

db();

app.listen(port, host, () => {
    const accessHost = host === "0.0.0.0" ? "26.201.150.33" : host;
    console.log(`Server running on http://${accessHost}:${port}`);
});