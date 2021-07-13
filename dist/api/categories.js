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
const Users_1 = __importDefault(require("../models/Users"));
const Writings_1 = __importDefault(require("../models/Writings"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const Categories_1 = __importDefault(require("../models/Categories"));
const router = express_1.Router();
/**
 *  @route POST api/categories
 *  @desc Create a category
 *  @access Private
 */
router.post("/", auth_1.default, [express_validator_1.check("name", "name is required").not().isEmpty()], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const name = req.body.name;
    const checkname = yield Categories_1.default.findOne({ name });
    if (checkname) {
        res.status(500).json({ success: false, msg: "중복된 이름 유지" });
    }
    else {
        try {
            let newindex = -1;
            for (var i = 0; i < 8; i++) {
                let ifcategory = yield Categories_1.default.findOne({ index: i });
                if (!ifcategory) {
                    newindex = i;
                    break;
                }
            }
            if (newindex == -1) {
                res.status(500).json({ success: false, msg: "카테고리 8개 초과" });
            }
            else {
                const user = yield Users_1.default.findById(req.body.user.id);
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
                const newCategory = new Categories_1.default({
                    name,
                    user_id: user.id,
                    index: newindex,
                    count: 0,
                    img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/${newindex}-0.png`,
                    created_date: getCurrentDate(),
                });
                const category = yield newCategory.save();
                const categoryresult = {
                    _id: category._id,
                    name: category.name,
                    img: category.img,
                    created_date: category.created_date,
                };
                res.json({ success: true, data: categoryresult });
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ success: false, msg: "서버 오류" });
        }
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const categories = yield Categories_1.default.find().select("-user_id -index -count -__v");
        res.status(200).json({ success: true, data: categories });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
router.delete("/:category_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const category_id = req.params.category_id;
    try {
        yield Writings_1.default.deleteMany({
            category_id: category_id,
        });
        yield Categories_1.default.deleteOne({
            _id: category_id,
        });
        res
            .status(204)
            .json({ success: true, msg: "카테고리 및 관련 글 삭제 완료" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
/**
 *  @route PATCH api/categories
 *  @desc PATCH categories by ID
 *  @access Public
 */
router.patch("/:category_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.name != null) {
            yield Categories_1.default.findByIdAndUpdate(req.params.category_id, {
                name: req.body.name,
            });
        }
        const category = yield Categories_1.default.findById(req.params.category_id).select("_id name img");
        res.status(200).json({ success: true, data: category });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=categories.js.map