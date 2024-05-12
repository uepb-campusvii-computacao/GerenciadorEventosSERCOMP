import { prisma } from "../lib/prisma";

export async function findAllProducts(uuid_evento: string){
    const events = await prisma.produto.findMany({
        where: {
            uuid_evento
        }
    });

    return events;
}