# 구인구직 백엔드 서버

본 프로젝트는 **구인구직 사이트의 채용공고 데이터를 크롤링**하여 수집하고, 이를 **MySQL** 데이터베이스에 저장한 뒤, **NestJS** 기반의 **REST API**로 제공하는 백엔드 서버입니다. **JWT 인증**, **Redis 캐싱**, **Swagger 문서화**, **JCloud 배포** 등 실제 서비스 운영 환경을 고려한 다양한 기능을 구현하였습니다.


## 디렉토리 구조 (주요 모듈만 발췌)

```bash
src/
├─ applications/          # 지원서 관련 로직 (신청, 취소, 조회)
│  └─ dto/
├─ auth/                  # 인증/인가 관련 로직 (로그인, 회원가입, 토큰 관리)
│  └─ dto/
├─ bookmarks/             # 북마크 관련 기능
│  └─ dto/
├─ cache/                 # Redis 캐싱 관련 모듈
├─ common/                # 공통 유틸, 데코레이터, 인터셉터, 예외 처리
│  ├─ cache/              # 전역 캐시 인터셉터, 캐시 키 헬퍼
│  ├─ custom-error.ts
│  ├─ logger.middleware.ts
│  └─ response.dto.ts
├─ exception/             # 글로벌 및 Prisma 예외 필터
├─ jobs/                  # 채용공고 관리 (CRUD, 검색, 필터링)
│  └─ dto/
├─ logger/                # 로깅 관련 설정 (Winston)
├─ main.ts                # 애플리케이션 진입점
├─ metadata/              # 메타데이터(포지션, 기술스택) 관리
│  └─ dto/
├─ prisma/                # Prisma 모듈 및 서비스
├─ reviews/               # 리뷰 관리 (등록, 조회, 삭제)
│  └─ dto/
├─ token/                 # 토큰 관리 로직 (JWT 생성, 검증)
├─ users/                 # 사용자 관리 (프로필 조회/수정)
│  └─ dto/
└─ utils/                 # 유틸 함수 (Base64 인코딩, API 응답 데코레이터 등)
```

### 추가 디렉토리

- ./db: MySQL 데이터베이스의 데이터를 영구 저장하기 위한 볼륨.
- ./logs: 애플리케이션과 서비스의 로그를 저장하는 디렉토리.



## 기술 스택

- **프레임워크**: NestJS (Node.js 기반)
- **DB**: MySQL (Prisma ORM 사용)
- **캐시**: Redis
- **인증**: JWT (Access/Refresh Token)
- **문서화**: Swagger (OpenAPI)
- **크롤링 도구**: Puppeteer, Cheerio 등 사용
- **배포**: JCloud

---

## [크롤링 데이터 파이프라인](https://github.com/jinseok1006/wsd-hw3-crawling)

크롤링 관련 문서는 크롤링 저장소를 확인해주세요.




## 도커를 이용한 시작 방법

Docker Compose를 사용하여 **Nest.js 앱**, **Redis**, **mysql** 를 실행할 수 있습니다. 


### `.env.production`
아래의 `.env.production` 파일을 프로젝트 루트 디렉토리에 작성하세요.

```dotenv
NODE_ENV="production"

# MySQL 초기화에 필요
MYSQL_DATABASE=wsd_db # 접속할 db
MYSQL_ROOT_PASSWORD=example 
MYSQL_USER=wsd_user # 접속할 계정
MYSQL_PASSWORD=wsd_pass # 접속할 비밀번호

# Nest.js 컨테이너에서 접근
DATABASE_URL="mysql://wsd_user:wsd_pass@db:3306/wsd_db"
JWT_SECRET="jwtsecret"

# Redis 설정
REDIS_HOST=redis
REDIS_PORT=6379
```
위 환경 변수는 로컬 테스트 용이며, 실제 배포환경은 이와 다릅니다.

### crawled-data.sql

crawled-data.sql을 wsd-hw3-nest/mysql에 저장하면 데이터베이스를 실행할때
자동으로 포함하여 초기화합니다.

### 실행 명령

다음 명령어로 mysql 어플리케이션을 실행합니다:

```bash
cd wsd-hw3-nest/mysql
docker compose up
```

mysql이 **crawled-data.sql을 주입 한 이후** nest와 redis를 실행합니다.
```bash
cd wsd-hw3-nest
docker compose up
```


### 포트 매핑

각 서비스의 포트 매핑 및 접근 방법은 다음과 같습니다:
<img src="https://github.com/user-attachments/assets/eaf4dcf9-72c6-4071-88da-0988882767e2" width="75%" height='auto'> 

