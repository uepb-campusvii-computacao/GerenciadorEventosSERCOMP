import { Request, Response } from "express";
import { CreateOrderParams } from "../interfaces/createOrderParams";
import { createPaymentMarketPlace } from "../services/payments/createPaymentMarketPlace";

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
