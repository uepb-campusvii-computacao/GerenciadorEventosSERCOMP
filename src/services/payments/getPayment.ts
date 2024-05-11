import { payment } from "../../lib/mercado_pago";

export async function getPayment(payment_id: string) {
  
  const payment_data = await payment.get({ id: payment_id })

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
