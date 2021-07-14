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
const Cheers_1 = __importDefault(require("../models/Cheers"));
const router = express_1.Router();
/**
 *  @route POST api/cheers
 *  @desc Create a cheers
 *  @access Private
 */
router.post("/", auth_1.default, [express_validator_1.check("name", "name is required").not().isEmpty()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { id, context, img } = req.body;
    try {
        const newCheers = new Cheers_1.default({
            id,
            context,
            img,
        });
        const cheer = yield newCheers.save();
        res.status(201).json({ success: true, data: cheer });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send("서버 오류");
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cheers = yield Cheers_1.default.find();
        if (!cheers) {
            return res.status(204).json({ message: "응원 메세지가 없음." });
        }
        res
            .status(200)
            .json({ success: true, data: cheers, message: "응원 메세지 조회 성공" });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
module.exports = router;
//# sourceMappingURL=cheers.js.map