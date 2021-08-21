import express, { Router, Request, Response } from "express";


const router = Router();


const admin = require('firebase-admin');
let serviceAccount = require('../bium-sever-firebase-adminsdk-y6tzj-9f976cbf9b.json'); 
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });


router.get('/push_send', function (req, res, next) {
    let target_token =`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjExYjgzZGJhM2FlODc3MWYzNTM4MmIyIn0sImlhdCI6MTYyOTUzNTAwNywiZXhwIjoxNjI5ODk1MDA3fQ._QsqoRn1-j_1QbRsMstQ1CRo-722KPs8i_4IiFC8Z2Y`
      
  
    let message = {
      notification: {
        title: '테스트 데이터 발송',
        body: '데이터가 잘 가나요?',
      },
      token: target_token,
    }
  
    admin
      .messaging()
      .send(message)
      .then(function (response) {
        console.log('Successfully sent message: : ', response)
        return res.status(200).json({success : true})
      })
      .catch(function (err) {
          console.log('Error Sending message!!! : ', err)
          return res.status(400).json({success : false})
      });
  
  })

module.exports = router;