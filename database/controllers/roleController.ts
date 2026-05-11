import { Request, Response } from "express";
import { Role } from "../models/Role";
import { User } from "../models/User";

// Endpoint to seed default roles if they don't exist
export const seedDefaultRoles = async () => {
    try {
        const adminRole = await Role.findOne({ name: "admin" });
        if (!adminRole) {
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

export const getRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar cargos" });
    }
};

export const createRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, permissions } = req.body;
        
        if (!name || name.trim() === "") {
            res.status(400).json({ message: "Nome do cargo é obrigatório" });
            return;
        }

        const exactMatchName = await Role.findOne({ name: name.trim() });
        if (exactMatchName) {
            res.status(400).json({ message: "Um cargo com este nome já existe." });
            return;
        }

        const newRole = await Role.create({
            name: name.trim(),
            permissions
        });

        res.status(201).json(newRole);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao criar cargo" });
    }
};

export const checkRoleExists = async (req: Request, res: Response): Promise<void> => {
    try {
        const { permissions } = req.body;
        
        const roles = await Role.find({ isSystem: false });
        
        let matchedRole = null;
        for (const role of roles) {
            const rolePerms = role.permissions ? Object.fromEntries(role.permissions as any) : {};
            let isExactMatch = true;

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

            for (const key of roleKeys) {
                if (!requestedKeys.includes(key)) {
                    const rolPerm = rolePerms[key] as any;
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
};

export const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { permissions } = req.body;

        const role = await Role.findById(id);
        if (!role) {
            res.status(404).json({ message: "Cargo não encontrado" });
            return;
        }
        if (role.isSystem) {
            res.status(403).json({ message: "Cargos do sistema não podem ser modificados." });
            return;
        }

        role.permissions = permissions;
        await role.save();

        res.json(role);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar cargo" });
    }
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);
        if (!role) {
            res.status(404).json({ message: "Cargo não encontrado" });
            return;
        }
        if (role.isSystem) {
            res.status(403).json({ message: "Cargos do sistema não podem ser excluídos." });
            return;
        }

        const roleName = role.name;
        await Role.findByIdAndDelete(id);

        await User.updateMany(
            { role: roleName },
            { $set: { role: "user" } }
        );

        res.json({ message: "Cargo excluído com sucesso e usuários atualizados." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao excluir cargo" });
    }
};
