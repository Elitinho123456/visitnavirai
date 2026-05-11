import mongoose from "mongoose";

import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

export default function db() {

    mongoose.connect(process.env.DB || "").then(() => {
        console.log("Database connected");
    }).catch((err) => {
        console.log(err);
    });

    return mongoose.connection;
};