import { Request, Response } from "express";
import { changePresencaValueInActivity, findAllSubscribersInActivity, findUserAtividadeById } from "../repositories/userAtividadeRepository";

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

export async function changeActivityPresencaValue(req: Request, res: Response){
    try {
        const { atividade_id, user_id } = req.params;

        const activity = await findUserAtividadeById(atividade_id, user_id);

        await changePresencaValueInActivity(atividade_id, user_id, !activity?.presenca);

        return res.status(200).send("Valor alterado com sucesso!");
    } catch (error) {
        return res.status(400).send(error);
    }
}