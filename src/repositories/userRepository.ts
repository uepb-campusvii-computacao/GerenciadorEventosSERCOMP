import { Usuario } from "@prisma/client";
import { CreateUserParams } from "../interfaces/createUserParams";
import { prisma } from "../lib/prisma";

export async function createUser({
  nome,
  nome_cracha,
  email,
  instituicao,
}: CreateUserParams): Promise<Usuario> {
  const user = await findUserByEmail(email);

  if (user) {
    throw new Error("Email já cadastrado");
  }

  const new_user = await prisma.usuario.create({
    data: {
      nome,
      nome_cracha,
      email,
      instituicao,
    },
  });

  return new_user;
}

export async function findUserByEmail(email: string) {
  const user = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function updateUser(
  uuid_user: string,
  nome: string,
  email: string,
  nome_cracha: string,
  instituicao: string
) {
  const user_exists = await findUserByEmail(email);

  if (user_exists && user_exists.uuid_user != uuid_user) {
    throw new Error("Email já cadastrado!");
  }

  const user = await prisma.usuario.update({
    where: {
      uuid_user,
    },
    data: {
      nome,
      nome_cracha,
      email,
      instituicao,
    },
  });

  return user;
}

export async function findUserById(uuid_user: string) {
  const user = await prisma.usuario.findUniqueOrThrow({
    where: {
      uuid_user,
    },
  });

  return user;
}


