"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CheersSchema = new mongoose_1.default.Schema({
    context: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Cheers", CheersSchema);
//# sourceMappingURL=Cheers.js.map