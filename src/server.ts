import express from "express";
import cors from "cors"
import * as dotenv from 'dotenv';
import { payment } from "./lib/mercado_pago";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const body = {
	transaction_amount: 12.34,
	description: 'primero pix',
	payment_method_id: 'pix',
	payer: {
		email: process.env.EMAIL_USER_MERCADOPAGO || ""
	},
};

app.get("/", (req, res) => {
    payment.create({body}).then((response) => {
        res.status(200).send(response)
    }).catch((err) => {
        res.status(400).send(err)
    });
})

app.listen(3000, () => (
    console.log("Http server running!")
));