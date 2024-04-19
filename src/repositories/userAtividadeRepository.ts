import { UpdateUserParams } from "../interfaces/updateUserParams";
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

export async function findUserAtividadeById(uuid_atividade: string, uuid_user: string) {
  const activity = await prisma.userAtividade.findUnique({
    where: {
      uuid_user_uuid_atividade: {
        uuid_atividade,
        uuid_user
      }
    }
  });

  return activity;
}

export async function changeActivity(uuid_user: string, uuid_atividade_atual: string, uuid_atividade_nova: string){
  await prisma.userAtividade.update({
    where: {
      uuid_user_uuid_atividade: {
        uuid_atividade: uuid_atividade_atual,
        uuid_user
      }
    },
    data: {
      uuid_atividade: uuid_atividade_nova,
    }
  })
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

export async function changePresencaValueInActivity(uuid_atividade: string, uuid_user: string, presenca_value: boolean){
  await prisma.userAtividade.update({
    where: {
      uuid_user_uuid_atividade: {
        uuid_atividade,
        uuid_user
      }
    },
    data: {
      presenca: presenca_value
    }
  })
}
