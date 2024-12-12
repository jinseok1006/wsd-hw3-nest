# 구인구직 백엔드 서버

본 프로젝트는 **구인구직 사이트의 채용공고 데이터를 크롤링**하여 수집하고, 이를 **MySQL** 데이터베이스에 저장한 뒤, **NestJS** 기반의 **REST API**로 제공하는 백엔드 서버입니다. **JWT 인증**, **Redis 캐싱**, **Swagger 문서화**, **JCloud 배포** 등 실제 서비스 운영 환경을 고려한 다양한 기능을 구현하였습니다.



## 주요 특징

- **웹 크롤링**: 특정 구인구직 사이트로부터 100개 이상의 채용공고 수집 및 정제.
- **데이터베이스(MySQL)**: Prisma ORM을 통한 스키마 관리 및 마이그레이션.
- **API 제공 (NestJS)**:  
  - 회원 관리 (회원가입, 로그인, JWT 인증/갱신)  
  - 채용공고 CRUD, 검색/필터링, 페이지네이션  
  - 지원 기능 (지원하기, 조회, 취소)  
  - 북마크 관리 (추가/조회)  
  - 메타데이터(포지션, 기술스택), 리뷰 관리 등 다양한 엔드포인트
- **JWT 기반 인증 및 보안**: Access/Refresh Token 관리, 비밀번호 암호화, 인증/인가 미들웨어.
- **Swagger 문서화**: `/swagger`를 통한 직관적 API 테스트 및 문서 확인.
- **Redis 캐싱**: 자주 조회되는 공고, 검색 결과 캐싱 및 JWT 토큰 블랙리스트 관리로 성능 향상.
- **JCloud 배포**: 실제 클라우드 환경에서 외부 접속 및 테스트 가능.
- **로깅 시스템**: 요청/응답 및 에러 발생 시 로깅 시스템(Winston) 적용.
- **글로벌 에러 핸들러**: 모든 오류에 대해 일관된 에러 응답 형식 제공. 커스텀 에러 클래스 정의.
   


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

채용공고 데이터를 스크래핑하고 정제하여 **데이터베이스로 통합**하는 다단계 파이프라인을 구현합니다.

1. **채용공고 ID 수집**: API 페이징을 통해 채용공고 ID를 대량으로 획득하고 `jobPostingIds.json`에 저장.
2. **상세 데이터 조회**: 수집한 ID를 기반으로 각 채용공고의 상세 정보를 조회하고 `jobPostings.json`에 기록.
3. **데이터베이스 저장**: 수집한 원시 데이터를 **MySQL (Prisma)** 기반 데이터베이스 스키마(`JobPosting`, `Company`, `DeveloperPosition`, `TechStack` 등)에 매핑 및 저장.  
   - 지역 매핑, 랜덤 연봉 생성 등 데이터 정제 로직 적용
   - 직군/스택/회사 정보와 연결하여 구조화된 관계형 데이터 유지



## 도커를 이용한 시작 방법

Docker Compose를 사용하여 **Nest.js 앱**, **Redis**, **MySQL 데이터베이스**를 한 번에 실행할 수 있습니다. 이를 위해 아래의 `.env.production` 파일을 프로젝트 루트 디렉토리에 작성하세요.


### `.env.production`

```dotenv
NODE_ENV="production"

# MySQL 초기화에 필요
MYSQL_DATABASE=wsd_db
MYSQL_ROOT_PASSWORD=wsdpass

# Nest.js 컨테이너에서 접근
DATABASE_URL="mysql://root:wsdpass@mysql:3306/wsd_db"
JWT_SECRET="jwtsecret"

# Redis 설정
REDIS_HOST=redis
REDIS_PORT=6379
```

위 환경 변수는 로컬 테스트 용이며, 실제 배포환경은 이와 다릅니다.

### `crawled-data.sql`

데이터베이스 백업파일을 프로젝트의 루트경로에 저장하세요. 데이터베이스 최초 실행시 자동으로 sql 파일을 주입합니다.
만약 sql파일 없이 컨테이너를 실행했다면, 프로젝트 루트 경로의 db 디렉토리를 삭제한 이후 다시 실행해야합니다.


### 실행 명령

다음 명령어로 모든 어플리케이션을 실행합니다:

```bash
docker compose up
```

필요한 이미지를 다운로드하고 컨테이너를 빌드하며, MySQL 초기 데이터(crawled-data.sql)를 데이터베이스에 주입하고 대기하는 과정 때문에 최초 실행 시 **약 5분 정도** 소요됩니다.


### 포트 매핑

각 서비스의 포트 매핑 및 접근 방법은 다음과 같습니다:

| 서비스   | 호스트 포트 | 컨테이너 포트 | 설명                                   |
|----------|-----------|-----------|----------------------------------------|
| MySQL    | 8080      | 3306      | MySQL 데이터베이스 접근: `localhost:8080` |
| Redis    | 3000      | 6379      | Redis 캐시 서버 접근: `localhost:3000`   |
| Nest.js  | 80        | 3000      | Nest.js API 서버 접근: `http://localhost` |


위 설정을 통해 한 번의 명령어로 모든 서비스를 실행하고, 각 포트를 통해 서비스를 사용할 수 있습니다.

## 베어메탈 시작 방법

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

# MySQL 설정
MYSQL_DATABASE=wsd_db
MYSQL_USER=root
MYSQL_PASSWORD=wsdpass
MYSQL_HOST=localhost
MYSQL_PORT=3306

# Nest.js 설정
DATABASE_URL="mysql://root:wsdpass@localhost:3306/wsd_db"
JWT_SECRET="jwtsecret"

# Redis 설정
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


## 배포 및 접근 정보

- **JCloud 배포 URL**: `http://***.***.***.***`
- **Swagger 문서**: `http://***.***.***.***/swagger`


