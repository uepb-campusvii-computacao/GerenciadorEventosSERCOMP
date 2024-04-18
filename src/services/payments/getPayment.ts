import { payment } from "../../lib/mercado_pago";
import { findUserInscricaoByMercadoPagoId } from "../../repositories/userInscricaoRepository";

export async function getPayment(payment_id: string) {
  const payment_data = await payment.get({ id: payment_id })

  if (!payment_data) {
    throw new Error("Pagamento não encontrado!");
  }

  const transaction_data = {
    qr_code_base64: payment_data.point_of_interaction?.transaction_data?.qr_code_base64,
    qr_code: payment_data.point_of_interaction?.transaction_data?.qr_code,
    ticket_url: payment_data.point_of_interaction?.transaction_data?.ticket_url
  }

  const user_inscricao = await findUserInscricaoByMercadoPagoId(
    payment_data.id!.toString()
  );

  const response = {
    user: {
      ...user_inscricao,
    },
    payment_data: {
      total: payment_data.transaction_amount,
      ...transaction_data
    },
  };

  return response;
}
