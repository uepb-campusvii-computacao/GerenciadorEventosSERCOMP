import { Request, Response } from "express";
import { RegisterUserRequestParams } from "../interfaces/registerUserRequestParam";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "../repositories/userRepository";
import {
  createUserAtividade,
  findActivitiesByUserId,
  findAllSubscribersInActivity,
} from "../repositories/userAtividadeRepository";
import { findActivityById } from "../repositories/activityRepository";
import { createPayment } from "../services/payments/createPayment";
import { getPayment } from "../services/payments/getPayment";
import { UserLoginParams } from "../interfaces/userLoginParams";
import jsonwebtoken from "jsonwebtoken";
import {
  changeStatusPagamento,
  changeStatusPagamentoToREALIZADO,
  findUserInscricaoById,
} from "../repositories/userInscricaoRepository";
import { UpdatePaymentStatusParams } from "../interfaces/updatePaymentStatusParams";
import { UpdateUserParams } from "../interfaces/updateUserParams";
import { checkPassword } from "../services/user/checkPassword";

export async function loginUser(req: Request, res: Response) {
  const params: UserLoginParams = req.body;

  const { email, senha } = params;

  const userExists = await findUserByEmail(email);
  
  if (!userExists) {
    return res.status(401).send("email não encontrado");
  }

  const password_encrypted = userExists.senha || ""

  const check_password = await checkPassword(senha, password_encrypted);

  if (!check_password) {
    return res.status(401).send("Senha inválida!");
  }

  const token = jsonwebtoken.sign(
    {
      id: userExists.uuid_user,
    },
    String(process.env.SECRET),
    {
      expiresIn: "4h",
    }
  );

  return res.status(200).json({ token: token, user_id: userExists.uuid_user });
}

export async function registerUser(req: Request, res: Response) {
  try {
    const {
      nome,
      email,
      instituicao,
      nome_cracha,
      atividades,
    }: RegisterUserRequestParams = req.body;

    const { lote_id } = req.params;

    const use_id = await createUser({ nome, nome_cracha, email, instituicao });

    const activities_ids = [
      atividades?.minicurso_id,
      atividades?.oficina_id,
      atividades?.workshop_id,
    ];

    for (const uuid_atividade of activities_ids) {
      if (uuid_atividade) {
        const activity_exists = await findActivityById(uuid_atividade);

        if (!activity_exists) {
          throw new Error("UUID inválido!");
        }

        let max_participants = Number(activity_exists.max_participants);

        let total_participants = (
          await findAllSubscribersInActivity(uuid_atividade)
        ).length;

        if (total_participants >= max_participants) {
          throw new Error(
            `A atividade ${activity_exists.nome} já está completa`
          );
        }

        await createUserAtividade(use_id, uuid_atividade);
      }
    }

    const user = await createPayment(use_id, lote_id);

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json(error);
  }
}

export async function realizarPagemento(req: Request, res: Response){
  try {
    const { lote_id, user_id } = req.params;

    console.log("teste")
    await changeStatusPagamentoToREALIZADO(lote_id, user_id);


    return res.status(200).send("Valor alterado")
  } catch (error) {
    return res.status(400).send("informações inválidas")
  }
}

export async function updateUserInformations(req: Request, res: Response) {
  try {
    const { user_id } = req.params;

    const { nome, email, nome_cracha, instituicao }: UpdateUserParams =
      req.body;

    await updateUser(user_id, nome, email, nome_cracha, instituicao);

    return res.status(200).send("Dados alterados com sucesso!");
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function getUserInscricao(req: Request, res: Response) {
  try {
    const { payment_id } = req.params;

    const payment = await getPayment(payment_id);

    return res.status(200).json(payment);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function getUserInLote(req: Request, res: Response) {
  try {
    const { lote_id, user_id } = req.params;

    const personal_user_information = await findUserById(user_id);

    const activities = await findActivitiesByUserId(user_id);

    const user_inscricao = await findUserInscricaoById(user_id, lote_id);

    const response = {
      personal_user_information: {
        uuid: personal_user_information.uuid_user,
        nome: personal_user_information.nome,
        nome_cracha: personal_user_information.nome_cracha,
        email: personal_user_information.email,
        instituicao: personal_user_information.instituicao,
      },
      atividades: activities,
      status_pagamento: user_inscricao?.status_pagamento,
      credenciamento: user_inscricao?.credenciamento
    };

    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).send("Informações inválidas");
  }
}

export async function updatePaymentStatus(req: Request, res: Response) {
  try {
    const { lote_id, user_id } = req.params;
    const { status_pagamento }: UpdatePaymentStatusParams = req.body;

    await changeStatusPagamento(lote_id, user_id, status_pagamento);

    res.status(200).send("Alterado com sucesso!");
  } catch (error) {
    return res.status(400).send(error);
  }
}
