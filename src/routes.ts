import { Router } from "express";
import { createPayment } from "./services/payments/createPayment";
import { getPayment } from "./services/payments/get_payment";
import { registerUser } from "./controllers/userController";

const routes = Router();


routes.post("/register", registerUser);
routes.get("/:payment_id", getPayment)

export default routes;