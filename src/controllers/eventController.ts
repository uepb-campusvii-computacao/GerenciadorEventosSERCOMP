import { Request, Response } from "express";
import {
  findAllActivitiesInEvent,
  findAllEvents,
  getEventoPrecoById,
} from "../repositories/eventRepository";
import { findActivitiesInEvent } from "../repositories/activityRepository";
import { changeCredenciamentoValue, findAllSubscribersInEvent, findAllUserInEventByStatusPagamento, findUserInscricaoById } from "../repositories/userInscricaoRepository";

export async function getAllEvents(req: Request, res: Response) {
  const all_events = await findAllEvents();

  res.send(all_events);
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

export async function changeEventCredenciamentoValue(req: Request, res: Response) {
  try {
    const { user_id, lote_id } = req.params

    const user_inscricao = await findUserInscricaoById(user_id, lote_id);

    await changeCredenciamentoValue(user_id, lote_id, !user_inscricao?.credenciamento);

    return res.status(200).send("Valor Alterado com sucesso!")
  } catch (error) {
    return res.status(400).send(error)
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

export async function getFinancialInformation(req: Request, res: Response){
  try{
    const { event_id } = req.params;

    const total_users_registered = await findAllSubscribersInEvent(event_id)

    const total_users_with_payment_status_pendente = await findAllUserInEventByStatusPagamento(event_id, "PENDENTE");

    const total_users_with_payment_status_realizado = await findAllUserInEventByStatusPagamento(event_id, "REALIZADO");

    const precos = await getEventoPrecoById(event_id);

    const total_arrecadado = total_users_with_payment_status_realizado.length * precos[0].preco

    res.status(200).json({
      total_inscritos: total_users_registered.length,
      total_arrecadado: total_arrecadado,
      inscricoes_pendentes: total_users_with_payment_status_pendente.length
    })
  }catch(error){
    return res.status(400).json(error)
  }
}
