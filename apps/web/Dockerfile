# apps/web/Dockerfile
#
# Receita da imagem do frontend.
#   - development: servidor do Vite com hot reload (usado pelo docker-compose)
#   - production:  gera os arquivos estáticos e serve com Nginx

FROM node:22-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./

# ---------- Desenvolvimento ----------
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

# ---------- Build ----------
FROM base AS build
RUN npm ci
COPY . .
# Variáveis VITE_* são "embutidas" no JavaScript na hora do build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_API_URL
RUN npm run build

# ---------- Produção ----------
FROM nginx:1.27-alpine AS production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
