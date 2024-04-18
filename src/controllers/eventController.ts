import { Request, Response } from "express";
import { findAllEvents } from "../repositories/eventRepository";
import { findActivitiesInEvent } from "../repositories/activityRepository";

export async function getAllEvents(req: Request, res: Response){
    const all_events = await findAllEvents();

    res.send(all_events);
}

export async function getActivitiesInEvent(req: Request, res: Response){
    const { event_id } = req.params;

    const workshops = await findActivitiesInEvent(event_id, "WORKSHOP");
    const minicursos = await findActivitiesInEvent(event_id, "MINICURSO");
    const oficinas = await findActivitiesInEvent(event_id, "OFICINA");
    const palestras = await findActivitiesInEvent(event_id, "PALESTRA");

    res.status(200).json({
        atividades: {
            minicursos,
            workshops,
            oficinas,
            palestras
        }
    })
}