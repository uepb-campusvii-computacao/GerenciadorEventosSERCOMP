import { payment } from "../../lib/mercado_pago";
import { findUserInscricaoById, findUserInscricaoByMercadoPagoId } from "../../repositories/userInscricaoRepository";

export async function getPayment(user_id: string, lote_id: string) {
  const user_inscricao = await findUserInscricaoById(user_id, lote_id)
  const payment_data = await payment.get({ id: user_inscricao!.id_payment_mercado_pago })

  if (!payment_data) {
    throw new Error("Pagamento não encontrado!");
  }

  const transaction_data = {
    qr_code_base64: "data:image/png;base64,"+payment_data.point_of_interaction?.transaction_data?.qr_code_base64,
    qr_code: payment_data.point_of_interaction?.transaction_data?.qr_code,
    ticket_url: payment_data.point_of_interaction?.transaction_data?.ticket_url
  }

  return transaction_data;
}
