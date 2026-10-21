FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY gateway ./gateway
COPY kernel ./kernel
COPY daemons ./daemons
COPY config ./config
COPY database ./database
COPY modules ./modules
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
EXPOSE 11001
CMD ["node", "dist/gateway/server.js"]
