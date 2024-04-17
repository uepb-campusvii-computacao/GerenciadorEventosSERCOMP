import { Request, Response } from "express";
import { payment } from "../../lib/mercado_pago";

export function getPayment(req: Request, res: Response) {
  const { payment_id } = req.params;

  //Modificar para retornar os dados do nosso banco de dados e não da api do MercadoPago
  payment
    .get({id: payment_id})
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
}
