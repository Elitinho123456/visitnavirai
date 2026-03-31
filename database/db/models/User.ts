import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    role: { type: String, default: 'user' },
    Token: String
});

export const User = mongoose.model("User", UserSchema);