import { Router } from "express";
import { createPayment } from "./services/payments/create_payment";
import { getPayment } from "./services/payments/get_payment";

const routes = Router();


routes.get("/", createPayment)
routes.get("/:payment_id", getPayment)

export default routes;