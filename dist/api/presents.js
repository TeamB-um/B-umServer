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
const Presents_1 = __importDefault(require("../models/Presents"));
const Users_1 = __importDefault(require("../models/Users"));
const router = express_1.Router();
/**
 *  @route POST api/presents
 *  @desc Create a present
 *  @access Private
 */
router.post("/", [
    express_validator_1.check("sentence", "sentence is required").not().isEmpty()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { sentence } = req.body;
    try {
        const seq = (yield Presents_1.default.count()) + 1;
        const newPresents = new Presents_1.default({
            sentence,
            seq,
        });
        const present = yield newPresents.save();
        res.status(201).json({ success: true, data: { present } });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield Users_1.default.findOne({ _id: req.body.user.id });
        const present = yield Presents_1.default.findOne({ seq: user.presentseq })
            .select("-__v -seq -_id");
        const newseq = Number(user.presentseq) + 1;
        yield Users_1.default.findOneAndUpdate({
            _id: req.body.user.id,
        }, {
            presentseq: newseq,
        });
        if (!present) {
            return res.status(404).json({ success: false, message: "선물 더미가 모자람" });
        }
        res.status(200).json({ success: true, data: { present } });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=presents.js.map