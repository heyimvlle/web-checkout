FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
EXPOSE 5173
ENV VITE_API_URL=http://localhost:3001
CMD ["npm", "run", "dev", "--", "--host"]
