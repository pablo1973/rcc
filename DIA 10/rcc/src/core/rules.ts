import { State } from "./states";
export function applyRules(text: string, state: State): string {
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
