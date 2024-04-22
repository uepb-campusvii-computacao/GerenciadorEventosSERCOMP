import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { UpdatePaymentStatusParams } from "../interfaces/updatePaymentStatusParams";
import { UserLoginParams } from "../interfaces/userLoginParams";
import {
  findActivitiesByUserId
} from "../repositories/userAtividadeRepository";
import {
  changeStatusPagamento,
  changeStatusPagamentoToREALIZADO,
  findUserInscricaoByEventId,
  findUserInscricaoById
} from "../repositories/userInscricaoRepository";
import {
  findUserByEmail,
  findUserById
} from "../repositories/userRepository";
import { getPayment } from "../services/payments/getPayment";
import { checkPassword } from "../services/user/checkPassword";
import { findLoteById } from "../repositories/loteRepository";

export async function loginUser(req: Request, res: Response) {
  const params: UserLoginParams = req.body;

  const { email, senha } = params;

  const userExists = await findUserByEmail(email);

  if (!userExists) {
    return res.status(401).send("email não encontrado");
  }

  const password_encrypted = userExists.senha || "";

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
      expiresIn: "12h",
    }
  );

  return res.status(200).json({ token: token, user_id: userExists.uuid_user });
}

export async function realizarPagemento(req: Request, res: Response) {
  try {
    const { lote_id, user_id } = req.params;

    console.log("teste");
    await changeStatusPagamentoToREALIZADO(lote_id, user_id);

    return res.status(200).send("Valor alterado");
  } catch (error) {
    return res.status(400).send("informações inválidas");
  }
}

export async function getUserInformation(req: Request, res: Response) {
  try {
    const { user_id, lote_id } = req.params;

    const atividades = await findActivitiesByUserId(user_id);
    const user = await findUserById(user_id);
    const user_inscricao = await findUserInscricaoById(user_id, lote_id);
    const lote = await findLoteById(lote_id)

    const response = {
      user_name: user.nome,
      inscricao: {
        status: user_inscricao?.status_pagamento,
        nome_lote: lote.nome,
        preco: lote.preco
      },
      atividades: atividades.map(atividade => ({
        nome: atividade.nome,
        tipo: atividade.tipo_atividade,
      }))
    }


    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function getUserInscricao(req: Request, res: Response) {
  try {
    const { user_id, lote_id } = req.params;

    const payment = await getPayment(user_id, lote_id);

    return res.status(200).json(payment);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function getUserInEvent(req: Request, res: Response) {
  try {
    const { event_id, user_id } = req.params;

    const personal_user_information = await findUserById(user_id);

    const activities = await findActivitiesByUserId(user_id);

    const user_inscricao = await findUserInscricaoByEventId(user_id, event_id);

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
      credenciamento: user_inscricao?.credenciamento,
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
