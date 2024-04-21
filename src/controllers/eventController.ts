import { Request, Response } from "express";
import {
  findAllActivitiesInEvent,
  findAllEvents,
  getEventoPrecoById,
  getLoteByEventId,
} from "../repositories/eventRepository";
import { findActivitiesInEvent } from "../repositories/activityRepository";
import {
  changeCredenciamentoValue,
  findAllEventsByUserId,
  userInscriptionsWithFullInfo,
  findAllSubscribersInEvent,
  findAllUserInEventByStatusPagamento,
  findUserInscricaoById,
} from "../repositories/userInscricaoRepository";

export async function getAllEvents(req: Request, res: Response) {
  const all_events = await findAllEvents();

  res.send(all_events);
}

export async function getAllEventsByIdUser(req: Request, res: Response) {
  try {
    const { user_id } = req.params;

    const eventos = await findAllEventsByUserId(user_id);

    return res.status(200).json(eventos);
  } catch (error) {
    return res.status(400).send("Informação incorreta");
  }
}

export async function getActivitiesInEvent(req: Request, res: Response) {
  try {
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
        palestras,
      },
    });
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function getAllSubscribersInEvent(req: Request, res: Response) {
  try {
    const { id_evento } = req.params;

    const all_subscribers = await findAllSubscribersInEvent(id_evento);

    if (!all_subscribers) {
      return res.status(400).send("Evento não encontrado");
    }

    return res.status(200).json(
      all_subscribers.map((subscriber) => ({
        uuid_user: subscriber.uuid_user,
        credenciamento: subscriber.credenciamento,
        ...subscriber.usuario,
      }))
    );
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function changeEventCredenciamentoValue(
  req: Request,
  res: Response
) {
  try {
    const { event_id, user_id } = req.params;

    const lote = await getLoteByEventId(event_id);

    const lote_id = lote!.uuid_lote;

    const user_inscricao = await findUserInscricaoById(user_id, lote_id);

    await changeCredenciamentoValue(
      user_id,
      lote_id,
      !user_inscricao?.credenciamento
    );

    return res.status(200).send("Valor Alterado com sucesso!");
  } catch (error) {
    return res.status(400).send("Informações inválidas");
  }
}

export async function getAllActivitiesInEvent(req: Request, res: Response) {
  try {
    const { id_evento } = req.params;

    const all_activities = await findAllActivitiesInEvent(id_evento);

    if (!all_activities) {
      return res.status(400).send("Evento não encontrado");
    }

    return res.status(200).json(all_activities.atividade);
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function getFinancialInformation(req: Request, res: Response) {
  try {
    const { event_id } = req.params;

    const userInscriptions = await userInscriptionsWithFullInfo(event_id);

    const usersRegistered = userInscriptions.length;
    const usersWithPaymentStatusPending = userInscriptions.filter(
      (inscricao) => inscricao.status_pagamento === 'PENDENTE'
    ).length;
    const usersWithPaymentStatusRealizado = userInscriptions.filter(
      (inscricao) => inscricao.status_pagamento === 'REALIZADO'
    );

    let totalArrecadado = 0;
    usersWithPaymentStatusRealizado.forEach((inscricao) => {
      totalArrecadado += inscricao.lote.preco;
    });

    return res.status(200).json({
      total_inscritos: usersRegistered,
      total_arrecadado: totalArrecadado,
      inscricoes_pendentes: usersWithPaymentStatusPending,
    });
  } catch (error) {
    console.error("Erro ao obter informações financeiras:", error);
    return res.status(500).json({ error: 'Erro ao obter informações financeiras' });
  }
}
