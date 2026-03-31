import { Router, Request, Response } from "express";
import { Role } from "../db/models/Role";
import { User } from "../db/models/User";
import { verifyToken, isSuperAdmin } from "../middlewares/authMiddleware";

const router = Router();

// Endpoint to seed default roles if they don't exist
const seedDefaultRoles = async () => {
    try {
        const adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) {
            // Admin gets all permissions implicitly by the frontend/middleware, 
            // but we can store true for everything if needed. We'll leave the map empty 
            // or handle it in the UI since it's immutable.
            await Role.create({
                name: "admin",
                isSystem: true,
                permissions: {}
            });
        }

        const userRole = await Role.findOne({ name: "user" });
        if (!userRole) {
            await Role.create({
                name: "user",
                isSystem: true,
                permissions: {}
            });
        }
    } catch (error) {
        console.error("Error seeding roles: ", error);
    }
};

seedDefaultRoles();

// GET all roles
router.get("/", verifyToken, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar cargos" });
    }
});

// CREATE custom role
router.post("/", verifyToken, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const { name, permissions } = req.body;
        
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Nome do cargo é obrigatório" });
        }

        const exactMatchName = await Role.findOne({ name: name.trim() });
        if (exactMatchName) {
            return res.status(400).json({ message: "Um cargo com este nome já existe." });
        }

        // isSystem is implicitly false
        const newRole = await Role.create({
            name: name.trim(),
            permissions
        });

        res.status(201).json(newRole);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar cargo" });
    }
});

// CHECK if permissions already exist
router.post("/check", verifyToken, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const { permissions } = req.body;
        
        // Find all roles
        const roles = await Role.find({ isSystem: false });
        
        // Find exact match
        let matchedRole = null;
        for (const role of roles) {
            const rolePerms = role.permissions ? Object.fromEntries(role.permissions) : {};
            let isExactMatch = true;

            // Check if all keys match
            const requestedKeys = Object.keys(permissions);
            const roleKeys = Object.keys(rolePerms);

            for (const key of requestedKeys) {
                const reqPerm = permissions[key] || { read: false, create: false, edit: false, delete: false };
                const rolPerm = rolePerms[key] || { read: false, create: false, edit: false, delete: false };
                
                if (reqPerm.read !== rolPerm.read ||
                    reqPerm.create !== rolPerm.create ||
                    reqPerm.edit !== rolPerm.edit ||
                    reqPerm.delete !== rolPerm.delete) {
                    isExactMatch = false;
                    break;
                }
            }

            // Also check keys only in role
            for (const key of roleKeys) {
                if (!requestedKeys.includes(key)) {
                    const rolPerm = rolePerms[key];
                    if (rolPerm.read || rolPerm.create || rolPerm.edit || rolPerm.delete) {
                        isExactMatch = false;
                        break;
                    }
                }
            }

            if (isExactMatch) {
                matchedRole = role;
                break;
            }
        }

        if (matchedRole) {
            res.json({ exists: true, role: matchedRole });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao verificar cargos" });
    }
});

// UPDATE custom role
router.put("/:id", verifyToken, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({ message: "Cargo não encontrado" });
        }
        if (role.isSystem) {
            return res.status(403).json({ message: "Cargos do sistema não podem ser modificados." });
        }

        role.permissions = permissions;
        await role.save();

        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar cargo" });
    }
});

// DELETE custom role
router.delete("/:id", verifyToken, isSuperAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({ message: "Cargo não encontrado" });
        }
        if (role.isSystem) {
            return res.status(403).json({ message: "Cargos do sistema não podem ser excluídos." });
        }

        const roleName = role.name;
        await Role.findByIdAndDelete(id);

        // Remove role from assigned users, fallback to simple 'user' role
        await User.updateMany(
            { role: roleName },
            { $set: { role: "user" } }
        );

        res.json({ message: "Cargo excluído com sucesso e usuários atualizados." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao excluir cargo" });
    }
});

export default router;
