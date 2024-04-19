import { Request, Response } from "express";
import { findAllActivitiesInEvent, findAllEvents } from "../repositories/eventRepository";
import { findActivitiesInEvent } from "../repositories/activityRepository";
import { findAllSubscribersInEvent } from "../repositories/userAtividadeRepository";

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

export async function getAllSubscribersInEvent(req: Request, res: Response){
    const { id_evento } = req.params;

    const all_subscribers = await findAllSubscribersInEvent(id_evento);

    if(!all_subscribers){
        return res.status(400).send("Evento não encontrado")
    }

    return res.status(200).json(
        all_subscribers.map((subscriber) => (
            {
                uuid_user: subscriber.uuid_user,
                ...subscriber.user
            }
        ))
    );
}

export async function getAllActivitiesInEvent(req: Request, res: Response){
    const { id_evento } = req.params;

    const all_activities = await findAllActivitiesInEvent(id_evento);

    if(!all_activities){
        return res.status(400).send("Evento não encontrado")
    }

    return res.status(200).json(all_activities.atividade);
}