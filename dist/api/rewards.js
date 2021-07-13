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
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const Rewards_1 = __importDefault(require("../models/Rewards"));
const Rewards_dummy_1 = __importDefault(require("../models/Rewards_dummy"));
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
const router = express_1.Router();
/**
 *  @route POST api/rewards
 *  @desc Create a rewards
 *  @access Private
 */
router.post("/", auth_1.default, [
    express_validator_1.check("sentence", "sentence is required").not().isEmpty(),
    express_validator_1.check("context", "context is required").not().isEmpty(),
    express_validator_1.check("author", "author is required").not().isEmpty(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { sentence, author, context } = req.body;
    try {
        const seq = (yield Rewards_dummy_1.default.count()) + 1;
        const newRewards = new Rewards_dummy_1.default({
            sentence,
            author,
            context,
            seq,
        });
        const reward = yield newRewards.save();
        res.status(201).json({ success: true, data: reward });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
router.get("/dummy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewards = yield Rewards_dummy_1.default.find();
        if (!rewards) {
            return res.status(404).json({ success: false, message: "리워드가 없음" });
        }
        res
            .status(200)
            .json({ success: true, data: rewards, message: "리워드 조회 성공" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rewards = yield Rewards_1.default.find().select("-__v");
        if (!rewards) {
            return res.status(404).json({ success: false, message: "리워드가 없음" });
        }
        res
            .status(200)
            .json({ success: true, data: rewards, message: "리워드 조회 성공" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=rewards.js.map