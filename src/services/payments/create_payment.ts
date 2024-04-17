import { Request, Response } from "express";
import { payment } from "../../lib/mercado_pago";

const body = {
  transaction_amount: 1.0,
  description: "primero pix",
  payment_method_id: "pix",
  payer: {
    email: process.env.EMAIL_USER_MERCADOPAGO || "",
  },
};

export function createPayment(req: Request, res: Response) {
  payment
    .create({ body })
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}
