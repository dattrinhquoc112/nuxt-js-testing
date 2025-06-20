FROM node:20.18.2-alpine

WORKDIR /app
ARG BUILD_ENV

RUN addgroup -S app -g 1001 && adduser -S app -G app -u 1001

COPY .env.${BUILD_ENV} .env
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build:${BUILD_ENV}

RUN chown -R app:app /app
USER app

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
