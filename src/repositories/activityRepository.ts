import { TipoAtividade } from "@prisma/client";
import { prisma } from "../lib/prisma";

export async function findActivityById(uuid_atividade: string) {
  const activity = await prisma.atividade.findUniqueOrThrow({
    where: {
      uuid_atividade,
    },
  });

  return activity;
}

export async function findActivityPubInfoById(uuid_atividade: string) {
  const activity = await prisma.atividade.findUnique({
    where: {
      uuid_atividade: uuid_atividade,
    },
    select: {
      nome: true
    },
  }); 

  return activity;
}

export async function findActivitiesInEvent(uuid_evento: string, tipo_atividade: TipoAtividade){
  const activities = await prisma.atividade.findMany({
    where: {
      uuid_evento,
      AND: {
        tipo_atividade
      }
    }
  })

  return activities;
}
