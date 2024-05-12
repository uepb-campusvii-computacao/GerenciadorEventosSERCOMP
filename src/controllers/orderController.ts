import { Request, Response } from "express";
import { CreateOrderParams } from "../interfaces/createOrderParams";
import { createPaymentMarketPlace } from "../services/payments/createPaymentMarketPlace";
import { changeVendaStatusPagamentoToREALIZADO, findAllVendasByUserId, findPagamentoById } from "../repositories/orderRepository";
import { getPayment } from "../services/payments/getPayment";

export async function createOrder(req: Request, res: Response) {
  try {
    const bodyParams: CreateOrderParams = req.body;

    const response = await createPaymentMarketPlace(bodyParams);

    return res.status(200).json(response);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send(error.message);
    }
    return res.status(400).send(error);
  }
}

export async function getOrders(req: Request, res: Response) {
    try {
      const { user_id } = req.params;
  
      const vendas = await findAllVendasByUserId(user_id);
  
      // Mapear as vendas para obter os detalhes do pagamento de forma assíncrona
      const response = await Promise.all(vendas.map(async (item) => ({
        ...item.pagamento,
        transaction_data: await getPayment(item.pagamento.id_payment_mercado_pago)
      })));
  
      return res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).send(error.message);
      }
      return res.status(400).send(error);
    }
}


export async function realizarPagamentoVenda(req: Request, res: Response) {
  try {
    const { pagamento_id } = req.params;
    const { action } = req.body;

    console.log(action);

    console.log(pagamento_id)

    if (action === "payment.updated") {
      console.log("estou na funcao")
      await changeVendaStatusPagamentoToREALIZADO(pagamento_id);
    }

    return res.status(200).send("Valor alterado");
  } catch (error) {
    return res.status(400).send("informações inválidas");
  }
}