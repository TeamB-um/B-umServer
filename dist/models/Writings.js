"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// const moment = require("moment-timezone");
// const dateSeoul = moment.tz(Date.now(), "Asia/Seoul");
const WritingsSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    created_date: {
        type: Date,
        required: true,
    },
    category: {
        type: Object,
        required: true,
    },
    user_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Users",
    },
    category_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Categories",
    },
});
exports.default = mongoose_1.default.model("Writings", WritingsSchema);
//# sourceMappingURL=Writings.js.map