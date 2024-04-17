import { prisma } from "../lib/prisma";

export async function createUserInscricao(
  uuid_user: string,
  uuid_lote: string,
  id_payment_mercado_pago: string,
  expiration_datetime: string
) {
    const user_inscricao = await prisma.userInscricao.create({
        data: {
            uuid_user,
            uuid_lote,
            expiration_datetime,
            id_payment_mercado_pago
        }
    })

    return user_inscricao;
}
