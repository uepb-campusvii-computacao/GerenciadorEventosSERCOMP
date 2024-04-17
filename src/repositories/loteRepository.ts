import { prisma } from "../lib/prisma";

export async function findLoteById(uuid_lote: string) {
  const lote = prisma.lote.findUniqueOrThrow({
    where: {
      uuid_lote,
    },
  });

  return lote;
}

