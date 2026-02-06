# Stage 1: Build the Angular application
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Stage 2: Serve with Nginx
FROM nginx:alpine

#Copy the MFE Shell app
COPY --from=build /app/dist/mfe-shell-container/browser /usr/share/nginx/html

# Also copy mfe-shared library for other containers to use
COPY --from=build /app/dist/mfe-shared /usr/share/mfe-shared

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
