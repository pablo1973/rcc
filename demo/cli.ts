#!/usr/bin/env node
/**
 * RCC Demo CLI
 * Uso: node cli.js "texto" | echo "texto" | node cli.js
 */

import { analyze } from '../src/core/analyzer';
import { regulate } from '../src/core/regulator';

function run(input: string): void {
  const analysis = analyze(input);
  const result = regulate(analysis, input);
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
