"use strict";
/**
 * Edge Cases - Mixed Language
 * RCC v1.0.0-DAY8
 *
 * Validates: no-crash, stable output, coherent state
 * for mixed language and script inputs
 */
Object.defineProperty(exports, "__esModule", { value: true });
const analyzer_1 = require("../../core/analyzer");
const regulator_1 = require("../../core/regulator");
const router_1 = require("../../core/router");
describe('Edge: Mixed Language', () => {
    // ─────────────────────────────────────────────────────────────
    // Helper: Full pipeline
    // ─────────────────────────────────────────────────────────────
    function runPipeline(input) {
        const analysis = (0, analyzer_1.analyze)(input);
        const regulation = (0, regulator_1.regulate)(analysis, input);
        const routing = (0, router_1.route)(regulation);
        return { analysis, regulation, routing };
    }
    // ─────────────────────────────────────────────────────────────
    // English + Other languages
    // ─────────────────────────────────────────────────────────────
    describe('English mixed with other languages', () => {
        test('English + Spanish', () => {
            const input = 'Hello, ¿cómo estás? I am fine, gracias.';
            expect(() => runPipeline(input)).not.toThrow();
            const { regulation } = runPipeline(input);
            expect(regulation.message).toBe(input);
        });
        test('English + French', () => {
            const input = 'Hello, je suis très happy to see you, mon ami.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + German', () => {
            const input = 'This is wunderbar, I love Gemütlichkeit.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Portuguese', () => {
            const input = 'Obrigado for your help, muito appreciated.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Italian', () => {
            const input = 'Ciao bella, how are you doing oggi?';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // English + Asian languages
    // ─────────────────────────────────────────────────────────────
    describe('English mixed with Asian languages', () => {
        test('English + Chinese', () => {
            const input = 'Hello 你好, welcome to the 世界.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Japanese', () => {
            const input = 'This is すごい, very kawaii indeed.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Korean', () => {
            const input = 'Hello 안녕, nice to meet you 감사합니다.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Hindi', () => {
            const input = 'Hello नमस्ते, welcome to India.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Thai', () => {
            const input = 'Hello สวัสดี, welcome to Bangkok.';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // English + RTL languages
    // ─────────────────────────────────────────────────────────────
    describe('English mixed with RTL languages', () => {
        test('English + Arabic', () => {
            const input = 'Hello مرحبا, welcome يا صديقي.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Hebrew', () => {
            const input = 'Hello שלום, welcome to ישראל.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Persian', () => {
            const input = 'Hello سلام, welcome to ایران.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Urdu', () => {
            const input = 'Hello السلام علیکم, welcome.';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // English + Cyrillic
    // ─────────────────────────────────────────────────────────────
    describe('English mixed with Cyrillic', () => {
        test('English + Russian', () => {
            const input = 'Hello Привет, welcome to Россия.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Ukrainian', () => {
            const input = 'Hello Привіт, welcome to Україна.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('English + Bulgarian', () => {
            const input = 'Hello Здравей, welcome to България.';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Multiple non-English languages
    // ─────────────────────────────────────────────────────────────
    describe('multiple non-English languages', () => {
        test('Spanish + French', () => {
            const input = 'Hola, comment ça va? Muy bien, merci.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Chinese + Japanese', () => {
            const input = '你好 こんにちは 朋友.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Arabic + Hebrew', () => {
            const input = 'مرحبا שלום سلام.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Russian + Ukrainian', () => {
            const input = 'Привет Привіт друзья.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('German + Dutch', () => {
            const input = 'Guten Tag, hoe gaat het?';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Many languages in one text
    // ─────────────────────────────────────────────────────────────
    describe('many languages in one text', () => {
        test('5 languages mixed', () => {
            const input = 'Hello 你好 مرحبا Привет Bonjour';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('6 scripts mixed', () => {
            const input = 'Hi 你好 こんにちは 안녕 שלום مرحبا';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('European languages mix', () => {
            const input = 'Hello Hola Bonjour Ciao Hallo Olá';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Asian languages mix', () => {
            const input = '你好 こんにちは 안녕하세요 สวัสดี नमस्ते';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('10+ languages', () => {
            const input = 'Hello Hola Bonjour Ciao 你好 مرحبا Привет こんにちは 안녕 שלום';
            expect(() => runPipeline(input)).not.toThrow();
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Code-switching patterns
    // ─────────────────────────────────────────────────────────────
    describe('code-switching patterns', () => {
        test('Spanglish', () => {
            const input = 'Vamos to the store porque I need leche.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Hinglish', () => {
            const input = 'Yaar, this is बहुत cool, I love it.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Chinglish', () => {
            const input = 'This 东西 is very 好, I 喜欢 it.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Japanglish', () => {
            const input = 'This is とても cool, 本当に awesome.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Denglish', () => {
            const input = 'Das ist super cool, very gut indeed.';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Technical terms in different languages
    // ─────────────────────────────────────────────────────────────
    describe('technical terms in different languages', () => {
        test('programming terms mixed', () => {
            const input = 'The función returns null cuando el array está vacío.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('business terms mixed', () => {
            const input = 'We need to faire le ROI analysis for the proyek.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('scientific terms mixed', () => {
            const input = 'The 実験 shows that die Hypothese is correct.';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Numbers and languages
    // ─────────────────────────────────────────────────────────────
    describe('numbers with different languages', () => {
        test('numbers with English', () => {
            const input = 'There are 100 items in the list.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('numbers with Chinese', () => {
            const input = '有100个items在这里.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Arabic numerals with Arabic text', () => {
            const input = 'هناك 100 عنصر في القائمة';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('mixed number formats', () => {
            const input = '100 items = 百 アイテム';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Punctuation in different languages
    // ─────────────────────────────────────────────────────────────
    describe('punctuation in different languages', () => {
        test('Spanish inverted punctuation', () => {
            const input = '¿Cómo estás? ¡Muy bien!';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Chinese punctuation', () => {
            const input = '你好！这是测试。';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Japanese punctuation', () => {
            const input = 'これはテストです。すごい！';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('French guillemets', () => {
            const input = '«Bonjour» dit-il.';
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('mixed punctuation styles', () => {
            const input = 'Hello! ¿Qué tal? 你好！こんにちは。';
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Long mixed language texts
    // ─────────────────────────────────────────────────────────────
    describe('long mixed language texts', () => {
        test('long paragraph with 3 languages', () => {
            const input = 'Hello world, 你好世界, مرحبا بالعالم. '.repeat(50);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('alternating languages', () => {
            const input = 'Hello 你好 Hello 你好 '.repeat(100);
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('complex mixed paragraph', () => {
            const input = 'This is a test 这是一个测试 これはテストです 이것은 테스트입니다 هذا اختبار Это тест. '.repeat(20);
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Determinism
    // ─────────────────────────────────────────────────────────────
    describe('determinism', () => {
        test('same mixed input = same output', () => {
            const input = 'Hello 你好 مرحبا';
            const r1 = runPipeline(input);
            const r2 = runPipeline(input);
            expect(r1.analysis).toEqual(r2.analysis);
        });
        test('deterministic for code-switching', () => {
            const input = 'This is muy bueno, 非常好';
            const r1 = runPipeline(input);
            const r2 = runPipeline(input);
            expect(r1.analysis.state).toBe(r2.analysis.state);
            expect(r1.analysis.score).toBe(r2.analysis.score);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // State coherence
    // ─────────────────────────────────────────────────────────────
    describe('state coherence', () => {
        test('mixed language produces valid state', () => {
            const input = 'Bonjour 你好 Hola';
            const { analysis } = runPipeline(input);
            expect(['CALM', 'NEUTRAL', 'TENSE']).toContain(analysis.state);
        });
        test('mixed language produces valid action', () => {
            const input = 'Hello مرحبا Привет';
            const { regulation } = runPipeline(input);
            expect(['PASSTHROUGH', 'SOFTEN', 'SUMMARIZE', 'PAUSE']).toContain(regulation.action);
        });
        test('mixed language routes to valid channel', () => {
            const input = 'Ciao 안녕 שלום';
            const { routing } = runPipeline(input);
            expect(['TEXT', 'COOLDOWN']).toContain(routing.channel);
        });
        test('message preserved for mixed language', () => {
            const input = 'Hello 你好 مرحبا';
            const { regulation } = runPipeline(input);
            expect(regulation.message).toBe(input);
        });
    });
    // ─────────────────────────────────────────────────────────────
    // Edge: similar looking scripts
    // ─────────────────────────────────────────────────────────────
    describe('similar looking scripts', () => {
        test('Cyrillic lookalikes', () => {
            // Some Cyrillic letters look like Latin
            const input = 'Неllo Wоrld'; // H and W are Latin, rest is Cyrillic
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('Greek lookalikes', () => {
            const input = 'Ηello Ωorld'; // H is Eta, Ω is Omega
            expect(() => runPipeline(input)).not.toThrow();
        });
        test('homoglyph attack pattern', () => {
            const input = 'раyраl'; // Cyrillic 'р' and 'а'
            expect(() => runPipeline(input)).not.toThrow();
        });
    });
});