| 서비스   | 호스트 포트 | 컨테이너 포트 | 설명                                   |
|----------|-----------|-----------|----------------------------------------|
| MySQL    | 8080      | 3306      | MySQL 데이터베이스 접근: `localhost:8080` |
| Redis    | 3000      | 6379      | Redis 캐시 서버 접근: `localhost:3000`   |
| Nest.js  | 80        | 3000      | Nest.js API 서버 접근: `http://localhost` |


위 설정을 통해 한 번의 명령어로 모든 서비스를 실행하고, 각 포트를 통해 서비스를 사용할 수 있습니다.

## 베어메탈 시작 방법(개발환경)

- Node.js: 18 버전 설치
- MySQL: 5.7 버전 설치
- Redis: 7 버전 설치
- NestJS CLI 설치:
```bash
npm install -g @nestjs/cli
```

### 1단계: 저장소 클론
프로젝트 저장소를 로컬 머신에 클론합니다:
```
git clone <repository-url>
cd <project-directory>
```

### 2단계: 의존성 설치
다음 명령어로 Node.js 의존성을 설치합니다:
```
npm install
```

### 3단계: 환경 설정
프로젝트 루트 디렉토리에 .env 파일을 생성하고 아래 내용을 작성합니다:
```
NODE_ENV="development"

DATABASE_URL="mysql://<계정명>:<비밀번호>@localhost:3306/<db명>"
JWT_SECRET="jwtsecret"

REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4단계: 데이터베이스 설정
데이터베이스 생성
```sql
CREATE DATABASE wsd_db;
```

초기 데이터 주입
crawled-data.sql 파일을 wsd_db 데이터베이스에 가져옵니다:
```
mysql -u root -p wsd_db < crawled-data.sql
```

### 5단계: Redis 로컬 실행
Redis가 로컬에서 실행 중인지 확인합니다. Redis를 시작하려면 다음 명령어를 사용합니다(OS에 따라 다를 수 있음):
```bash
redis-server
```

### 6단계: NestJS 애플리케이션 실행
아래 명령어로 애플리케이션을 개발 모드에서 실행합니다:
```bash
npm run start:dev
```

서버가 실행되며, API는 http://localhost:3000에서 접근 가능합니다.

### API 엔드포인트 간단 정리

#### **인증 Auth**
1. **회원가입**  
   - `POST /auth/register`  
   - 회원가입 처리 이메일, 비밀번호, 이름 필요

2. **로그인**  
   - `POST /auth/login`  
   - 로그인 및 토큰 발급 이메일, 비밀번호 필요

3. **토큰 갱신**  
   - `POST /auth/refresh`  
   - 리프레시 토큰으로 새 토큰 발급

4. **프로필 조회**  
   - `GET /auth/profile`  
   - 사용자 정보 조회 로그인 필요

5. **프로필 수정**  
   - `PUT /auth/profile`  
   - 사용자 정보 수정 로그인 필요

---

#### **채용공고 Jobs**
1. **공고 목록 조회**  
   - `GET /jobs`  
   - 필터 및 정렬을 통한 공고 조회

2. **공고 상세 조회**  
   - `GET /jobs/{id}`  
   - 특정 공고 상세 정보 조회

---

#### **북마크 Bookmarks**
1. **북마크 추가/제거**  
   - `POST /bookmarks`  
   - 공고 북마크 추가 또는 제거

2. **북마크 목록 조회**  
   - `GET /bookmarks`  
   - 북마크한 공고 목록 조회

---

#### **지원서 Applications**
1. **지원서 작성**  
   - `POST /applications`  
   - 특정 공고에 지원서 제출

2. **지원서 목록 조회**  
   - `GET /applications`  
   - 지원한 공고 목록 조회

3. **지원서 취소**  
   - `DELETE /applications/{id}`  
   - 특정 지원 취소

---

#### **리뷰 Reviews**
1. **리뷰 작성**  
   - `POST /reviews`  
   - 회사 리뷰 작성

2. **회사 리뷰 조회**  
   - `GET /reviews/{companyId}`  
   - 특정 회사의 리뷰 목록 조회

3. **리뷰 삭제**  
   - `DELETE /reviews/{reviewId}`  
   - 작성한 리뷰 삭제

---

#### **메타데이터 Metadata**
1. **개발자 직무 조회**  
   - `GET /metadata/developer-positions`  
   - 직무 리스트 조회

2. **기술 스택 조회**  
   - `GET /metadata/tech-stacks`  
   - 기술 스택 리스트 조회

자세한 사항은 `/swagger` 엔드포인트를 참조하십시오.
---