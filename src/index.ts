import express from "express";
const app = express();
import connectDB from "./Loaders/db";
import Users from "./models/Users";
const schedule = require("node-schedule");
const admin = require("firebase-admin");
const rule = new schedule.RecurrenceRule();
import Pushtoken from "./models/Pushtokens";
let serviceAccount = require("../bium-sever-firebase-adminsdk-y6tzj-9f976cbf9b.json");
rule.tz = "Asia/Seoul";
rule.hour = 17;
rule.minute = 10;
rule.second = 0;

// Connect Database
connectDB();

app.use(express.json());

// Define Routes
app.use("/users", require("./api/users"));
app.use("/categories", require("./api/categories"));
app.use("/writings", require("./api/writings"));
app.use("/rewards", require("./api/rewards"));
app.use("/presents", require("./api/presents"));
app.use("/pushtokens", require("./api/pushtokens"));

schedule.scheduleJob(rule, async () => {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    const pushtoken = await Pushtoken.find();
    console.log(pushtoken[0].token);
    const result = [];
    for (let i = 0; i < pushtoken.length; ++i) {
      result.push(pushtoken[i].token);
    }
    console.log(result);
    let message = {
      notification: {
        title: "깜짝 선물을 발견했어요!",
        body: "미화원이 휴지통 속에서 무언가 발견했어요! 확인해볼까요?",
      },
    };
    admin
      .messaging()
      .sendToDevice(result, message)
      .then(function (response) {
        console.log("Successfully sent message: : ", response);
      })
      .catch(function (err) {
        console.log("Error Sending message!!! : ", err);
      });
  } catch (err) {
    console.log(err);
  }
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app // [5]
  .listen(5000, () => {
    console.log(`
    ################################################
    🛡️  Server listening on port: 5000 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
