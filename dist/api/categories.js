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
const Rewards_dummy_1 = __importDefault(require("../models/Rewards_dummy"));
const Rewards_1 = __importDefault(require("../models/Rewards"));
const Writings_2 = __importDefault(require("../models/Writings"));
const Trashcans_1 = __importDefault(require("../models/Trashcans"));
const router = express_1.Router();
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
        res.status(500).json({ success: false, message: "중복된 이름 존재" });
    }
    else {
        try {
            let newindex = -1;
            for (var i = 0; i < 8; i++) {
                let ifcategory = yield Categories_1.default.find({
                    index: i,
                    user_id: req.body.user.id,
                }).select("-__v");
                console.log(ifcategory);
                if (!ifcategory[0]) {
                    console.log(i);
                    newindex = i;
                    break;
                }
            }
            if (newindex == -1) {
                res
                    .status(500)
                    .json({ success: false, message: "카테고리 8개 초과" });
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
                const categoryresult = yield newCategory.save();
                const category = {
                    _id: categoryresult._id,
                    name: categoryresult.name,
                    img: categoryresult.img,
                    index: categoryresult.index,
                    count: categoryresult.count,
                    created_date: categoryresult.created_date,
                };
                res.status(201).json({ success: true, data: { category } });
            }
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ success: false, message: "서버 오류" });
        }
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const categories = yield Categories_1.default.find({
            user_id: req.body.user.id,
        })
            .sort({ created_date: 1 })
            .select("-user_id  -__v");
        res.status(200).json({ success: true, data: { categories } });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
router.get("/:category_id/rewards", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const categorycheck = yield Categories_1.default.find({
            _id: req.params.category_id,
            user_id: req.body.user.id,
        });
        if (categorycheck[0]) {
            const category = yield Categories_1.default.findOne({
                _id: req.params.category_id,
            });
            const user = yield Users_1.default.findOne({
                _id: req.body.user.id,
            });
            const newseq = Number(user.seq) + 1;
            const rewardcheck = yield Rewards_dummy_1.default.findOne({
                seq: user.seq,
            }).select("-__v -seq");
            yield Users_1.default.findOneAndUpdate({
                _id: req.body.user.id,
            }, {
                seq: newseq,
            });
            const Categoryindex = yield Categories_1.default.findOne({ _id: req.params.category_id, });
            const index = Categoryindex.index;
            yield Categories_1.default.findOneAndUpdate({
                _id: req.params.category_id,
            }, {
                count: 0,
                img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/${index}-0.png`,
            });
            const newcategory = yield Categories_1.default.findById(req.params.category_id);
            yield Writings_2.default.updateMany({ category_id: req.params.category_id }, { category: newcategory });
            const rewardresult = new Rewards_1.default({
                sentence: rewardcheck.sentence,
                context: rewardcheck.context,
                author: rewardcheck.author,
                user_id: req.body.user.id,
                index: category.index,
                created_date: getCurrentDate(),
            });
            yield rewardresult.save();
            const reward = {
                sentence: rewardresult.sentence,
                context: rewardresult.context,
                author: rewardresult.author,
                user_id: req.body.user.id,
                index: category.index,
                created_date: getCurrentDate(),
            };
            res.status(200).json({ success: true, data: { reward } });
        }
        else {
            res.status(400).json({
                success: false,
                message: "유저에 해당하는 카테고리 id가 아님",
            });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
router.delete("/:category_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const category_id = req.params.category_id;
    try {
        const categorycheck = yield Categories_1.default.find({
            _id: req.params.category_id,
            user_id: req.body.user.id,
        });
        if (categorycheck[0]) {
            const category = yield Categories_1.default.findOne({
                _id: req.params.category_id,
            });
            yield Writings_1.default.deleteMany({
                category_id: category_id,
            });
            yield Trashcans_1.default.deleteMany({
                category_id: category_id,
            });
            yield Categories_1.default.deleteOne({
                _id: category_id,
            });
            res
                .status(204)
                .json({ success: true, message: "카테고리 및 관련 글 삭제 완료" });
        }
        else {
            res.status(400).json({
                success: false,
                message: "유저에 해당하는 카테고리 id가 아님",
            });
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
/**
 *  @route PATCH api/categories
 *  @desc PATCH categories by ID
 *  @access Public
 */
router.patch("/:category_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categorycheck = yield Categories_1.default.find({
            _id: req.params.category_id,
            user_id: req.body.user.id,
        });
        if (categorycheck[0]) {
            const check = yield Categories_1.default.find({
                user_id: req.body.user.id,
                name: req.body.name,
            });
            if (check[0]) {
                res.status(500).json({ success: false, message: "중복된 이름 존재" });
            }
            else {
                if (req.body.name != null) {
                    yield Categories_1.default.findByIdAndUpdate(req.params.category_id, {
                        name: req.body.name,
                    });
                    const newcategory = yield Categories_1.default.findById(req.params.category_id);
                    yield Writings_2.default.updateMany({ category_id: req.params.category_id }, { category: newcategory });
                }
                const category = yield Categories_1.default.findById(req.params.category_id).select("_id name index count img");
                res.status(200).json({ success: true, data: { category } });
            }
        }
        else {
            res.status(400).json({
                success: false,
                message: "유저에 해당하는 카테고리 id가 아님",
            });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=categories.js.map