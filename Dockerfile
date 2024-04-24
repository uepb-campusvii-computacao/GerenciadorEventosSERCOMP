# !!! ATENÇÃO !!!
# Este Dockerfile é referente apenas para teste de downgrade para funcionar
# no VPS da hostgator (CentOS 7 com Node16)
FROM centos:7

# Instale as dependências necessárias para rodar Node.js e compilar código-fonte
RUN yum -y update && \
    yum -y install epel-release && \
    yum -y install nodejs npm

# Verifique a versão do Node.js para garantir que seja 16
RUN node -v
RUN npm -v

# Defina o diretório de trabalho para o contêiner
WORKDIR /app

# Copie os arquivos de configuração do Node.js (package.json e package-lock.json, se disponível)
COPY package*.json package-lock.json ./

# Instale as dependências do Node.js
RUN npm install

# Copie o restante do código do seu aplicativo para o diretório de trabalho
COPY . .

# Configure o Prisma
RUN npx prisma generate

# Crie a build do projeto
RUN npm run build

# Exponha a porta que seu aplicativo usa
EXPOSE 3000

# Defina o comando para iniciar o aplicativo
CMD ["npm", "start"]
