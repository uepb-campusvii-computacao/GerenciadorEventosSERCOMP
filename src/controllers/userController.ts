import { Request, Response } from "express";
import { RegisterUserRequestParams } from "../interfaces/registerUserRequestParam";
import { createUser } from "../repositories/userRepository";
import { createUserAtividade } from "../repositories/userAtividadeRepository";
import { findActivityById } from "../repositories/activityRepository";

export async function registerUser(req: Request, res: Response) {
  try {
    const {
      nome,
      email,
      instituicao,
      nome_cracha,
      minicurso_id,
      oficina_id,
      workshop_id,
    }: RegisterUserRequestParams = req.body.params;

    const use_id = await createUser({ nome, nome_cracha, email, instituicao });

    const activities_ids = [minicurso_id, oficina_id, workshop_id];

    if (activities_ids.length == 0) {
      throw new Error("É necessário se matricula em pelo menos uma atividade");
    }

    for (const uuid_atividade of activities_ids) {
      if (uuid_atividade) {
        const activity_exits = await findActivityById(uuid_atividade);

        if (!activity_exits) {
          throw new Error("UUID inválido!");
        }

        await createUserAtividade(use_id, uuid_atividade);
      }
    }

   
    return res.status(200).json({
      message: "cadastrado nas atividades"
    });
  } catch (error) {
    res.status(200).json(error);
  }
}
