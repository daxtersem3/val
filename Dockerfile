# Multi-stage Dockerfile for LP Importados (Vite React + Nginx)

# Stage 1: Build React App with Node 22 (required by Vite 8 and Supabase JS v2.112+)
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

ARG VITE_SUPABASE_URL=https://kyyhkutyazkqcrbnqzba.supabase.co
ARG VITE_SUPABASE_ANON_KEY=sb_publishable_DBqkeyIdUvwUOOuVtVePdQ_Qndhw9cX
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

COPY . .
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine AS runner

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
