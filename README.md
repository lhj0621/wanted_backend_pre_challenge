# [위코드 x 원티드] 백엔드 프리온보딩 선발 과제


### 기술스택
- Node.js : 14.15.5
- npm : 6.14.11
- express : 4.17.1
- sequelize : 6.5.0
- typescript : 4.4.3

## 구현한 방법과 이유에 대한 간략한 내용
### ORM 사용 아유
객체 모델만 이용하여 데이터베이스를 간편하게 다룰 수 있어, 소스를 짜는데 있어서 집중 할 수 있다고 판단하였습니다. 

### ResponseHandler
ResponseHandler.ts을 제작하여 response을 한곳에서 핸들링 하였습니다.
response의 공통적인 부분을 한번에 관리 하기 위해서 제작하였습니다.
추후 명세서에서는 공통 값 이므로 생략하겠습니다.
```typescript
{
  ...
    "member": {
        "id": 1,
        "email": "aaa@bb.com",
        "password": "******",
        "name": "원티드",
        "createdAt": "2021-10-26T22:09:19.586Z"
    },
    "field": {
        "title": "제목 제목",
        "content": "내용11 내용 내용 내용 내용 내용 내용 내용"
    },
    "params": {
        "postsId": "1"
    },
    "query": {},
    "path": "/posts/1"
}
```
- user: user session
- field: post, put, patch 요청 시, 입력된 필드 값
- params: Request의 param 값
- query: Request의 query 값
- path: 요청 path

