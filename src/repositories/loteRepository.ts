import { prisma } from "../lib/prisma";

export async function findLoteById(uuid_lote: string) {
  const lote = await prisma.lote.findUniqueOrThrow({
    where: {
      uuid_lote,
    },
  });

  return lote;
}

export async function getLotesAtivosByEventID(id_evento: string){
  const lotes = await prisma.lote.findMany({
    where: {
      uuid_evento: id_evento,
      ativo: true
    }
  });

  return lotes;
}
