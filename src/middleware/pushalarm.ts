import Users from "../models/Users";
const schedule = require("node_schedule");
const admin = require('firebase-admin');
const rule = new schedule.RecurrenceRule();

let serviceAccount = require('../bium-sever-firebase-adminsdk-y6tzj-9f976cbf9b.json'); 
rule.tz = "Asia/Seoul";
rule.hour = 0;
rule.minute = 30;
rule.second = 0;


schedule.scheduleJob(rule, async () => {
    try {
        if(!admin.apps.length) {
            admin.initializeApp({
                 credential: admin.credential.cert(serviceAccount) 
                });
        }
        const pushuser = await Users.find({
            is_push : true
        })
        const result = [];
        for (let i = 0; i < pushuser.length; ++i) {
            result.push(pushuser[i].devicetoken)
        }  
        let message = {
            notification: {
              title: '깜짝 선물을 발견했어요!',
              body: '미화원이 휴지통 속에서 무언가 발견했어요! 확인해볼까요?',
            },
        } 
        admin
        .messaging()
        .sendToDevice(result,message)
        .then(function (response) {
          console.log('Successfully sent message: : ', response);
        })
        .catch(function (err) {
           console.log('Error Sending message!!! : ', err);
        });
    }catch(err){
        console.log(err);
    }
});