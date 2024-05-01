import { prisma } from "../lib/prisma";
import { createPayment } from "../services/payments/createPayment";
import { isUserRegisteredInLote } from "./loteRepository";
import { registerUserInActivities } from "./userAtividadeRepository";
import { createUserInscricao } from "./userInscricaoRepository";
import { createUser } from "./userRepository";

export interface RegisterParticipanteParams {
  nome: string;
  nome_cracha: string;
  email: string;
  instituicao: string;
  atividades?: {
    minicurso_id?: string;
    workshop_id?: string;
    oficina_id?: string;
  };
  lote_id: string;
}

export async function registerParticipante({
  nome,
  nome_cracha,
  email,
  instituicao,
  atividades,
  lote_id,
}: RegisterParticipanteParams) {
  return await prisma.$transaction(async (tx) => {
    const user = await createUser(tx, {
      nome,
      nome_cracha,
      email,
      instituicao,
    });

    if (await isUserRegisteredInLote(tx, user.uuid_user, lote_id)) {
      throw new Error("Você já se cadastrou nesse evento!");
    }

    await registerUserInActivities(tx, user.uuid_user, atividades);

    const { payment_id, expiration_date } = await createPayment(tx, user.uuid_user, lote_id);

    return await createUserInscricao(tx, user.uuid_user, lote_id, payment_id, expiration_date);
  });
}

export async function findAllActivitiesInEvent(uuid_evento: string) {
  const activities = await prisma.evento.findFirst({
    where: {
      uuid_evento,
    },
    select: {
      atividade: {
        select: {
          uuid_atividade: true,
          nome: true,
          max_participants: true,
          tipo_atividade: true,
          _count: {
            select: {
              userAtividade: true,
            },
          },
        },
        orderBy: {
          nome: "asc",
        },
      },
    },
  });

  return activities;
}

export async function getEventoPrecoById(uuid_evento: string) {
  const evento = await prisma.evento.findUniqueOrThrow({
    where: {
      uuid_evento,
    },
    select: {
      lote: {
        select: {
          preco: true,
        },
      },
    },
  });

  return evento.lote;
}

export async function findAllEvents() {
  const response = await prisma.evento.findMany();

  return response;
}