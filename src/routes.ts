import { Router } from "express";
import { getUserInLote, getUserInscricao, loginUser, registerUser, updatePaymentStatus, updateUserInformations } from "./controllers/userController";
import { changeEventCredenciamentoValue, getActivitiesInEvent, getAllActivitiesInEvent, getAllEventsByIdUser, getAllSubscribersInEvent, getFinancialInformation } from "./controllers/eventController";
import { checkToken } from "./lib/ensureAuthenticate";
import { changeActivityPresencaValue, getSubscribersInActivity, upadateUserActivity } from "./controllers/activityController";

const routes = Router();


routes.post("/login", loginUser);

routes.post("/register/:lote_id", registerUser);

routes.get("/user/payment/:payment_id", getUserInscricao);

routes.get("/events/:event_id/activities", getActivitiesInEvent);

routes.get("/lote/:lote_id/inscricoes/:user_id", getUserInLote)

routes.get("/admin/events/:event_id/dashboard", checkToken, getFinancialInformation);

routes.get("/admin/user/:user_id/events", checkToken, getAllEventsByIdUser);

routes.get("/admin/events/:id_evento/inscricoes", checkToken, getAllSubscribersInEvent);

routes.put("/admin/events/:event_id/inscricoes/credenciamento/:user_id", checkToken, changeEventCredenciamentoValue);

routes.get("/admin/events/:id_evento/atividades", checkToken, getAllActivitiesInEvent);

routes.put("/admin/usuario/:user_id/atividades/troca", checkToken, upadateUserActivity);

routes.put("/admin/usuario/:user_id", checkToken, updateUserInformations);

routes.put("/admin/lote/:lote_id/inscricoes/:user_id", checkToken, updatePaymentStatus);

routes.get("/admin/atividades/:id_atividade/inscricoes", checkToken, getSubscribersInActivity);

routes.put("/admin/atividades/:id_atividade/inscricoes/:user_id/frequencia", checkToken, changeActivityPresencaValue);

export default routes;