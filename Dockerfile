FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy everything except .env
COPY . .
RUN rm -f .env

# Build with environment variables from build args
ARG VITE_OIDC_ISSUER
ARG VITE_OIDC_CLIENT_ID
ARG VITE_OIDC_REDIRECT_URI
ARG VITE_OIDC_SCOPE
ARG VITE_OIDC_RESPONSE_TYPE
ARG VITE_ENABLE_SKINS
ARG VITE_USER_CONFIG

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
