import { prisma } from "../lib/prisma";

export async function findActivityById(uuid_atividade: string) {
  const activity = await prisma.atividade.findUniqueOrThrow({
    where: {
      uuid_atividade,
    },
  });

  return activity;
}
