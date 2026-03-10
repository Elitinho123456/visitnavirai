import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import route from "./routes/route";
import hotelRoutes from "./routes/hotelRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";

// DB
import db from "./db/db";

dotenv.config();

const app = express();
const port = process.env.VITE_API_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/", route);
app.use("/api/hotels", hotelRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/dashboard/stats", dashboardRoutes);

db();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});