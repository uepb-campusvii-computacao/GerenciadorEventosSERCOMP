import { prisma } from "../lib/prisma";

export async function createUserAtividade(
  uuid_user: string,
  uuid_atividade: string
) {
  await prisma.userAtividade.create({
    data: {
      uuid_user,
      uuid_atividade,
    },
  });
}

export async function findAllSubscribersInEvent(event_id: string) {
  const all_subscribers = await prisma.userAtividade.findMany({
    where: {
      atividade: {
        uuid_evento: event_id,
      },
    },
    select: {
      uuid_user: true,
      user: {
        select: {
          nome: true,
          email: true,
          nome_cracha: true,
        },
      },
    },
  });

  return all_subscribers;
}

export async function findAllSubscribersInActivity(uuid_atividade: string) {
  const subscribers = await prisma.userAtividade.findMany({
    where: {
      uuid_atividade,
    },
    select: {
      uuid_user: true,
      presenca: true,
      user: {
        select: {
          nome: true,
          email: true,
          nome_cracha: true,
        },
      },
    },
  });

  return subscribers;
}
