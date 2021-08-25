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
const mongoose_1 = __importDefault(require("mongoose"));
const Users_1 = __importDefault(require("../models/Users"));
const Writings_1 = __importDefault(require("../models/Writings"));
const express_validator_1 = require("express-validator");
const auth_1 = __importDefault(require("../middleware/auth"));
const Categories_1 = __importDefault(require("../models/Categories"));
const Writings_2 = __importDefault(require("../models/Writings"));
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
 *  @route POST api/posts
 *  @desc Create a post
 *  @access Private
 */
router.post("/", auth_1.default, [
    express_validator_1.check("category_id", "category_id is required").not().isEmpty(),
    express_validator_1.check("text", "text is required").not().isEmpty(),
    express_validator_1.check("iswriting", "iswriting is required").not().isEmpty(),
    express_validator_1.check("paper", "paper is required").not().isEmpty()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    console.log(req.body);
    let title = req.body.title;
    if (!title) {
        title = "제목 없음";
    }
    const text = req.body.text;
    const paper = req.body.paper;
    const category_id = req.body.category_id;
    const categoryObjectcheck = yield Categories_1.default.findOne({
        _id: category_id,
    });
    if (req.body.user.id != categoryObjectcheck.user_id) {
        res
            .status(400)
            .json({ success: false, message: "카테고리가 유저와 일치하지 않음" });
    }
    else {
        console.log("fuckingbium!!!!!!!!!!!!!!!!!");
        try {
            const user = yield Users_1.default.findById(req.body.user.id);
            const categoryObject = yield Categories_1.default.findOne({
                _id: category_id,
            });
            if (req.body.iswriting) {
                let categorycount = categoryObject.count;
                let categoryindex = categoryObject.index;
                categorycount = Number(categorycount) + 1;
                let categorycount_img = categorycount;
                if (categorycount >= 5) {
                    categorycount_img = 5;
                }
                const category = yield Categories_1.default.findOneAndUpdate({
                    _id: category_id,
                }, {
                    $set: {
                        count: categorycount,
                        img: `https://soptseminar5test.s3.ap-northeast-2.amazonaws.com/${categoryindex}-${categorycount_img}.png`,
                    },
                });
            }
            const newcategory = yield Categories_1.default.findById(req.body.category_id);
            yield Writings_2.default.updateMany({ category_id: req.body.category_id }, { category: newcategory });
            const inputcategoryObject = yield Categories_1.default.findOne({
                _id: req.body.category_id,
            }).select("-__v -user_id");
            let created_date = getCurrentDate();
            //created_date.setHours(created_date.getHours() + 9);
            if (req.body.iswriting) {
                const newWriting = new Writings_2.default({
                    title: title,
                    text: text,
                    user_id: user.id,
                    category: inputcategoryObject,
                    created_date: created_date,
                    category_id: req.body.category_id,
                    category_name: inputcategoryObject.name,
                    paper: paper,
                });
                const writingresult = yield newWriting.save();
                const writing = yield Writings_2.default.find({
                    user_id: req.body.user.id,
                }).select("-__v -category_id -category.__v -category.user_id -category_name").sort({ created_date: -1 });
                res.status(201).json({ success: true, data: { writing } });
            }
            else {
                res.status(201).json({ success: true, message: "삭제 완료" });
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
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    let offset = req.query.offset;
    offset = String(offset);
    let offsetnum = Number(offset);
    if (req.query.offset == null) {
        offsetnum = 10;
    }
    let page = req.query.page;
    page = String(page);
    let pagenum = Number(page);
    let category = String(req.query.category_ids)
        .replace("[", "")
        .replace("]", "");
    const category_real_list = category.split(",");
    const Date_start_date = new Date(String(start_date));
    const Date_end_date = new Date(String(end_date));
    Date_end_date.setDate(Date_end_date.getDate() + 1);
    const user_id = req.body.user.id;
    try {
        if (start_date) {
            if (req.query.category_ids) {
                const count = yield Writings_1.default.find({
                    user_id: user_id,
                    category_id: { $in: category_real_list },
                    created_date: { $gte: Date_start_date, $lte: Date_end_date },
                }).count();
                const writing = yield Writings_1.default.find({
                    user_id: user_id,
                    category_id: { $in: category_real_list },
                    created_date: { $gte: Date_start_date, $lte: Date_end_date },
                }).sort({ created_date: -1 }).skip(offsetnum * (pagenum - 1)).limit(offsetnum).select("-__v -category_id -category.__v -category.user_id -category_name");
                if (writing.length != 0) {
                    res.status(200).json({ success: true, data: { writing, count } });
                }
                else {
                    res
                        .status(404)
                        .json({ success: false, message: "해당 필터 결과가 없습니다. " });
                }
            }
            else {
                const writing = yield Writings_1.default.find({
                    user_id: user_id,
                    created_date: { $gte: Date_start_date, $lte: Date_end_date },
                }).sort({ created_date: -1 }).skip(offsetnum * (pagenum - 1)).limit(offsetnum).select("-__v -category_id -category.__v -category.user_id -category_name");
                const count = yield Writings_1.default.find({
                    user_id: user_id,
                    created_date: { $gte: Date_start_date, $lte: Date_end_date },
                }).count();
                if (writing.length != 0) {
                    res.status(200).json({ success: true, data: { writing, count } });
                }
                else {
                    res
                        .status(404)
                        .json({ success: false, message: "해당 필터 결과가 없습니다." });
                }
            }
        }
        else {
            if (req.query.category_ids) {
                const writing = yield Writings_1.default.find({
                    user_id: user_id,
                    category_id: { $in: category_real_list },
                }).sort({ created_date: -1 }).skip(offsetnum * (pagenum - 1)).limit(offsetnum).select("-__v -category_id -category.__v -category.user_id -category_name");
                const count = yield Writings_1.default.find({
                    user_id: user_id,
                    category_id: { $in: category_real_list }
                }).count();
                if (writing.length != 0) {
                    res.status(200).json({ success: true, data: { writing, count } });
                }
                else {
                    res
                        .status(404)
                        .json({ success: false, message: "해당 필터 결과가 없습니다." });
                }
            }
            else {
                const writing = yield Writings_1.default.find({
                    user_id: { $eq: user_id },
                }).sort({ created_date: -1 }).skip(offsetnum * (pagenum - 1)).limit(offsetnum).select("-__v -category_id -category.__v -category.user_id -category_name");
                const count = yield Writings_1.default.find({
                    user_id: user_id,
                }).count();
                if (writing.length != 0) {
                    res.status(200).json({ success: true, data: { writing, count } });
                }
                else {
                    res
                        .status(404)
                        .json({ success: false, message: "해당 필터 결과가 없습니다." });
                }
            }
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
router.get("/:writing_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        const writing = yield Writings_1.default.find({
            _id: req.params.writing_id,
            user_id: req.body.user.id,
        }).select("-__v -category_id -category.__v -category.user_id");
        res.status(200).json({ success: true, data: { writing } });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
router.get("/stat/graph", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userid = mongoose_1.default.Types.ObjectId(req.body.user.id);
    try {
        console.log(req.body.user.id);
        const nums = yield Writings_2.default.find({ user_id: req.body.user.id }).count();
        console.log(nums);
        const allstat = yield Writings_2.default.aggregate([
            { $match: { "user_id": userid } },
            { $group: { _id: {
                        'name': "$category_name",
                        'index': '$category.index'
                    }, count: { $sum: 1 } } },
            { $project: {
                    name: "$_id.name",
                    index: "$_id.index",
                    _id: false,
                    percent: { $round: [{ "$multiply": [{ "$divide": ["$count", { "$literal": nums }] }, 100] }, 0]
                    }
                } },
            { $sort: { percent: -1 } },
        ]);
        const end_date = getCurrentDate();
        let start_date = new Date(end_date);
        start_date.setDate(end_date.getDate() - 30);
        console.log(start_date);
        const month_cnt = yield Writings_2.default.find({
            user_id: req.body.user.id,
            created_date: { $gte: start_date, $lte: end_date },
        }).count();
        console.log(month_cnt);
        const monthstat = yield Writings_2.default.aggregate([
            { $match: { "user_id": userid, "created_date": { $gte: start_date, $lte: end_date } } },
            { $group: { _id: {
                        'name': "$category_name",
                        'index': '$category.index'
                    }, count1: { $sum: 1 } } },
            { $project: {
                    name: "$_id.name",
                    index: "$_id.index",
                    _id: false,
                    percent: { $round: [{ "$multiply": [{ "$divide": ["$count1", { "$literal": month_cnt }] }, 100] }, 0]
                    }
                } },
            { $sort: { percent: -1 } },
        ]);
        res.status(200).json({
            success: true,
            data: { allstat, monthstat }
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
router.delete("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: "false", errors: errors.array() });
    }
    const writing_ids = String(req.query.ids).replace("[", "").replace("]", "");
    const id_list = writing_ids.split(",");
    try {
        yield Writings_1.default.deleteMany({
            _id: { $in: id_list },
        });
        const writing = yield Writings_2.default.find({
            user_id: req.body.user.id,
        }).select("-__v -category_id -category.__v").sort({ created_date: -1 });
        res.status(200).json({ success: true, data: { writing } });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=writings.js.map