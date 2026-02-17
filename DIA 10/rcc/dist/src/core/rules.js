"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyRules = applyRules;
function applyRules(text, state) {
    switch (state) {
        case "CALM":
            return text;
        case "NEUTRAL":
            return text;
        case "TENSE":
            return text;
        default:
            return text;
    }
}
