'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { MAX_INPUT_LENGTH, analyzeInput } = require('../src/forensicEngine');
const { DRILLS, GOLDEN_HOUR_PLAYBOOK, XRAY_PRESETS, getDrillById } = require('../src/drills');

function assertLosslessSegments(input, result) {
  assert.ok(Array.isArray(result.highlightedSegments), 'highlightedSegments must be an array');
  const joined = result.highlightedSegments.map((s) => s.text).join('');
  assert.equal(joined, input, 'Concatenated highlightedSegments must exactly match original input');
  for (const seg of result.highlightedSegments) {
    assert.ok(
      seg.highlight === null || seg.highlight === 'warn' || seg.highlight === 'danger',
      `Unexpected highlight value: ${seg.highlight}`
    );
    assert.equal(typeof seg.text, 'string');
    assert.ok(seg.text.length > 0, 'Segments should be non-empty');
  }
}

describe('Forensic Engine — Unit & Edge-Case Suite', () => {
  describe('1. Punycode (xn--) detection & span highlighting', () => {
    it('flags xn-- punycode URL host with exact span highlighting', () => {
      const input = 'Verify account at https://xn--metrobank-kyc-9x2a.example/update now.';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'punycode_homoglyph');
      assert.ok(finding, 'Expected punycode_homoglyph finding');
      assert.equal(finding.severity, 'danger');
      assert.equal(finding.points, 35);
      assert.ok(finding.matchedTokens.includes('xn--metrobank-kyc-9x2a.example'));

      const dangerSegs = res.highlightedSegments.filter(
        (s) => s.highlight === 'danger' && s.ruleId === 'punycode_homoglyph'
      );
      assert.equal(dangerSegs.length, 1);
      assert.equal(dangerSegs[0].text, 'xn--metrobank-kyc-9x2a.example');
    });

    it('flags uppercase XN-- and standalone punycode domains without scheme', () => {
      const input = 'Open XN--b1aew-demo.example/login to continue';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'punycode_homoglyph');
      assert.ok(finding);
      assert.equal(finding.points, 35);
      const highlighted = res.highlightedSegments.find((s) => s.ruleId === 'punycode_homoglyph');
      assert.equal(highlighted.text, 'XN--b1aew-demo.example');
    });
  });

  describe('2. Mixed Cyrillic/Greek homoglyphs vs clean Hindi Devanagari', () => {
    it('detects Cyrillic lookalike "е" inside Latin domain mеtrobank.example', () => {
      // Uses Cyrillic small letter Ie (\u0435)
      const spoofedHost = 'm\u0435trobank.example';
      const input = `Login at https://${spoofedHost}/kyc`;
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'punycode_homoglyph');
      assert.ok(finding, 'Expected mixed Cyrillic homoglyph finding');
      assert.equal(finding.severity, 'danger');
      assert.equal(finding.points, 35);
      assert.ok(finding.matchedTokens.includes(spoofedHost));

      const highlighted = res.highlightedSegments.find((s) => s.ruleId === 'punycode_homoglyph');
      assert.equal(highlighted.text, spoofedHost);
    });

    it('detects Cyrillic "а" and Greek "ο" lookalikes inside Latin domains/brands', () => {
      const cyrillicInput = 'Visit https://p\u0430ysim-help.example/claim';
      const greekInput = 'Check bank\u03BFfmetro.example for updates';

      const r1 = analyzeInput(cyrillicInput);
      assertLosslessSegments(cyrillicInput, r1);
      assert.ok(r1.findings.some((f) => f.ruleId === 'punycode_homoglyph'));

      const r2 = analyzeInput(greekInput);
      assertLosslessSegments(greekInput, r2);
      assert.ok(r2.findings.some((f) => f.ruleId === 'punycode_homoglyph'));
    });

    it('does NOT false-positive on clean Hindi Devanagari mixed with clean English URLs', () => {
      const input =
        'आधिकारिक साइबर सुरक्षा पोर्टल https://cybercrime.gov.in पर जाएं और किसी भी मदद के लिए 1930 पर कॉल करें।';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      assert.equal(res.riskScore, 0);
      assert.equal(res.verdictLevel, 'low');
      assert.equal(res.findings.length, 0);
      assert.ok(res.highlightedSegments.every((s) => s.highlight === null));
    });

    it('does NOT false-positive on pure non-Latin Cyrillic text without Latin mixing', () => {
      const input = 'Обычное сообщение без латиницы и ссылок';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      assert.equal(res.findings.length, 0);
      assert.equal(res.riskScore, 0);
    });
  });

  describe('3. Double-extension & executable lures', () => {
    it('flags .pdf.apk double-extension lure at +40 risk and highlights only filename', () => {
      const input = 'Download https://files.example/dl/MetroBill_Notice.pdf.apk?v=2';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'double_extension_apk');
      assert.ok(finding);
      assert.equal(finding.severity, 'danger');
      assert.equal(finding.points, 40);
      assert.ok(finding.matchedTokens.includes('MetroBill_Notice.pdf.apk'));

      const highlighted = res.highlightedSegments.find((s) => s.ruleId === 'double_extension_apk');
      assert.equal(highlighted.text, 'MetroBill_Notice.pdf.apk');
    });

    it('flags .jpg.exe and .doc.bat double-extension lures at +40 risk', () => {
      for (const fname of ['Photo_Scan.jpg.exe', 'Court_Order.doc.bat']) {
        const res = analyzeInput(`Open ${fname} attached here.`);
        assertLosslessSegments(`Open ${fname} attached here.`, res);
        const finding = res.findings.find((f) => f.ruleId === 'double_extension_apk');
        assert.ok(finding, `Expected finding for ${fname}`);
        assert.equal(finding.points, 40);
        assert.equal(finding.severity, 'danger');
      }
    });

    it('scores standalone .apk at +35 without lure keywords and +40 with urgent lure keywords', () => {
      const plainInput = 'File shared: app-build.apk';
      const plainRes = analyzeInput(plainInput);
      assertLosslessSegments(plainInput, plainRes);
      const plainFinding = plainRes.findings.find((f) => f.ruleId === 'double_extension_apk');
      assert.ok(plainFinding);
      assert.equal(plainFinding.points, 35);

      const urgentInput = 'URGENT: install MetroUtility.apk immediately to avoid fee';
      const urgentRes = analyzeInput(urgentInput);
      assertLosslessSegments(urgentInput, urgentRes);
      const urgentFinding = urgentRes.findings.find((f) => f.ruleId === 'double_extension_apk');
      assert.ok(urgentFinding);
      assert.equal(urgentFinding.points, 40);
      assert.equal(urgentRes.verdictLevel, 'high');
    });
  });

  describe('4. @ userinfo masking vs harmless email in query params', () => {
    it('flags @ userinfo credential masking in URL authority (+30 danger)', () => {
      const input = 'Click https://secure.bank@evil.example/login to verify';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'url_deception');
      assert.ok(finding);
      assert.equal(finding.severity, 'danger');
      assert.equal(finding.points, 30);

      const highlighted = res.highlightedSegments.find((s) => s.ruleId === 'url_deception');
      assert.equal(highlighted.text, 'secure.bank@evil.example');
      assert.equal(highlighted.highlight, 'danger');
    });

    it('does NOT false-positive on harmless email in URL query params or path', () => {
      const queryInput = 'Support link: https://example.org/?email=a@b.com';
      const res1 = analyzeInput(queryInput);
      assertLosslessSegments(queryInput, res1);
      assert.equal(res1.findings.length, 0);
      assert.equal(res1.riskScore, 0);

      const pathInput = 'Profile: https://example.org/users/@handle';
      const res2 = analyzeInput(pathInput);
      assertLosslessSegments(pathInput, res2);
      assert.equal(res2.findings.length, 0);
      assert.equal(res2.riskScore, 0);
    });
  });

  describe('5. Raw IPv4 literal URLs vs invalid IPv4 strings', () => {
    it('flags valid raw IPv4 URL host (+30 danger) with exact host span', () => {
      const input = 'Pay bill at http://192.168.1.10/pay';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'url_deception');
      assert.ok(finding);
      assert.equal(finding.severity, 'danger');
      assert.equal(finding.points, 30);

      const highlighted = res.highlightedSegments.find((s) => s.ruleId === 'url_deception');
      assert.equal(highlighted.text, '192.168.1.10');
      assert.equal(highlighted.highlight, 'danger');

      const withPort = 'Visit http://10.0.0.5:8080/verify';
      const resPort = analyzeInput(withPort);
      assertLosslessSegments(withPort, resPort);
      assert.equal(resPort.findings.find((f) => f.ruleId === 'url_deception').points, 30);
    });

    it('ignores invalid IPv4 octets like 999.999.1.1', () => {
      const input = 'Test host http://999.999.1.1/pay';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      assert.equal(res.findings.length, 0);
      assert.equal(res.riskScore, 0);
    });
  });

  describe('6. URL shorteners alone vs with urgency', () => {
    it('scores bit.ly and tinyurl.com alone at +20 warn', () => {
      for (const input of ['See https://bit.ly/3xDemo', 'See https://tinyurl.com/demo99', 'Open bit.ly/bare99']) {
        const res = analyzeInput(input);
        assertLosslessSegments(input, res);
        const finding = res.findings.find((f) => f.ruleId === 'url_deception');
        assert.ok(finding, `Expected url_deception for: ${input}`);
        assert.equal(finding.severity, 'warn');
        assert.equal(finding.points, 20);
        assert.equal(res.riskScore, 20);
        assert.equal(res.verdictLevel, 'low');
      }
    });

    it('escalates shortener url_deception from +20 to +30 when urgency keywords are present', () => {
      const input = 'Please click https://tinyurl.com/demo99 today';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'url_deception');
      assert.ok(finding);
      assert.equal(finding.points, 30);
      assert.equal(res.verdictLevel, 'medium');

      const urgentShort = 'URGENT: verify now at https://bit.ly/3xDemo';
      const res2 = analyzeInput(urgentShort);
      assertLosslessSegments(urgentShort, res2);
      const f2 = res2.findings.find((f) => f.ruleId === 'url_deception');
      assert.equal(f2.points, 30);
      assert.ok(res2.riskScore >= 45);
    });
  });

  describe('7. UPI deep-link parameter dissection & collect-trap rules', () => {
    it('dissects pa, pn, am, cu, tn and warns on positive am + cashback/refund/PIN', () => {
      const input =
        'Win cashback! upi://pay?pa=reward-desk@paysim&pn=Prize%20Refund%20Demo&am=4500&cu=INR&tn=Approve%20PIN%20to%20Receive';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      assert.ok(res.upiDecoded, 'Expected upiDecoded object');
      assert.equal(res.upiDecoded.pa, 'reward-desk@paysim');
      assert.equal(res.upiDecoded.pn, 'Prize Refund Demo');
      assert.equal(res.upiDecoded.am, '4500');
      assert.equal(res.upiDecoded.cu, 'INR');
      assert.equal(res.upiDecoded.tn, 'Approve PIN to Receive');
      assert.match(res.upiDecoded.warning, /Collect-Trap Alert/);
      assert.match(res.upiDecoded.warning, /4500/);
      assert.match(res.upiDecoded.warning, /NEVER receives money/);

      const finding = res.findings.find((f) => f.ruleId === 'upi_collect_trap');
      assert.ok(finding);
      assert.equal(finding.severity, 'danger');
      assert.equal(finding.points, 30);
    });

    it('dissects positive am without cashback wording with Debit Alert warning', () => {
      const input = 'upi://pay?pa=demo@paysim&pn=Demo%20Store&am=250&cu=INR&tn=Order%2077';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      assert.ok(res.upiDecoded);
      assert.equal(res.upiDecoded.am, '250');
      assert.match(res.upiDecoded.warning, /Debit Alert/);
      assert.match(res.upiDecoded.warning, /₹250/);

      const finding = res.findings.find((f) => f.ruleId === 'upi_collect_trap');
      assert.ok(finding);
      assert.equal(finding.points, 30);
    });

    it('dissects benign upi://pay without positive am or receive bait without flagging', () => {
      const input = 'upi://pay?pa=family@paysim&pn=Home&cu=INR';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      assert.ok(res.upiDecoded);
      assert.equal(res.upiDecoded.pa, 'family@paysim');
      assert.equal(res.upiDecoded.am, null);
      assert.match(res.upiDecoded.warning, /Golden Rule/);
      assert.equal(res.findings.length, 0);
    });

    it('detects plain-text UPI collect-trap wording when no upi://pay URI is present', () => {
      const input = 'Approve UPI collect request to receive your Rs 4500 cashback';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'upi_collect_trap');
      assert.ok(finding);
      assert.equal(finding.points, 30);
      assert.equal(finding.severity, 'danger');
    });
  });

  describe('8. Bilingual EN & हिंदी social-engineering pressure tokens', () => {
    it('detects English pressure tokens (digital arrest, stay alone) and scales points up to 25', () => {
      const single = 'You are under digital arrest right now.';
      const r1 = analyzeInput(single);
      assertLosslessSegments(single, r1);
      const f1 = r1.findings.find((f) => f.ruleId === 'social_engineering_pressure');
      assert.ok(f1);
      assert.equal(f1.severity, 'warn');
      assert.equal(f1.points, 15);
      assert.ok(f1.matchedTokens.some((t) => t.toLowerCase() === 'digital arrest'));

      const multi = 'Digital arrest warrant! Stay alone, do not tell anyone, update kyc immediately.';
      const r2 = analyzeInput(multi);
      assertLosslessSegments(multi, r2);
      const f2 = r2.findings.find((f) => f.ruleId === 'social_engineering_pressure');
      assert.ok(f2);
      assert.equal(f2.points, 25);
      assert.ok(f2.matchedTokens.length >= 3);
    });

    it('detects Hindi pressure tokens (बिजली कट, गिरफ्तारी, पिन डालें)', () => {
      const input = 'जरूरी सूचना: आज रात बिजली कट जाएगी या गिरफ्तारी होगी, तुरंत पिन डालें।';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      const finding = res.findings.find((f) => f.ruleId === 'social_engineering_pressure');
      assert.ok(finding);
      assert.equal(finding.severity, 'warn');
      assert.equal(finding.points, 25);
      for (const phrase of ['बिजली कट', 'गिरफ्तारी', 'पिन डालें', 'तुरंत', 'जरूरी सूचना']) {
        assert.ok(finding.matchedTokens.includes(phrase), `Expected Hindi token: ${phrase}`);
      }
    });
  });

  describe('9. Benign inputs & validation errors (400 EMPTY_INPUT / INPUT_TOO_LONG)', () => {
    it('returns low risk 0 for https://cybercrime.gov.in and normal family messages', () => {
      for (const safe of [
        'https://cybercrime.gov.in',
        'Hi Mom, I reached home safely. Dinner at 8 PM?',
        'नमस्ते माँ, मैं घर सुरक्षित पहुँच गया हूँ।'
      ]) {
        const res = analyzeInput(safe);
        assertLosslessSegments(safe, res);
        assert.equal(res.riskScore, 0);
        assert.equal(res.verdictLevel, 'low');
        assert.equal(res.findings.length, 0);
        assert.equal(res.upiDecoded, null);
      }
    });

    it('throws 400 EMPTY_INPUT for empty, whitespace, or non-string inputs', () => {
      for (const bad of ['', '   ', '\n\t  ', null, undefined, 123]) {
        assert.throws(
          () => analyzeInput(bad),
          (err) => err.status === 400 && err.code === 'EMPTY_INPUT'
        );
      }
    });

    it('throws 400 INPUT_TOO_LONG for >2000 chars and accepts exact 2000-char boundary', () => {
      const boundary = 'a'.repeat(MAX_INPUT_LENGTH);
      const okRes = analyzeInput(boundary);
      assert.equal(okRes.riskScore, 0);
      assertLosslessSegments(boundary, okRes);

      const tooLong = 'a'.repeat(MAX_INPUT_LENGTH + 1);
      assert.throws(
        () => analyzeInput(tooLong),
        (err) => err.status === 400 && err.code === 'INPUT_TOO_LONG'
      );
    });
  });

  describe('10. Lossless highlightedSegments, XSS immunity & <10ms latency', () => {
    it('never injects HTML tags and preserves exact text with overlapping signals & angle brackets', () => {
      const input =
        '  <script>alert(1)</script> URGENT: "https://secure.bank@192.168.1.10/Notice.pdf.apk?q=<b>x</b>"   ';
      const res = analyzeInput(input);

      assertLosslessSegments(input, res);
      assert.ok(res.findings.length >= 2);
      // Verify no synthetic HTML markup such as <span or <mark was injected into segment fields
      for (const seg of res.highlightedSegments) {
        assert.ok(!/<(?:span|mark|script|img)\b/i.test(seg.ruleId || ''));
      }
    });

    it('completes within <10 ms even on 2000-char pathological input', () => {
      const chunk =
        'URGENT digital arrest https://xn--demo-9x2a.example/a.pdf.apk बिजली कट bit.ly/x ';
      const pathological = chunk.repeat(Math.ceil(MAX_INPUT_LENGTH / chunk.length)).slice(0, MAX_INPUT_LENGTH);
      assert.equal(pathological.length, 2000);

      // Warm up JIT once, then measure
      analyzeInput(pathological);
      const res = analyzeInput(pathological);

      assertLosslessSegments(pathological, res);
      assert.ok(
        res.elapsedMs < 10,
        `Expected elapsedMs < 10 ms on 2000-char pathological input, got ${res.elapsedMs} ms`
      );
    });
  });

  describe('11. DRILLS, PLAYBOOK & PRESETS integrity validation', () => {
    it('has exactly 3 drills whose weights sum to 100', () => {
      assert.equal(DRILLS.length, 3);
      const weightSum = DRILLS.reduce((acc, d) => acc + d.weight, 0);
      assert.equal(weightSum, 100);
      for (const drill of DRILLS) {
        assert.ok(drill.id);
        assert.ok(drill.entity.en && drill.entity.hi);
        assert.ok(drill.title.en && drill.title.hi);
        assert.ok(drill.script.en && drill.script.hi);
        assert.equal(drill.choices.length, 3);
        assert.equal(getDrillById(drill.id), drill);
      }
    });

    it('has non-spoiler choice labels and varied trap positions across drills', () => {
      const trapIndices = DRILLS.map((d) => d.choices.findIndex((c) => c.passed === false));
      for (const idx of trapIndices) {
        assert.ok(idx >= 0, 'Each drill must include a fail/trap choice');
      }
      assert.ok(new Set(trapIndices).size >= 2, 'Trap choice position should vary across drills');

      const spoilerRe = /\b(correct answer|wrong answer|right choice|spoiler)\b/i;
      for (const drill of DRILLS) {
        for (const choice of drill.choices) {
          assert.ok(choice.label.en && choice.label.hi);
          assert.ok(!spoilerRe.test(choice.label.en), `Spoiler detected in ${choice.id}`);
        }
      }
    });

    it('contains zero real bank/agency/app brand names across drills, playbook, and presets', () => {
      assert.equal(GOLDEN_HOUR_PLAYBOOK.steps.length, 3);
      assert.equal(XRAY_PRESETS.length, 4);

      const serialized = JSON.stringify({ DRILLS, GOLDEN_HOUR_PLAYBOOK, XRAY_PRESETS });
      const forbiddenBrandRe = /\b(SBI|HDFC|ICICI|Paytm|GPay|PhonePe|WhatsApp|CBI|TRAI|RBI)\b/i;
      const match = forbiddenBrandRe.exec(serialized);
      assert.equal(match, null, `Found forbidden real brand name: ${match && match[0]}`);
    });
  });
});
