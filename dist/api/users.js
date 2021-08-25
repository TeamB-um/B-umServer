"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const Users_1 = __importDefault(require("../models/Users"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const Categories_1 = __importDefault(require("../models/Categories"));
const router = express_1.Router();
/**
 *  @route POST api/users
 *  @desc Create a user
 *  @access Public
 */
router.post("/", [express_validator_1.check("device_id", "id is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const device_id = req.body.device_id;
    //const devicetoken = req.body.devicetoken;
    try {
        let user = yield Users_1.default.findOne({ device_id });
        if (user) {
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: 360000 }, (err, token) => {
                if (err)
                    throw err;
                res.status(200).json({ success: true, data: { token } });
            });
        }
        else {
            let ispush = true;
            user = new Users_1.default({
                device_id,
                ispush,
                //devicetoken,
            });
            yield user.save();
            function getCurrentDate() {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth();
                var today = date.getDate();
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var seconds = date.getSeconds();
                var milliseconds = date.getMilliseconds();
                return new Date(Date.UTC(year, month, today, hours, minutes, seconds, milliseconds));
            }
            let created_date0 = getCurrentDate();
            const newCategory0 = new Categories_1.default({
                name: "취업",
                user_id: user.id,
                index: 0,
                count: 0,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/0-0.png`,
                created_date: created_date0
            });
            yield newCategory0.save();
            let created_date1 = getCurrentDate();
            const newCategory1 = new Categories_1.default({
                name: "학업",
                user_id: user.id,
                index: 1,
                count: 0,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/1-0.png`,
                created_date: created_date1,
            });
            yield newCategory1.save();
            let created_date2 = getCurrentDate();
            const newCategory2 = new Categories_1.default({
                name: "인간관계",
                user_id: user.id,
                index: 2,
                count: 0,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/2-0.png`,
                created_date: created_date2,
            });
            yield newCategory2.save();
            let created_date3 = getCurrentDate();
            const newCategory3 = new Categories_1.default({
                name: "건강",
                user_id: user.id,
                index: 3,
                count: 0,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/3-0.png`,
                created_date: created_date3,
            });
            yield newCategory3.save();
            let created_date4 = getCurrentDate();
            const newCategory4 = new Categories_1.default({
                name: "금전",
                user_id: user.id,
                index: 4,
                count: 0,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/4-0.png`,
                created_date: created_date4
            });
            yield newCategory4.save();
            let created_date5 = getCurrentDate();
            const newCategory5 = new Categories_1.default({
                name: "개인",
                user_id: user.id,
                index: 5,
                count: 0,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/5-0.png`,
                created_date: created_date5
            });
            yield newCategory5.save();
            const payload = {
                user: {
                    id: user.id,
                },
            };
            jsonwebtoken_1.default.sign(payload, config_1.default.jwtSecret, { expiresIn: 360000 }, (err, token) => {
                if (err)
                    throw err;
                res.status(201).json({ success: true, data: { token } });
            });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
/**
 *  @route GET api/users
 *  @desc Get user by ID
 *  @access Public
 */
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Users_1.default.findById(req.body.user.id).select("-device_id -_id -__v -seq");
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "사용자 조회 실패" });
        }
        res.status(200).json({ success: true, data: { user } });
    }
    catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res
                .status(404)
                .json({ success: false, message: "사용자 조회 실패" });
        }
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
/**
 *  @route PATCH api/users
 *  @desc PATCH user by ID
 *  @access Public
 */
router.patch("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const delperiod = req.body.delperiod;
    if (delperiod >= 8) {
        res.status(400).json({ success: false, message: "조건에 맞지 않는 요청" });
    }
    try {
        if (req.body.ispush != null && typeof req.body.ispush == "boolean") {
            yield Users_1.default.findByIdAndUpdate(req.body.user.id, {
                ispush: req.body.ispush,
            });
        }
        if (req.body.delperiod != null && typeof req.body.delperiod == "number") {
            yield Users_1.default.findByIdAndUpdate(req.body.user.id, {
                delperiod: req.body.delperiod,
            });
        }
        const user = yield Users_1.default.findById(req.body.user.id).select("-device_id -_id -__v -seq");
        res.status(200).json({ success: true, data: { user } });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=users.js.map