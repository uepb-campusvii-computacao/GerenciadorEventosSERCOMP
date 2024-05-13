import { prisma } from "../lib/prisma";

export async function findAllProductsByEventId(uuid_evento: string) {
  const events = await prisma.produto.findMany({
    where: {
      uuid_evento,
    },
  });

  return events;
}

export async function updateProduct(
  uuid_produto: string,
  nome: string,
  descricao: string,
  estoque: number,
  preco: number,
  imagem_url: string
) {
   const produto = await prisma.produto.update({
        where: {
            uuid_produto
        },
        data: {
            descricao,
            estoque,
            nome,
            preco, 
            imagem_url,
        }
    })

    return produto
}

export async function findProductById(uuid_produto: string){
    const produto = await prisma.produto.findUniqueOrThrow({
        where: {
            uuid_produto
        }
    })

    return produto;
}
