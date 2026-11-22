'use strict';

(function (global) {
  const I18N = {
    en: {
      safetyRibbon: 'TRAINING SIMULATION • NO REAL PAYMENTS, OTPs OR DOWNLOADS',
      soundOn: 'SOUND: ON',
      soundOff: 'SOUND: OFF',
      incomingSimulated: 'SIMULATED TRAINING CALL',
      simulationBadge: 'SIMULATION',
      exampleMessage: 'EXAMPLE MESSAGE',
      upiCollectLabel: 'PAYMENT REQUEST',
      textSizeLarge: 'Use larger text',
      textSizeStandard: 'Use standard text',
      tabDrill: 'PRACTICE',
      tabXray: 'CHECK A MESSAGE',
      tabChallenge: 'FAMILY PRACTICE',
      footerDisclaimer:
        'BaitCheck teaches scam safety with fictional examples. It never asks for money, PINs, passwords or one-time codes, and never downloads files.',

      loadingTitle: 'Getting practice ready…',
      loadingBody: 'Loading examples.',
      loadErrorTitle: 'Practice did not load',
      loadErrorBody: 'Check your connection and try again.',
      retryBtn: 'Try again',

      heroEyebrow: 'SAFE PRACTICE FOR EVERY AGE',
      heroCallerSub: 'A safe practice call • no real person is calling',
      heroHeadlinePre: 'Learn to spot scams ',
      heroHeadlineMark: 'one step at a time',
      heroValueProp: 'Choose what you would do in a short example. Then see the warning signs and the safer next step.',
      statTrapsVal: '3 short stories',
      statTrapsLbl: 'practice situations',
      statClockVal: 'About 1 min',
      statClockLbl: 'you can take your time',
      statLangVal: 'EN / हिंदी',
      statLangLbl: 'large text available',
      heroPreviewEyebrow: 'HOW IT WORKS',
      heroPreviewTitle: 'Safe, calm practice in 3 quick steps',
      heroPreviewStep1Title: 'See a real-world trap',
      heroPreviewStep1Desc: 'Fake calls, disguised bills & payment links.',
      heroPreviewStep2Title: 'Pick your response',
      heroPreviewStep2Desc: 'No real money, OTPs, or downloads.',
      heroPreviewStep3Title: 'Spot the warning signs',
      heroPreviewStep3Desc: 'Learn the safer move to share with family.',
      answerCta: 'Start practice',
      timedPracticeCta: 'Try a timed round',
      timedPracticeDisclosure: 'Want an extra challenge?',
      timedModeLabel: 'TIMED CHALLENGE',
      calmModeLabel: 'TAKE YOUR TIME',
      calmModeNote: 'No timer. Read the situation and choose when you are ready.',
      secondsLabel: 'seconds',
      callClueTitle: 'Two clues in the caller’s words',
      callClueIsolation: '“Stay alone” stops you from checking with family.',
      callCluePayment: '“Pay a deposit now” pressures you to send money immediately.',
      fileAnatomyTitle: 'Look at the end of the file name',
      fileBaseLabel: 'File name',
      fileDisguiseLabel: 'Looks like a PDF',
      fileInstallerLabel: 'An app installer',
      fileAnatomyNote: 'The last part, .apk, tells you this is an app file, not a bill.',
      upiSendTitle: 'Enter a UPI PIN',
      upiSendBody: 'Money leaves your account.',
      upiReceiveTitle: 'Receive money',
      upiReceiveBody: 'You do not need a UPI PIN.',
      upiWhoGetsPaid: 'Who would receive the payment',
      upiPayeeName: 'Name shown in the request',
      upiAmountLeaving: 'Amount requested',
      upiPaymentNote: 'Message in the request',
      upiWarningLabel: 'Remember',
      learnMoreToggle: 'PRACTICE MORE SCAMS • NO TIMER',
      learnMoreIntro: 'Take your time. Read each short story, choose what feels safest, and see the clue and next step. No score is saved.',
      learnQuestion: 'What would you do?',
      learnSafeTitle: 'Good choice',
      learnTryAgainTitle: 'That choice could put you at risk',
      learnNextStep: 'A safer next step',
      learnRetry: 'TRY AGAIN',
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
      timeoutTitle: 'The timer ended. Scams use pressure to rush you.',
      nextDrillBtn: 'NEXT DRILL →',
      viewVerdictBtn: 'VIEW VERDICT TICKET →',
      savingResult: 'Saving drill telemetry to challenge report…',
      savedResult: 'Saved to live family readiness report.',
      saveResultErr: 'Could not sync result to report (local score still shown).',
      reactionLabel: 'You chose in',

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
      ticketRibbon: 'SIMULATION • EDUCATIONAL SCAM DRILL - NO REAL DATA OR OTPs',
      ticketSerialPrefix: 'NO. ',
      ticketSubDefault: '60-SECOND FAMILY SCAM SURVIVAL VERDICT',
      ticketSubChallengePrefix: 'CHALLENGE FOR ',
      ticketSubChallengeFrom: 'FROM ',
      ticketStubVertical: 'VERDICT STUB • ',
      ticketLossRetry: ' - RETRY TO SHARPEN REFLEX',
      ticketLossZero: 'SIMULATED LOSS: ₹0 - ALL 3 SCAM TRAPS SPOTTED!',
      ticketPlaybookTitle: '1930 GOLDEN-HOUR RULE:',
      ticketPlaybookSteps: '1. Airplane Mode if .apk tapped  •  2. Call 1930  •  3. Report at cybercrime.gov.in',
      ticketFooterTagline: 'SHARE YOUR SCORE. PRACTICE TOGETHER.',
      challengeFamilyBtn: 'CHALLENGE FAMILY →',
      openChallengeReportBtn: 'OPEN LIVE REPORT →',
      replayDrillBtn: 'REPLAY 60s DRILL',

      xrayEyebrow: 'CHECK A MESSAGE',
      xrayTitle: 'Why might this message be risky?',
      xraySub:
        'Paste a message or link to check for warning signs. We explain what we find. Never paste passwords, OTPs or bank details; the message text is not saved.',
      xrayPresetsLbl: 'TRY A SAMPLE',
      xrayInputLbl: 'MESSAGE OR LINK TO CHECK',
      xrayPlaceholder: 'Paste a suspicious message or link',
      xrayClearBtn: 'CLEAR',
      xrayAnalyzeBtn: 'CHECK FOR WARNING SIGNS',
      xrayScanningBtn: 'ANALYZING…',
      xrayEmptyErr: 'Please paste a message, URL, or UPI string (or tap a preset above).',
      xrayFailErr: 'Could not analyze input. Please verify your text and try again.',
      xrayNetErr: 'Network error while running Link & UPI X-Ray.',
      xrayRiskScoreLbl: 'WARNING LEVEL',
      xrayCaveat: 'This checker looks for known patterns. A low score does not prove a message is safe. Verify through an official app or a number you already trust.',
      xrayLatencyLbl: 'CHECK SPEED',
      xrayHighlightTitle: 'MESSAGE CLUES',
      xrayUpiTitle: 'PAYMENT DETAILS IN THIS LINK',
      xrayFindingsTitle: 'WHY TO BE CAREFUL',
      xrayRiskUnit: 'WARNING SIGN',
      xraySafeTitle: 'NO KNOWN WARNING SIGNS FOUND',
      xraySafeBody:
        'No known warning pattern was detected. This checker cannot prove a message or link is safe. Verify it through the organisation’s official app or a phone number you already trust.',

      challengeEyebrow: '03 · FAMILY & FRIEND READINESS',
      challengeTitle: 'SEND A 60s CHALLENGE LINK',
      challengeSub:
        'Generate a personal challenge link for your parents, siblings, or friends. Watch their live scores update as they complete each drill.',
      privacyNote:
        'Only nicknames are saved for this challenge. Do not use full names or sensitive details. We never ask for phone numbers, email, or bank information.',
      creatorLbl: 'YOUR NICKNAME (MAX 40)',
      creatorPlaceholder: 'e.g. Aarav / Priya',
      targetLbl: 'WHO IS TAKING THIS? (MAX 40)',
      targetPlaceholder: 'e.g. Mom / Dad / Hostel Room 204',
      targetPresetsLbl: 'Choose a family member or friend',
      targetPresetMom: 'Mom',
      targetPresetDad: 'Dad',
      targetPresetGrandparent: 'Grandparent',
      targetPresetSibling: 'Sibling',
      targetPresetFriend: 'Friend',
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
      reportCoachTitle: 'A helpful next step',
      reportCoachCall: 'End the call and contact the organisation using a number you already trust. No official can demand money on a video call.',
      reportCoachFile: 'Do not install files sent in a message. Check the file ending first. A bill should not ask you to install an app.',
      reportCoachUpi: 'A UPI PIN sends money. Never enter it to receive a refund, prize, or cashback.',
      reportCoachPrefix: 'Try saying to',
      reportRefreshBtn: 'REFRESH REPORT',
      reportCopyBtn: 'COPY CHALLENGE LINK',
      reportRunBtn: 'RUN THIS CHALLENGE',
      reportBackBtn: 'BACK TO 60s DRILL',

      cohortEyebrow: 'Practice activity',
      cohortDisclosure: 'Counts combine a sample baseline with activity recorded by this app.',
      cohortTitle: 'Practice activity',
      cohortDrillsLbl: 'DRILLS COMPLETED',
      cohortPassLbl: 'PASS RATE',
      cohortScansLbl: 'X-RAYS RUN',
      cohortTopMissedLbl: 'TOP MISSED TRAP',
      playbookEyebrow: 'WHAT TO DO NEXT',
      playbookHint: 'KEEP THESE STEPS HANDY',

      simHubEyebrow: 'More practice',
      simHubTitle: 'What would you do?',
      simHubSub: 'Choose a situation, decide what you would do, and learn a safer next step.',
      simFilterAll: 'All situations',
      simFilterCalls: 'Calls',
      simFilterMessages: 'Messages',
      simFilterPayments: 'Payments',
      simFilterJobs: 'Jobs and parcels',
      simLaunchBtn: 'Start practice',
      simBackBtn: 'Back to practice',
      simStepPrefix: 'Step',
      simStepsPlural: 'steps',
      simStepSingular: 'step',
      simTypicalLossLbl: 'Typical reported loss:',
      simHearCallerBtn: 'Hear this message',
      simOfficerBriefingLink: 'Hear an Indian cybercrime officer',
      simOfficialSourceLink: 'Read the official advisory',
      simFictionNotice: 'Training scene. The caller and police station are fictional. This is not real police footage.',
      simBrowseTopics: 'Browse by topic',
      simShowAll: 'See all practice examples',
      simShowFewer: 'Show fewer examples',
      simInspectCluesBtn: 'Show warning signs',
      simHideCluesBtn: 'Hide warning signs',
      simCluesTitle: 'Warning signs',
      simQuestionPrompt: 'What would you do next?',
      simScammerSaysLbl: 'Example of what the caller says or sends',
      simSafeOutcomeTitle: 'Safe choice',
      simEscalateOutcomeTitle: 'The scammer may escalate',
      simLossOutcomeTitle: 'This choice could cost money',
      simTacticLbl: 'What the scammer is doing:',
      simSaferMoveLbl: 'A safer move:',
      simTryOtherChoiceBtn: 'Try another answer',
      simNextStepBtn: 'Continue',
      simFinishBtn: 'See the key lessons',
      simAnatomyEyebrow: 'PRACTICE COMPLETE',
      simHowWorksTitle: 'How this scam works',
      simNeverIgnoreTitle: 'Warning signs to remember',
      simActionPlanTitle: 'If this happens to you',
      simYourPathTitle: 'Your choices',
      simCheckXrayBtn: 'Check a message',
      simReplayBtn: 'Practice again',
      audienceDisclosure: 'Guides for families and older adults',
      audienceAllBtn: 'All examples',
      audienceParentBtn: 'Practice with a child',
      audienceElderBtn: 'Simple guide for older adults',
      lessonPrefix: 'LESSON',

      parentGuideTitle: 'PARENTAL GUIDE: TEACH KIDS ABOUT AI & UPI SCAMS',
      parentGuideSub:
        'Just like road safety, kids and teens need scam safety education before they use UPI or social media. Practice these real AI-scam situations together aloud.',
      parentRuleTitle: '3 FAMILY RULES TO TEACH YOUR CHILD TODAY',
      parentRule1: '1. "Your Dad told me to send ₹1,00,000" is a trap — even if the voice sounds like Mom or Dad, ALWAYS call your parent directly on their saved number first.',
      parentRule2: '2. UPI PIN = Money Leaving — never enter a UPI PIN or scan a QR to get game coins, scholarships, or cash prizes.',
      parentRule3: '3. No-Blame Promise — if someone threatens you or asks to keep a secret on a video call, tell Mom/Dad immediately. You will never be scolded.',
      parentQuizTitle: 'TRY THIS WITH YOUR CHILD RIGHT NOW',
      parentSimTitle: 'SIMULATIONS TO PRACTICE TOGETHER',

      elderGuideTitle: 'ELDER-SAFE GUIDE: CALM, SIMPLE & LARGE PRINT',
      elderGuideSub:
        'Take your time. Real government offices, banks, and police NEVER rush you on a phone or video call.',
      elderRule1: '1. Real Police Never Arrest on Video Call — "Digital Arrest" and "Cyber Lock" do not exist. Just hang up.',
      elderRule2: '2. Never Tap .apk Files in Messages — an electricity or bank bill will never ask you to install an app file.',
      elderRule3: '3. Never Share Your PIN to Receive Money — a UPI PIN only sends money out of your account.',
      elderSimTitle: 'MOST IMPORTANT SCAMS TO PRACTICE FIRST'
    },
    hi: {
      safetyRibbon: 'अभ्यास सिम्युलेशन • असली भुगतान, OTP या डाउनलोड नहीं',
      soundOn: 'आवाज़: चालू',
      soundOff: 'आवाज़: बंद',
      incomingSimulated: 'अभ्यास कॉल • असली नहीं',
      simulationBadge: 'सिम्युलेशन',
      exampleMessage: 'उदाहरण संदेश',
      upiCollectLabel: 'भुगतान अनुरोध',
      textSizeLarge: 'बड़ा टेक्स्ट करें',
      textSizeStandard: 'सामान्य टेक्स्ट करें',
      tabDrill: 'अभ्यास',
      tabXray: 'संदेश जाँचें',
      tabChallenge: 'परिवार के साथ अभ्यास',
      footerDisclaimer:
        'BaitCheck काल्पनिक उदाहरणों से ठगी से बचना सिखाता है। यह पैसे, PIN, पासवर्ड या OTP नहीं माँगता और कोई फ़ाइल डाउनलोड नहीं करता।',

      loadingTitle: 'स्कैम ड्रिल लोड हो रही है…',
      loadingBody: 'द्विभाषी अभ्यास और जांच प्रीसेट सर्वर से लोड हो रहे हैं।',
      loadErrorTitle: 'ड्रिल लोड नहीं हो सकी',
      loadErrorBody: 'कृपया इंटरनेट जांचें और पुनः प्रयास करें।',
      retryBtn: 'पुनः प्रयास करें',

      heroEyebrow: 'हर उम्र के लिए सुरक्षित अभ्यास',
      heroCallerSub: 'सुरक्षित अभ्यास कॉल • कोई असली व्यक्ति कॉल नहीं कर रहा',
      heroHeadlinePre: 'ठगी पहचानना सीखें ',
      heroHeadlineMark: 'एक-एक कदम से',
      heroValueProp: 'छोटे उदाहरण में अपना जवाब चुनें। फिर चेतावनी के संकेत और सुरक्षित अगला कदम जानें।',
      statTrapsVal: '3 छोटी कहानियाँ',
      statTrapsLbl: 'अभ्यास के हालात',
      statClockVal: 'लगभग 1 मिनट',
      statClockLbl: 'धीरे-धीरे करें',
      statLangVal: 'EN / हिंदी',
      statLangLbl: 'बड़ा टेक्स्ट उपलब्ध',
      heroPreviewEyebrow: 'यह कैसे काम करता है',
      heroPreviewTitle: '3 आसान कदमों में सुरक्षित अभ्यास',
      heroPreviewStep1Title: 'असली जैसा उदाहरण देखें',
      heroPreviewStep1Desc: 'नकली कॉल, बिल संदेश और पेमेंट लिंक।',
      heroPreviewStep2Title: 'अपना जवाब चुनें',
      heroPreviewStep2Desc: 'कोई असली पैसा, OTP या डाउनलोड नहीं।',
      heroPreviewStep3Title: 'चेतावनी के संकेत समझें',
      heroPreviewStep3Desc: 'परिवार के साथ सुरक्षित कदम साझा करें।',
      answerCta: 'अभ्यास कॉल शुरू करें',
      timedPracticeCta: '15 सेकंड की चुनौती आज़माएँ',
      timedPracticeDisclosure: 'समय वाली चुनौती आज़माएँ?',
      timedModeLabel: 'समय वाला अभ्यास',
      calmModeLabel: 'आराम से करें',
      calmModeNote: 'कोई टाइमर नहीं। स्थिति पढ़ें और तैयार होने पर जवाब चुनें।',
      secondsLabel: 'सेकंड में',
      callClueTitle: 'कॉल की बातों में दो संकेत',
      callClueIsolation: 'अकेले रहने को कहना आपको परिवार से जाँचने से रोकता है।',
      callCluePayment: 'अभी पैसे जमा करने को कहना जल्दबाज़ी का दबाव है।',
      fileAnatomyTitle: 'फ़ाइल के नाम का आखिरी हिस्सा देखें',
      fileBaseLabel: 'फ़ाइल का नाम',
      fileDisguiseLabel: '.pdf जैसा दिखता है',
      fileInstallerLabel: 'ऐप इंस्टॉलर',
      fileAnatomyNote: '.apk बताता है कि यह ऐप फ़ाइल है, बिजली का बिल नहीं।',
      upiSendTitle: 'UPI PIN डालें',
      upiSendBody: 'आपके खाते से पैसे जाएंगे।',
      upiReceiveTitle: 'पैसे पाएं',
      upiReceiveBody: 'UPI PIN की जरूरत नहीं।',
      upiWhoGetsPaid: 'पैसे किसे जाएंगे',
      upiPayeeName: 'अनुरोध में दिखा नाम',
      upiAmountLeaving: 'मांगी गई रकम',
      upiPaymentNote: 'भुगतान के साथ संदेश',
      upiWarningLabel: 'ध्यान रखें',
      learnMoreToggle: 'और ठगी के उदाहरण • बिना टाइमर',
      learnMoreIntro: 'आराम से करें। हर छोटी कहानी पढ़ें, सुरक्षित जवाब चुनें और संकेत व अगला कदम जानें। कोई स्कोर सेव नहीं होता।',
      learnQuestion: 'आप क्या करेंगे?',
      learnSafeTitle: 'सही और सुरक्षित जवाब',
      learnTryAgainTitle: 'इस जवाब से खतरा हो सकता है',
      learnNextStep: 'सुरक्षित अगला कदम',
      learnRetry: 'फिर से कोशिश करें',
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
        'सिम्युलेशन सुरक्षित: कोई फाइल डाउनलोड नहीं हुई! ध्यान दें-.pdf के बाद छिपा .apk एक Android ऐप इंस्टॉलर है।',
      upiCollectHeader: 'पेसिम वॉलेट कलेक्ट (डेमो)',
      upiCollectSub: 'सिम्युलेटेड अनुरोध • कोई असली PIN पैड नहीं',
      timeoutTitle: 'समय समाप्त - आप घबराहट के जाल में फंस गए',
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
      ticketRibbon: 'सिम्युलेशन • शैक्षणिक स्कैम अभ्यास - कोई असली डेटा या OTP नहीं',
      ticketSerialPrefix: 'क्र. ',
      ticketSubDefault: '60-सेकंड पारिवारिक स्कैम सुरक्षा निर्णय',
      ticketSubChallengePrefix: 'चुनौती: ',
      ticketSubChallengeFrom: 'भेजने वाले: ',
      ticketStubVertical: 'निर्णय स्टब • ',
      ticketLossRetry: ' - अभ्यास दोहराएं',
      ticketLossZero: 'सिम्युलेटेड नुकसान: ₹0 - सभी 3 स्कैम जाल पहचाने!',
      ticketPlaybookTitle: '1930 गोल्डन-आवर सुरक्षा नियम:',
      ticketPlaybookSteps: '1. .apk दबाया हो तो एयरप्लेन मोड • 2. 1930 कॉल • 3. cybercrime.gov.in',
      ticketFooterTagline: 'अपना स्कोर साझा करें, साथ अभ्यास करें',
      challengeFamilyBtn: 'परिवार को चुनौती दें →',
      openChallengeReportBtn: 'लाइव रिपोर्ट देखें →',
      replayDrillBtn: '60s ड्रिल दोबारा खेलें',

      xrayEyebrow: 'संदेश की जाँच',
      xrayTitle: 'यह संदेश जोखिम भरा क्यों हो सकता है?',
      xraySub:
        'संदेश या लिंक को चेतावनी संकेतों के लिए जाँचें। हम बताएँगे कि क्या मिला। पासवर्ड, OTP या बैंक जानकारी न डालें; संदेश का टेक्स्ट सेव नहीं होता।',
      xrayPresetsLbl: 'उदाहरण देखें',
      xrayInputLbl: 'जाँचने के लिए संदेश या लिंक',
      xrayPlaceholder: 'संदिग्ध संदेश या लिंक पेस्ट करें',
      xrayClearBtn: 'साफ़ करें',
      xrayAnalyzeBtn: 'चेतावनी के संकेत जाँचें',
      xrayScanningBtn: 'जांच जारी है…',
      xrayEmptyErr: 'कृपया जांच के लिए कोई मैसेज, लिंक या ऊपर से एक सैंपल चुनें।',
      xrayFailErr: 'इनपुट की जांच नहीं हो सकी। कृपया टेक्स्ट जांचें और पुनः प्रयास करें।',
      xrayNetErr: 'लिंक और UPI X-RAY चलाते समय नेटवर्क त्रुटि हुई।',
      xrayRiskScoreLbl: 'चेतावनी का स्तर',
      xrayCaveat: 'यह जाँच जाने-पहचाने पैटर्न देखती है। कम स्कोर यह साबित नहीं करता कि संदेश सुरक्षित है। आधिकारिक ऐप या पहले से भरोसेमंद नंबर से पुष्टि करें।',
      xrayLatencyLbl: 'जांच गति',
      xrayHighlightTitle: 'संदेश के संकेत',
      xrayUpiTitle: 'लिंक में भुगतान का विवरण',
      xrayFindingsTitle: 'सावधान क्यों रहें',
      xrayRiskUnit: 'चेतावनी का संकेत',
      xraySafeTitle: 'कोई जाना-पहचाना चेतावनी संकेत नहीं मिला',
      xraySafeBody:
        'कोई जाना-पहचाना चेतावनी संकेत नहीं मिला। यह जाँच साबित नहीं कर सकती कि संदेश या लिंक सुरक्षित है। संस्था के आधिकारिक ऐप या पहले से भरोसेमंद नंबर से पुष्टि करें।',

      challengeEyebrow: '03 · परिवार व मित्र सुरक्षा परीक्षण',
      challengeTitle: '60s चुनौती लिंक भेजें',
      challengeSub:
        'माता-पिता, भाई-बहन या दोस्तों के लिए निजी चुनौती लिंक बनाएं और देखें कि वे किस जाल से बचते हैं।',
      privacyNote:
        'इस चुनौती के लिए केवल उपनाम सेव होता है। पूरा नाम या संवेदनशील जानकारी न लिखें। फोन नंबर, ईमेल या बैंक जानकारी नहीं माँगी जाती।',
      creatorLbl: 'आपका उपनाम (अधिकतम 40)',
      creatorPlaceholder: 'जैसे: आरव / प्रिया',
      targetLbl: 'यह टेस्ट किसके लिए है? (अधिकतम 40)',
      targetPresetsLbl: '\u092a\u0930\u093f\u0935\u093e\u0930 \u092f\u093e \u0926\u094b\u0938\u094d\u0924 \u091a\u0941\u0928\u0947\u0902',
      targetPresetMom: '\u092e\u093e\u0901',
      targetPresetDad: '\u092a\u093f\u0924\u093e',
      targetPresetGrandparent: '\u0926\u093e\u0926\u093e-\u0926\u093e\u0926\u0940',
      targetPresetSibling: '\u092d\u093e\u0908 \u092f\u093e \u092c\u0939\u0928',
      targetPresetFriend: '\u0926\u094b\u0938\u094d\u0924',
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
      reportCoachTitle: '\u0905\u092c \u0915\u094d\u092f\u093e \u0938\u092e\u091d\u093e\u090f\u0901',
      reportCoachCall: '\u0915\u0949\u0932 \u0915\u093e\u091f\u0947\u0902 \u0914\u0930 \u0938\u0902\u0938\u094d\u0925\u093e \u0938\u0947 \u092a\u0939\u0932\u0947 \u0938\u0947 \u092d\u0930\u094b\u0938\u0947\u092e\u0902\u0926 \u0928\u0902\u092c\u0930 \u092a\u0930 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964 \u0915\u094b\u0908 \u0905\u0927\u093f\u0915\u093e\u0930\u0940 \u0935\u0940\u0921\u093f\u092f\u094b \u0915\u0949\u0932 \u092a\u0930 \u092a\u0948\u0938\u0947 \u0928\u0939\u0940\u0902 \u092e\u093e\u0902\u0917\u0924\u093e\u0964',
      reportCoachFile: '\u0938\u0902\u0926\u0947\u0936 \u092e\u0947\u0902 \u0906\u0908 \u092b\u093c\u093e\u0907\u0932 \u0907\u0902\u0938\u094d\u091f\u0949\u0932 \u0928 \u0915\u0930\u0947\u0902\u0964 \u092a\u0939\u0932\u0947 \u092b\u093c\u093e\u0907\u0932 \u0915\u093e \u0906\u0916\u093f\u0930\u0940 \u0939\u093f\u0938\u094d\u0938\u093e \u0926\u0947\u0916\u0947\u0902\u0964 \u092c\u093f\u0932 \u0916\u094b\u0932\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u0910\u092a \u0907\u0902\u0938\u094d\u091f\u0949\u0932 \u0928\u0939\u0940\u0902 \u0915\u0930\u0928\u093e \u091a\u093e\u0939\u093f\u090f\u0964',
      reportCoachUpi: 'UPI PIN \u0921\u093e\u0932\u0928\u0947 \u0938\u0947 \u092a\u0948\u0938\u0947 \u091c\u093e\u0924\u0947 \u0939\u0948\u0902\u0964 \u0930\u093f\u092b\u0902\u0921, \u0907\u0928\u093e\u092e \u092f\u093e \u0915\u0948\u0936\u092c\u0948\u0915 \u092a\u093e\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f PIN \u0915\u092d\u0940 \u0928 \u0921\u093e\u0932\u0947\u0902\u0964',
      reportCoachPrefix: '\u0907\u0928\u094d\u0939\u0947\u0902 \u092f\u0939 \u0938\u092e\u091d\u093e\u090f\u0902:',
      reportRefreshBtn: 'रिपोर्ट रिफ्रेश करें',
      reportCopyBtn: 'चुनौती लिंक कॉपी करें',
      reportRunBtn: 'यह चुनौती खुद चलाएं',
      reportBackBtn: '60s ड्रिल पर वापस जाएं',

      cohortEyebrow: 'उदाहरण आँकड़े + ऐप गतिविधि',
      cohortDisclosure: 'गिनती में नमूना आधार और इस ऐप में दर्ज गतिविधि शामिल है।',
      cohortTitle: 'ठगी सुरक्षा अभ्यास आँकड़े',
      cohortDrillsLbl: 'पूर्ण अभ्यास',
      cohortPassLbl: 'सफलता दर',
      cohortScansLbl: 'कुल X-RAY',
      cohortTopMissedLbl: 'सबसे कठिन जाल',
      playbookEyebrow: 'अब क्या करें',
      playbookHint: 'इन आसान कदमों को याद रखें',

      simHubEyebrow: 'ठगी से बचने का अभ्यास',
      simHubTitle: 'आप क्या करेंगे?',
      simHubSub: 'एक स्थिति चुनें। पढ़ें, अपना जवाब चुनें और फिर सुरक्षित कदम देखें।',
      simFilterAll: 'सभी स्थितियाँ',
      simFilterCalls: 'कॉल',
      simFilterMessages: 'मैसेज',
      simFilterPayments: 'भुगतान',
      simFilterJobs: 'नौकरी और पार्सल',
      simLaunchBtn: 'अभ्यास शुरू करें',
      simBackBtn: 'अभ्यास पर वापस जाएँ',
      simStepPrefix: 'चरण',
      simStepsPlural: 'चरण',
      simStepSingular: 'चरण',
      simTypicalLossLbl: 'आम तौर पर दर्ज नुकसान:',
      simOfficerBriefingLink: 'भारतीय साइबर अधिकारी का वीडियो देखें',
      simOfficialSourceLink: 'सरकारी सलाह पढ़ें',
      simFictionNotice: 'अभ्यास का दृश्य। कॉलर और पुलिस स्टेशन काल्पनिक हैं। यह असली पुलिस का वीडियो नहीं है।',
      simBrowseTopics: 'विषय चुनें',
      simShowAll: 'सभी अभ्यास देखें',
      simShowFewer: 'कम उदाहरण दिखाएँ',
      simInspectCluesBtn: 'चेतावनी के संकेत दिखाएँ',
      simHideCluesBtn: 'चेतावनी के संकेत छिपाएँ',
      simCluesTitle: 'चेतावनी के संकेत',
      simQuestionPrompt: 'अब आप क्या करेंगे?',
      simScammerSaysLbl: 'कॉलर क्या कह सकता है या भेज सकता है',
      simSafeOutcomeTitle: 'सुरक्षित जवाब',
      simEscalateOutcomeTitle: 'ठग दबाव बढ़ा सकता है',
      simLossOutcomeTitle: 'इस जवाब से पैसे जा सकते हैं',
      simTacticLbl: 'ठग की चाल:',
      simSaferMoveLbl: 'सुरक्षित कदम:',
      simTryOtherChoiceBtn: 'दूसरा जवाब आज़माएँ',
      simNextStepBtn: 'आगे बढ़ें',
      simFinishBtn: 'मुख्य बातें देखें',
      simAnatomyEyebrow: 'अभ्यास पूरा हुआ',
      simHowWorksTitle: 'यह ठगी कैसे होती है',
      simNeverIgnoreTitle: 'याद रखने वाले संकेत',
      simActionPlanTitle: 'अगर आपके साथ ऐसा हो',
      simYourPathTitle: 'आपके जवाब',
      simCheckXrayBtn: 'मैसेज जाँचें',
      simReplayBtn: 'फिर से अभ्यास करें',
      audienceDisclosure: 'परिवार और वरिष्ठ लोगों के लिए गाइड',
      audienceAllBtn: 'सभी उदाहरण',
      audienceParentBtn: 'बच्चे के साथ अभ्यास',
      audienceElderBtn: 'वरिष्ठ लोगों के लिए आसान गाइड',
      lessonPrefix: 'पाठ',

      elderGuideTitle: 'वरिष्ठ नागरिक सुरक्षा गाइड: आसान, स्पष्ट और बड़े अक्षरों में',
      elderGuideSub:
        'आराम से पढ़ें। असली बैंक, बिजली विभाग या पुलिस कभी फोन या वीडियो कॉल पर जल्दबाज़ी नहीं करते।',
      elderRule1: '1. असली पुलिस वीडियो कॉल पर गिरफ्तारी नहीं करती — "डिजिटल अरेस्ट" या "साइबर लॉक" झूठ है। तुरंत कॉल काटें।',
      elderRule2: '2. मैसेज में आई .apk फाइल न खोलें — बिजली बिल या बैंक अपडेट के लिए कभी चैट से ऐप इंस्टॉल नहीं करना होता।',
      elderRule3: '3. पैसे पाने के लिए कभी PIN न डालें — UPI PIN से हमेशा पैसे खाते से बाहर जाते हैं।',
      elderSimTitle: 'सबसे पहले इन ज़रूरी ठगियों का अभ्यास करें'
    }
  };

  const XRAY_VERDICT_LABELS = {
    high: { en: 'A scam is likely', hi: 'संभावित स्कैम' },
    medium: { en: 'Check this carefully', hi: 'ध्यान से जाँचें' },
    low: { en: 'No known warning signs found', hi: 'कोई जाना-पहचाना चेतावनी संकेत नहीं मिला' }
  };

  const XRAY_RULE_I18N = {
    punycode_homoglyph: {
      en: {
        title: 'Lookalike web address',
        detail:
          'This address imitates a trusted website using a lookalike name or characters.'
      },
      hi: {
        title: 'Punycode / हमशक्ल (Homoglyph) नकली डोमेन',
        detail:
          'असली वेबसाइट की नकल करने के लिए Punycode (xn--) डोमेन या मिलते-जुलते विदेशी अक्षरों (Cyrillic/Greek) का उपयोग पाया गया।'
      }
    },
    double_extension_apk: {
      en: {
        title: 'App file disguised as a document',
        detail:
          'The file name ends in .apk, which is an app installer, not a bill or PDF. Do not install it.'
      },
      hi: {
        title: 'दस्तावेज़ के रूप में छिपी .apk / खतरनाक फाइल',
        detail:
          'दस्तावेज़ (.pdf/.jpg) के नाम के पीछे छिपी .apk/.exe इंस्टॉलर फाइल मिली। अनजान APK इंस्टॉल करने से SMS OTP और फोन का नियंत्रण चोरी हो सकता है।'
      }
    },
    url_deception: {
      en: {
        title: 'Unusual or disguised web address',
        detail:
          'This link hides its destination, uses a shortened address, or comes from an unusual domain.'
      },
      hi: {
        title: 'भ्रामक या छिपा हुआ URL पैटर्न',
        detail:
          'लिंक में "@" द्वारा असली वेबसाइट छिपाने, सीधे IP पते, शॉर्ट लिंक, या संदिग्ध डिस्पोज़ेबल TLD (.xyz/.top/.click) के साथ झांसे वाले शब्दों का उपयोग पाया गया।'
      }
    },
    upi_collect_trap: {
      en: {
        title: 'Request that may send money out',
        detail:
          'This request mentions a refund or prize, but approving it sends money out. A PIN is never needed to receive money.'
      },
      hi: {
        title: 'UPI कलेक्ट / पिन से पैसे पाने का जाल',
        detail:
          'रिफंड, इनाम या कैशबैक के नाम पर UPI भुगतान/कलेक्ट जाल पाया गया। UPI PIN डालने से पैसा हमेशा बाहर जाता है, कभी खाते में आता नहीं।'
      }
    },
    social_engineering_pressure: {
      en: {
        title: 'Pressure to act quickly',
        detail:
          'Urgent threats, isolation, or false authority are used to stop you from checking first.'
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
    const rawWarn = String(upiDecoded.warning || '');
    const am = upiDecoded.am;
    if (lang !== 'hi') {
      if (rawWarn.startsWith('Collect-Trap Alert:') && am) {
        return `This request claims to be a refund or prize, but approving it sends ₹${am} to the other person. A UPI PIN is only for sending money.`;
      }
      if (rawWarn.startsWith('Debit Alert:') && am) {
        return `Approving this request sends ₹${am} from your account. Never enter a UPI PIN to receive money.`;
      }
      if (!rawWarn) return 'This link contains payment details. Check the recipient and amount before approving.';
      return 'A UPI PIN confirms a payment. Never enter it to receive money.';
    }
    if (rawWarn.startsWith('Collect-Trap Alert:') && am) {
      return `कलेक्ट-जाल चेतावनी: यह लिंक कैशबैक/रिफंड/इनाम का झांसा देकर आपके खाते से ₹${am} काटने की कोशिश कर रहा है। UPI PIN डालने से पैसा हमेशा बाहर जाता है, कभी अंदर नहीं आता।`;
    }
    if (rawWarn.startsWith('Debit Alert:') && am) {
      return `डेबिट चेतावनी: इस UPI लिंक को मंज़ूर करके UPI PIN डालने पर आपके खाते से ₹${am} कट जाएंगे। पैसे प्राप्त करने के लिए कभी भी UPI PIN नहीं डालना होता।`;
    }
    if (!rawWarn) return 'इस लिंक में भुगतान का विवरण है। मंज़ूर करने से पहले पाने वाले और रकम की जाँच करें।';
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
