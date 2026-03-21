# Use node alpine as build env
FROM node:22-alpine AS build

WORKDIR /app

# Accept GitHub token and specific shared version for dynamic PR testing
ARG NODE_AUTH_TOKEN
ARG MFE_SHARED_VERSION=latest

# Copy application code
COPY package.json package-lock.json ./

# Add .npmrc for GitHub Packages inside the container before install
RUN echo "@polecatworks:registry=https://npm.pkg.github.com" > .npmrc && \
    echo "//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}" >> .npmrc

# Explicitly install desired mfe-shared version to update the lockfile accurately before full CI install
RUN npm install @polecatworks/mfe-shared@${MFE_SHARED_VERSION} --package-lock-only --ignore-scripts
RUN npm ci

# Force mfe-shared to be a real directory (not a symlink) to fix resolution issues

COPY . .

# Build mfe1
RUN npx ng build --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/dist/mfe1-container/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
