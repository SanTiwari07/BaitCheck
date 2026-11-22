'use strict';

(function () {
  const MAX_XRAY_LENGTH = 2000;
  const REPORT_POLL_MS = 4000;

  const I18N = {
    en: {
      safetyRibbon: 'SIMULATION • EDUCATIONAL SCAM DRILL — NO REAL DATA, OTPs, OR DOWNLOADS',
      soundOn: 'SOUND: ON',
      soundOff: 'SOUND: OFF',
      tabDrill: '60s DRILL',
      tabXray: 'LINK X-RAY',
      tabChallenge: 'CHALLENGE',
      footerDisclaimer:
        'Educational anti-scam flight simulator & deterministic forensic link dissector. Fictional entities only. Zero passwords, OTPs, bank details, or file downloads.',

      loadingTitle: 'LOADING SCAM DRILL STUDIO…',
      loadingBody: 'Fetching bilingual scenarios and forensic presets from server.',
      loadErrorTitle: 'UNABLE TO LOAD DRILLS',
      loadErrorBody: 'Please check your connection and try reloading the simulator.',
      retryBtn: 'RETRY CONNECTION',

      heroEyebrow: '01 · PANIC FLIGHT SIMULATOR',
      heroCallerSub: 'Unknown Video Desk • Fictional Training Scenario',
      heroHeadlinePre: 'SURVIVE A SCAM IN ',
      heroHeadlineMark: '60 SECONDS',
      heroValueProp:
        'Practice against an AI "Digital Arrest" call, a disguised .pdf.apk utility bill, and a UPI cashback collect trap before a real scammer catches you off-guard.',
      statTrapsVal: '3 TRAPS',
      statTrapsLbl: '15s Each',
      statClockVal: 'LIVE CLOCK',
      statClockLbl: 'Reaction ms',
      statLangVal: 'EN / हिंदी',
      statLangLbl: 'Captions On',
      answerCta: 'ANSWER & START 60s DRILL →',
      quickXrayBtn: 'TRY LINK X-RAY',
      quickChallengeBtn: 'CHALLENGE FAMILY',
      challengeBannerPrefix: 'CHALLENGE FROM',
      challengeBannerFor: 'FOR',
      challengeNotFoundTitle: 'CHALLENGE LINK NOT FOUND',
      challengeNotFoundBody:
        'This challenge slug does not exist or may have expired. You can start a fresh 60s drill or create a new family link below.',
      startFreshDrillBtn: 'START 60s DRILL',
      createChallengeBtn: 'CREATE NEW CHALLENGE',

      drillPrefix: 'DRILL',
      ofLabel: 'OF',
      clockLabel: 'TIME LEFT',
      captionLabel: 'ALWAYS-ON BILINGUAL CAPTION',
      inspectApkHint: 'TAP TO INSPECT ATTACHMENT (SAFE SIMULATION)',
      apkSimNotice:
        'SIMULATION SAFE: Zero file downloaded! Notice the disguised double extension (.pdf.apk) trying to hide an Android installer.',
      upiCollectHeader: 'PAYSIM WALLET COLLECT (DEMO)',
      upiCollectSub: 'Simulated Request • Zero Real PIN Pad',
      timeoutTitle: 'TIME EXPIRED — PANIC TRAP TRIGGERED',
      nextDrillBtn: 'NEXT DRILL →',
      viewVerdictBtn: 'VIEW VERDICT TICKET →',
      savingResult: 'Saving drill telemetry to challenge report…',
      savedResult: 'Saved to live family readiness report.',
      saveResultErr: 'Could not sync result to report (local score still shown).',
      reactionLabel: 'REACTION',

      finaleEyebrow: 'DRILL COMPLETE • VERDICT TICKET',
      finaleDodged: 'BAIT DODGED',
      finalePartial: 'PARTIAL SURVIVAL',
      finaleTrapped: 'TRAP TRIGGERED',
      finaleSubDodged: 'Sharp reflexes under a ticking clock. Keep verifying before tapping or approving.',
      finaleSubTrapped: 'Scammers rely on 15 seconds of panic. Review what fooled you and retry to lock in the reflex.',
      metricImmunity: 'IMMUNITY',
      metricAvgSpeed: 'AVG SPEED',
      metricDodged: 'TRAPS DODGED',
      ticketStubTitle: 'OFFICIAL DRILL STUB',
      ticketHeadline: 'SCAM SURVIVAL BREAKDOWN',
      ticketLossSummary: 'Simulated Loss Avoided / Incurred',
      ticketSavedTag: 'SIMULATED LOSS: ₹0',
      ticketLostTag: 'SIMULATED LOSS:',
      passTag: 'DODGED',
      failTag: 'TRAPPED',
      pendingTag: 'PENDING',
      downloadTicketBtn: 'DOWNLOAD VERDICT TICKET (1080×1350 PNG)',
      downloadSuccess: 'Downloaded baitcheck-verdict-ticket.png (1080×1350).',
      challengeFamilyBtn: 'CHALLENGE FAMILY →',
      openChallengeReportBtn: 'OPEN LIVE REPORT →',
      replayDrillBtn: 'REPLAY 60s DRILL',

      xrayEyebrow: '02 · DETERMINISTIC FORENSIC ENGINE',
      xrayTitle: 'LINK, MESSAGE & UPI X-RAY',
      xraySub:
        'Paste any suspicious SMS, chat forward, URL, or upi://pay link—or tap a real-world preset below to dissect Punycode, .pdf.apk lures, and UPI collect traps locally.',
      xrayPresetsLbl: '1-TAP SAMPLE PRESETS',
      xrayInputLbl: 'SUSPICIOUS MESSAGE OR LINK',
      xrayPlaceholder: 'Paste SMS, URL (https://...), .pdf.apk notice, or upi://pay?... string',
      xrayClearBtn: 'CLEAR',
      xrayAnalyzeBtn: 'RUN FORENSIC X-RAY →',
      xrayScanningBtn: 'ANALYZING…',
      xrayEmptyErr: 'Please paste a message, URL, or UPI string (or tap a preset above).',
      xrayRiskScoreLbl: 'RISK SCORE',
      xrayLatencyLbl: 'LATENCY',
      xrayHighlightTitle: 'TOKEN X-RAY PREVIEW',
      xrayUpiTitle: 'DECODED UPI PAYLOAD',
      xrayFindingsTitle: 'FORENSIC FINDINGS',
      xraySafeTitle: 'NO KNOWN TRAP PATTERNS DETECTED',
      xraySafeBody:
        'No Punycode, double-extension executable, URL masking, UPI collect mismatch, or panic trigger phrases matched. Still verify unknown senders via official channels.',

      challengeEyebrow: '03 · FAMILY & FRIEND READINESS',
      challengeTitle: 'SEND A 60s CHALLENGE LINK',
      challengeSub:
        'Generate a personal challenge link for your parents, siblings, or friends. Watch their live scores update as they complete each drill.',
      privacyNote:
        'ZERO PII STORED: Only display nicknames are saved in SQLite—never phone numbers, emails, Aadhaar, or bank details.',
      creatorLbl: 'YOUR NICKNAME (MAX 40)',
      creatorPlaceholder: 'e.g. Aarav / Priya',
      targetLbl: 'WHO IS TAKING THIS? (MAX 40)',
      targetPlaceholder: 'e.g. Mom / Dad / Hostel Room 204',
      challengeLangLbl: 'DEFAULT DRILL LANGUAGE',
      challengeSubmitBtn: 'CREATE CHALLENGE LINK →',
      challengeCreatingBtn: 'CREATING LINK…',
      challengeReadyTitle: 'CHALLENGE LINK READY',
      copyLinkBtn: 'COPY LINK',
      copiedBtn: 'COPIED!',
      whatsappBtn: 'SHARE ON WHATSAPP',
      openLiveReportBtn: 'OPEN LIVE REPORT →',
      testChallengeNowBtn: 'TEST THIS LINK NOW',

      reportEyebrow: 'LIVE READINESS REPORT',
      reportFor: 'REPORT FOR',
      reportSentBy: 'SENT BY',
      reportPolling: 'LIVE • AUTO-POLLING EVERY 4s',
      reportComplete: 'ALL 3 DRILLS COMPLETED',
      reportCompletedLbl: 'COMPLETED',
      reportMissedFlagLbl: 'MISSED FLAG:',
      reportRefreshBtn: 'REFRESH REPORT',
      reportCopyBtn: 'COPY CHALLENGE LINK',
      reportRunBtn: 'RUN THIS CHALLENGE',
      reportBackBtn: 'BACK TO 60s DRILL',

      cohortEyebrow: 'COHORT TELEMETRY • SQLITE',
      cohortTitle: 'PUBLIC SCAM BENCHMARK',
      cohortDrillsLbl: 'DRILLS LOGGED',
      cohortPassLbl: 'PASS RATE',
      cohortScansLbl: 'X-RAYS RUN',
      cohortTopMissedLbl: 'TOP MISSED TRAP',
      playbookEyebrow: '1930 GOLDEN-HOUR CHECKLIST',
      playbookHint: 'SAVE THIS 3-STEP RESPONSE PLAN'
    },
    hi: {
      safetyRibbon: 'सिम्युलेशन • शैक्षणिक स्कैम अभ्यास — कोई असली डेटा, OTP या डाउनलोड नहीं',
      soundOn: 'आवाज़: चालू',
      soundOff: 'आवाज़: बंद',
      tabDrill: '60s ड्रिल',
      tabXray: 'लिंक X-RAY',
      tabChallenge: 'चुनौती',
      footerDisclaimer:
        'शैक्षणिक एंटी-स्कैम सिम्युलेटर और लिंक जांच टूल। केवल काल्पनिक नाम। कोई पासवर्ड, OTP, बैंक विवरण या फाइल डाउनलोड नहीं।',

      loadingTitle: 'स्कैम ड्रिल लोड हो रही है…',
      loadingBody: 'द्विभाषी अभ्यास और जांच प्रीसेट सर्वर से लोड हो रहे हैं।',
      loadErrorTitle: 'ड्रिल लोड नहीं हो सकी',
      loadErrorBody: 'कृपया इंटरनेट जांचें और पुनः प्रयास करें।',
      retryBtn: 'पुनः प्रयास करें',

      heroEyebrow: '01 · पैनिक सर्वाइवल सिम्युलेटर',
      heroCallerSub: 'अज्ञात वीडियो डेस्क • काल्पनिक प्रशिक्षण दृश्य',
      heroHeadlinePre: 'स्कैम से बचें सिर्फ ',
      heroHeadlineMark: '60 सेकंड में',
      heroValueProp:
        'असली ठग के फोन आने से पहले ही AI "डिजिटल अरेस्ट" कॉल, नकली .pdf.apk बिजली बिल और UPI कैशबैक जाल को पहचानने का अभ्यास करें।',
      statTrapsVal: '3 जाल',
      statTrapsLbl: '15 सेकंड प्रत्येक',
      statClockVal: 'लाइव घड़ी',
      statClockLbl: 'प्रतिक्रिया समय',
      statLangVal: 'EN / हिंदी',
      statLangLbl: 'हमेशा कैप्शन',
      answerCta: 'कॉल उठाएं और 60s ड्रिल शुरू करें →',
      quickXrayBtn: 'लिंक X-RAY आज़माएं',
      quickChallengeBtn: 'परिवार को चुनौती दें',
      challengeBannerPrefix: 'चुनौती भेजने वाले:',
      challengeBannerFor: 'किसके लिए:',
      challengeNotFoundTitle: 'चुनौती लिंक नहीं मिला',
      challengeNotFoundBody:
        'यह चुनौती लिंक मौजूद नहीं है। आप नीचे नई 60s ड्रिल शुरू कर सकते हैं या नया लिंक बना सकते हैं।',
      startFreshDrillBtn: '60s ड्रिल शुरू करें',
      createChallengeBtn: 'नई चुनौती बनाएं',

      drillPrefix: 'अभ्यास',
      ofLabel: 'में से',
      clockLabel: 'शेष समय',
      captionLabel: 'हमेशा दिखने वाला कैप्शन',
      inspectApkHint: 'फाइल जांचने के लिए टैप करें (सुरक्षित सिम्युलेशन)',
      apkSimNotice:
        'सिम्युलेशन सुरक्षित: कोई फाइल डाउनलोड नहीं हुई! ध्यान दें—.pdf के बाद छिपा .apk एक Android ऐप इंस्टॉलर है।',
      upiCollectHeader: 'पेसिम वॉलेट कलेक्ट (डेमो)',
      upiCollectSub: 'सिम्युलेटेड अनुरोध • कोई असली PIN पैड नहीं',
      timeoutTitle: 'समय समाप्त — आप घबराहट के जाल में फंस गए',
      nextDrillBtn: 'अगला अभ्यास →',
      viewVerdictBtn: 'निर्णय टिकट देखें →',
      savingResult: 'परिणाम लाइव रिपोर्ट में सेव हो रहा है…',
      savedResult: 'लाइव पारिवारिक रिपोर्ट में सेव हो गया।',
      saveResultErr: 'रिपोर्ट सिंक नहीं हो सकी (स्थानीय स्कोर सुरक्षित है)।',
      reactionLabel: 'प्रतिक्रिया',

      finaleEyebrow: 'अभ्यास पूर्ण • निर्णय टिकट',
      finaleDodged: 'जाल से बचाव सफल',
      finalePartial: 'आंशिक बचाव',
      finaleTrapped: 'स्कैम जाल में फंसे',
      finaleSubDodged: 'दबाव में भी सही पहचान। किसी भी कॉल या लिंक पर भरोसा करने से पहले हमेशा जांच करें।',
      finaleSubTrapped: 'स्कैमर 15 सेकंड के डर का फायदा उठाते हैं। कारण समझें और पक्की आदत बनाने के लिए दोबारा खेलें।',
      metricImmunity: 'सुरक्षा स्कोर',
      metricAvgSpeed: 'औसत गति',
      metricDodged: 'जाल से बचाव',
      ticketStubTitle: 'आधिकारिक ड्रिल स्टब',
      ticketHeadline: 'स्कैम बचाव विवरण',
      ticketLossSummary: 'सिम्युलेटेड नुकसान से बचाव / हानि',
      ticketSavedTag: 'सिम्युलेटेड नुकसान: ₹0',
      ticketLostTag: 'सिम्युलेटेड नुकसान:',
      passTag: 'बचाव',
      failTag: 'फंसे',
      pendingTag: 'बाकी',
      downloadTicketBtn: 'निर्णय टिकट डाउनलोड करें (1080×1350 PNG)',
      downloadSuccess: 'baitcheck-verdict-ticket.png (1080×1350) डाउनलोड हो गया।',
      challengeFamilyBtn: 'परिवार को चुनौती दें →',
      openChallengeReportBtn: 'लाइव रिपोर्ट देखें →',
      replayDrillBtn: '60s ड्रिल दोबारा खेलें',

      xrayEyebrow: '02 · फॉरेंसिक लिंक और मैसेज जांच',
      xrayTitle: 'लिंक, मैसेज और UPI X-RAY',
      xraySub:
        'कोई भी संदिग्ध SMS, चैट मैसेज, लिंक या upi://pay स्ट्रिंग यहां पेस्ट करें—या नीचे दिए सैंपल पर 1-टैप करके जांच देखें।',
      xrayPresetsLbl: '1-टैप सैंपल प्रीसेट',
      xrayInputLbl: 'संदिग्ध मैसेज या लिंक',
      xrayPlaceholder: 'SMS, URL (https://...), .pdf.apk नोटिस या upi://pay?... पेस्ट करें',
      xrayClearBtn: 'साफ़ करें',
      xrayAnalyzeBtn: 'फॉरेंसिक X-RAY चलाएं →',
      xrayScanningBtn: 'जांच जारी है…',
      xrayEmptyErr: 'कृपया जांच के लिए कोई मैसेज, लिंक या ऊपर से एक सैंपल चुनें।',
      xrayRiskScoreLbl: 'जोखिम स्कोर',
      xrayLatencyLbl: 'जांच गति',
      xrayHighlightTitle: 'खतरनाक शब्दों की पहचान',
      xrayUpiTitle: 'डिकोड किया गया UPI डेटा',
      xrayFindingsTitle: 'फॉरेंसिक निष्कर्ष',
      xraySafeTitle: 'कोई ज्ञात स्कैम पैटर्न नहीं मिला',
      xraySafeBody:
        'इसमें कोई Punycode, नकली .apk फाइल, URL धोखा या UPI कलेक्ट जाल नहीं मिला। फिर भी अनजान भेजने वाले की आधिकारिक जांच करें।',

      challengeEyebrow: '03 · परिवार व मित्र सुरक्षा परीक्षण',
      challengeTitle: '60s चुनौती लिंक भेजें',
      challengeSub:
        'माता-पिता, भाई-बहन या दोस्तों के लिए निजी चुनौती लिंक बनाएं और देखें कि वे किस जाल से बचते हैं।',
      privacyNote:
        'कोई निजी डेटा नहीं: केवल उपनाम (nickname) सेव होता है—कोई फोन नंबर, ईमेल या बैंक जानकारी नहीं।',
      creatorLbl: 'आपका उपनाम (अधिकतम 40)',
      creatorPlaceholder: 'जैसे: आरव / प्रिया',
      targetLbl: 'यह टेस्ट किसके लिए है? (अधिकतम 40)',
      targetPlaceholder: 'जैसे: मम्मी / पापा / रूममेट',
      challengeLangLbl: 'ड्रिल की भाषा',
      challengeSubmitBtn: 'चुनौती लिंक बनाएं →',
      challengeCreatingBtn: 'लिंक बन रहा है…',
      challengeReadyTitle: 'चुनौती लिंक तैयार है',
      copyLinkBtn: 'लिंक कॉपी करें',
      copiedBtn: 'कॉपी हो गया!',
      whatsappBtn: 'WHATSAPP पर भेजें',
      openLiveReportBtn: 'लाइव रिपोर्ट खोलें →',
      testChallengeNowBtn: 'अभी लिंक टेस्ट करें',

      reportEyebrow: 'लाइव सुरक्षा रिपोर्ट',
      reportFor: 'रिपोर्ट:',
      reportSentBy: 'भेजने वाले:',
      reportPolling: 'लाइव • हर 4 सेकंड में अपडेट',
      reportComplete: 'सभी 3 अभ्यास पूर्ण',
      reportCompletedLbl: 'पूर्ण अभ्यास',
      reportMissedFlagLbl: 'चूक का कारण:',
      reportRefreshBtn: 'रिपोर्ट रिफ्रेश करें',
      reportCopyBtn: 'चुनौती लिंक कॉपी करें',
      reportRunBtn: 'यह चुनौती खुद चलाएं',
      reportBackBtn: '60s ड्रिल पर वापस जाएं',

      cohortEyebrow: 'कोहोर्ट आंकड़े • SQLITE',
      cohortTitle: 'सार्वजनिक स्कैम बेंचमार्क',
      cohortDrillsLbl: 'कुल अभ्यास',
      cohortPassLbl: 'सफलता दर',
      cohortScansLbl: 'कुल X-RAY',
      cohortTopMissedLbl: 'सबसे कठिन जाल',
      playbookEyebrow: '1930 गोल्डन-आवर आपातकालीन गाइड',
      playbookHint: 'यह 3-कदम सुरक्षा योजना याद रखें'
    }
  };

  const state = {
    lang: 'en',
    muted: false,
    route: { mode: 'tab', tab: 'drill', challengeId: null },

    // Server payload cache
    loaded: false,
    loadError: false,
    drills: [],
    playbook: null,
    presets: [],
    stats: null,

    // Audio
    audioCtx: null,

    // Drill state
    drillPhase: 'hero', // 'hero' | 'active' | 'finale'
    drillIndex: 0,
    drillOutcomes: [], // [{ scenarioId, title, weight, passed, points, reactionMs, missedFlag, lossLabel, lossInr }]
    drillStartPerf: 0,
    drillRemainingMs: 15000,
    drillLastTickSec: null,
    drillAnswered: false,
    drillTimerId: null,
    apkNoticeShown: false,
    syncStatus: null, // null | 'saving' | 'saved' | 'error'
    ticketDownloadedMsg: '',

    // Active challenge context (when on /c/:id)
    activeChallenge: null,
    challengeLoadError: null, // null | 'not-found' | 'error'

    // X-Ray state
    xrayInput: '',
    xraySelectedPresetId: null,
    xrayLoading: false,
    xrayError: '',
    xrayResult: null,

    // Challenge Creator state
    challengeCreatorName: '',
    challengeTargetLabel: '',
    challengeFormLang: 'en',
    challengeSubmitting: false,
    challengeError: '',
    createdChallenge: null,
    copiedKey: '',

    // Live Report state
    reportId: null,
    reportLoading: false,
    reportError: null,
    reportData: null,
    reportPollId: null
  };

  const els = {};

  function t(key) {
    const pack = I18N[state.lang] || I18N.en;
    return pack[key] !== undefined ? pack[key] : (I18N.en[key] || key);
  }

  function loc(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[state.lang] || obj.en || '';
  }

  function createEl(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function clearEl(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function makeSvg(viewBox, width, height, buildFn) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('aria-hidden', 'true');
    buildFn(svg);
    return svg;
  }

  function svgEl(tag, attrs) {
    const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
    const keys = Object.keys(attrs);
    for (let i = 0; i < keys.length; i++) {
      node.setAttribute(keys[i], String(attrs[keys[i]]));
    }
    return node;
  }

  function buildCallerEmblemSvg() {
    return makeSvg('0 0 48 48', 40, 40, (svg) => {
      svg.appendChild(svgEl('polygon', {
        points: '24,3 43,13 43,35 24,45 5,35 5,13',
        fill: 'none',
        stroke: '#FEC917',
        'stroke-width': '2.5'
      }));
      svg.appendChild(svgEl('circle', {
        cx: '24',
        cy: '19',
        r: '6',
        fill: '#FEC917'
      }));
      svg.appendChild(svgEl('path', {
        d: 'M13,36 C13,29 35,29 35,36',
        fill: 'none',
        stroke: '#F7F5EF',
        'stroke-width': '2.5'
      }));
    });
  }

  function buildSilhouetteSvg() {
    return makeSvg('0 0 64 64', 52, 52, (svg) => {
      svg.appendChild(svgEl('rect', {
        x: '4',
        y: '4',
        width: '56',
        height: '56',
        fill: '#0D0D0D',
        stroke: '#FEC917',
        'stroke-width': '2'
      }));
      svg.appendChild(svgEl('circle', {
        cx: '32',
        cy: '24',
        r: '10',
        fill: '#8E8B80'
      }));
      svg.appendChild(svgEl('path', {
        d: 'M15,54 C15,40 49,40 49,54',
        fill: '#8E8B80'
      }));
      svg.appendChild(svgEl('line', {
        x1: '10',
        y1: '14',
        x2: '54',
        y2: '14',
        stroke: '#D92D20',
        'stroke-width': '2'
      }));
    });
  }

  // =========================================================================
  // Audio Engine (Tap-to-Unlock WebAudio + Conditional en-IN/hi-IN TTS)
  // =========================================================================

  function unlockAudio() {
    if (state.muted) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      if (!state.audioCtx) {
        state.audioCtx = new AudioCtx();
      }
      if (state.audioCtx.state === 'suspended') {
        state.audioCtx.resume();
      }
    } catch {
      // Ignore WebAudio restrictions cleanly.
    }
  }

  function playTone(freq, durationSec, type, gainPeak, delaySec) {
    if (state.muted || !state.audioCtx) return;
    try {
      const ctx = state.audioCtx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const startAt = ctx.currentTime + (delaySec || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, startAt);
      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(gainPeak || 0.08, startAt + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startAt);
      osc.stop(startAt + durationSec + 0.02);
    } catch {
      // Silent fallback on audio failure.
    }
  }

  function playIncomingChime() {
    playTone(784, 0.12, 'triangle', 0.09, 0);
    playTone(987.77, 0.18, 'triangle', 0.09, 0.13);
  }

  function playTickSound(isUrgent) {
    playTone(isUrgent ? 1046 : 660, 0.045, 'square', isUrgent ? 0.045 : 0.025, 0);
  }

  function playPassChime() {
    playTone(587.33, 0.11, 'triangle', 0.09, 0);
    playTone(880, 0.2, 'triangle', 0.1, 0.11);
  }

  function playTrapBuzz() {
    playTone(220, 0.18, 'sawtooth', 0.08, 0);
    playTone(164.81, 0.26, 'sawtooth', 0.08, 0.16);
  }

  function stopSpeech() {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore synthesis cancel errors.
    }
  }

  function speakCaption(text, lang) {
    if (state.muted || !text || !('speechSynthesis' in window)) return;
    try {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices ? synth.getVoices() : [];
      if (!voices || voices.length === 0) return;

      const targetRe = lang === 'hi' ? /^hi[-_]IN$/i : /^en[-_]IN$/i;
      const matchedVoice = voices.find((v) => targetRe.test(v.lang || ''));
      if (!matchedVoice) return;

      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = matchedVoice;
      utter.lang = matchedVoice.lang;
      utter.rate = 1.02;
      synth.speak(utter);
    } catch {
      // Visual captions are primary; ignore TTS runtime errors.
    }
  }

  // =========================================================================
  // URL Routing & Timer Lifecycle
  // =========================================================================

  function parseRoute(pathname, search) {
    const cleanPath = pathname || '/';
    const reportMatch = /^\/c\/([a-z0-9-]{2,40})\/report\/?$/.exec(cleanPath);
    if (reportMatch) {
      return { mode: 'report', tab: 'challenge', challengeId: reportMatch[1] };
    }
    const challengeMatch = /^\/c\/([a-z0-9-]{2,40})\/?$/.exec(cleanPath);
    if (challengeMatch) {
      return { mode: 'challenge-drill', tab: 'drill', challengeId: challengeMatch[1] };
    }
    const params = new URLSearchParams(search || '');
    const tabParam = params.get('tab');
    if (tabParam === 'xray') {
      return { mode: 'tab', tab: 'xray', challengeId: null };
    }
    if (tabParam === 'challenge') {
      return { mode: 'tab', tab: 'challenge', challengeId: null };
    }
    return { mode: 'tab', tab: 'drill', challengeId: null };
  }

  function stopDrillTimer() {
    if (state.drillTimerId !== null) {
      clearInterval(state.drillTimerId);
      state.drillTimerId = null;
    }
  }

  function stopReportPolling() {
    if (state.reportPollId !== null) {
      clearInterval(state.reportPollId);
      state.reportPollId = null;
    }
  }

  function navigateTo(urlPath, opts) {
    const options = opts || {};
    stopDrillTimer();
    stopReportPolling();
    stopSpeech();

    const parsedUrl = new URL(urlPath, window.location.origin);
    if (!options.fromPopstate && (parsedUrl.pathname + parsedUrl.search) !== (window.location.pathname + window.location.search)) {
      window.history.pushState({}, '', parsedUrl.pathname + parsedUrl.search);
    }

    state.route = parseRoute(parsedUrl.pathname, parsedUrl.search);
    syncRouteView();
  }

  function syncRouteView() {
    const route = state.route;

    if (route.mode === 'challenge-drill') {
      state.drillPhase = 'hero';
      state.drillIndex = 0;
      state.drillOutcomes = [];
      state.activeChallenge = null;
      state.challengeLoadError = null;
      loadChallengeForDrill(route.challengeId);
    } else if (route.mode === 'report') {
      state.reportId = route.challengeId;
      state.reportLoading = true;
      state.reportError = null;
      state.reportData = null;
      loadReport(route.challengeId, true);
    } else {
      if (route.tab === 'drill' && state.activeChallenge) {
        state.activeChallenge = null;
        state.challengeLoadError = null;
        state.drillPhase = 'hero';
        state.drillIndex = 0;
        state.drillOutcomes = [];
      }
    }

    renderAll();
  }

  // =========================================================================
  // Data Fetching
  // =========================================================================

  async function fetchDrillsAndStats() {
    try {
      const [drillsRes, statsRes] = await Promise.all([
        fetch('/api/drills'),
        fetch('/api/stats')
      ]);

      if (!drillsRes.ok) {
        throw new Error('Failed to load drills');
      }
      const drillsPayload = await drillsRes.json();
      state.drills = Array.isArray(drillsPayload.drills) ? drillsPayload.drills : [];
      state.playbook = drillsPayload.playbook || null;
      state.presets = Array.isArray(drillsPayload.presets) ? drillsPayload.presets : [];
      state.loaded = true;
      state.loadError = false;

      if (statsRes.ok) {
        state.stats = await statsRes.json();
      }
    } catch {
      state.loadError = true;
    }
    renderAll();
  }

  async function refreshCohortStats() {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        state.stats = await res.json();
        renderCohortPanel();
      }
    } catch {
      // Ignore silent background stat refresh error.
    }
  }

  async function loadChallengeForDrill(challengeId) {
    try {
      const res = await fetch('/api/challenge/' + encodeURIComponent(challengeId));
      if (res.status === 404) {
        state.challengeLoadError = 'not-found';
        renderDrillView();
        return;
      }
      if (!res.ok) {
        state.challengeLoadError = 'error';
        renderDrillView();
        return;
      }
      const data = await res.json();
      state.activeChallenge = data.challenge || null;
      state.challengeLoadError = null;
      if (state.activeChallenge && state.activeChallenge.lang === 'hi') {
        state.lang = 'hi';
      } else if (state.activeChallenge && state.activeChallenge.lang === 'en') {
        state.lang = 'en';
      }
      renderAll();
    } catch {
      state.challengeLoadError = 'error';
      renderDrillView();
    }
  }

  async function postChallengeDrillResult(outcome) {
    if (state.route.mode !== 'challenge-drill' || !state.route.challengeId) return;
    state.syncStatus = 'saving';
    renderDrillView();

    try {
      const res = await fetch(
        '/api/challenge/' + encodeURIComponent(state.route.challengeId) + '/result',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scenarioId: outcome.scenarioId,
            passed: outcome.passed,
            reactionMs: outcome.reactionMs,
            missedFlag: outcome.missedFlag
          })
        }
      );
      if (!res.ok) {
        state.syncStatus = 'error';
      } else {
        state.syncStatus = 'saved';
        refreshCohortStats();
      }
    } catch {
      state.syncStatus = 'error';
    }
    renderDrillView();
  }

  async function loadReport(challengeId, isInitial) {
    if (isInitial) {
      state.reportLoading = true;
      renderReportView();
    }
    try {
      const res = await fetch('/api/challenge/' + encodeURIComponent(challengeId));
      if (res.status === 404) {
        state.reportLoading = false;
        state.reportError = 'not-found';
        stopReportPolling();
        renderReportView();
        return;
      }
      if (!res.ok) {
        state.reportLoading = false;
        state.reportError = 'error';
        renderReportView();
        return;
      }
      const data = await res.json();
      state.reportLoading = false;
      state.reportError = null;
      state.reportData = data;
      renderReportView();

      const completed = data && data.summary ? Number(data.summary.completedCount || 0) : 0;
      const total = data && data.summary ? Number(data.summary.totalScenarios || 3) : 3;

      if (completed >= total) {
        stopReportPolling();
      } else if (state.route.mode === 'report' && state.route.challengeId === challengeId && state.reportPollId === null) {
        state.reportPollId = setInterval(() => {
          if (state.route.mode === 'report' && state.route.challengeId === challengeId) {
            loadReport(challengeId, false);
          } else {
            stopReportPolling();
          }
        }, REPORT_POLL_MS);
      }
    } catch {
      state.reportLoading = false;
      state.reportError = 'error';
      renderReportView();
    }
  }

  // =========================================================================
  // Drill Engine
  // =========================================================================

  function startDrillSequence() {
    if (!state.drills.length) return;
    unlockAudio();
    playIncomingChime();

    state.drillPhase = 'active';
    state.drillIndex = 0;
    state.drillOutcomes = [];
    state.ticketDownloadedMsg = '';
    beginCurrentDrill();
  }

  function beginCurrentDrill() {
    stopDrillTimer();
    stopSpeech();

    const drill = state.drills[state.drillIndex];
    if (!drill) {
      state.drillPhase = 'finale';
      renderDrillView();
      return;
    }

    const durationMs = (Number(drill.durationSec) || 15) * 1000;
    state.drillStartPerf = performance.now();
    state.drillRemainingMs = durationMs;
    state.drillLastTickSec = Math.ceil(durationMs / 1000);
    state.drillAnswered = false;
    state.apkNoticeShown = false;
    state.syncStatus = null;

    renderDrillView();
    speakCaption(loc(drill.script), state.lang);

    state.drillTimerId = setInterval(() => {
      if (state.drillPhase !== 'active' || state.drillAnswered) {
        stopDrillTimer();
        return;
      }
      const elapsed = performance.now() - state.drillStartPerf;
      const remaining = Math.max(0, durationMs - elapsed);
      state.drillRemainingMs = remaining;

      const secCeil = Math.ceil(remaining / 1000);
      if (secCeil !== state.drillLastTickSec) {
        state.drillLastTickSec = secCeil;
        if (secCeil > 0 && secCeil <= 5) {
          playTickSound(secCeil <= 3);
        }
      }

      updateCountdownDom(remaining, durationMs);

      if (remaining <= 0) {
        handleDrillTimeout();
      }
    }, 100);
  }

  function updateCountdownDom(remainingMs, totalMs) {
    const timeEl = document.getElementById('drill-countdown-time');
    const fillEl = document.getElementById('drill-countdown-fill');
    const secStr = (remainingMs / 1000).toFixed(1) + 's';
    const pct = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));
    const urgent = remainingMs <= 5000;

    if (timeEl) {
      timeEl.textContent = secStr;
      timeEl.classList.toggle('is-urgent', urgent);
    }
    if (fillEl) {
      fillEl.style.width = pct.toFixed(1) + '%';
      fillEl.classList.toggle('is-urgent', urgent);
    }
  }

  function handleDrillChoice(choice) {
    if (state.drillAnswered || state.drillPhase !== 'active') return;
    const drill = state.drills[state.drillIndex];
    if (!drill) return;

    stopDrillTimer();
    stopSpeech();

    const durationMs = (Number(drill.durationSec) || 15) * 1000;
    const rawElapsed = Math.round(performance.now() - state.drillStartPerf);
    const reactionMs = Math.max(120, Math.min(durationMs, rawElapsed));

    state.drillAnswered = true;
    const passed = Boolean(choice.passed);

    if (passed) {
      playPassChime();
    } else {
      playTrapBuzz();
    }

    const outcome = {
      scenarioId: drill.id,
      title: drill.title,
      weight: Number(drill.weight) || 0,
      choiceId: choice.id,
      passed,
      timedOut: false,
      points: passed ? (Number(choice.points) || Number(drill.weight) || 0) : 0,
      reactionMs,
      missedFlag: passed ? null : (choice.missed_flag || drill.timeoutFlag || 'trap-triggered'),
      lossLabel: passed ? null : (choice.loss_label || null),
      lossInr: passed ? 0 : (Number(choice.simulated_loss_inr) || 0)
    };

    state.drillOutcomes.push(outcome);
    renderDrillView();
    postChallengeDrillResult(outcome);
  }

  function handleDrillTimeout() {
    if (state.drillAnswered || state.drillPhase !== 'active') return;
    const drill = state.drills[state.drillIndex];
    if (!drill) return;

    stopDrillTimer();
    stopSpeech();

    const durationMs = (Number(drill.durationSec) || 15) * 1000;
    state.drillAnswered = true;
    state.drillRemainingMs = 0;
    playTrapBuzz();

    const failChoice = (drill.choices || []).find((c) => !c.passed);
    const outcome = {
      scenarioId: drill.id,
      title: drill.title,
      weight: Number(drill.weight) || 0,
      choiceId: null,
      passed: false,
      timedOut: true,
      points: 0,
      reactionMs: durationMs,
      missedFlag: drill.timeoutFlag || (failChoice ? failChoice.missed_flag : 'timeout'),
      lossLabel: failChoice ? failChoice.loss_label : '-₹50,000',
      lossInr: failChoice ? Number(failChoice.simulated_loss_inr) || 50000 : 50000
    };

    state.drillOutcomes.push(outcome);
    renderDrillView();
    postChallengeDrillResult(outcome);
  }

  function advanceDrill() {
    if (state.drillIndex + 1 < state.drills.length) {
      state.drillIndex += 1;
      beginCurrentDrill();
    } else {
      state.drillPhase = 'finale';
      renderDrillView();
    }
  }

  function computeFinaleMetrics() {
    const outcomes = state.drillOutcomes;
    let immunity = 0;
    let dodgedCount = 0;
    let totalReaction = 0;
    let totalLossInr = 0;

    for (let i = 0; i < outcomes.length; i++) {
      const o = outcomes[i];
      immunity += o.points;
      if (o.passed) dodgedCount += 1;
      totalReaction += o.reactionMs;
      totalLossInr += o.lossInr;
    }

    const avgMs = outcomes.length > 0 ? Math.round(totalReaction / outcomes.length) : 0;
    return {
      immunity: Math.max(0, Math.min(100, immunity)),
      dodgedCount,
      totalDrills: state.drills.length || 3,
      avgMs,
      avgSecStr: (avgMs / 1000).toFixed(1) + 's',
      totalLossInr
    };
  }

  // =========================================================================
  // 1080x1350 Verdict Ticket PNG Canvas Generator (Feature 3.1)
  // =========================================================================

  function downloadVerdictTicketPng() {
    const metrics = computeFinaleMetrics();
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Dark paste-up wall background
    ctx.fillStyle = '#161616';
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Top Signal Yellow safety ribbon
    ctx.fillStyle = '#FEC917';
    ctx.fillRect(0, 0, 1080, 62);
    ctx.fillStyle = '#0D0D0D';
    ctx.font = 'bold 21px Archivo, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SIMULATION • EDUCATIONAL SCAM DRILL — NO REAL DATA OR OTPs', 540, 39);

    // 3. Brand stamp + serial header
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FEC917';
    ctx.fillRect(64, 104, 240, 56);
    ctx.fillStyle = '#0D0D0D';
    ctx.font = '800 32px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText('BAITCHECK®', 88, 143);

    const serialNo = 'NO. BC-' + String(Math.floor(1000 + Math.random() * 9000));
    ctx.fillStyle = '#B5B1A6';
    ctx.font = 'bold 24px Consolas, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(serialNo, 1016, 142);

    // 4. Main Verdict Headline
    ctx.textAlign = 'left';
    ctx.fillStyle = '#F7F5EF';
    ctx.font = '800 84px "Archivo Narrow", Impact, sans-serif';
    const headline =
      metrics.immunity === 100
        ? 'BAIT DODGED'
        : metrics.immunity >= 65
          ? 'PARTIAL SURVIVAL'
          : 'TRAP TRIGGERED';
    ctx.fillText(headline, 64, 256);

    ctx.fillStyle = '#FEC917';
    ctx.font = 'bold 26px Archivo, Arial, sans-serif';
    const subLine = state.activeChallenge
      ? `CHALLENGE: ${state.activeChallenge.target_label} (FROM ${state.activeChallenge.creator_name})`
      : '60-SECOND FAMILY SCAM SURVIVAL VERDICT';
    ctx.fillText(subLine.slice(0, 48), 64, 304);

    // 5. Split-Flap Metrics Row
    const boxW = 296;
    const boxY = 342;
    const boxH = 166;
    const boxes = [
      { val: metrics.immunity + '%', lbl: 'IMMUNITY SCORE' },
      { val: metrics.avgSecStr, lbl: 'AVG REACTION' },
      { val: `${metrics.dodgedCount}/${metrics.totalDrills}`, lbl: 'TRAPS DODGED' }
    ];

    for (let i = 0; i < boxes.length; i++) {
      const bx = 64 + i * (boxW + 32);
      ctx.fillStyle = '#0D0D0D';
      ctx.fillRect(bx, boxY, boxW, boxH);
      ctx.strokeStyle = '#FEC917';
      ctx.lineWidth = 3;
      ctx.strokeRect(bx, boxY, boxW, boxH);

      // Split-flap horizontal line
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bx, boxY + 86);
      ctx.lineTo(bx + boxW, boxY + 86);
      ctx.stroke();

      ctx.fillStyle = '#FEC917';
      ctx.textAlign = 'center';
      ctx.font = '800 66px "Archivo Narrow", Impact, sans-serif';
      ctx.fillText(boxes[i].val, bx + boxW / 2, boxY + 94);

      ctx.fillStyle = '#B5B1A6';
      ctx.font = 'bold 20px Archivo, Arial, sans-serif';
      ctx.fillText(boxes[i].lbl, bx + boxW / 2, boxY + 142);
    }

    // 6. Perforated Ticket Card
    const cardX = 64;
    const cardY = 552;
    const cardW = 952;
    const cardH = 520;

    // Hard ink shadow
    ctx.fillStyle = '#000000';
    ctx.fillRect(cardX + 10, cardY + 10, cardW, cardH);

    // White ticket paper
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cardX, cardY, cardW, cardH);

    // Yellow stub on left
    ctx.fillStyle = '#FEC917';
    ctx.fillRect(cardX, cardY, 176, cardH);

    // Ticket border
    ctx.strokeStyle = '#0D0D0D';
    ctx.lineWidth = 4;
    ctx.strokeRect(cardX, cardY, cardW, cardH);

    // Dashed tear line
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(cardX + 176, cardY);
    ctx.lineTo(cardX + 176, cardY + cardH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Mechanical punch hole
    ctx.fillStyle = '#161616';
    ctx.beginPath();
    ctx.arc(cardX + 88, cardY + 72, 22, 0, Math.PI * 2);
    ctx.fill();

    // Stub vertical label
    ctx.save();
    ctx.translate(cardX + 102, cardY + 460);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#0D0D0D';
    ctx.textAlign = 'left';
    ctx.font = '800 28px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText('VERDICT STUB • ' + serialNo, 0, 0);
    ctx.restore();

    // Ticket body rows
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0D0D0D';
    ctx.font = '800 34px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText('SCENARIO BREAKDOWN', cardX + 216, cardY + 64);

    const outcomes = state.drillOutcomes;
    for (let i = 0; i < outcomes.length; i++) {
      const o = outcomes[i];
      const ry = cardY + 102 + i * 114;
      ctx.fillStyle = '#FCFAF6';
      ctx.fillRect(cardX + 216, ry, 700, 92);
      ctx.strokeStyle = '#0D0D0D';
      ctx.lineWidth = 2;
      ctx.strokeRect(cardX + 216, ry, 700, 92);

      const titleTxt = (o.title && o.title.en) ? o.title.en : o.scenarioId;
      ctx.fillStyle = '#0D0D0D';
      ctx.font = 'bold 25px Archivo, Arial, sans-serif';
      ctx.fillText((i + 1) + '. ' + titleTxt.slice(0, 32), cardX + 236, ry + 38);

      ctx.fillStyle = '#5A5850';
      ctx.font = 'bold 21px Consolas, monospace';
      ctx.fillText('REACTION: ' + (o.reactionMs / 1000).toFixed(1) + 's', cardX + 236, ry + 72);

      const badgeW = 170;
      const badgeX = cardX + 730;
      ctx.fillStyle = o.passed ? '#067647' : '#D92D20';
      ctx.fillRect(badgeX, ry + 22, badgeW, 48);
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '800 22px "Archivo Narrow", Impact, sans-serif';
      ctx.fillText(o.passed ? 'DODGED' : (o.lossLabel || 'TRAPPED'), badgeX + badgeW / 2, ry + 54);
      ctx.textAlign = 'left';
    }

    // Simulated loss summary line inside ticket
    ctx.fillStyle = metrics.totalLossInr > 0 ? '#D92D20' : '#067647';
    ctx.font = '800 26px Archivo, Arial, sans-serif';
    const lossLine =
      metrics.totalLossInr > 0
        ? `SIMULATED LOSS: -₹${metrics.totalLossInr.toLocaleString('en-IN')} — RETRY TO SHARPEN REFLEX`
        : 'SIMULATED LOSS: ₹0 — ALL 3 SCAM TRAPS SPOTTED!';
    ctx.fillText(lossLine, cardX + 216, cardY + 482);

    // 7. 1930 Golden-Hour Strip & Footer
    ctx.fillStyle = '#F2EFE7';
    ctx.fillRect(64, 1110, 952, 116);
    ctx.fillStyle = '#0D0D0D';
    ctx.font = '800 24px "Archivo Narrow", Impact, sans-serif';
    ctx.fillText('1930 GOLDEN-HOUR RULE:', 88, 1152);
    ctx.font = 'bold 22px Archivo, Arial, sans-serif';
    ctx.fillText('1. Airplane Mode if .apk tapped  •  2. Call 1930  •  3. Report at cybercrime.gov.in', 88, 1194);

    ctx.fillStyle = '#FEC917';
    ctx.font = 'bold 28px Consolas, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('baitcheck.embarko.app', 64, 1292);

    ctx.fillStyle = '#B5B1A6';
    ctx.font = 'bold 20px Archivo, Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('TEST YOUR FAMILY IN 60 SECONDS', 1016, 1292);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'baitcheck-verdict-ticket.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    state.ticketDownloadedMsg = t('downloadSuccess');
    renderDrillView();
  }

  // =========================================================================
  // Link X-Ray Actions
  // =========================================================================

  async function runForensicScan() {
    const trimmed = state.xrayInput.trim();
    if (!trimmed) {
      state.xrayError = t('xrayEmptyErr');
      state.xrayResult = null;
      renderXrayView();
      return;
    }

    state.xrayLoading = true;
    state.xrayError = '';
    renderXrayView();

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: state.xrayInput })
      });
      const payload = await res.json();
      if (!res.ok) {
        state.xrayError = payload.error || 'Scan failed';
        state.xrayResult = null;
      } else {
        state.xrayResult = payload;
        refreshCohortStats();
      }
    } catch {
      state.xrayError = 'Network error while running forensic X-Ray.';
      state.xrayResult = null;
    }

    state.xrayLoading = false;
    renderXrayView();
  }

  // =========================================================================
  // Challenge Creator Actions
  // =========================================================================

  async function submitChallengeForm(e) {
    e.preventDefault();
    const creatorName = state.challengeCreatorName.trim();
    const targetLabel = state.challengeTargetLabel.trim();

    if (!creatorName || creatorName.length > 40) {
      state.challengeError = 'Please enter your nickname (1–40 characters).';
      renderChallengeView();
      return;
    }
    if (!targetLabel || targetLabel.length > 40) {
      state.challengeError = 'Please enter who this challenge is for (1–40 characters).';
      renderChallengeView();
      return;
    }

    state.challengeSubmitting = true;
    state.challengeError = '';
    renderChallengeView();

    try {
      const res = await fetch('/api/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorName,
          targetLabel,
          lang: state.challengeFormLang
        })
      });
      const data = await res.json();
      if (!res.ok) {
        state.challengeError = data.error || 'Could not create challenge.';
      } else {
        state.createdChallenge = data;
        state.copiedKey = '';
      }
    } catch {
      state.challengeError = 'Network error while creating challenge.';
    }

    state.challengeSubmitting = false;
    renderChallengeView();
  }

  async function copyTextSafe(text, keyName) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const tmp = document.createElement('textarea');
        tmp.value = text;
        tmp.setAttribute('readonly', 'true');
        tmp.style.position = 'fixed';
        tmp.style.left = '-9999px';
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
      state.copiedKey = keyName;
      renderAll();
      setTimeout(() => {
        if (state.copiedKey === keyName) {
          state.copiedKey = '';
          renderAll();
        }
      }, 2200);
    } catch {
      // Ignore clipboard permission failures gracefully.
    }
  }

  // =========================================================================
  // Rendering: Shell, Drill View, X-Ray, Challenge, Report, Companion
  // =========================================================================

  function renderTopBar() {
    document.documentElement.lang = state.lang;
    els.safetyRibbonText.textContent = t('safetyRibbon');
    els.footerDisclaimer.textContent = t('footerDisclaimer');

    els.langEnBtn.classList.toggle('is-active', state.lang === 'en');
    els.langEnBtn.setAttribute('aria-pressed', state.lang === 'en' ? 'true' : 'false');
    els.langHiBtn.classList.toggle('is-active', state.lang === 'hi');
    els.langHiBtn.setAttribute('aria-pressed', state.lang === 'hi' ? 'true' : 'false');

    els.soundToggleLabel.textContent = state.muted ? t('soundOff') : t('soundOn');
    els.soundToggleBtn.classList.toggle('is-muted', state.muted);
    els.soundToggleBtn.setAttribute('aria-pressed', state.muted ? 'false' : 'true');

    els.tabDrillLabel.textContent = t('tabDrill');
    els.tabXrayLabel.textContent = t('tabXray');
    els.tabChallengeLabel.textContent = t('tabChallenge');

    const activeTab =
      state.route.mode === 'report'
        ? 'challenge'
        : state.route.mode === 'challenge-drill'
          ? 'drill'
          : state.route.tab;

    els.tabDrillBtn.classList.toggle('is-active', activeTab === 'drill');
    els.tabXrayBtn.classList.toggle('is-active', activeTab === 'xray');
    els.tabChallengeBtn.classList.toggle('is-active', activeTab === 'challenge');

    if (activeTab === 'drill') els.tabDrillBtn.setAttribute('aria-current', 'page');
    else els.tabDrillBtn.removeAttribute('aria-current');

    if (activeTab === 'xray') els.tabXrayBtn.setAttribute('aria-current', 'page');
    else els.tabXrayBtn.removeAttribute('aria-current');

    if (activeTab === 'challenge') els.tabChallengeBtn.setAttribute('aria-current', 'page');
    else els.tabChallengeBtn.removeAttribute('aria-current');

    els.viewDrill.classList.toggle(
      'is-hidden',
      !(state.route.mode === 'challenge-drill' || (state.route.mode === 'tab' && state.route.tab === 'drill'))
    );
    els.viewXray.classList.toggle('is-hidden', !(state.route.mode === 'tab' && state.route.tab === 'xray'));
    els.viewChallenge.classList.toggle('is-hidden', !(state.route.mode === 'tab' && state.route.tab === 'challenge'));
    els.viewReport.classList.toggle('is-hidden', state.route.mode !== 'report');
  }

  function renderDrillView() {
    const container = els.viewDrill;
    clearEl(container);

    // 404 or error on /c/:id
    if (state.route.mode === 'challenge-drill' && state.challengeLoadError) {
      const sheet = createEl('div', 'newsprint-sheet');
      const card = createEl('div', 'paper-card stack-base');
      card.appendChild(createEl('p', 'eyebrow', '404 • CHALLENGE'));
      card.appendChild(createEl('h1', 'display-md', t('challengeNotFoundTitle')));
      card.appendChild(createEl('p', 'body-md', t('challengeNotFoundBody')));

      const actions = createEl('div', 'stack-sm');
      const freshBtn = createEl('button', 'button-primary button-full', t('startFreshDrillBtn'));
      freshBtn.type = 'button';
      freshBtn.addEventListener('click', () => navigateTo('/'));
      actions.appendChild(freshBtn);

      const newChalBtn = createEl('button', 'button-dark button-full', t('createChallengeBtn'));
      newChalBtn.type = 'button';
      newChalBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));
      actions.appendChild(newChalBtn);

      card.appendChild(actions);
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    // Loading /api/drills
    if (!state.loaded && !state.loadError) {
      const wall = createEl('div', 'poster-wall');
      const card = createEl('div', 'incoming-call-card stack-sm');
      card.appendChild(createEl('h1', 'display-md', t('loadingTitle')));
      card.appendChild(createEl('p', 'body-md', t('loadingBody')));
      wall.appendChild(card);
      container.appendChild(wall);
      return;
    }

    if (state.loadError) {
      const sheet = createEl('div', 'newsprint-sheet');
      const card = createEl('div', 'trap-alert-banner stack-md');
      card.appendChild(createEl('h1', 'display-md', t('loadErrorTitle')));
      card.appendChild(createEl('p', 'body-md', t('loadErrorBody')));
      const retry = createEl('button', 'button-primary button-full', t('retryBtn'));
      retry.type = 'button';
      retry.addEventListener('click', fetchDrillsAndStats);
      card.appendChild(retry);
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    // Phase 0: Screen 0 Incoming Call Hero
    if (state.drillPhase === 'hero') {
      const wall = createEl('div', 'poster-wall');

      if (state.activeChallenge) {
        const banner = createEl('div', 'challenge-banner');
        const bannerTitle = createEl(
          'p',
          'challenge-banner-title',
          `${t('challengeBannerPrefix')} ${state.activeChallenge.creator_name} ${t('challengeBannerFor')} ${state.activeChallenge.target_label}`
        );
        banner.appendChild(bannerTitle);
        wall.appendChild(banner);
      }

      const card = createEl('div', 'incoming-call-card');
      const meta = createEl('div', 'call-header-meta');
      meta.appendChild(createEl('span', 'eyebrow eyebrow--dark', t('heroEyebrow')));

      const recPill = createEl('span', 'rec-pill');
      recPill.appendChild(createEl('span', 'rec-dot'));
      recPill.appendChild(document.createTextNode('INCOMING • SIMULATED'));
      meta.appendChild(recPill);
      card.appendChild(meta);

      const callerStage = createEl('div', 'caller-ring-stage');
      const pulseFrame = createEl('div', 'pulse-frame');
      pulseFrame.appendChild(buildCallerEmblemSvg());
      callerStage.appendChild(pulseFrame);

      const callerMeta = createEl('div', 'caller-meta');
      const firstDrill = state.drills[0];
      const entityName = firstDrill ? loc(firstDrill.entity) : 'Central Cyber Desk (Simulated)';
      callerMeta.appendChild(createEl('p', 'caller-name', entityName));
      callerMeta.appendChild(createEl('p', 'caller-sub', t('heroCallerSub')));
      callerStage.appendChild(callerMeta);
      card.appendChild(callerStage);

      const h1 = createEl('h1', 'display-xl');
      h1.appendChild(document.createTextNode(t('heroHeadlinePre')));
      h1.appendChild(createEl('span', 'highlight-mark', t('heroHeadlineMark')));
      card.appendChild(h1);

      card.appendChild(createEl('p', 'hero-value-prop', t('heroValueProp')));

      const statsRow = createEl('div', 'hero-checklist');
      const chips = [
        [t('statTrapsVal'), t('statTrapsLbl')],
        [t('statClockVal'), t('statClockLbl')],
        [t('statLangVal'), t('statLangLbl')]
      ];
      for (let i = 0; i < chips.length; i++) {
        const chip = createEl('div', 'hero-stat-chip');
        chip.appendChild(createEl('strong', '', chips[i][0]));
        chip.appendChild(createEl('span', '', chips[i][1]));
        statsRow.appendChild(chip);
      }
      card.appendChild(statsRow);

      const answerBtn = createEl('button', 'button-primary button-full', t('answerCta'));
      answerBtn.type = 'button';
      answerBtn.id = 'answer-start-drill-btn';
      answerBtn.addEventListener('click', startDrillSequence);
      card.appendChild(answerBtn);

      const quickRow = createEl('div', 'quick-links-row');
      const qXray = createEl('button', 'button-dark', t('quickXrayBtn'));
      qXray.type = 'button';
      qXray.addEventListener('click', () => navigateTo('/?tab=xray'));
      quickRow.appendChild(qXray);

      const qChal = createEl('button', 'button-dark', t('quickChallengeBtn'));
      qChal.type = 'button';
      qChal.addEventListener('click', () => navigateTo('/?tab=challenge'));
      quickRow.appendChild(qChal);
      card.appendChild(quickRow);

      wall.appendChild(card);
      container.appendChild(wall);
      return;
    }

    // Phase 1: Active Drill 1, 2, or 3
    if (state.drillPhase === 'active') {
      const drill = state.drills[state.drillIndex];
      const sheet = createEl('div', 'newsprint-sheet');

      if (state.activeChallenge) {
        const banner = createEl('div', 'challenge-banner');
        banner.appendChild(
          createEl(
            'p',
            'challenge-banner-title',
            `${t('challengeBannerPrefix')} ${state.activeChallenge.creator_name} ${t('challengeBannerFor')} ${state.activeChallenge.target_label}`
          )
        );
        sheet.appendChild(banner);
      }

      const topStrip = createEl('div', 'drill-top-strip');
      topStrip.appendChild(
        createEl('span', 'eyebrow', `${t('drillPrefix')} ${state.drillIndex + 1} ${t('ofLabel')} ${state.drills.length}`)
      );
      topStrip.appendChild(createEl('span', 'status-tag status-tag--warn', drill.badge || 'SIMULATED'));
      sheet.appendChild(topStrip);

      // Countdown bar
      const durationMs = (Number(drill.durationSec) || 15) * 1000;
      const countdownBox = createEl('div', 'countdown-box');
      const cdHeader = createEl('div', 'countdown-header');
      cdHeader.appendChild(createEl('span', 'eyebrow eyebrow--dark', t('clockLabel')));
      const cdTime = createEl('span', 'countdown-time', (state.drillRemainingMs / 1000).toFixed(1) + 's');
      cdTime.id = 'drill-countdown-time';
      if (state.drillRemainingMs <= 5000) cdTime.classList.add('is-urgent');
      cdHeader.appendChild(cdTime);
      countdownBox.appendChild(cdHeader);

      const cdTrack = createEl('div', 'countdown-track');
      const cdFill = createEl('div', 'countdown-fill');
      cdFill.id = 'drill-countdown-fill';
      cdFill.style.width = Math.max(0, Math.min(100, (state.drillRemainingMs / durationMs) * 100)).toFixed(1) + '%';
      if (state.drillRemainingMs <= 5000) cdFill.classList.add('is-urgent');
      cdTrack.appendChild(cdFill);
      countdownBox.appendChild(cdTrack);
      sheet.appendChild(countdownBox);

      const drillCard = createEl('div', 'paper-card');
      drillCard.appendChild(createEl('div', 'masking-tape'));
      drillCard.appendChild(createEl('p', 'eyebrow', loc(drill.entity)));
      drillCard.appendChild(createEl('h2', 'display-md', loc(drill.title)));

      // Mode-specific prop
      if (drill.mode === 'video-call') {
        const frame = createEl('div', 'drill-visual-frame drill-visual--video');
        const info = createEl('div', 'stack-sm');
        const rec = createEl('span', 'rec-pill');
        rec.appendChild(createEl('span', 'rec-dot'));
        rec.appendChild(document.createTextNode(drill.badge));
        info.appendChild(rec);
        info.appendChild(createEl('strong', 'body-md', loc(drill.entity)));
        frame.appendChild(info);

        const sil = createEl('div', 'silhouette-box');
        sil.appendChild(buildSilhouetteSvg());
        frame.appendChild(sil);
        drillCard.appendChild(frame);
      } else if (drill.mode === 'chat-attachment') {
        const frame = createEl('div', 'drill-visual-frame drill-visual--chat');
        frame.appendChild(createEl('div', 'chat-bubble-meta', loc(drill.entity) + ' • CHAT LURE'));
        frame.appendChild(createEl('div', 'caption-txt', t('inspectApkHint')));

        const pillBtn = createEl('button', 'apk-pill-btn');
        pillBtn.type = 'button';
        pillBtn.appendChild(createEl('span', '', drill.attachment ? drill.attachment.pillText : 'Notice.pdf.apk'));
        pillBtn.appendChild(createEl('span', 'apk-pill-badge', 'SIMULATED'));
        pillBtn.addEventListener('click', () => {
          state.apkNoticeShown = true;
          renderDrillView();
        });
        frame.appendChild(pillBtn);

        if (state.apkNoticeShown) {
          frame.appendChild(createEl('div', 'apk-sim-notice', t('apkSimNotice')));
        }
        drillCard.appendChild(frame);
      } else if (drill.mode === 'upi-collect') {
        const frame = createEl('div', 'drill-visual-frame drill-visual--upi');
        frame.appendChild(createEl('p', 'eyebrow', t('upiCollectHeader')));
        const row = createEl('div', 'upi-amount-row');
        row.appendChild(createEl('span', 'upi-amount-big', drill.collectMeta ? drill.collectMeta.amountDisplay : '₹4,500'));
        row.appendChild(createEl('span', 'status-tag status-tag--warn', 'COLLECT'));
        frame.appendChild(row);
        frame.appendChild(
          createEl('div', 'body-md', drill.collectMeta ? loc(drill.collectMeta.prompt) : '')
        );
        frame.appendChild(createEl('div', 'caption-txt', t('upiCollectSub')));
        drillCard.appendChild(frame);
      }

      // Always-on >=18px Caption Box
      const capBox = createEl('div', 'caption-box');
      capBox.appendChild(createEl('span', 'caption-label', t('captionLabel')));
      capBox.appendChild(createEl('p', 'caption-script', loc(drill.script)));
      drillCard.appendChild(capBox);

      // Choice buttons
      const choicesList = createEl('div', 'choices-list');
      const lastOutcome = state.drillAnswered ? state.drillOutcomes[state.drillOutcomes.length - 1] : null;
      const choices = drill.choices || [];

      for (let i = 0; i < choices.length; i++) {
        const ch = choices[i];
        const btn = createEl('button', 'drill-choice-card');
        btn.type = 'button';
        btn.disabled = state.drillAnswered;

        if (lastOutcome && lastOutcome.choiceId === ch.id) {
          btn.classList.add(ch.passed ? 'is-selected-pass' : 'is-selected-fail');
        }

        btn.appendChild(createEl('span', '', loc(ch.label)));
        btn.addEventListener('click', () => handleDrillChoice(ch));
        choicesList.appendChild(btn);
      }
      drillCard.appendChild(choicesList);

      // Immediate Debrief Banner
      if (state.drillAnswered && lastOutcome) {
        const banner = createEl('div', lastOutcome.passed ? 'safe-pass-banner' : 'trap-alert-banner');
        const headingText = lastOutcome.timedOut
          ? `${t('timeoutTitle')} (${lastOutcome.lossLabel || '-₹50,000'})`
          : lastOutcome.passed
            ? loc(drill.debrief.passTitle)
            : loc(drill.debrief.trapTitle);

        banner.appendChild(createEl('h3', 'debrief-title', headingText));
        banner.appendChild(
          createEl(
            'p',
            'mono-tabular',
            `${t('reactionLabel')}: ${(lastOutcome.reactionMs / 1000).toFixed(1)}s (${lastOutcome.reactionMs} ms)`
          )
        );
        banner.appendChild(createEl('p', 'debrief-body', loc(drill.debrief.explanation)));

        if (state.syncStatus === 'saving') {
          banner.appendChild(createEl('p', 'caption-txt', t('savingResult')));
        } else if (state.syncStatus === 'saved') {
          banner.appendChild(createEl('p', 'caption-txt', t('savedResult')));
        } else if (state.syncStatus === 'error') {
          banner.appendChild(createEl('p', 'caption-txt', t('saveResultErr')));
        }

        const nextLabel =
          state.drillIndex + 1 < state.drills.length ? t('nextDrillBtn') : t('viewVerdictBtn');
        const nextBtn = createEl('button', 'button-primary button-full', nextLabel);
        nextBtn.type = 'button';
        nextBtn.addEventListener('click', advanceDrill);
        banner.appendChild(nextBtn);

        drillCard.appendChild(banner);
      }

      sheet.appendChild(drillCard);
      container.appendChild(sheet);
      return;
    }

    // Phase 2: Finale Verdict Ticket
    renderFinaleView(container);
  }

  function renderFinaleView(container) {
    const metrics = computeFinaleMetrics();
    const wall = createEl('div', 'poster-wall');

    if (state.activeChallenge) {
      const banner = createEl('div', 'challenge-banner');
      banner.appendChild(
        createEl(
          'p',
          'challenge-banner-title',
          `${t('challengeBannerPrefix')} ${state.activeChallenge.creator_name} ${t('challengeBannerFor')} ${state.activeChallenge.target_label}`
        )
      );
      wall.appendChild(banner);
    }

    wall.appendChild(createEl('p', 'eyebrow eyebrow--dark', t('finaleEyebrow')));

    const headlineText =
      metrics.immunity === 100
        ? t('finaleDodged')
        : metrics.immunity >= 65
          ? t('finalePartial')
          : t('finaleTrapped');
    wall.appendChild(createEl('h1', 'display-xl', headlineText));
    wall.appendChild(
      createEl(
        'p',
        'body-md',
        metrics.immunity === 100 ? t('finaleSubDodged') : t('finaleSubTrapped')
      )
    );

    // Split-Flap Tiles
    const flapGrid = createEl('div', 'split-flap-grid');
    const flapData = [
      [metrics.immunity + '%', t('metricImmunity')],
      [metrics.avgSecStr, t('metricAvgSpeed')],
      [`${metrics.dodgedCount}/${metrics.totalDrills}`, t('metricDodged')]
    ];
    for (let i = 0; i < flapData.length; i++) {
      const tile = createEl('div', 'split-flap-tile');
      tile.appendChild(createEl('span', 'split-flap-val', flapData[i][0]));
      tile.appendChild(createEl('span', 'split-flap-lbl', flapData[i][1]));
      flapGrid.appendChild(tile);
    }
    wall.appendChild(flapGrid);

    // Perforated Verdict Ticket
    const ticket = createEl('div', 'verdict-ticket');
    const stub = createEl('div', 'ticket-stub');
    stub.appendChild(createEl('div', 'ticket-punch-hole'));
    const stubMeta = createEl('div');
    stubMeta.appendChild(createEl('div', 'mono-tabular', 'NO. BC-2026'));
    stubMeta.appendChild(createEl('div', 'title-card', t('ticketStubTitle')));
    stub.appendChild(stubMeta);
    ticket.appendChild(stub);

    const tbody = createEl('div', 'ticket-body');
    tbody.appendChild(createEl('h2', 'title-card', t('ticketHeadline')));
    const lossSummary =
      metrics.totalLossInr > 0
        ? `${t('ticketLostTag')} -₹${metrics.totalLossInr.toLocaleString('en-IN')}`
        : t('ticketSavedTag');
    tbody.appendChild(createEl('p', 'mono-tabular', lossSummary));

    const rowsWrap = createEl('div', 'ticket-rows');
    for (let i = 0; i < state.drillOutcomes.length; i++) {
      const o = state.drillOutcomes[i];
      const row = createEl('div', 'ticket-drill-row');
      const left = createEl('div');
      left.appendChild(createEl('div', 'body-md', `${i + 1}. ${loc(o.title)}`));
      left.appendChild(createEl('div', 'mono-tabular', `${(o.reactionMs / 1000).toFixed(1)}s`));
      row.appendChild(left);

      const tag = createEl(
        'span',
        'status-tag ' + (o.passed ? 'status-tag--pass' : 'status-tag--fail'),
        o.passed ? t('passTag') : (o.lossLabel || t('failTag'))
      );
      row.appendChild(tag);
      rowsWrap.appendChild(row);
    }
    tbody.appendChild(rowsWrap);
    ticket.appendChild(tbody);
    wall.appendChild(ticket);

    // Action Buttons
    const actions = createEl('div', 'stack-sm');

    const dlBtn = createEl('button', 'button-primary button-full', t('downloadTicketBtn'));
    dlBtn.type = 'button';
    dlBtn.addEventListener('click', downloadVerdictTicketPng);
    actions.appendChild(dlBtn);

    if (state.ticketDownloadedMsg) {
      actions.appendChild(createEl('p', 'caption-txt', state.ticketDownloadedMsg));
    }

    if (state.route.mode === 'challenge-drill' && state.route.challengeId) {
      const reportBtn = createEl('button', 'button-dark button-full', t('openChallengeReportBtn'));
      reportBtn.type = 'button';
      reportBtn.addEventListener('click', () =>
        navigateTo('/c/' + encodeURIComponent(state.route.challengeId) + '/report')
      );
      actions.appendChild(reportBtn);
    }

    const chalBtn = createEl('button', 'button-dark button-full', t('challengeFamilyBtn'));
    chalBtn.type = 'button';
    chalBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));
    actions.appendChild(chalBtn);

    const replayBtn = createEl('button', 'button-ghost-light button-full', t('replayDrillBtn'));
    replayBtn.type = 'button';
    replayBtn.addEventListener('click', () => {
      state.drillPhase = 'hero';
      state.drillIndex = 0;
      state.drillOutcomes = [];
      state.ticketDownloadedMsg = '';
      renderDrillView();
    });
    actions.appendChild(replayBtn);

    wall.appendChild(actions);
    container.appendChild(wall);
  }

  function renderXrayView() {
    const container = els.viewXray;
    clearEl(container);

    const sheet = createEl('div', 'newsprint-sheet stack-base');
    const head = createEl('div');
    head.appendChild(createEl('p', 'eyebrow', t('xrayEyebrow')));
    head.appendChild(createEl('h1', 'display-md', t('xrayTitle')));
    head.appendChild(createEl('p', 'body-md', t('xraySub')));
    sheet.appendChild(head);

    // 1-Tap Sample Presets
    const presetsWrap = createEl('div');
    presetsWrap.appendChild(createEl('span', 'eyebrow', t('xrayPresetsLbl')));
    const presetGrid = createEl('div', 'preset-grid');
    for (let i = 0; i < state.presets.length; i++) {
      const preset = state.presets[i];
      const chip = createEl('button', 'preset-chip', loc(preset.label));
      chip.type = 'button';
      if (state.xraySelectedPresetId === preset.id) {
        chip.classList.add('is-active');
      }
      chip.addEventListener('click', () => {
        state.xraySelectedPresetId = preset.id;
        state.xrayInput = preset.text;
        state.xrayError = '';
        runForensicScan();
      });
      presetGrid.appendChild(chip);
    }
    presetsWrap.appendChild(presetGrid);
    sheet.appendChild(presetsWrap);

    // Textarea + Char Counter
    const inputWrap = createEl('div', 'stack-sm');
    const lblRow = createEl('label', 'field-label');
    lblRow.setAttribute('for', 'xray-textarea');
    lblRow.appendChild(createEl('span', '', t('xrayInputLbl')));
    const counterSpan = createEl('span', 'mono-tabular', `${state.xrayInput.length} / ${MAX_XRAY_LENGTH}`);
    counterSpan.id = 'xray-char-counter';
    lblRow.appendChild(counterSpan);
    inputWrap.appendChild(lblRow);

    const textarea = createEl('textarea', 'editorial-textarea');
    textarea.id = 'xray-textarea';
    textarea.maxLength = MAX_XRAY_LENGTH;
    textarea.placeholder = t('xrayPlaceholder');
    textarea.value = state.xrayInput;
    textarea.addEventListener('input', (e) => {
      state.xrayInput = e.target.value;
      state.xraySelectedPresetId = null;
      const c = document.getElementById('xray-char-counter');
      if (c) c.textContent = `${state.xrayInput.length} / ${MAX_XRAY_LENGTH}`;
    });
    inputWrap.appendChild(textarea);

    const btnRow = createEl('div', 'row-wrap');
    const analyzeBtn = createEl(
      'button',
      'button-primary',
      state.xrayLoading ? t('xrayScanningBtn') : t('xrayAnalyzeBtn')
    );
    analyzeBtn.type = 'button';
    analyzeBtn.style.flex = '1 1 200px';
    analyzeBtn.disabled = state.xrayLoading;
    analyzeBtn.addEventListener('click', runForensicScan);
    btnRow.appendChild(analyzeBtn);

    const clearBtn = createEl('button', 'button-ghost-light', t('xrayClearBtn'));
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', () => {
      state.xrayInput = '';
      state.xraySelectedPresetId = null;
      state.xrayResult = null;
      state.xrayError = '';
      renderXrayView();
    });
    btnRow.appendChild(clearBtn);
    inputWrap.appendChild(btnRow);

    if (state.xrayError) {
      inputWrap.appendChild(createEl('div', 'trap-alert-banner', state.xrayError));
    }
    sheet.appendChild(inputWrap);

    // Results Panel
    if (state.xrayResult) {
      const res = state.xrayResult;
      const meterCard = createEl('div', 'risk-meter-wrap stack-sm');

      const scoreRow = createEl('div', 'risk-score-row');
      const leftScore = createEl('div');
      leftScore.appendChild(createEl('span', 'eyebrow', t('xrayRiskScoreLbl')));
      leftScore.appendChild(createEl('div', 'display-xl', `${res.riskScore}/100`));
      scoreRow.appendChild(leftScore);

      const rightMeta = createEl('div', 'stack-sm');
      rightMeta.style.alignItems = 'flex-end';
      const verdictClass =
        res.verdictLevel === 'high'
          ? 'status-tag--fail'
          : res.verdictLevel === 'medium'
            ? 'status-tag--warn'
            : 'status-tag--pass';
      rightMeta.appendChild(createEl('span', 'status-tag ' + verdictClass, res.verdict));
      rightMeta.appendChild(createEl('span', 'mono-tabular', `${t('xrayLatencyLbl')}: ${res.elapsedMs} ms`));
      scoreRow.appendChild(rightMeta);
      meterCard.appendChild(scoreRow);

      const track = createEl('div', 'risk-bar-track');
      const fill = createEl('div', 'risk-bar-fill');
      fill.style.width = `${Math.max(4, Math.min(100, res.riskScore))}%`;
      if (res.verdictLevel === 'high') fill.classList.add('is-high');
      else if (res.verdictLevel === 'medium') fill.classList.add('is-medium');
      track.appendChild(fill);
      meterCard.appendChild(track);
      sheet.appendChild(meterCard);

      // Inline Highlighted Preview (Strictly built with createElement + textContent)
      if (Array.isArray(res.highlightedSegments) && res.highlightedSegments.length > 0) {
        const hlCard = createEl('div', 'paper-card stack-sm');
        hlCard.appendChild(createEl('span', 'eyebrow', t('xrayHighlightTitle')));
        const preview = createEl('div', 'xray-highlight-box');
        for (let i = 0; i < res.highlightedSegments.length; i++) {
          const seg = res.highlightedSegments[i];
          if (seg.highlight === 'danger') {
            preview.appendChild(createEl('mark', 'hl-danger', seg.text));
          } else if (seg.highlight === 'warn') {
            preview.appendChild(createEl('mark', 'hl-warn', seg.text));
          } else {
            preview.appendChild(document.createTextNode(seg.text));
          }
        }
        hlCard.appendChild(preview);
        sheet.appendChild(hlCard);
      }

      // Decoded UPI Table
      if (res.upiDecoded) {
        const upiCard = createEl('div', 'paper-card stack-sm');
        upiCard.appendChild(createEl('span', 'eyebrow', t('xrayUpiTitle')));

        const warnBox = createEl('div', 'trap-alert-banner');
        warnBox.style.marginTop = '0';
        warnBox.appendChild(createEl('strong', 'body-md', res.upiDecoded.warning || ''));
        upiCard.appendChild(warnBox);

        const table = createEl('table', 'upi-table');
        const tbody = createEl('tbody');
        const fields = [
          ['pa (Payee VPA)', res.upiDecoded.pa],
          ['pn (Payee Name)', res.upiDecoded.pn],
          ['am (Amount ₹)', res.upiDecoded.am],
          ['cu (Currency)', res.upiDecoded.cu],
          ['tn (Note)', res.upiDecoded.tn],
          ['mode', res.upiDecoded.mode],
          ['tr (Ref)', res.upiDecoded.tr]
        ];
        for (let i = 0; i < fields.length; i++) {
          if (!fields[i][1]) continue;
          const tr = createEl('tr');
          tr.appendChild(createEl('th', '', fields[i][0]));
          tr.appendChild(createEl('td', 'mono-tabular', fields[i][1]));
          tbody.appendChild(tr);
        }
        table.appendChild(tbody);
        upiCard.appendChild(table);
        sheet.appendChild(upiCard);
      }

      // Forensic Findings
      const findingsWrap = createEl('div', 'stack-sm');
      findingsWrap.appendChild(createEl('span', 'eyebrow', t('xrayFindingsTitle')));

      if (Array.isArray(res.findings) && res.findings.length > 0) {
        for (let i = 0; i < res.findings.length; i++) {
          const f = res.findings[i];
          const sw = createEl('div', 'finding-swatch' + (f.severity === 'danger' ? ' is-danger' : ''));
          const top = createEl('div', 'row-wrap');
          top.style.justifyContent = 'space-between';
          top.appendChild(createEl('strong', 'title-card', f.title));
          top.appendChild(
            createEl(
              'span',
              'status-tag ' + (f.severity === 'danger' ? 'status-tag--fail' : 'status-tag--warn'),
              `+${f.points} RISK`
            )
          );
          sw.appendChild(top);
          sw.appendChild(createEl('p', 'body-md', f.detail));

          if (Array.isArray(f.matchedTokens) && f.matchedTokens.length > 0) {
            const chips = createEl('div', 'token-chips');
            for (let j = 0; j < f.matchedTokens.length; j++) {
              chips.appendChild(createEl('span', 'token-chip', f.matchedTokens[j]));
            }
            sw.appendChild(chips);
          }
          findingsWrap.appendChild(sw);
        }
      } else {
        const safeBanner = createEl('div', 'safe-pass-banner');
        safeBanner.style.marginTop = '0';
        safeBanner.appendChild(createEl('h3', 'debrief-title', t('xraySafeTitle')));
        safeBanner.appendChild(createEl('p', 'debrief-body', t('xraySafeBody')));
        findingsWrap.appendChild(safeBanner);
      }
      sheet.appendChild(findingsWrap);
    }

    container.appendChild(sheet);
  }

  function renderChallengeView() {
    const container = els.viewChallenge;
    clearEl(container);

    const sheet = createEl('div', 'newsprint-sheet stack-base');
    const head = createEl('div');
    head.appendChild(createEl('p', 'eyebrow', t('challengeEyebrow')));
    head.appendChild(createEl('h1', 'display-md', t('challengeTitle')));
    head.appendChild(createEl('p', 'body-md', t('challengeSub')));
    sheet.appendChild(head);

    sheet.appendChild(createEl('div', 'privacy-note', t('privacyNote')));

    const formCard = createEl('form', 'paper-card stack-md');
    formCard.addEventListener('submit', submitChallengeForm);

    const creatorGroup = createEl('div');
    const creatorLbl = createEl('label', 'field-label', t('creatorLbl'));
    creatorLbl.setAttribute('for', 'challenge-creator-input');
    creatorGroup.appendChild(creatorLbl);
    const creatorInput = createEl('input', 'editorial-input');
    creatorInput.id = 'challenge-creator-input';
    creatorInput.type = 'text';
    creatorInput.maxLength = 40;
    creatorInput.required = true;
    creatorInput.placeholder = t('creatorPlaceholder');
    creatorInput.value = state.challengeCreatorName;
    creatorInput.addEventListener('input', (e) => {
      state.challengeCreatorName = e.target.value;
    });
    creatorGroup.appendChild(creatorInput);
    formCard.appendChild(creatorGroup);

    const targetGroup = createEl('div');
    const targetLbl = createEl('label', 'field-label', t('targetLbl'));
    targetLbl.setAttribute('for', 'challenge-target-input');
    targetGroup.appendChild(targetLbl);
    const targetInput = createEl('input', 'editorial-input');
    targetInput.id = 'challenge-target-input';
    targetInput.type = 'text';
    targetInput.maxLength = 40;
    targetInput.required = true;
    targetInput.placeholder = t('targetPlaceholder');
    targetInput.value = state.challengeTargetLabel;
    targetInput.addEventListener('input', (e) => {
      state.challengeTargetLabel = e.target.value;
    });
    targetGroup.appendChild(targetInput);
    formCard.appendChild(targetGroup);

    const langGroup = createEl('div');
    langGroup.appendChild(createEl('span', 'field-label', t('challengeLangLbl')));
    const radioRow = createEl('div', 'radio-row');

    const enBtn = createEl('button', 'radio-chip' + (state.challengeFormLang === 'en' ? ' is-active' : ''), 'ENGLISH (EN)');
    enBtn.type = 'button';
    enBtn.addEventListener('click', () => {
      state.challengeFormLang = 'en';
      renderChallengeView();
    });
    radioRow.appendChild(enBtn);

    const hiBtn = createEl('button', 'radio-chip' + (state.challengeFormLang === 'hi' ? ' is-active' : ''), 'हिन्दी (HI)');
    hiBtn.type = 'button';
    hiBtn.addEventListener('click', () => {
      state.challengeFormLang = 'hi';
      renderChallengeView();
    });
    radioRow.appendChild(hiBtn);

    langGroup.appendChild(radioRow);
    formCard.appendChild(langGroup);

    if (state.challengeError) {
      formCard.appendChild(createEl('div', 'trap-alert-banner', state.challengeError));
    }

    const submitBtn = createEl(
      'button',
      'button-primary button-full',
      state.challengeSubmitting ? t('challengeCreatingBtn') : t('challengeSubmitBtn')
    );
    submitBtn.type = 'submit';
    submitBtn.disabled = state.challengeSubmitting;
    formCard.appendChild(submitBtn);

    sheet.appendChild(formCard);

    if (state.createdChallenge) {
      const ch = state.createdChallenge;
      const fullChallengeUrl = window.location.origin + ch.challengeUrl;
      const readyCard = createEl('div', 'paper-card stack-md');
      readyCard.appendChild(createEl('span', 'status-tag status-tag--pass', t('challengeReadyTitle')));
      readyCard.appendChild(
        createEl('div', 'title-card', `${ch.creator_name} → ${ch.target_label} (${ch.lang.toUpperCase()})`)
      );
      readyCard.appendChild(createEl('div', 'share-url-box', fullChallengeUrl));

      const copyBtn = createEl(
        'button',
        'button-primary button-full',
        state.copiedKey === 'creator' ? t('copiedBtn') : t('copyLinkBtn')
      );
      copyBtn.type = 'button';
      copyBtn.addEventListener('click', () => copyTextSafe(fullChallengeUrl, 'creator'));
      readyCard.appendChild(copyBtn);

      const waMsg = `Try this 60-second scam survival drill I created for ${ch.target_label} on BaitCheck (Simulated): ${fullChallengeUrl}`;
      const waLink = createEl('a', 'button-dark button-full', t('whatsappBtn'));
      waLink.href = 'https://wa.me/?text=' + encodeURIComponent(waMsg);
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      readyCard.appendChild(waLink);

      const openReportBtn = createEl('button', 'button-dark button-full', t('openLiveReportBtn'));
      openReportBtn.type = 'button';
      openReportBtn.addEventListener('click', () => navigateTo(ch.reportUrl));
      readyCard.appendChild(openReportBtn);

      const testNowBtn = createEl('button', 'button-ghost-light button-full', t('testChallengeNowBtn'));
      testNowBtn.type = 'button';
      testNowBtn.addEventListener('click', () => navigateTo(ch.challengeUrl));
      readyCard.appendChild(testNowBtn);

      sheet.appendChild(readyCard);
    }

    container.appendChild(sheet);
  }

  function renderReportView() {
    const container = els.viewReport;
    clearEl(container);

    const sheet = createEl('div', 'newsprint-sheet stack-base');

    if (state.reportLoading && !state.reportData) {
      const card = createEl('div', 'paper-card');
      card.appendChild(createEl('h1', 'display-md', t('loadingTitle')));
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    if (state.reportError === 'not-found') {
      const card = createEl('div', 'paper-card stack-md');
      card.appendChild(createEl('p', 'eyebrow', '404 • REPORT'));
      card.appendChild(createEl('h1', 'display-md', t('challengeNotFoundTitle')));
      card.appendChild(createEl('p', 'body-md', t('challengeNotFoundBody')));
      const createBtn = createEl('button', 'button-primary button-full', t('createChallengeBtn'));
      createBtn.type = 'button';
      createBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));
      card.appendChild(createBtn);
      sheet.appendChild(card);
      container.appendChild(sheet);
      return;
    }

    if (state.reportError && !state.reportData) {
      const errCard = createEl('div', 'trap-alert-banner stack-md');
      errCard.appendChild(createEl('h1', 'display-md', t('loadErrorTitle')));
      const retry = createEl('button', 'button-primary button-full', t('retryBtn'));
      retry.type = 'button';
      retry.addEventListener('click', () => loadReport(state.reportId, true));
      errCard.appendChild(retry);
      sheet.appendChild(errCard);
      container.appendChild(sheet);
      return;
    }

    if (!state.reportData) return;

    const data = state.reportData;
    const challenge = data.challenge;
    const summary = data.summary || {
      immunityScore: 0,
      completedCount: 0,
      totalScenarios: 3,
      averageReactionMs: null
    };
    const isComplete = Number(summary.completedCount) >= Number(summary.totalScenarios || 3);

    const header = createEl('div', 'stack-sm');
    header.appendChild(createEl('p', 'eyebrow', t('reportEyebrow')));
    header.appendChild(createEl('h1', 'display-md', `${t('reportFor')} ${challenge.target_label}`));
    header.appendChild(
      createEl('p', 'body-md', `${t('reportSentBy')} ${challenge.creator_name} • /c/${challenge.id}`)
    );

    const pollBadge = createEl(
      'span',
      'status-tag ' + (isComplete ? 'status-tag--pass' : 'status-tag--warn'),
      isComplete ? t('reportComplete') : t('reportPolling')
    );
    header.appendChild(pollBadge);
    sheet.appendChild(header);

    // Split-Flap Summary
    const flapGrid = createEl('div', 'split-flap-grid');
    const avgStr =
      summary.averageReactionMs !== null && summary.averageReactionMs !== undefined
        ? (Number(summary.averageReactionMs) / 1000).toFixed(1) + 's'
        : '--';
    const items = [
      [`${summary.immunityScore}%`, t('metricImmunity')],
      [avgStr, t('metricAvgSpeed')],
      [`${summary.completedCount}/${summary.totalScenarios}`, t('reportCompletedLbl')]
    ];
    for (let i = 0; i < items.length; i++) {
      const tile = createEl('div', 'split-flap-tile');
      tile.appendChild(createEl('span', 'split-flap-val', items[i][0]));
      tile.appendChild(createEl('span', 'split-flap-lbl', items[i][1]));
      flapGrid.appendChild(tile);
    }
    sheet.appendChild(flapGrid);

    // Latest result per scenario
    const latestMap = new Map();
    const results = Array.isArray(data.results) ? data.results : [];
    for (let i = 0; i < results.length; i++) {
      latestMap.set(results[i].scenario_id, results[i]);
    }

    const drills = state.drills.length
      ? state.drills
      : [
          { id: 'drill-1-call', weight: 35, title: { en: 'Digital Arrest Video Call', hi: 'डिजिटल अरेस्ट वीडियो कॉल' } },
          { id: 'drill-2-apk', weight: 35, title: { en: 'Fake Utility Bill .pdf.apk Forward', hi: 'नकली बिजली बिल .pdf.apk मैसेज' } },
          { id: 'drill-3-upi', weight: 30, title: { en: 'UPI Cashback Collect Trap', hi: 'UPI कैशबैक कलेक्ट जाल' } }
        ];

    const breakdownCard = createEl('div', 'paper-card stack-sm');
    breakdownCard.appendChild(createEl('h2', 'title-card', t('ticketHeadline')));

    for (let i = 0; i < drills.length; i++) {
      const d = drills[i];
      const latest = latestMap.get(d.id);
      const row = createEl('div', 'ticket-drill-row');
      const left = createEl('div');
      left.appendChild(createEl('strong', 'body-md', `${i + 1}. ${loc(d.title)}`));

      if (latest) {
        const passed = Boolean(latest.passed);
        left.appendChild(
          createEl(
            'div',
            'mono-tabular',
            `${t('reactionLabel')}: ${(Number(latest.reaction_ms) / 1000).toFixed(1)}s (${latest.reaction_ms} ms)`
          )
        );
        if (!passed && latest.missed_flag) {
          left.appendChild(createEl('div', 'caption-txt', `${t('reportMissedFlagLbl')} ${latest.missed_flag}`));
        }
        row.appendChild(left);
        row.appendChild(
          createEl(
            'span',
            'status-tag ' + (passed ? 'status-tag--pass' : 'status-tag--fail'),
            passed ? `${t('passTag')} +${d.weight}` : t('failTag')
          )
        );
      } else {
        left.appendChild(createEl('div', 'mono-tabular', `${d.weight} PTS`));
        row.appendChild(left);
        row.appendChild(createEl('span', 'status-tag status-tag--pending', t('pendingTag')));
      }
      breakdownCard.appendChild(row);
    }
    sheet.appendChild(breakdownCard);

    // Controls
    const fullLink = `${window.location.origin}/c/${challenge.id}`;
    const actions = createEl('div', 'stack-sm');

    const refreshBtn = createEl('button', 'button-primary button-full', t('reportRefreshBtn'));
    refreshBtn.type = 'button';
    refreshBtn.addEventListener('click', () => loadReport(challenge.id, false));
    actions.appendChild(refreshBtn);

    const copyBtn = createEl(
      'button',
      'button-dark button-full',
      state.copiedKey === 'report' ? t('copiedBtn') : t('reportCopyBtn')
    );
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', () => copyTextSafe(fullLink, 'report'));
    actions.appendChild(copyBtn);

    const runBtn = createEl('button', 'button-dark button-full', t('reportRunBtn'));
    runBtn.type = 'button';
    runBtn.addEventListener('click', () => navigateTo('/c/' + encodeURIComponent(challenge.id)));
    actions.appendChild(runBtn);

    const backBtn = createEl('button', 'button-ghost-light button-full', t('reportBackBtn'));
    backBtn.type = 'button';
    backBtn.addEventListener('click', () => navigateTo('/'));
    actions.appendChild(backBtn);

    sheet.appendChild(actions);
    container.appendChild(sheet);
  }

  function renderCohortPanel() {
    const panel = els.cohortPanel;
    clearEl(panel);

    panel.appendChild(createEl('p', 'eyebrow eyebrow--dark', t('cohortEyebrow')));
    const h2 = createEl('h2', 'display-md', t('cohortTitle'));
    h2.id = 'cohort-heading';
    panel.appendChild(h2);

    const stats = state.stats || {
      totalDrills: 142,
      passRatePct: 61.5,
      topMissedScenario: 'drill-2-apk',
      totalScans: 0
    };

    const grid = createEl('div', 'split-flap-grid split-flap-grid--two');
    const topMissedObj = state.drills.find((d) => d.id === stats.topMissedScenario);
    const topMissedLabel = topMissedObj
      ? (state.lang === 'hi' ? 'बिल .APK' : '.PDF.APK')
      : String(stats.topMissedScenario || 'DRILL-2');

    const tiles = [
      [String(stats.totalDrills), t('cohortDrillsLbl')],
      [`${stats.passRatePct}%`, t('cohortPassLbl')],
      [String(stats.totalScans || 0), t('cohortScansLbl')],
      [topMissedLabel, t('cohortTopMissedLbl')]
    ];

    for (let i = 0; i < tiles.length; i++) {
      const tile = createEl('div', 'split-flap-tile');
      tile.appendChild(createEl('span', 'split-flap-val', tiles[i][0]));
      tile.appendChild(createEl('span', 'split-flap-lbl', tiles[i][1]));
      grid.appendChild(tile);
    }

    panel.appendChild(grid);
  }

  function renderPlaybookPanel() {
    const panel = els.playbookPanel;
    clearEl(panel);

    panel.appendChild(createEl('p', 'eyebrow', t('playbookEyebrow')));
    const pb = state.playbook;
    const h2 = createEl(
      'h2',
      'display-md',
      pb ? loc(pb.title) : '1930 Golden-Hour Emergency Playbook'
    );
    h2.id = 'playbook-heading';
    panel.appendChild(h2);
    panel.appendChild(createEl('p', 'caption-txt', t('playbookHint')));

    const steps = pb && Array.isArray(pb.steps) ? pb.steps : [];
    const list = createEl('div', 'swatch-list');

    for (let i = 0; i < steps.length; i++) {
      const st = steps[i];
      const strip = createEl('div', 'swatch-strip');
      const badge = createEl(
        'div',
        `swatch-step-badge swatch-step-${Math.min(3, Math.max(1, Number(st.step) || i + 1))}`,
        String(st.step || i + 1)
      );
      strip.appendChild(badge);

      const content = createEl('div');
      content.appendChild(createEl('h3', 'swatch-title', loc(st.title)));
      content.appendChild(createEl('p', 'swatch-detail', loc(st.detail)));
      strip.appendChild(content);

      list.appendChild(strip);
    }

    panel.appendChild(list);
  }

  function renderAll() {
    renderTopBar();
    renderDrillView();
    renderXrayView();
    renderChallengeView();
    renderReportView();
    renderCohortPanel();
    renderPlaybookPanel();
  }

  // =========================================================================
  // Initialization & Event Binding
  // =========================================================================

  function bindStaticControls() {
    els.safetyRibbonText = document.getElementById('safety-ribbon-text');
    els.brandHomeBtn = document.getElementById('brand-home-btn');
    els.langEnBtn = document.getElementById('lang-en-btn');
    els.langHiBtn = document.getElementById('lang-hi-btn');
    els.soundToggleBtn = document.getElementById('sound-toggle-btn');
    els.soundToggleLabel = document.getElementById('sound-toggle-label');
    els.tabDrillBtn = document.getElementById('tab-drill-btn');
    els.tabXrayBtn = document.getElementById('tab-xray-btn');
    els.tabChallengeBtn = document.getElementById('tab-challenge-btn');
    els.tabDrillLabel = document.getElementById('tab-drill-label');
    els.tabXrayLabel = document.getElementById('tab-xray-label');
    els.tabChallengeLabel = document.getElementById('tab-challenge-label');
    els.viewDrill = document.getElementById('view-drill');
    els.viewXray = document.getElementById('view-xray');
    els.viewChallenge = document.getElementById('view-challenge');
    els.viewReport = document.getElementById('view-report');
    els.cohortPanel = document.getElementById('cohort-panel');
    els.playbookPanel = document.getElementById('playbook-panel');
    els.footerDisclaimer = document.getElementById('footer-disclaimer');

    els.brandHomeBtn.addEventListener('click', () => {
      state.drillPhase = 'hero';
      state.drillIndex = 0;
      state.drillOutcomes = [];
      navigateTo('/');
    });

    els.langEnBtn.addEventListener('click', () => {
      state.lang = 'en';
      stopSpeech();
      renderAll();
    });

    els.langHiBtn.addEventListener('click', () => {
      state.lang = 'hi';
      stopSpeech();
      renderAll();
    });

    els.soundToggleBtn.addEventListener('click', () => {
      state.muted = !state.muted;
      if (state.muted) {
        stopSpeech();
      } else {
        unlockAudio();
      }
      renderTopBar();
    });

    els.tabDrillBtn.addEventListener('click', () => navigateTo('/'));
    els.tabXrayBtn.addEventListener('click', () => navigateTo('/?tab=xray'));
    els.tabChallengeBtn.addEventListener('click', () => navigateTo('/?tab=challenge'));

    window.addEventListener('popstate', () => {
      stopDrillTimer();
      stopReportPolling();
      stopSpeech();
      state.route = parseRoute(window.location.pathname, window.location.search);
      syncRouteView();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindStaticControls();
    state.route = parseRoute(window.location.pathname, window.location.search);
    syncRouteView();
    fetchDrillsAndStats();
  });
})();
