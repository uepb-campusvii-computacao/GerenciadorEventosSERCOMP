import { Request, Response } from "express";
import { changePresencaValueInActivity, changeUserAtividade, createUserAtividade, findAllSubscribersInActivity, findUserAtividadeById } from "../repositories/userAtividadeRepository";
import { ChangeActivityParamsRequest } from "../interfaces/changeActivityParamsRequest";
import { findActivityById } from "../repositories/activityRepository";

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

export async function upadateUserActivity(req: Request, res: Response) {
    try {
        const { user_id } = req.params;
        const { uuid_atividade_atual, uuid_atividade_nova }: ChangeActivityParamsRequest = req.body;

        const activity_exists = await findActivityById(uuid_atividade_nova);
        
        if (!activity_exists) {
            throw new Error("UUID inválido!");
        }

        let max_participants = Number(activity_exists.max_participants);

        let total_participants = (await findAllSubscribersInActivity(uuid_atividade_nova)).length


        if(total_participants >= max_participants){
          throw new Error(`A atividade ${activity_exists.nome} já está completa`)
        }

        if(uuid_atividade_atual == ""){
            await createUserAtividade(user_id, uuid_atividade_nova)
        }else{
            await changeUserAtividade(uuid_atividade_atual, uuid_atividade_nova, user_id)
        }


        return res.status(200).send("Alterado com sucesso")
    } catch (error) {
        return res.status(400).send(error)
    }   
}