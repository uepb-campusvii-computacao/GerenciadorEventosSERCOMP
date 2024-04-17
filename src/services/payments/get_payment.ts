import { Request, Response } from "express";
import { payment } from "../../lib/mercado_pago";

export function getPayment(req: Request, res: Response) {
  const { payment_id } = req.params;

  payment
    .get({id: payment_id})
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
}
