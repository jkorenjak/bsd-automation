FROM mcr.microsoft.com/playwright:latest

WORKDIR /tests

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma/

RUN npx prisma generate

COPY tests/ ./tests/
COPY utils/ ./utils/
COPY playwright.config.ts ./

CMD ["npx", "playwright", "test"]
