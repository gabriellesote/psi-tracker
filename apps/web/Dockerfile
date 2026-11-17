# apps/web/Dockerfile
#
# Receita da imagem do site, construída a partir da RAIZ do repositório.
#   - development: servidor do Vite com hot reload (usado pelo docker-compose)
#   - production:  gera os arquivos estáticos e serve com Nginx

FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY apps/mobile/package.json apps/mobile/
COPY packages/shared/package.json packages/shared/

# ---------- Desenvolvimento ----------
FROM base AS development
RUN npm ci --workspace @psi-tracker/web
COPY packages/shared packages/shared
COPY apps/web apps/web
WORKDIR /app/apps/web
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---------- Build ----------
FROM base AS build
RUN npm ci --workspace @psi-tracker/web
COPY packages/shared packages/shared
COPY apps/web apps/web
# Variáveis VITE_* são "embutidas" no JavaScript na hora do build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_API_URL
RUN npm run build --workspace @psi-tracker/web

# ---------- Produção ----------
FROM nginx:1.27-alpine AS production
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
