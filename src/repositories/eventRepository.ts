import { prisma } from "../lib/prisma";
import { createPayment } from "../services/payments/createPayment";
import { findActivityById } from "./activityRepository";
import { createUserAtividade, findAllSubscribersInActivity } from "./userAtividadeRepository";
import { getOrCreateUser } from "./userRepository";

export async function findAllEvents() {
  const response = await prisma.evento.findMany();

  return response;
}

export async function getEventoPrecoById(uuid_evento: string) {
  const evento = await prisma.evento.findUniqueOrThrow({
    where: {
       uuid_evento
    },
    select: {
      lote: {
        select: {
          preco: true
        }
      }
    }
  });

  return evento.lote;
}

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
  lote_id
}: RegisterParticipanteParams) {
  return prisma.$transaction(async () => {

    const user = await getOrCreateUser({nome, nome_cracha, email, instituicao});

    if(await isUserRegisteredInEventFromLote(user.uuid_user, lote_id)){
      throw new Error("Você ja se cadastrou nesse evento!");
    }

    const activities_ids = [
      atividades?.minicurso_id,
      atividades?.workshop_id,
      atividades?.oficina_id,
    ];

    for (const uuid_atividade of activities_ids) {
      if (uuid_atividade) {
        const activity = await findActivityById(uuid_atividade);

        if (!activity) {
          throw new Error("Atividade inválido!");
        }

        if (activity.max_participants) {
          const total_participants = (
            await findAllSubscribersInActivity(uuid_atividade)
          ).length;

          if (total_participants >= activity.max_participants) {
            throw new Error(`A atividade ${activity.nome} já está esgotou as vagas.`);
          }
        }

        await createUserAtividade(user.uuid_user, uuid_atividade);
      }
    }

    return await createPayment(user.uuid_user, lote_id);
  });
}

export async function isUserRegisteredInEventFromLote(
  user_id: string,
  lote_id: string
): Promise<boolean> {

  const lote = await prisma.lote.findUnique({
    where: {
      uuid_lote: lote_id,
    },
    select: {
      uuid_evento: true,
    },
  });

  if (!lote) {
    throw new Error(`Lote com ID ${lote_id} não encontrado.`);
  }

  const event_id = lote.uuid_evento;

  const registrationCount = await prisma.userInscricao.count({
    where: {
      uuid_user: user_id,
      lote: {
        uuid_evento: event_id,
      },
    },
  });

  return registrationCount > 0;
}

export async function getLoteByEventId(id_evento: string){
  const response = await prisma.evento.findUnique({
    where: {
      uuid_evento : id_evento
    },
    select: {
      lote: true
    }
  })

  return response?.lote[0];
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
          nome: 'asc',
        },
      },
    },
  });

  return activities;
}
