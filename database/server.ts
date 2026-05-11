import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Routes
import routes from "./routes/index";

// DB
import db from "./config/db";

dotenv.config();

const app = express();
const port = Number(process.env.VITE_API_PORT) || 3000;
const host = process.env.API_HOST || "0.0.0.0";

app.use(cors());
app.use(express.json());

// Serve static images folder
app.use("/imgs", express.static(path.join(process.cwd(), "database/imgs")));

// API Routes
app.use("/", routes);

// Initialize DB
db();

app.listen(port, host, () => {
    const accessHost = host === "0.0.0.0" ? "26.201.150.33" : host;
    console.log(`Server running on http://${accessHost}:${port}`);
});