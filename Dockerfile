# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Pass build-time env vars
ARG VITE_GEMINI_API_KEY
ARG VITE_GEMINI_API_KEY_BACKUP
ARG VITE_GCP_PROJECT_ID
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY_BACKUP=$VITE_GEMINI_API_KEY_BACKUP
ENV VITE_GCP_PROJECT_ID=$VITE_GCP_PROJECT_ID

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
