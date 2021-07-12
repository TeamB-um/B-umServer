"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TrashcansSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    category_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Categories",
    },
    user_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Users",
    },
    delperiod: {
        type: Number,
        required: true,
    },
    created_date: {
        type: Date,
        //created_date가 될 시 1분 후 해당 문서 삭제
        expires: 60,
    },
    category: {
        type: Object,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Trashcans", TrashcansSchema);
//# sourceMappingURL=Trashcans.js.map