### JWT
authentication을 위해서 [JWT](https://jwt.io/)를 사용하였습니다. 로그인 시 token을 발행하여 응답합니다. 
해당 토큰은 API 호출 시 header에 `Bearer token~~`을 담아 보내야 합니다.

### route
route.ts를 작성하여 한 곳에서 공통적인 소스를 관리하고 src/route에 있는 파일을 이용하여 관리할 수 있도록 제작하였습니다.

### github
Projects의 칸반과 PR와 커밋 컨벤션을 신경쓰며 제작하였습니다.

## 실행 방법
```bash
npm i
//필요 모듈 설치

npm run dev // or tsnd src/index.ts
//실행

localhost:3000으로 서버가 실행됩니다.
```

## API 명세

### 회원 가입

| 메소드 | 경로 |
| ------ | ---- |
| POST | localhost:3000/member |

#### Requset

Bodyraw (json)
```js
{
    "email": "aaa@bb.com",
    "password": "1234",
    "name": "원티드"
}
```

#### Response
성공 201 Created
```js
{
    "message": "가입이 완료되었습니다.",
    "data": {
        "id": 1,
        "email": "aaa@bb.com",
        "password": "$2b$10$ItrNc/6n7P81fmzea4F13O7KpmKqdyDjxVv9SLApzmh3FcBaJU0Ym",
        "name": "원티드",
        "updatedAt": "2021-10-27T05:56:34.722Z",
        "createdAt": "2021-10-27T05:56:34.722Z"
    },
    ...
}
```
필수값 누락 400 Bad Request
```js
{
    "message": "필수값이 없습니다. name"
}
```
중복 이메일 400 Bad Request
```js
{
    "message": "이미 가입되어 있는 이메일 입니다. aaa@bb.com"
}
```
### 로그인

| 메소드 | 경로 |
| ------ | ---- |
| POST | localhost:3000/member/signin |

#### Requset

Bodyraw (json)
```js
{
    "email": "aaa@bb.com",
    "password": "1234"
}
```

#### Response
성공 200 OK
```js
{
    "token": "eyJhbGciOi....Pnrs7Qd3FEQ5eopnNAyuMoewql-E7E",
    ...
}
```
필수값 누락 400 Bad Request
```js
{
    "message": "필수값이 없습니다. password"
}
```
존재하지 않는 이메일 400 Bad Request
```js
{
    "message": "존재하지 않는 아이디입니다."
}
```
비밀번호 불일치 401 Unauthorized
```js
{
    "message": "틀린 비밀번호 입니다."
}
```
### 게시글 작성

| 메소드 | 경로 |
| ------ | ---- |
| POST | localhost:3000/posts |

#### Requset
headers

| Key | Value | description |
| ------ | ---- | ---- |
| Authorization | Bearer Token | 인증 토큰 |

Bodyraw (json)
```js
{
    "title": "제목 제목",
    "content": "내용 내용 내용 내용 내용 내용 내용 내용"
}
```

#### Response
성공 201 Created
```js
{
    "data": {
        "id": 1,
        "memberId": 1,
        "title": "제목 제목",
        "content": "내용 내용 내용 내용 내용 내용 내용 내용",
        "updatedAt": "2021-10-27T06:07:25.420Z",
        "createdAt": "2021-10-27T06:07:25.420Z"
    },
    ...
}
```
필수값 누락 400 Bad Request
```js
{
    "message": "필수값이 없습니다. content"
}
```
토큰 문제 403 Forbidden
```js
{
    "message": "유효하지 않은 토큰입니다. 다시 로그인 해주세요."
}
```
### 게시글 확인

| 메소드 | 경로 |
| ------ | ---- |
| GET | localhost:3000/posts/:postsId |

#### Requset

 Path  Params

| Key | Value | description |
| ------ | ---- | ---- |
| postsId | 1 | 게시글 번호 |


#### Response
성공 200 OK
```js
{
    "posts": {
        "id": 1,
        "memberId": 1,
        "title": "제목 제목",
        "content": "내용 내용 내용 내용 내용 내용 내용 내용",
        "createdAt": "2021-10-27T06:07:25.420Z",
        "updatedAt": "2021-10-27T06:07:25.420Z",
        "member": {
            "name": "원티드"
        }
    },
    ...
}
```

유효하지 않은 게시글 번호 400 Bad Request
```js
{
    "message": "유효하지 않은 게시글 번호입니다."
}
```

### 게시글 목록 조회

| 메소드 | 경로 |
| ------ | ---- |
| GET | localhost:3000/posts |

#### Requset

 Query Params
 
| Key | Value | description |
| ------ | ---- | ---- |
| order | createdAt\|DESC | 정렬 |
| limit | 10 | 출력 수 |
| page | 1 | 페이지 번호 |

#### Response
성공 200 OK
```js
{
    "count": 2,
    "data": [
        {
            "id": 2,
            "memberId": 1,
            "title": "제목 제목",
            "content": "내용 내용 내용 내용 내용 내용 내용 내용",
            "createdAt": "2021-10-26T22:09:27.971Z",
            "updatedAt": "2021-10-26T22:09:27.971Z",
            "member": {
                "name": "원티드"
            }
        },
        ...
    ],
	...
}
```
### 게시글 수정

| 메소드 | 경로 |
| ------ | ---- |
| PUT | localhost:3000/posts/:postsId |

#### Requset

 Path  Params

| Key | Value | description |
| ------ | ---- | ---- |
| postsId | 1 | 게시글 번호 |

headers

| Key | Value | description |
| ------ | ---- | ---- |
| Authorization | Bearer Token | 인증 토큰 |
 

Bodyraw (json)
```js
{
    "title": "제목 수정",
    "content": "수정 내용"
}
```

#### Response
완료 201 Created
```js
{
    "message": "게시글 수정이 완료되었습니다.",
    ...
}
```
필수값 누락 400 Bad Request
```js
{
    "message": "필수값이 없습니다. content"
}
```
본인글 이외 수정 요청 403 Forbidden
```js
{
    "message": "본인 글만 수정할 수 있습니다."
}
```
토큰 문제 403 Forbidden
```js
{
    "message": "유효하지 않은 토큰입니다. 다시 로그인 해주세요."
}
```
### 게시글 삭제

| 메소드 | 경로 |
| ------ | ---- |
| DELETE | localhost:3000/posts/:postsId  |

#### Requset

 Path  Params

| Key | Value | description |
| ------ | ---- | ---- |
| postsId | 1 | 게시글 번호 |

headers

| Key | Value | description |
| ------ | ---- | ---- |
| Authorization | Bearer Token | 인증 토큰 |

#### Response

삭제 완료 204 No Content
```js

```
필수값 누락 400 Bad Request
```js
{
    "message": "필수값이 없습니다. content"
}
```
본인글 이외 수정 요청 403 Forbidden
```js
{
    "message": "본인 글만 삭제할 수 있습니다."
}
```
토큰 문제 403 Forbidden
```js
{
    "message": "유효하지 않은 토큰입니다. 다시 로그인 해주세요."
}
```