'use strict';

(function (global) {
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
      ticketPreviewLabel: 'VERDICT TICKET PREVIEW (1080×1350 PNG)',
      ticketPreviewHint: 'Long-press image on mobile to save or share directly',
      ticketBadgeUrlLabel: 'PERMANENT BADGE URL',
      ticketRibbon: 'SIMULATION • EDUCATIONAL SCAM DRILL — NO REAL DATA OR OTPs',
      ticketSerialPrefix: 'NO. ',
      ticketSubDefault: '60-SECOND FAMILY SCAM SURVIVAL VERDICT',
      ticketSubChallengePrefix: 'CHALLENGE FOR ',
      ticketSubChallengeFrom: 'FROM ',
      ticketStubVertical: 'VERDICT STUB • ',
      ticketLossRetry: ' — RETRY TO SHARPEN REFLEX',
      ticketLossZero: 'SIMULATED LOSS: ₹0 — ALL 3 SCAM TRAPS SPOTTED!',
      ticketPlaybookTitle: '1930 GOLDEN-HOUR RULE:',
      ticketPlaybookSteps: '1. Airplane Mode if .apk tapped  •  2. Call 1930  •  3. Report at cybercrime.gov.in',
      ticketFooterTagline: 'TEST YOUR FAMILY IN 60 SECONDS',
      challengeFamilyBtn: 'CHALLENGE FAMILY →',
      openChallengeReportBtn: 'OPEN LIVE REPORT →',
      replayDrillBtn: 'REPLAY 60s DRILL',

      xrayEyebrow: '02 · INSTANT LINK & UPI X-RAY',
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
      xrayFailErr: 'Could not analyze input. Please verify your text and try again.',
      xrayNetErr: 'Network error while running Link & UPI X-Ray.',
      xrayRiskScoreLbl: 'RISK SCORE',
      xrayLatencyLbl: 'LATENCY',
      xrayHighlightTitle: 'TOKEN X-RAY PREVIEW',
      xrayUpiTitle: 'DECODED UPI PAYLOAD',
      xrayFindingsTitle: 'FORENSIC FINDINGS',
      xrayRiskUnit: 'RISK',
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
      challengeRequiredErr: 'Please enter both nicknames (1–40 characters each).',
      challengeCreatorErr: 'Please enter your nickname (1–40 characters).',
      challengeTargetErr: 'Please enter who is taking this challenge (1–40 characters).',
      challengeFailErr: 'Unable to create challenge link. Please try again.',
      challengeNetErr: 'Network error while creating challenge link.',
      challengeReadyTitle: 'CHALLENGE LINK READY',
      copyLinkBtn: 'COPY LINK',
      copiedBtn: 'COPIED!',
      whatsappBtn: 'SHARE ON WHATSAPP',
      openLiveReportBtn: 'OPEN LIVE REPORT →',
      testChallengeNowBtn: 'TEST THIS LINK NOW',
      recentChallengesTitle: 'RECENT SENT CHALLENGES',
      recentReportBtn: 'OPEN LIVE REPORT',

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

      cohortEyebrow: 'COMMUNITY BENCHMARK • LIVE + BASELINE',
      cohortTitle: 'PUBLIC SCAM BENCHMARK',
      cohortDrillsLbl: 'DRILLS COMPLETED',
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
      ticketPreviewLabel: 'निर्णय टिकट पूर्वावलोकन (1080×1350 PNG)',
      ticketPreviewHint: 'मोबाइल पर सेव करने के लिए इमेज को दबाकर रखें (Long-press)',
      ticketBadgeUrlLabel: 'स्थायी बैज लिंक',
      ticketRibbon: 'सिम्युलेशन • शैक्षणिक स्कैम अभ्यास — कोई असली डेटा या OTP नहीं',
      ticketSerialPrefix: 'क्र. ',
      ticketSubDefault: '60-सेकंड पारिवारिक स्कैम सुरक्षा निर्णय',
      ticketSubChallengePrefix: 'चुनौती: ',
      ticketSubChallengeFrom: 'भेजने वाले: ',
      ticketStubVertical: 'निर्णय स्टब • ',
      ticketLossRetry: ' — अभ्यास दोहराएं',
      ticketLossZero: 'सिम्युलेटेड नुकसान: ₹0 — सभी 3 स्कैम जाल पहचाने!',
      ticketPlaybookTitle: '1930 गोल्डन-आवर सुरक्षा नियम:',
      ticketPlaybookSteps: '1. .apk दबाया हो तो एयरप्लेन मोड • 2. 1930 कॉल • 3. cybercrime.gov.in',
      ticketFooterTagline: '60 सेकंड में अपने परिवार की जांच करें',
      challengeFamilyBtn: 'परिवार को चुनौती दें →',
      openChallengeReportBtn: 'लाइव रिपोर्ट देखें →',
      replayDrillBtn: '60s ड्रिल दोबारा खेलें',

      xrayEyebrow: '02 · त्वरित लिंक और UPI X-RAY',
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
      xrayFailErr: 'इनपुट की जांच नहीं हो सकी। कृपया टेक्स्ट जांचें और पुनः प्रयास करें।',
      xrayNetErr: 'लिंक और UPI X-RAY चलाते समय नेटवर्क त्रुटि हुई।',
      xrayRiskScoreLbl: 'जोखिम स्कोर',
      xrayLatencyLbl: 'जांच गति',
      xrayHighlightTitle: 'खतरनाक शब्दों की पहचान',
      xrayUpiTitle: 'डिकोड किया गया UPI डेटा',
      xrayFindingsTitle: 'फॉरेंसिक निष्कर्ष',
      xrayRiskUnit: 'जोखिम',
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
      challengeRequiredErr: 'कृपया दोनों उपनाम दर्ज करें (प्रत्येक 1–40 अक्षर)।',
      challengeCreatorErr: 'कृपया अपना उपनाम दर्ज करें (1–40 अक्षर)।',
      challengeTargetErr: 'कृपया बताएं कि यह चुनौती किसके लिए है (1–40 अक्षर)।',
      challengeFailErr: 'चुनौती लिंक नहीं बन सका। कृपया पुनः प्रयास करें।',
      challengeNetErr: 'चुनौती बनाते समय नेटवर्क त्रुटि हुई।',
      challengeReadyTitle: 'चुनौती लिंक तैयार है',
      copyLinkBtn: 'लिंक कॉपी करें',
      copiedBtn: 'कॉपी हो गया!',
      whatsappBtn: 'WHATSAPP पर भेजें',
      openLiveReportBtn: 'लाइव रिपोर्ट खोलें →',
      testChallengeNowBtn: 'अभी लिंक टेस्ट करें',
      recentChallengesTitle: 'हाल ही में भेजी गई चुनौतियाँ',
      recentReportBtn: 'लाइव रिपोर्ट खोलें',

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

      cohortEyebrow: 'सामुदायिक बेंचमार्क • लाइव + बेसलाइन',
      cohortTitle: 'सार्वजनिक स्कैम बेंचमार्क',
      cohortDrillsLbl: 'पूर्ण अभ्यास',
      cohortPassLbl: 'सफलता दर',
      cohortScansLbl: 'कुल X-RAY',
      cohortTopMissedLbl: 'सबसे कठिन जाल',
      playbookEyebrow: '1930 गोल्डन-आवर आपातकालीन गाइड',
      playbookHint: 'यह 3-कदम सुरक्षा योजना याद रखें'
    }
  };

  const XRAY_VERDICT_LABELS = {
    high: { en: 'HIGH RISK — LIKELY SCAM TRAP', hi: 'उच्च जोखिम — संभावित स्कैम जाल' },
    medium: { en: 'CAUTION — SUSPICIOUS SIGNALS', hi: 'सावधान — संदिग्ध संकेत' },
    low: { en: 'LOW RISK — NO KNOWN TRAP TOKENS', hi: 'कम जोखिम — कोई ज्ञात जाल पैटर्न नहीं' }
  };

  const XRAY_RULE_I18N = {
    punycode_homoglyph: {
      en: {
        title: 'Punycode / Lookalike Homoglyph Domain',
        detail:
          'Detected an internationalized Punycode (xn--) domain or mixed Cyrillic/Greek lookalike characters used to impersonate trusted sites.'
      },
      hi: {
        title: 'Punycode / हमशक्ल (Homoglyph) नकली डोमेन',
        detail:
          'असली वेबसाइट की नकल करने के लिए Punycode (xn--) डोमेन या मिलते-जुलते विदेशी अक्षरों (Cyrillic/Greek) का उपयोग पाया गया।'
      }
    },
    double_extension_apk: {
      en: {
        title: 'Disguised Double-Extension / Executable Lure',
        detail:
          'Found an executable (.apk/.exe/.bat) or double-extension file disguised as a document. Installing unknown APKs can steal SMS OTPs and device control.'
      },
      hi: {
        title: 'दस्तावेज़ के रूप में छिपी .apk / खतरनाक फाइल',
        detail:
          'दस्तावेज़ (.pdf/.jpg) के नाम के पीछे छिपी .apk/.exe इंस्टॉलर फाइल मिली। अनजान APK इंस्टॉल करने से SMS OTP और फोन का नियंत्रण चोरी हो सकता है।'
      }
    },
    url_deception: {
      en: {
        title: 'Deceptive or Masked URL Pattern',
        detail:
          'Detected URL credential masking (@), a raw IPv4 host, a shortened link, or a high-risk disposable TLD (.xyz/.top/.click) with lure keywords.'
      },
      hi: {
        title: 'भ्रामक या छिपा हुआ URL पैटर्न',
        detail:
          'लिंक में "@" द्वारा असली वेबसाइट छिपाने, सीधे IP पते, शॉर्ट लिंक, या संदिग्ध डिस्पोज़ेबल TLD (.xyz/.top/.click) के साथ झांसे वाले शब्दों का उपयोग पाया गया।'
      }
    },
    upi_collect_trap: {
      en: {
        title: 'UPI Collect / PIN-to-Receive Trap',
        detail:
          'Detected a UPI debit/collect pattern paired with refund, prize, or PIN claims. Entering a UPI PIN only sends money out and never credits money.'
      },
      hi: {
        title: 'UPI कलेक्ट / पिन से पैसे पाने का जाल',
        detail:
          'रिफंड, इनाम या कैशबैक के नाम पर UPI भुगतान/कलेक्ट जाल पाया गया। UPI PIN डालने से पैसा हमेशा बाहर जाता है, कभी खाते में आता नहीं।'
      }
    },
    social_engineering_pressure: {
      en: {
        title: 'High-Pressure / Authority Manipulation Language',
        detail:
          'Found panic, isolation, fake legal/KYC suspension, or urgency phrases engineered to force action before verifying.'
      },
      hi: {
        title: 'डराने, जल्दबाज़ी या नकली कानूनी दबाव की भाषा',
        detail:
          'बिना सोचे-समझे तुरंत कार्रवाई कराने के लिए डर, अकेले रहने, बिजली कटने, KYC बंद होने या गिरफ्तारी जैसी दबाव वाली भाषा मिली।'
      }
    }
  };

  const MISSED_FLAG_LABELS = {
    'digital-arrest-compliance': {
      en: 'Stayed on fake Digital Arrest call instead of hanging up',
      hi: 'फर्जी डिजिटल अरेस्ट कॉल पर बने रहे (कॉल नहीं काटी)'
    },
    'digital-arrest-timeout': {
      en: 'Timed out under Digital Arrest panic pressure',
      hi: 'डिजिटल अरेस्ट के दबाव में समय समाप्त हो गया'
    },
    'apk-disguised-extension': {
      en: 'Tapped disguised .pdf.apk utility bill installer',
      hi: 'नकली .pdf.apk बिजली बिल ऐप इंस्टॉल करने के लिए टैप किया'
    },
    'apk-disguised-timeout': {
      en: 'Timed out on disguised .pdf.apk chat lure',
      hi: 'नकली .pdf.apk चैट जाल में समय समाप्त हो गया'
    },
    'upi-pin-collect-trap': {
      en: 'Approved UPI collect request thinking PIN receives cashback',
      hi: 'कैशबैक पाने के लिए UPI PIN कलेक्ट रिक्वेस्ट मंज़ूर कर दी'
    },
    'upi-collect-timeout': {
      en: 'Timed out on UPI cashback collect trap',
      hi: 'UPI कैशबैक कलेक्ट जाल में समय समाप्त हो गया'
    }
  };

  function localizeXrayVerdict(res, lang) {
    const level = res && res.verdictLevel ? res.verdictLevel : 'low';
    const pack = XRAY_VERDICT_LABELS[level];
    if (pack) return pack[lang] || pack.en;
    return (res && res.verdict) || '';
  }

  function localizeXrayFinding(f, lang) {
    const entry = f && f.ruleId ? XRAY_RULE_I18N[f.ruleId] : null;
    if (entry) {
      const langPack = entry[lang] || entry.en;
      return { title: langPack.title, detail: langPack.detail };
    }
    return { title: (f && f.title) || '', detail: (f && f.detail) || '' };
  }

  function localizeUpiWarning(upiDecoded, lang) {
    if (!upiDecoded) return '';
    if (lang !== 'hi') return upiDecoded.warning || '';
    const rawWarn = String(upiDecoded.warning || '');
    const am = upiDecoded.am;
    if (rawWarn.startsWith('Collect-Trap Alert:') && am) {
      return `कलेक्ट-जाल चेतावनी: यह लिंक कैशबैक/रिफंड/इनाम का झांसा देकर आपके खाते से ₹${am} काटने की कोशिश कर रहा है। UPI PIN डालने से पैसा हमेशा बाहर जाता है, कभी अंदर नहीं आता।`;
    }
    if (rawWarn.startsWith('Debit Alert:') && am) {
      return `डेबिट चेतावनी: इस UPI लिंक को मंज़ूर करके UPI PIN डालने पर आपके खाते से ₹${am} कट जाएंगे। पैसे प्राप्त करने के लिए कभी भी UPI PIN नहीं डालना होता।`;
    }
    return 'सुनहरा नियम: UPI PIN डालने से पैसा हमेशा आपके खाते से बाहर जाता है, कभी अंदर नहीं आता।';
  }

  function formatMissedFlag(flag, lang) {
    if (!flag) return '';
    const entry = MISSED_FLAG_LABELS[flag];
    if (entry) return entry[lang] || entry.en;
    return flag;
  }

  global.BaitCheckI18n = {
    I18N,
    XRAY_VERDICT_LABELS,
    XRAY_RULE_I18N,
    MISSED_FLAG_LABELS,
    localizeXrayVerdict,
    localizeXrayFinding,
    localizeUpiWarning,
    formatMissedFlag
  };
})(window);
