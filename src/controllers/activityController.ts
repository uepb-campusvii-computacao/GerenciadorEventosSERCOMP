import { Request, Response } from "express";
import { findAllSubscribersInActivity } from "../repositories/userAtividadeRepository";

export async function getSubscribersInActivity(req: Request, res: Response){
    const { id_atividade } = req.params

    const subscribers = await findAllSubscribersInActivity(id_atividade);

    if(!subscribers){
        return res.status(400).send("Atividade não encontrada")
    }

    return res.status(200).json(subscribers.map(subscriber => (
        {
            uuid_user: subscriber.uuid_user,
            presenca: subscriber.presenca,
            ...subscriber.user
        }
    )))
}