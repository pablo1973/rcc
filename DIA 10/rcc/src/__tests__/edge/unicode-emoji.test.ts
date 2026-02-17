/**
 * Edge Cases - Unicode and Emoji
 * RCC v1.0.0-DAY8
 * 
 * Validates: no-crash, stable output, coherent state
 * for unicode and emoji inputs
 */

import { analyze } from '../../core/analyzer';
import { regulate } from '../../core/regulator';
import { route } from '../../core/router';

describe('Edge: Unicode and Emoji', () => {

  // ─────────────────────────────────────────────────────────────
  // Helper: Full pipeline
  // ─────────────────────────────────────────────────────────────
  function runPipeline(input: string) {
    const analysis = analyze(input);
    const regulation = regulate(analysis, input);
    const routing = route(regulation);
    return { analysis, regulation, routing };
  }

  // ─────────────────────────────────────────────────────────────
  // Basic emoji
  // ─────────────────────────────────────────────────────────────
  describe('basic emoji', () => {
    test('single emoji does not crash', () => {
      const input = '😀';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('multiple emoji', () => {
      const input = '😀😃😄😁😆';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('emoji with text', () => {
      const input = 'hello 😀 world';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('emoji only returns valid state', () => {
      const input = '🎉🎊🎁';
      const { analysis } = runPipeline(input);
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
    });

    test('emoji message preserved', () => {
      const input = '👋 hello';
      const { regulation } = runPipeline(input);
      expect(regulation.message).toBe(input);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Emoji categories
  // ─────────────────────────────────────────────────────────────
  describe('emoji categories', () => {
    test('face emoji', () => {
      const input = '😀😃😄😁😆😅🤣😂';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('hand emoji', () => {
      const input = '👋👌👍👎✌️🤞';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('heart emoji', () => {
      const input = '❤️💛💚💙💜🖤🤍';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('animal emoji', () => {
      const input = '🐶🐱🐭🐹🐰🦊🐻';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('food emoji', () => {
      const input = '🍎🍐🍊🍋🍌🍉🍇';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('flag emoji', () => {
      const input = '🇺🇸🇬🇧🇫🇷🇩🇪🇯🇵';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('symbol emoji', () => {
      const input = '✅❌⚠️🔴🟢🔵';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Complex emoji (ZWJ sequences)
  // ─────────────────────────────────────────────────────────────
  describe('complex emoji (ZWJ sequences)', () => {
    test('family emoji', () => {
      const input = '👨‍👩‍👧‍👦';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('profession emoji', () => {
      const input = '👨‍💻👩‍🔬👨‍🍳';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('skin tone modifiers', () => {
      const input = '👋🏻👋🏼👋🏽👋🏾👋🏿';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('gender variants', () => {
      const input = '🙋‍♂️🙋‍♀️🧑‍🦰';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // CJK characters (Chinese, Japanese, Korean)
  // ─────────────────────────────────────────────────────────────
  describe('CJK characters', () => {
    test('Chinese simplified', () => {
      const input = '你好世界';
      expect(() => runPipeline(input)).not.toThrow();
      const { regulation } = runPipeline(input);
      expect(regulation.message).toBe(input);
    });

    test('Chinese traditional', () => {
      const input = '繁體中文測試';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Japanese hiragana', () => {
      const input = 'こんにちは';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Japanese katakana', () => {
      const input = 'カタカナテスト';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Japanese kanji', () => {
      const input = '日本語漢字';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Korean hangul', () => {
      const input = '안녕하세요';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('mixed CJK', () => {
      const input = '中文 日本語 한국어';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Arabic and RTL
  // ─────────────────────────────────────────────────────────────
  describe('Arabic and RTL', () => {
    test('Arabic text', () => {
      const input = 'مرحبا بالعالم';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Hebrew text', () => {
      const input = 'שלום עולם';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('RTL with LTR mixed', () => {
      const input = 'Hello مرحبا World';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('RTL markers', () => {
      const input = '\u200F\u200Etest\u200F';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Cyrillic
  // ─────────────────────────────────────────────────────────────
  describe('Cyrillic', () => {
    test('Russian text', () => {
      const input = 'Привет мир';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Ukrainian text', () => {
      const input = 'Привіт світ';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('mixed Cyrillic and Latin', () => {
      const input = 'Hello Привет';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Cyrillic uppercase', () => {
      const input = 'ПРИВЕТ';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Other scripts
  // ─────────────────────────────────────────────────────────────
  describe('other scripts', () => {
    test('Greek', () => {
      const input = 'Γειά σου κόσμε';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Thai', () => {
      const input = 'สวัสดีโลก';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Hindi/Devanagari', () => {
      const input = 'नमस्ते दुनिया';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Tamil', () => {
      const input = 'வணக்கம் உலகம்';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('Bengali', () => {
      const input = 'হ্যালো বিশ্ব';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Special unicode
  // ─────────────────────────────────────────────────────────────
  describe('special unicode', () => {
    test('mathematical symbols', () => {
      const input = '∑∏∫∂∞≠≈±';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('currency symbols', () => {
      const input = '$€£¥₹₽₿';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('arrows', () => {
      const input = '←→↑↓↔↕⇐⇒';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('box drawing', () => {
      const input = '┌─┐│└─┘├┤';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('dingbats', () => {
      const input = '✓✗✔✘★☆♠♣';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Unicode edge cases
  // ─────────────────────────────────────────────────────────────
  describe('unicode edge cases', () => {
    test('zero-width space', () => {
      const input = 'hello\u200Bworld';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('zero-width joiner', () => {
      const input = 'test\u200Dtest';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('BOM character', () => {
      const input = '\uFEFFhello';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('replacement character', () => {
      const input = '�hello�';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('unpaired surrogate', () => {
      const input = '\uD800test';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('high surrogate pair', () => {
      const input = '\uD83D\uDE00'; // 😀
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('non-breaking space', () => {
      const input = 'hello\u00A0world';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Combining characters
  // ─────────────────────────────────────────────────────────────
  describe('combining characters', () => {
    test('combining diacritical marks', () => {
      const input = 'e\u0301'; // é via combining
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('multiple combining marks', () => {
      const input = 'a\u0300\u0301\u0302'; // heavily accented
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('zalgo text', () => {
      const input = 'H̷̭̔ë̶̞l̸̰̐l̷̰͝o̶͚̓';
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('extreme zalgo', () => {
      const input = 'T̷̨̧̢̡̛̳̱̣̮̭̠̤͉̼̙̝̫͖͓̲͇̻̪͖̖̦̣̳͔̫̯̼͇̹̻̹̬̠̝̱̜̱̦̪̣͔̲̞̼̈́̃́̈̓̈́͊̿̔̋̎̃̓́̅͆̏̋͐̈́̈́̀̃̃̆̉̊̑̽̓̃̕̕͘͜͝͝e̷s̴t';
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Long unicode strings
  // ─────────────────────────────────────────────────────────────
  describe('long unicode strings', () => {
    test('many emoji', () => {
      const input = '😀'.repeat(1000);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('long Chinese text', () => {
      const input = '测试'.repeat(1000);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('long Arabic text', () => {
      const input = 'اختبار '.repeat(500);
      expect(() => runPipeline(input)).not.toThrow();
    });

    test('mixed script long text', () => {
      const input = 'Hello你好مرحبا'.repeat(200);
      expect(() => runPipeline(input)).not.toThrow();
    });
  });

  // ─────────────────────────────────────────────────────────────
  // Determinism
  // ─────────────────────────────────────────────────────────────
  describe('determinism', () => {
    test('same emoji input = same output', () => {
      const input = '😀😃😄';
      const r1 = runPipeline(input);
      const r2 = runPipeline(input);
      expect(r1.analysis).toEqual(r2.analysis);
    });

    test('same CJK input = same output', () => {
      const input = '你好世界';
      const r1 = runPipeline(input);
      const r2 = runPipeline(input);
      expect(r1.analysis.state).toBe(r2.analysis.state);
    });

    test('same mixed script = same output', () => {
      const input = 'Hello 你好 مرحبا';
      const r1 = runPipeline(input);
      const r2 = runPipeline(input);
      expect(r1.analysis).toEqual(r2.analysis);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // State coherence
  // ─────────────────────────────────────────────────────────────
  describe('state coherence', () => {
    test('unicode produces valid state', () => {
      const input = '你好世界 🌍';
      const { analysis } = runPipeline(input);
      expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
    });

    test('unicode produces valid action', () => {
      const input = 'مرحبا';
      const { regulation } = runPipeline(input);
      expect(['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE']).toContain(regulation.action);
    });

    test('unicode routes to valid channel', () => {
      const input = 'Привет';
      const { routing } = runPipeline(input);
      expect(['TEXT', 'COOLDOWN']).toContain(routing.channel);
    });

    test('message preserved for unicode', () => {
      const input = '日本語テスト 🎌';
      const { regulation } = runPipeline(input);
      expect(regulation.message).toBe(input);
    });
  });
});
