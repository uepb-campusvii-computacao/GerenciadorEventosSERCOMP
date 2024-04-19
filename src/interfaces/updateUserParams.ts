import { AtividadesParams } from "./registerUserRequestParam";

export interface UpdateUserParams{
    uuid_user: string;
    nome: string;
    email: string;
    nome_cracha: string;
    instituicao: string;
    atividades: AtividadesParams;
    status_pagamento: "PENDENTE" | "REALIZADO" | "EXPIRADO"
}