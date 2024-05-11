import { prisma } from "../lib/prisma";

export async function findAllVendasByUserId(uuid_user: string) {
  const response = prisma.venda.findMany({
    where: {
      uuid_user,
    },
    distinct: ['uuid_pagamento'],
    select: {
      pagamento: {
        select: {
          uuid_pagamento: true,
          id_payment_mercado_pago: true,
          status_pagamento: true,
          valor_total: true,
          venda: {
            select: {
              quantidade: true,
              produto: {
                select: {
                  uuid_produto: true,
                  nome: true,
                  preco: true,
                  imagem_url: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return response;
}
