CREATE DATABASE IF NOT EXISTS inscricoes_sercomp;

USE inscricoes_sercomp;

-- BINARY(16) é para guardar UUID na forma binaria
-- VARCHAR(80) na senha é para guardar o hash resultante do algoritmo BCrypt

CREATE TABLE IF NOT EXISTS tb_usuario (
    uuid_user BINARY(16) PRIMARY KEY,
    nome VARCHAR(255) UNIQUE NOT NULL,
    nome_cracha VARCHAR(255) UNIQUE NOT NULL,
    instituicao VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(80),  --BCRYPT
    perfil VARCHAR(30) NOT NULL CHECK (perfil IN ('ADMIN', 'PARTICIPANTE'))
);

CREATE TABLE IF NOT EXISTS tb_evento (
    uuid_evento BINARY(16) PRIMARY KEY,
    uuid_user BINARY(16) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    FOREIGN KEY (uuid_user) REFERENCES tb_usuario(uuid_user)
);

CREATE TABLE IF NOT EXISTS tb_lote (
    uuid_lote BINARY(16) PRIMARY KEY,
    uuid_evento BINARY(16) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    FOREIGN KEY (uuid_evento) REFERENCES tb_evento(uuid_evento)
);

CREATE TABLE IF NOT EXISTS tb_atividade (
    uuid_atividade BINARY(16) PRIMARY KEY,
    uuid_evento BINARY(16) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    max_participants INTEGER,
    FOREIGN KEY (uuid_evento) REFERENCES tb_evento(uuid_evento)
);

CREATE TABLE IF NOT EXISTS tb_atividade_participante (
    uuid_user BINARY(16) NOT NULL,
    uuid_atividade BINARY(16) NOT NULL,
    PRIMARY KEY (uuid_user, uuid_atividade),
    FOREIGN KEY (uuid_user) REFERENCES tb_usuario(uuid_user),
    FOREIGN KEY (uuid_atividade) REFERENCES tb_atividade(uuid_atividade)
);

CREATE TABLE IF NOT EXISTS tb_inscricao (
    uuid_inscricao BINARY(16) PRIMARY KEY,
    uuid_evento BINARY(16) NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    FOREIGN KEY (uuid_evento) REFERENCES tb_evento(uuid_evento)
);

CREATE TABLE IF NOT EXISTS tb_user_inscricao (
    uuid_inscricao BINARY(16) NOT NULL,
    uuid_user BINARY(16) NOT NULL,
    id_payment_mercado_pago VARCHAR(20) NOT NULL,
    status_pagamento VARCHAR(30) NOT NULL CHECK (status_pagamento IN ('PENDENTE', 'REALIZADO', 'EXPIRADO')),
    PRIMARY KEY (uuid_inscricao, uuid_user),
    FOREIGN KEY (uuid_inscricao) REFERENCES tb_inscricao(uuid_inscricao),
    FOREIGN KEY (uuid_user) REFERENCES tb_usuario(uuid_user)
);

