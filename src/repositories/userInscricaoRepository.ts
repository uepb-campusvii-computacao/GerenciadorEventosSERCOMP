import { StatusPagamento } from "@prisma/client";
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
      id_payment_mercado_pago,
    },
  });

  return user_inscricao;
}

export async function findUserInscricaoByMercadoPagoId(
  id_payment_mercado_pago: string
) {
  const user_inscricao = await prisma.userInscricao.findFirst({
    where: {
      id_payment_mercado_pago,
    },
  });

  return user_inscricao;
}

export async function chancheStatusPagemento(
  id_payment_mercado_pago: string,
  status_pagamento: StatusPagamento
) {
  const user_inscricao = await findUserInscricaoByMercadoPagoId(
    id_payment_mercado_pago
  );

  await prisma.userInscricao.update({
    where: {
      uuid_lote_uuid_user: {
        uuid_user: user_inscricao!.uuid_user,
        uuid_lote: user_inscricao!.uuid_lote,
      },
    },
    data: {
      status_pagamento,
    },
  });
}
