# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json .npmrc ./

RUN --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN \
    npm ci

# Copy source code
COPY . .

# Build mfe2
# Assuming npm run build outputs to dist/
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine

# Copy built artifacts to nginx html directory
# mfe2 build script outputs to dist/, not dist/mfe2-container/browser
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
