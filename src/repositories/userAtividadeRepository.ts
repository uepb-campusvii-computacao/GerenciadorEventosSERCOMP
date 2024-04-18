import { prisma } from "../lib/prisma";

export async function createUserAtividade(uuid_user: string, uuid_atividade: string){
    await prisma.userAtividade.create({
        data: {
            uuid_user,
            uuid_atividade,
        }
    })
}