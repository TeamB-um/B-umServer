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
const Writings_2 = __importDefault(require("../models/Writings"));
const Trashcans_1 = __importDefault(require("../models/Trashcans"));
const Rewards_dummy_1 = __importDefault(require("../models/Rewards_dummy"));
const Rewards_1 = __importDefault(require("../models/Rewards"));
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
function addDays(date, days) {
    const clone = new Date(date);
    clone.setDate(date.getDate() + days);
    return clone;
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
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }
    let title = req.body.title;
    if (!title) {
        title = "제목 없음";
    }
    const text = req.body.text;
    const category_id = req.body.category_id;
    const usercheck = yield Users_1.default.findById(req.body.user.id);
    const categoryObjectcheck = yield Categories_1.default.findOne({
        _id: category_id,
    });
    if (req.body.user.id != categoryObjectcheck.user_id) {
        res
            .status(400)
            .json({ success: false, msg: "카테고리가 유저와 일치하지 않음" });
    }
    else {
        try {
            const user = yield Users_1.default.findById(req.body.user.id);
            const categoryObject = yield Categories_1.default.findOne({
                _id: category_id,
            });
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
            const inputcategoryObject = yield Categories_1.default.findOne({
                _id: req.body.category_id,
            });
            const newWriting = new Writings_2.default({
                title: title,
                text: text,
                user_id: user.id,
                category: inputcategoryObject,
                created_date: getCurrentDate(),
                category_id: req.body.category_id,
            });
            const writing = yield newWriting.save();
            let writingresult = {
                _id: writing.id,
                title: writing.title,
                text: writing.text,
                category: writing.category,
                created_date: writing.created_date,
            };
            res.status(201).json({ success: true, data: writingresult });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json({ success: false, msg: "서버 오류" });
        }
    }
}));
router.get("/", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    let start_date = req.query.start_date;
    let end_date = req.query.end_date;
    const category_list = String(req.query.category_ids);
    const category_real_list = category_list.split(",");
    const Date_start_date = new Date(String(start_date));
    const Date_end_date = new Date(String(end_date));
    const user_id = req.body.user.id;
    console.log(category_real_list);
    try {
        if (req.query.writing_id) {
            const writing = yield Writings_1.default.findOne({ _id: req.query.writing_id });
            const writingresult = {
                _id: writing.id,
                title: writing.title,
                text: writing.text,
                category: writing.category,
                created_date: writing.created_date,
            };
            res
                .status(200)
                .json({ success: true, msg: "글 1개 조회 완료", data: writingresult });
        }
        else {
            if (start_date) {
                if (req.query.category_ids) {
                    const writings = yield Writings_1.default.find({
                        user_id: user_id,
                        category_id: { $in: category_real_list },
                        created_date: { $gte: Date_start_date, $lte: Date_end_date },
                    });
                    console.log(writings);
                    if (writings.length != 0) {
                        res.status(200).json({ success: true, data: writings });
                    }
                    else {
                        res
                            .status(404)
                            .json({ success: false, msg: "해당 필터 결과가 없습니다." });
                    }
                }
                else {
                    const writings = yield Writings_1.default.find({
                        user_id: user_id,
                        created_date: { $gte: Date_start_date, $lte: Date_end_date },
                    });
                    if (writings.length != 0) {
                        res.status(200).json({ success: true, data: writings });
                    }
                    else {
                        res
                            .status(404)
                            .json({ success: false, msg: "해당 필터 결과가 없습니다." });
                    }
                }
            }
            else {
                if (req.query.category_ids) {
                    const writings = yield Writings_1.default.find({
                        user_id: user_id,
                        category_id: { $in: category_real_list },
                    });
                    if (writings.length != 0) {
                        res.status(200).json({ success: true, writings });
                    }
                    else {
                        res
                            .status(404)
                            .json({ success: false, msg: "해당 필터 결과가 없습니다." });
                    }
                }
                else {
                    const writings = yield Writings_1.default.find({ user_id: { $eq: user_id } });
                    if (writings.length != 0) {
                        res.status(200).json({ success: true, data: writings });
                    }
                    else {
                        res
                            .status(404)
                            .json({ success: false, msg: "해당 필터 결과가 없습니다." });
                    }
                }
            }
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
router.get("/stat", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const category = yield Categories_1.default.find({
            user_id: req.body.user.id,
        });
        const categorynumber = yield Categories_1.default.find({
            user_id: req.body.user.id,
        }).count();
        var dicObject = {};
        for (let i = 0; i < categorynumber; i++) {
            var newobject = {};
            const cnt = yield Writings_2.default.find({
                category_id: category[i]._id,
            }).count();
            const name = String(category[i].name);
            newobject["name"] = name;
            newobject["cnt"] = cnt;
        }
        console.log(dicObject);
        var sortable = [];
        for (var name in dicObject) {
            sortable.push([name, dicObject[name]]);
        }
        sortable.sort(function (a, b) {
            if (b[1] > a[1]) {
                return 1;
            }
            else if (b[1] < a[1]) {
                return -1;
            }
            else {
                console.log("a");
                if (a[0] > b[0]) {
                    return 1;
                }
                else if (a[0] < b[1]) {
                    return -1;
                }
            }
        });
        console.log(sortable);
        console.log(categorynumber);
        let sum = 0;
        let allresult = {};
        // for (let i =0;i<categorynumber;i++)
        // {
        //       if(i==0 && sortable[i][1]==0){
        //         allresult["result"] = "작성된 글이 존재하지 않습니다."
        //       }
        //       else{
        //          allresult[sortable[0][0]]=allresult[sortable[]]
        //       }
        // }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
router.get("/rewards/:category_id", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const category = yield Categories_1.default.findOne({
            _id: req.params.category_id,
        });
        const user = yield Users_1.default.findOne({
            _id: req.body.user.id,
        });
        const newseq = Number(user.seq) + 1;
        const reward = yield Rewards_dummy_1.default.findOne({
            seq: user.seq,
        });
        console.log(newseq);
        yield Users_1.default.findOneAndUpdate({
            _id: req.body.user.id,
        }, {
            seq: newseq,
        });
        yield Categories_1.default.findOneAndUpdate({
            _id: req.params.category_id,
        }, {
            count: 0,
        });
        const newReward = new Rewards_1.default({
            sentence: reward.sentence,
            context: reward.context,
            author: reward.author,
            user_id: req.body.user_id,
            index: category.index,
            created_date: getCurrentDate(),
        });
        yield newReward.save();
        res.status(200).json({ success: true, data: reward });
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
    const writing_ids = String(req.query.writing_ids);
    console.log(req.query.writing_ids);
    const id_list = writing_ids.split(",");
    console.log(id_list);
    try {
        for (let i = 0; i < id_list.length; i++) {
            const writing_info = yield Writings_2.default.findById(id_list[i]);
            const user = yield Users_1.default.findById(writing_info.user_id);
            const title = writing_info.title;
            const text = writing_info.text;
            const user_id = writing_info.user_id;
            const category = writing_info.category;
            //현재 날짜를 생성날짜로 정하고
            let created_date = getCurrentDate();
            //user model에서 유통기한을 받아온 뒤
            const delperiod = user.delperiod;
            //두 날짜를 더해서 삭제 예정 날짜를 연산
            //models expire 설정에 따라 해당 날짜가 되면 1분 경과 후 삭제
            created_date = addDays(created_date, delperiod);
            const newTrash = new Trashcans_1.default({
                title,
                text,
                user_id,
                delperiod,
                created_date,
                category,
            });
            const trash = yield newTrash.save();
        }
        yield Writings_1.default.deleteMany({
            _id: { $in: id_list },
        });
        res.status(204).json({ success: true, msg: "보관함 글 삭제 완료" });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: "서버 오류" });
    }
}));
module.exports = router;
//# sourceMappingURL=writings.js.map