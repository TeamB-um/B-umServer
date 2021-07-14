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
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const trashcans = yield Trashcans_1.default.find({ user_id: req.body.user.id });
        const trashcount = yield Trashcans_1.default.find({
            user_id: req.body.user.id,
        }).count();
        let trashresult = [];
        for (let i = 0; i < trashcount; i++) {
            const current = getCurrentDate();
            const d_day = (trashcans[i].created_date.getTime() - current.getTime()) / 86400000;
            console.log(trashcans[i].created_date);
            console.log(current);
            const object = {
                _id: trashcans[i].id,
                title: trashcans[i].title,
                text: trashcans[i].text,
                category: trashcans[i].category,
                d_day: Math.round(d_day),
            };
            trashresult.push(object);
        }
        if (!trashcans[0]) {
            return res
                .status(404)
                .json({ success: false, message: "휴지통이 비어 있음." });
        }
        res.status(200).json({
            success: true,
            data: { trashresult },
        });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("서버 오류");
    }
}));
module.exports = router;
//# sourceMappingURL=trashcans.js.map