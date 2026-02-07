# Use mfe-shell image for mfe-shared library
ARG MFE_SHELL_IMAGE=mfe-shell-container:latest
FROM ${MFE_SHELL_IMAGE} AS mfe-shell

FROM node:22-alpine AS build

WORKDIR /app

# Copy and link mfe-shared library from mfe-shell image
COPY --from=mfe-shell /usr/share/mfe-shared /tmp/mfe-shared
WORKDIR /tmp/mfe-shared
RUN npm link

# Copy mfe1 application
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Link mfe-shared into mfe1
RUN npm link mfe-shared

COPY . .

# Build mfe1
RUN npx ng build --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/mfe1-container/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
