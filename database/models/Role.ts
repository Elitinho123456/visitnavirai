import mongoose from "mongoose";

const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    isSystem: { type: Boolean, default: false }, // "admin" and "user"
    permissions: {
        type: Map,
        of: new Schema({
            read: { type: Boolean, default: false },
            create: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        }, { _id: false })
    }
});

export const Role = mongoose.model("Role", RoleSchema);
