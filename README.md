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

 
