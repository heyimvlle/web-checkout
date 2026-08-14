# Etapa base com Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia os arquivos de configuração do npm/yarn/pnpm e instala as dependências
COPY package.json package-lock.json* ./
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta que o Vite utiliza (5173 por padrão)
EXPOSE 5173

# Variável de ambiente padrão, será sobrescrita pelo docker-compose se necessário
ENV VITE_API_URL=http://localhost:3001

# Inicia a aplicação usando Vite com host exposto para ser acessível externamente
CMD ["npm", "run", "dev", "--", "--host"]
