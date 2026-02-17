import { analyze } from "../src/core/analyzer";
import { regulate } from "../src/core/regulator";
import { route } from "../src/core/router";

export function runOnce(input: string) {
  const a = analyze(input);
  const r = regulate(a, input);
  return route(r);
}
