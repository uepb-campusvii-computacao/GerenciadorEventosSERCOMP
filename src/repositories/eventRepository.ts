import { prisma } from "../lib/prisma";

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

export async function getLoteByEventId(uuid_evento: string){
  const response = await prisma.evento.findUnique({
    where: {
      uuid_evento
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
        },
      },
    },
  });

  return activities;
}
