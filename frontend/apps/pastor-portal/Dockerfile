FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/pastor-portal/package.json apps/pastor-portal/
RUN npm install
COPY packages/shared/ packages/shared/
COPY apps/pastor-portal/ apps/pastor-portal/
WORKDIR /app/apps/pastor-portal
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npx vite build

FROM nginx:alpine
COPY --from=builder /app/apps/pastor-portal/dist /usr/share/nginx/html
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
