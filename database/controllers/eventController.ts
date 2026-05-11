import { Request, Response } from "express";
import { Types } from "mongoose";
import { Event } from "../models/Event";
import path from "path";
import fs from "fs";
import { sanitizeName } from "../utils/fileUtils";

export const getEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar eventos" });
    }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const eventData = req.body;
        if (eventData.startTime >= eventData.endTime) {
            res.status(400).json({ message: "Hora de início deve ser menor que a hora de término" });
            return;
        }

        // Verificação de duplicidade no mês
        const monthPrefix = eventData.date.substring(0, 7);
        const duplicate = await Event.findOne({
            name: { $regex: `^${eventData.name}$`, $options: 'i' },
            date: { $regex: `^${monthPrefix}` }
        });

        if (duplicate && !req.query.force) {
            const related = await Event.find({
                name: { $regex: `^${eventData.name}(\\(\\d+\\))?$`, $options: 'i' },
                date: { $regex: `^${monthPrefix}` }
            });
            let maxIdx = 0;
            related.forEach(e => {
                const m = e.name.match(/\((\d+)\)$/);
                if (m) maxIdx = Math.max(maxIdx, parseInt(m[1]));
                else if (e.name.toLowerCase() === eventData.name.toLowerCase()) maxIdx = Math.max(maxIdx, 0);
            });
            res.status(409).json({
                message: "Já existe um evento com este nome neste mês.",
                suggestion: `${eventData.name}(${maxIdx + 1})`,
                existingId: duplicate._id
            });
            return;
        }

        const newEvent = new Event(eventData);
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erro ao criar evento" });
    }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const eventData = req.body;
        if (eventData.startTime >= eventData.endTime) {
            res.status(400).json({ message: "Hora de início deve ser menor que a hora de término" });
            return;
        }

        const monthPrefix = eventData.date.substring(0, 7);
        const duplicate = await Event.findOne({
            name: { $regex: `^${eventData.name}$`, $options: 'i' },
            date: { $regex: `^${monthPrefix}` },
            _id: { $ne: new Types.ObjectId(req.params.id as string) }
        });

        if (duplicate && !req.query.force) {
            const related = await Event.find({
                name: { $regex: `^${eventData.name}(\\(\\d+\\))?$`, $options: 'i' },
                date: { $regex: `^${monthPrefix}` }
            });
            let maxIdx = 0;
            related.forEach(e => {
                const m = e.name.match(/\((\d+)\)$/);
                if (m) maxIdx = Math.max(maxIdx, parseInt(m[1]));
            });
            res.status(409).json({
                message: "Já existe outro evento com este nome neste mês.",
                suggestion: `${eventData.name}(${maxIdx + 1})`,
                existingId: duplicate._id
            });
            return;
        }

        const updatedEvent = await Event.findByIdAndUpdate(req.params.id, eventData, { new: true });
        if (!updatedEvent) {
            res.status(404).json({ message: "Evento não encontrado" });
            return;
        }
        res.json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Erro ao atualizar evento" });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) {
            res.status(404).json({ message: "Evento não encontrado" });
            return;
        }

        if (deletedEvent.name) {
            const deletedSanitized = sanitizeName(deletedEvent.name);
            // Só apaga a pasta se não houver mais nenhum evento que aponte para ela
            const allEvents = await Event.find({});
            const sharesFolder = allEvents.some(e =>
                e._id.toString() !== deletedEvent._id.toString() &&
                sanitizeName(e.name) === deletedSanitized
            );

            if (!sharesFolder) {
                const dirPath = path.join(process.cwd(), "database", "imgs", "eventos", deletedSanitized);
                if (fs.existsSync(dirPath)) {
                    fs.rmSync(dirPath, { recursive: true, force: true });
                }
            }
        }

        res.json({ message: "Evento deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar evento" });
    }
};
