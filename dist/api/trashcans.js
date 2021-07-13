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
const auth_1 = __importDefault(require("../middleware/auth"));
const Trashcans_1 = __importDefault(require("../models/Trashcans"));
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
 *  @route GET api/trashcans
 *  @desc open all post in trashcan
 *  @access Private
 */
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trashcans = yield Trashcans_1.default.find();
        const trashcount = yield Trashcans_1.default.find().count();
        let trashresult = [];
        for (let i = 0; i < trashcount; i++) {
            const current = getCurrentDate();
            const d_day = (trashcans[i].created_date.getTime() - current.getTime()) / 86400000;
            const object = {
                _id: trashcans[i].id,
                title: trashcans[i].title,
                text: trashcans[i].text,
                category: trashcans[i].category,
                d_day: Math.round(d_day),
            };
            trashresult.push(object);
        }
        if (!trashcans) {
            return res
                .status(404)
                .json({ success: false, message: "휴지통이 비어 있음." });
        }
        res
            .status(200)
            .json({
            success: true,
            data: trashresult,
            message: "전체 휴지통 조회 성공",
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("서버 오류");
    }
}));
/**
 *  @route GET api/trashcans/:id
 *  @desc Get trash by ID
 *  @access Private
 */
router.get("/:trashcan_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trash = yield Trashcans_1.default.findById(req.params.trashcan_id).select("-user_id -__v -created_date -delperiod");
        if (!trash) {
            return res.status(404).json({ msg: "특정 휴지 조회 실패" });
        }
        res.status(200).json({ success: true, data: trash });
    }
    catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            return res
                .status(404)
                .json({ success: false, msg: "특정 휴지 조회 실패" });
        }
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=trashcans.js.map