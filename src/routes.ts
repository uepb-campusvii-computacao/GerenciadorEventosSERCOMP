import { Router } from "express";
import { getUserInscricao, loginUser, registerUser } from "./controllers/userController";
import { getActivitiesInEvent, getAllActivitiesInEvent, getAllSubscribersInEvent } from "./controllers/eventController";
import { checkToken } from "./lib/ensureAuthenticate";
import { getSubscribersInActivity } from "./controllers/activityController";

const routes = Router();


routes.post("/login", loginUser);

routes.post("/register/:lote_id", registerUser);

routes.get("/user/payment/:payment_id", getUserInscricao);

routes.get("/events/:event_id/activities", getActivitiesInEvent);

routes.get("/admin/events/:id_evento/inscricoes", checkToken, getAllSubscribersInEvent);

routes.get("/admin/events/:id_evento/atividades", checkToken, getAllActivitiesInEvent);

routes.get("/admin/atividades/:id_atividade/inscricoes", checkToken, getSubscribersInActivity);


export default routes;