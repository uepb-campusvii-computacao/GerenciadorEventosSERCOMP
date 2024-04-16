import { Router } from "express";
import { payment } from "./lib/mercado_pago";

const routes = Router();

const body = {
	transaction_amount: 1.0,
	description: 'primero pix',
	payment_method_id: 'pix',
	payer: {
		email: process.env.EMAIL_USER_MERCADOPAGO || ""
	},
};

routes.get("/", (req, res) => {
    payment.create({body}).then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        res.status(400).send(err)
    });
})

export default routes;