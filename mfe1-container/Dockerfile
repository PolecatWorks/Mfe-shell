FROM node:22-alpine AS build

WORKDIR /app

COPY . .

# Build Shared Library
WORKDIR /app/mfe-shell-container
RUN npm ci
RUN npm run build

# Build MFE1
WORKDIR /app/mfe1-container
RUN npm install

# Link Shared Library
WORKDIR /app/mfe-shell-container/dist/mfe-shared
RUN npm link

WORKDIR /app/mfe1-container
RUN npm link mfe-shared

RUN npx ng build --configuration production

# Stage 2: Serve
FROM nginx:alpine
COPY --from=build /app/mfe1-container/dist/mfe1-container/browser /usr/share/nginx/html
COPY mfe1-container/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
