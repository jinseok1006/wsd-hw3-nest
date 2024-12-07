# Stage 1: Build Stage
FROM --platform=linux/amd64 node:18

RUN apt-get update && apt-get install -y wget
RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

# 컨테이너 작업 디렉토리 설정
WORKDIR /usr/src/app

# 1. package.json 복사 후 전체 의존성(devDependencies 포함) 설치
COPY . .
RUN npm install

# 2. Prisma 스키마 복사 및 Prisma Client 생성
RUN npx prisma generate
RUN npm run build

RUN npm prune --production


EXPOSE 3000
CMD ["npm", "run", "start:prod"]
