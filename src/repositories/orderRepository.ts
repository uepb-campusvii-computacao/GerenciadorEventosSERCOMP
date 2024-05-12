import { CreateOrderParams } from "../interfaces/createOrderParams";
import { prisma } from "../lib/prisma";
import { createPaymentMarketPlace } from "../services/payments/createPaymentMarketPlace";
import { getPayment } from "../services/payments/getPayment";

export async function findAllVendasByUserId(uuid_user: string) {
  const response = prisma.venda.findMany({
    where: {
      uuid_user,
    },
    distinct: ['uuid_pagamento'],
    select: {
      pagamento: {
        select: {
          uuid_user: true,
          uuid_pagamento: true,
          id_payment_mercado_pago: true,
          status_pagamento: true,
          valor_total: true,
          usuario: {
            select: {
              nome: true,
            }
          },
          vendas: {
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

export async function findPagamentoById(uuid_pagamento: string){
  const response = prisma.venda.findFirst({
    where: {
      uuid_pagamento
    },
    distinct: ['uuid_pagamento'],
    select: {
      user: {
        select: {
          nome: true,
        }
      },
      pagamento: {
        select: {
          uuid_pagamento: true,
          id_payment_mercado_pago: true,
          status_pagamento: true,
          valor_total: true,
          vendas: {
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


  if(!response){
    throw new Error("Erro ao buscar pagamento")
  }

  return response
}


export async function changeVendaStatusPagamentoToREALIZADO(uuid_pagamento: string){

  const current_date = new Date();
 
  const pagamento = await prisma.pagamento.update({
    where: {
      uuid_pagamento,
    },
    data: {
      data_pagamento: current_date,
      status_pagamento: "REALIZADO"
    }
  });

  return pagamento;

}

