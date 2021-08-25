"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UsersSchema = new mongoose_1.default.Schema({
    device_id: {
        type: String,
        required: true,
    },
    ispush: {
        type: Boolean,
        required: true,
    },
    rewardseq: {
        type: Number,
        required: true,
        default: 1,
    },
    presentseq: {
        type: Number,
        required: true,
        default: 1
    },
    // devicetoken : {
    //   type : String,
    //   required : true
    // }
});
exports.default = mongoose_1.default.model("Users", UsersSchema);
//# sourceMappingURL=Users.js.map