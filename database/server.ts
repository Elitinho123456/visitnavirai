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

// DB
import db from "./db/db";

dotenv.config();

const app = express();
const port = process.env.VITE_API_PORT || 3000;

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

db();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});