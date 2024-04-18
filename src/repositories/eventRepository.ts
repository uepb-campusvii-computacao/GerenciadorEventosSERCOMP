import { prisma } from "../lib/prisma";

export async function findAllEvents(){
    const response = await prisma.evento.findMany();

    return response;
}

export async function findAllActivitiesInEvent(uuid_evento: string){
    const activities = await prisma.evento.findFirst({
        where: {
            uuid_evento
        }, 
        select: {
            atividade: {
                select: {
                    uuid_atividade: true,
                    nome: true,
                    max_participants: true,
                    tipo_atividade: true,
                }
            }
        }
    })

    return activities;
}