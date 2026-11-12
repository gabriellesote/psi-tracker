# apps/api/Dockerfile
#
# Receita da "caixinha" (imagem) que roda a API.
# Tem dois alvos (stages):
#   - development: roda com hot reload (usado pelo docker-compose)
#   - production:  compila o TypeScript e roda só o JavaScript gerado

FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---------- Desenvolvimento ----------
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3333
CMD ["npm", "run", "dev"]

# ---------- Build ----------
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---------- Produção ----------
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3333
USER node
CMD ["node", "dist/server.js"]
