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

export async function findUserInscricaoById(uuid_user: string, uuid_lote: string){
  const user_inscricao = await prisma.userInscricao.findUnique({
    where:{
      uuid_lote_uuid_user: {
        uuid_lote,
        uuid_user
      }
    }
  })

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

  if (!user_inscricao) {
    throw new Error("UUID não encontrado!");
  }

  return user_inscricao;
}

export async function changeStatusPagamento(
  uuid_lote: string,
  uuid_user: string,
  status_pagamento: StatusPagamento
) {
  await prisma.userInscricao.update({
    where: {
      uuid_lote_uuid_user: {
        uuid_user,
        uuid_lote
      },
    },
    data: {
      status_pagamento,
    },
  });
}

export async function findAllSubscribersInEvent(event_id: string) {
  const event_exists = await prisma.evento.findUnique({
    where: {
      uuid_evento: event_id
    }
  });

  if(!event_exists){
    throw new Error("UUID incorreto!");
  }

  const all_subscribers = await prisma.userInscricao.findMany({
    where: {
      lote: {
        uuid_evento: event_id,
      },
    },
    select: {
      uuid_user: true,
      credenciamento: true,
      usuario: {
        select: {
          nome: true,
          email: true,
        },
      },
    },
  });

  return all_subscribers;
}


export async function getTotalPaymentsInEventByStatusPagemento(
  uuid_evento: string,
  status_pagamento: StatusPagamento
) {
  const event_exists = await prisma.evento.findUnique({
    where: {
      uuid_evento,
    },
  });

  if (!event_exists) {
    throw new Error("UUID incorreto!");
  }

  const total = await prisma.userInscricao.count({
    where: {
      lote: {
        uuid_evento,
      },
      status_pagamento,
    },
  });

  return total;
}

export async function findAllUserInEventByStatusPagamento(
  uuid_evento: string,
  status_pagamento: StatusPagamento
) {
  const users = await prisma.userInscricao.findMany({
    where: {
      lote: {
        evento: {
          uuid_evento,
        },
      },
      AND: {
        status_pagamento,
      },
    },
    select: {
      uuid_user: true,
      usuario: {
        select: {
          nome: true,
          email: true,
        },
      },
    },
  });

  return users;
}

export async function changeCredenciamentoValue(uuid_user: string, uuid_lote: string, credenciamento_value: boolean){
  await prisma.userInscricao.update({
    where: {
      uuid_lote_uuid_user: {
        uuid_lote,
        uuid_user
      }
    },
    data: {
      credenciamento: credenciamento_value
    }
  })
}