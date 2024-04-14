import { MercadoPagoConfig, Payment } from "mercadopago";
import * as dotenv from 'dotenv';

dotenv.config();

const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN_MERCADOPAGO || "", options: { timeout: 5000, idempotencyKey: 'abc' } });

export const payment = new Payment(client);

const requestOptions = {
	idempotencyKey: '<IDEMPOTENCY_KEY>',
};

// Step 6: Make the request
//payment.create({ body, requestOptions }).then(console.log).catch(console.log);
