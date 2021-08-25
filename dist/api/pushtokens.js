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
const Pushtokens_1 = __importDefault(require("../models/Pushtokens"));
const router = express_1.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pushtoken = req.body.pushtoken;
        const tokenarray = new Pushtokens_1.default({
            token: pushtoken
        });
        yield tokenarray.save();
        res.status(201).json({ success: true });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=pushtokens.js.map