import { Router } from "express";
import {
    changeActivityPresencaValue,
    getActivityById,
    getSubscribersInActivity,
    upadateUserActivity,
} from "./controllers/activityController";
import {
    changeEventCredenciamentoValue,
    getAllActivitiesInEvent,
    getAllActivitiesInEventOrdenateByTipo,
    getAllEventsByIdUser,
    getAllSubscribersInEvent,
    getFinancialInformation,
    getLotesInEvent,
    registerParticipanteInEvent,
    updateParticipantInformations,
} from "./controllers/eventController";
import {
    getUserInEvent,
    getUserInscricao,
    loginUser,
    realizarPagemento,
    updatePaymentStatus,
} from "./controllers/userController";
import { checkToken } from "./lib/ensureAuthenticate";

const routes = Router();

// Rotas Públicas
routes.post("/login", loginUser);
routes.get("/events/:event_id/lotes", getLotesInEvent);
routes.post("/register/:event_id", registerParticipanteInEvent);
routes.post("/lote/:lote_id/user/:user_id/realizar-pagamento", realizarPagemento);
routes.get("/events/:id_evento/atividades", getAllActivitiesInEventOrdenateByTipo);

// Rotas para usuários (com autenticação)
const userRoutes = Router();
userRoutes.use(checkToken);
userRoutes.get("/user/payment/:payment_id", getUserInscricao);
userRoutes.get("/event/:event_id/inscricao/:user_id", getUserInEvent);
userRoutes.put("/admin/user/:user_id", updateParticipantInformations);
userRoutes.put("/admin/lote/:lote_id/inscricoes/:user_id", updatePaymentStatus);

// Rotas para eventos (com autenticação)
const eventRoutes = Router();
eventRoutes.use(checkToken);
eventRoutes.get("/admin/events/:event_id/dashboard", getFinancialInformation);
eventRoutes.get("/admin/user/:user_id/events", getAllEventsByIdUser);
eventRoutes.get("/admin/events/:id_evento/inscricoes", getAllSubscribersInEvent);
eventRoutes.put("/admin/events/:event_id/inscricoes/credenciamento/:user_id", changeEventCredenciamentoValue);
eventRoutes.get("/admin/events/:id_evento/atividades", getAllActivitiesInEvent);

// Rotas para atividades (com autenticação)
const activityRoutes = Router();
activityRoutes.use(checkToken);
activityRoutes.get("/admin/atividades/:id_atividade/inscricoes", getSubscribersInActivity);
activityRoutes.get("/admin/atividades/:atividade_id", getActivityById);
activityRoutes.put("/admin/atividades/:atividade_id/inscricoes/:user_id/frequencia", changeActivityPresencaValue);
activityRoutes.put("/admin/user/:user_id/atividades/troca", upadateUserActivity);

// Monta os sub-routers no Router principal
routes.use("/", userRoutes);
routes.use("/", eventRoutes);
routes.use("/", activityRoutes);

export default routes;