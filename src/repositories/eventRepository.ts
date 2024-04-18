import { prisma } from "../lib/prisma";

export async function findAllEvents(){
    const response = await prisma.evento.findMany();

    return response;
}
