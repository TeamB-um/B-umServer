"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RewardsSchema = new mongoose_1.default.Schema({
    created_date: {
        type: Date,
        required: true,
    },
    sentence: {
        type: String,
        required: true,
    },
    context: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    user_id: {
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Users",
    },
    index: {
        type: Number,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Rewards", RewardsSchema);
//# sourceMappingURL=Rewards.js.map