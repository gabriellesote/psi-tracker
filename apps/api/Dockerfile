# apps/api/Dockerfile
#
# Receita da imagem da API. Ela é construída a partir da RAIZ do repositório
# (o docker-compose cuida disso), porque precisa do pacote packages/shared.
#   - development: roda com hot reload (usado pelo docker-compose)
#   - production:  gera dist/server.js com o tsup e roda só o JavaScript

FROM node:22-alpine AS base
WORKDIR /app
# Primeiro só os package.json: assim o Docker reaproveita o "npm ci"
# enquanto as dependências não mudarem (builds bem mais rápidos)
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/mobile/package.json apps/mobile/
COPY packages/shared/package.json packages/shared/

# ---------- Desenvolvimento ----------
FROM base AS development
RUN npm ci --workspace @psi-tracker/api
COPY packages/shared packages/shared
COPY apps/api apps/api
WORKDIR /app/apps/api
EXPOSE 3333
CMD ["npm", "run", "dev"]

# ---------- Build ----------
FROM base AS build
RUN npm ci --workspace @psi-tracker/api
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build --workspace @psi-tracker/api

# ---------- Produção ----------
FROM base AS production
ENV NODE_ENV=production
RUN npm ci --workspace @psi-tracker/api --omit=dev
COPY --from=build /app/apps/api/dist apps/api/dist
WORKDIR /app/apps/api
EXPOSE 3333
USER node
CMD ["node", "dist/server.js"]
