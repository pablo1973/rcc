"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runOnce = runOnce;
const analyzer_1 = require("../src/core/analyzer");
const regulator_1 = require("../src/core/regulator");
const router_1 = require("../src/core/router");
function runOnce(input) {
    const a = (0, analyzer_1.analyze)(input);
    const r = (0, regulator_1.regulate)(a, input);
    return (0, router_1.route)(r);
}
