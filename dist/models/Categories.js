"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CategoriesSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    },
    user_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Users",
    },
    img: {
        type: String,
        requied: true,
    },
    created_date: {
        type: Date,
        requied: true,
    },
});
exports.default = mongoose_1.default.model("Categories", CategoriesSchema);
//# sourceMappingURL=Categories.js.map