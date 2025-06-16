FROM node:20-alpine
WORKDIR /app

# ставим pnpm и зависимости
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# остальной код проекта
COPY . .

EXPOSE 3000
CMD ["pnpm", "dev"]