# 비움 B-um
![ex_screenshot](./bum.JPG)</br>
살아가며 필연적으로 마주치는 크고 작은 스트레스들...</br>
완벽한 해결이 아니더라도 한 스푼 덜어드리겠습니다. 
당신을 괴롭히는 스트레스, 휴지통에 버려버리세요! 

## 서비스 설명
하루 동안 스트레스 받은 일을 글로 적어 보관함에 저장하고, 휴지통에 버림으로써 스트레스를 해소할 수 있습니다.</br>
또한 보관함 통계를 통해 자신이 어떤 유형의 스트레스를 가장 많이 받는지 알아볼 수 있고,</br>
일정량 이상의 스트레스를 받은 사용자에게 위로와 응원의 글귀가 적힌 리워드를 제공합니다.

## 서비스 팀원
<div id="about_team">

|  <center>이름</center> |  <center>파트</center> |  <center>리딩/팔로잉</center> |
|:--------|:--------:|--------:|
|**정석현**    | <center>서버</center> | 리딩 |
|**박신현**    | <center>서버</center> | 팔로잉 |

## 서버 아키텍쳐
|  <center>용도/역할</center> |  <center>이름</center> |
|:--------|:--------:|
|  **서버 구축 플랫폼** | <center>Node.js</center> |
|  **서버 구축 언어**   | <center>Typescript</center> |
|  **데이터베이스**   | <center>MongoDB</center> |
|  **ORM**   | <center>Mongoose</center> |
|  **푸쉬 알림**   | <center>FCM 라이브러리</center> |
|  **백업 및 복원**   | <center>구글 연동 검토중</center> |

## Dependencies Module
``` javascript
 {
  "name": "beum_server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "ts-node src",
    "build": "tsc && node dist"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@types/express": "^4.17.11",
    "@types/mongoose": "^5.10.5",
    "@types/node": "^16.0.0",
    "ts-node": "^10.0.0",
    "typescript": "^4.3.5"
  },
  "dependencies": {
    "dotenv": "^9.0.2",
    "express": "^4.17.1",
    "mongoose": "^5.12.10"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/TeamB-um/B-umServer.git"
  },
  "bugs": {
    "url": "https://github.com/TeamB-um/B-umServer/issues"
  },
  "homepage": "https://github.com/TeamB-um/B-umServer#readme"
}
```
## Coding convention
**Camel Case**</br>
첫 단어는 소문자로, 그 뒤는 대문자로, 단어와 단어 사이는 붙이는 것을 원칙으로 함.

**Eslint Extension**</br>
tab 사이즈를 space 2 size로 적용.

**Prettier Formatting**</br>
Formatting 형식을 VS Code Extesion 중 prettier 형식에 맞체 적용.
``` javascript
npx prettier --write "index.js" // prettier 형태로 바꿔줌

npx prettier "index.js" // prettier 형태로 출력 
```
**주석 규칙**</br>
한줄을 "//"로 적고, 그 이상은 "/* */"로 함.
``` javascript
// 한줄 주석일 때
/**
 * 여러줄
 * 주석일 때
 */
```

**데이터베이스 명명 규칙**</br>
- DB 이름 (스키마)
    - 데이터베이스 명은 영어 대문자로 구성한다.
    - 길이는 8자 이내로 구성한다.
- 테이블
    - 테이블은 영어 대문자로 구성, 대분류_의미있는 테이블 명 형태로 작성한다.
    - 테이블 명의 구성은 최대 3단어까지 사용할 수 있다.
    - 각 단어의 최대 길이는 8자 이내로 구성한다.
    - 최대 길이는 26자 이내로 구성한다.
- 컬럼
    - 컬럼은 snake 표기법을 따르고, 의미있는 컬럼명_접미사 형태로 작성한다.
    - 컬럼의 성질을 나타내는 접미사를 사용한다. (사용하는 데이터의 타입을 나타내는 것이 아님에 유의)

**접미사 list**</br>
- CNT : count 조회수 등의 count에 사용된다.
- DT : date 날짜인 경우를 나타낸다.
- FK : foreign key를 나타내는데 사용한다.
- FL : flag 0, 1로 구성된 상태를 나타낸다.
- ID : id 계정 등의 아이디를 나타낸다.
- NM : name 이름, 별명 등 식별 가능하며 중복이 가능한 문자열 나타내는 데 사용한다.
- NO : number 나이, 휴대폰 번호 등 숫자를 나타낸다.
- ORD : order 정렬에 사용되는 index를 나타낸다.
- PK : primary key를 나타내는데 사용한다.
- ST : status 회원의 등급, 성별 등의 상태를 나타낸다.

**그 외 항목**</br>
1. async await 사용하기
2. 파일명
    - 폴더: 복수형
    - 파일명: 언더바
    - 메소드에 라우터명 붙이지 않기
    - 각 폴더에 인덱스 넣기
3. 변수명
    - 배열이 들어가는 변수면 마지막에 List
    - 통신 API 리턴되는건 그냥 data
    - 함수가 동사가 제일 먼저와야하고, 데이터를 담는 변수는 동사가 오면 않도록 함
    - 메소드: READ(찾기) CREATE(만들기) UPDATE(수정하기) DELETE(삭제하기)

## Commit, Branch 전략
**Branch 중심 운영**</br>
- main - 실제 올라가는 Branch
- develop - 테스트용 Branch
- feat/~~ - 새로운 기능 개발용 Branch
- fix/~~ - 오류 기능을 수정 Branch

**Branch Senario**</br>
- 새 기능 개발 시
 - main, develop (branch pull) → feat/users(개발완료) → develop 머지(develop문제없음) → main로 머지
- 오류 발생 시
 - main (branch pull) → fix/users(수정완료) → develop 머지(develop문제없음 → master머지

**머지 규칙**</br>
1. 풀리퀘스트 날리기
2. 작성자 외 1명 이상이 리뷰를 해줌 (develop) 후 머지
3. 로컬에서 작업하고 풀리퀘하기전에 풀받기

**Commit Message**</br>
- Feat: 새기능
- Refactor: 원래있던 코드의 수정(기능도 변경)
- Style: 원래있던 코드의 수정(기능이 안변경)
- Docs: 문서변경
- Fix: 오류 수정
- Etc: 기타 
- 한글로 커밋하기. 커밋은 이해하기 편한 단위로 잘게 쪼개기(독자가 읽기 편하게)
