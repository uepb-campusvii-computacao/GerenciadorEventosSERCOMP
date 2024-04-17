import { Request, Response } from "express";
import { PrismaClient, StatusPagamento, UserInscricao } from '@prisma/client';
import { payment } from "../../lib/mercado_pago";

const prisma = new PrismaClient();

export async function createPayment(req: Request, res: Response) {
  try {
    const { user_id, lote_id } = req.params;

    const user = await prisma.usuario.findUnique({
      where: {
        uuid_user: user_id,
      },
    });

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    const lote = await prisma.lote.findUnique({
      where: {
        uuid_lote: lote_id,
      },
    });

    if (!lote) {
      return res.status(404).send("Lote não encontrado");
    }

    const requestOptions = {
      idempotencyKey: `${user_id}-${lote_id}`,
    };

    const body = {
      transaction_amount: lote.preco,
      description: "Compra de ingresso",
      payment_method_id: "pix",
      payer: {
        email: user.email,
      },
    };

    // Criar pagamento
    const { id, date_of_expiration } = await payment.create({ body, requestOptions });

    if(!id || !date_of_expiration){
      return res.status(400).send("Erro na criação do link de pagamento");
    }

    const userInscricao : UserInscricao = await prisma.userInscricao.create({
      data: {
        uuid_user: user_id,
        uuid_lote: lote_id,
        id_payment_mercado_pago: id.toString(),
        expiration_datetime: date_of_expiration,
        status_pagamento: StatusPagamento.PENDENTE
      },
    });

    res.status(200).send(userInscricao);

  } catch (error) {

    console.error("Erro ao criar pagamento:", error);
    res.status(500).send("Erro interno do servidor");

  } finally {

    await prisma.$disconnect();
    
  }
}
