import { Router } from "express";
import { getUserInscricao, registerUser } from "./controllers/userController";
import { getActivitiesInEvent } from "./controllers/eventController";

const routes = Router();


routes.post("/register/:lote_id", registerUser);
routes.get("/user/payment/:payment_id", getUserInscricao);

routes.get("/events/:event_id/activities", getActivitiesInEvent);


export default routes;