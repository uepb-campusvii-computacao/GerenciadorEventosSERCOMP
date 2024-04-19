import { CreateUserParams } from "../interfaces/createUserParams";
import { prisma } from "../lib/prisma";

export async function findUserByEmail(email: string){
  const user = await prisma.usuario.findUnique({
    where: {
      email,
    },
  });

  return user;
}

export async function createUser({
  nome,
  nome_cracha,
  email,
  instituicao,
}: CreateUserParams) {
  const user_exits = await findUserByEmail(email);

  if (user_exits) {
    throw new Error("Email já cadastrado!");
  }

  const new_user = await prisma.usuario.create({
    data: {
      nome,
      nome_cracha,
      email,
      instituicao,
    },
  });

  return new_user.uuid_user;
}

export async function findUserById(uuid_user: string) {
  const user = await prisma.usuario.findUniqueOrThrow({
    where: {
      uuid_user,
    },
  });

  return user;
}
