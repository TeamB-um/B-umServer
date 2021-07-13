"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RewardDummySchema = new mongoose_1.default.Schema({
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
    seq: {
        type: Number,
        required: true,
    },
});
exports.default = mongoose_1.default.model("RewardDummy", RewardDummySchema);
//# sourceMappingURL=Rewards_dummy.js.map