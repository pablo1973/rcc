#!/usr/bin/env node
"use strict";
/**
 * RCC Demo CLI
 * Uso: node cli.js "texto" | echo "texto" | node cli.js
 */
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../src/core/analyzer");
const regulator_1 = require("../src/core/regulator");
function run(input) {
    const analysis = (0, analyzer_1.analyze)(input);
    const result = (0, regulator_1.regulate)(analysis, input);
    console.log(`[${analysis.state}] ${result.message}`);
}
// Argv mode
if (process.argv[2]) {
    run(process.argv[2]);
    process.exit(0);
}
// Stdin mode
let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { data += chunk; });
process.stdin.on('end', () => {
    if (data.trim()) {
        run(data.trim());
    }
    process.exit(0);
});
