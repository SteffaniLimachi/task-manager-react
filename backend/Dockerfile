# Backend Node/Express + TypeScript + Prisma
FROM node:20-alpine

WORKDIR /app

# package*.json y prisma/schema.prisma primero: postinstall corre "prisma generate",
# que necesita el schema presente, y esta capa se cachea mientras no cambien.
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
