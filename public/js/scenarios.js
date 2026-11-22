'use strict';

(function (global) {
  /**
   * 8 comprehensive multi-step real-life scam simulations (EN + हिंदी).
   * Each scenario has 3 escalating interactive steps asking "What will you do next?"
   * Uses authentic scammer scripts, realistic phone/evidence visuals, and zero real PII.
   */
  const REAL_LIFE_SCAMS = [
    {
      id: 'digital-arrest-cyber-lock',
      featured: true,
      category: 'calls',
      categoryLabel: { en: 'VIDEO CALL & CYBER LOCK', hi: 'वीडियो कॉल और साइबर लॉक' },
      badge: { en: 'TRENDING • FAKE POLICE CALL', hi: 'सबसे आम • नकली पुलिस कॉल' },
      title: {
        en: 'Fake Police "Cyber Lock" & Digital Arrest Call',
        hi: 'नकली पुलिस "साइबर लॉक" और डिजिटल अरेस्ट कॉल'
      },
      summary: {
        en: 'A uniformed caller claims your Aadhaar & phone are "Cyber Locked" in a seized parcel case and orders you onto a 24-hour video call.',
        hi: 'वर्दी में एक कॉलर दावा करता है कि आपका आधार व नंबर ज़ब्त पार्सल केस में "साइबर लॉक" हो गया है और आपको वीडियो कॉल पर रहने को कहता है।'
      },
      threatLevel: { en: 'CRITICAL RISK', hi: 'अत्यधिक जोखिम' },
      typicalLoss: '₹50,000 – ₹5,00,000+',
      coverImage: '/assets/sim/police-officer-call.svg',
      callerMeta: {
        name: { en: 'Unknown caller (fictional)', hi: 'Unknown caller (fictional)' },
        number: 'TRAINING SIMULATION',
        channel: { en: 'WhatsApp-style Video Call (Simulated)', hi: 'वीडियो कॉल सिम्युलेशन' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'video-call',
          video: {
            en: '/assets/sim/digital-arrest-call-en.mp4',
            hi: '/assets/sim/digital-arrest-call-hi.mp4'
          },
          image: '/assets/sim/police-video-poster.jpg',
          imageAlt: {
            en: 'Simulated video call showing a stern person in khaki uniform at a cyber desk',
            hi: 'सिम्युलेटेड वीडियो कॉल जिसमें वर्दी पहने एक व्यक्ति डेस्क पर बैठा दिख रहा है'
          },
          stageHeader: {
            en: 'SIMULATED VIDEO CALL / TRAINING ONLY',
            hi: 'SIMULATED VIDEO CALL / TRAINING ONLY'
          },
          liveTag: { en: 'REC 00:42 • CYBER LOCKED', hi: 'REC 00:42 • साइबर लॉक' },
          scammerQuote: {
            en: '"Your mobile number and Aadhaar are under CYBER LOCK. A parcel booked in your name with illegal items was seized at customs. Do not cut this video call or a local patrol van will arrest you in 20 minutes!"',
            hi: '"आपका मोबाइल नंबर और आधार CYBER LOCK कर दिया गया है। आपके नाम का एक गैरकानूनी पार्सल कस्टम्स ने पकड़ा है। यह वीडियो कॉल मत काटिए, वरना 20 मिनट में पुलिस वैन आपको गिरफ्तार कर लेगी!"'
          },
          redFlags: [
            { en: "The caller's number is unverified. Do not trust a displayed caller ID.", hi: 'कॉलर किसी आधिकारिक नंबर के बजाय सामान्य 10 अंकों के मोबाइल नंबर से वीडियो कॉल कर रहा है।' },
            { en: '"Cyber Lock" and "Digital Arrest" do not exist in Indian law.', hi: 'भारतीय कानून में "साइबर लॉक" या "डिजिटल अरेस्ट" जैसी कोई प्रक्रिया नहीं होती।' },
            { en: 'Threatens instant arrest in 20 minutes to trigger panic before you can think.', hi: 'सोचने का मौका न मिले, इसलिए 20 मिनट में गिरफ्तारी का डर दिखाया जा रहा है।' }
          ],
          choices: [
            {
              id: 'da-s1-comply',
              outcomeType: 'escalate',
              label: {
                en: 'Stay on the video call and ask, "Sir, please tell me how to prove I am innocent!"',
                hi: 'वीडियो कॉल पर बने रहें और पूछें, "सर, मैं बेगुनाह हूँ—सबूत कैसे दूँ?"'
              },
              tacticExposed: { en: 'Authority + Panic Fear', hi: 'वर्दी का डर और घबराहट' },
              consequence: {
                en: 'Once you stay on camera and defend yourself, the scammer knows fear is working. Next, they isolate you from your family and send a forged "Cyber Lock" arrest warrant.',
                hi: 'कॉल पर बने रहकर सफाई देने से ठग समझ जाता है कि आप डर गए हैं। अब वह आपको परिवार से अलग करके नकली अरेस्ट वारंट भेजेगा।'
              },
              saferMove: {
                en: 'Hang up immediately. Real police never interrogate or threaten arrest on a video call.',
                hi: 'तुरंत कॉल काट दें। असली पुलिस कभी वीडियो कॉल पर पूछताछ या गिरफ्तारी नहीं करती।'
              }
            },
            {
              id: 'da-s1-argue',
              outcomeType: 'escalate',
              label: {
                en: 'Show your Aadhaar / ID on camera to prove you never sent any parcel',
                hi: 'कैमरे पर अपना आधार / पहचान पत्र दिखाएं कि आपने कोई पार्सल नहीं भेजा'
              },
              tacticExposed: { en: 'Data Harvesting Under Fear', hi: 'डर में दस्तावेज़ चोरी' },
              consequence: {
                en: 'Showing your ID on camera lets scammers screenshot your Aadhaar/PAN and face to forge even more convincing threats—and pushes you into Step 2.',
                hi: 'कैमरे पर आधार दिखाने से ठग आपकी फोटो और ID का स्क्रीनशॉट लेकर अगली चाल में और ज्यादा डराते हैं।'
              },
              saferMove: {
                en: 'Never show ID cards on unverified video calls. Disconnect and dial 1930.',
                hi: 'अनजान वीडियो कॉल पर कभी पहचान पत्र न दिखाएं। कॉल काटकर 1930 पर जांच करें।'
              }
            },
            {
              id: 'da-s1-hangup',
              outcomeType: 'safe',
              label: {
                en: 'Disconnect the video call immediately, tell a family member, and dial 1930',
                hi: 'तुरंत वीडियो कॉल काटें, परिवार को बताएं और 1930 हेल्पलाइन पर कॉल करें'
              },
              tacticExposed: { en: 'Scam Broken at Step 1', hi: 'पहले ही कदम में जाल टूटा' },
              consequence: {
                en: 'Smart move! Hanging up breaks the scammer\'s psychological hold. "Digital Arrest" and "Cyber Lock" calls collapse the moment you involve family or verify via 1930.',
                hi: 'बिल्कुल सही! कॉल काटते ही ठग का मानसिक दबाव टूट जाता है। परिवार से बात करते ही यह पूरा जाल बेनकाब हो जाता है।'
              },
              saferMove: {
                en: 'If curious, tap "Next Step" below to see what the scammer sends next if someone stays on the call.',
                hi: 'अगर आप देखना चाहते हैं कि कॉल पर रुकने पर ठग आगे क्या करता है, तो नीचे "अगला कदम" देखें।'
              }
            }
          ]
        },
        {
          stepNumber: 2,
          uiMode: 'document-warrant',
          image: '/assets/sim/cyber-lock-warrant.svg',
          imageAlt: {
            en: 'Simulated forged Cyber Lock and Digital Arrest notice with red stamp',
            hi: 'लाल मुहर वाला नकली साइबर लॉक और डिजिटल अरेस्ट नोटिस'
          },
          stageHeader: {
            en: 'DOCUMENT RECEIVED IN CHAT • CASE #CCD/2026/88412',
            hi: 'चैट में मिला नोटिस • केस #CCD/2026/88412'
          },
          liveTag: { en: 'FORGED ARREST NOTICE', hi: 'नकली अरेस्ट नोटिस' },
          scammerQuote: {
            en: '"See this Cyber Lock Arrest Order on your screen! Lock your room door right now. Under Section 66, this is confidential—do NOT call your spouse, parents, or bank. Keep your camera on us."',
            hi: '"स्क्रीन पर यह साइबर लॉक अरेस्ट ऑर्डर देखिए! अभी अपने कमरे का दरवाज़ा बंद कर लें। यह गोपनीय जांच है—किसी घरवाले या बैंक को फोन मत कीजिए, कैमरा चालू रखिए!"'
          },
          redFlags: [
            { en: 'Forces secrecy & isolation ("lock your room, tell nobody") so no rational person can warn you.', hi: 'कमरा बंद करने और परिवार से छिपाने का दबाव ताकि कोई आपको बचा न सके।' },
            { en: 'Forwards a scary PDF/image warrant in chat—courts never serve arrest warrants over chat apps.', hi: 'चैट पर अरेस्ट वारंट भेजना—अदालतें कभी चैट ऐप पर वारंट नहीं भेजतीं।' },
            { en: 'Fake rubber stamps like "CYBER LOCKED" are made in simple editing apps.', hi: '"CYBER LOCKED" जैसी लाल मुहरें नकली एडिटिंग से बनाई जाती हैं।' }
          ],
          choices: [
            {
              id: 'da-s2-isolate',
              outcomeType: 'escalate',
              label: {
                en: 'Lock the room door and stay silent on camera so you don\'t break "confidentiality"',
                hi: 'कमरे का दरवाज़ा बंद करें और "गोपनीयता" के डर से चुपचाप कैमरे के सामने रहें'
              },
              tacticExposed: { en: 'Forced Isolation', hi: 'परिवार से काटकर अकेला करना' },
              consequence: {
                en: 'Isolation is the #1 weapon in Digital Arrest scams. Victims are kept alone on video for hours or even days until they panic and transfer all their savings in Step 3.',
                hi: 'अकेला करना इस ठगी का सबसे बड़ा हथियार है। पीड़ित को घंटों कैमरे पर बैठाकर इतना डराया जाता है कि वह स्टेप 3 में पैसे भेज देता है।'
              },
              saferMove: {
                en: 'Open the door right now and hand the phone to someone you trust.',
                hi: 'तुरंत दरवाज़ा खोलें और किसी भरोसेमंद व्यक्ति से बात करें।'
              }
            },
            {
              id: 'da-s2-check-case',
              outcomeType: 'escalate',
              label: {
                en: 'Ask the officer to transfer you to the "Senior Judge / RBI Verification Officer"',
                hi: 'अधिकारी से कहें कि वे आपकी बात "सीनियर जज या बैंक वेरिफिकेशन ऑफिसर" से कराएं'
              },
              tacticExposed: { en: 'Fake Escalation Theater', hi: 'नकली जज/ऑफिसर का नाटक' },
              consequence: {
                en: 'Scammers work in call-center teams! They happily switch the camera to an accomplice pretending to be a "Senior Officer" or "Fake Courtroom" to demand money in Step 3.',
                hi: 'ठग गैंग में काम करते हैं—वे तुरंत दूसरे साथी को "सीनियर अधिकारी" या नकली कोर्ट बनाकर पेश कर देते हैं!'
              },
              saferMove: {
                en: 'Never verify a caller through the caller\'s own transfer. Hang up and call 1930 or walk into a local police station.',
                hi: 'कॉलर के जोड़े गए किसी "अधिकारी" पर भरोसा न करें। फोन काटकर 1930 पर कॉल करें।'
              }
            },
            {
              id: 'da-s2-call-family',
              outcomeType: 'safe',
              label: {
                en: 'Refuse isolation, call a family member into the room, and hang up',
                hi: 'अकेले रहने से इनकार करें, घर के किसी सदस्य को बुलाएं और कॉल काट दें'
              },
              tacticExposed: { en: 'Isolation Broken', hi: 'अकेलेपन का जाल टूटा' },
              consequence: {
                en: 'Excellent! The moment another person enters the room or hears the call, scammers usually disconnect immediately because their bluff gets exposed.',
                hi: 'बहुत बढ़िया! जैसे ही घर का कोई दूसरा सदस्य कमरे में आता है, ठग अक्सर खुद ही कॉल काट देते हैं।'
              },
              saferMove: {
                en: 'Report the caller number on cybercrime.gov.in or Chakshu portal.',
                hi: 'कॉलर का नंबर cybercrime.gov.in पर रिपोर्ट करें।'
              }
            }
          ]
        },
        {
          stepNumber: 3,
          uiMode: 'video-call',
          video: {
            en: '/assets/sim/digital-arrest-call-en.mp4',
            hi: '/assets/sim/digital-arrest-call-hi.mp4'
          },
          image: '/assets/sim/police-video-poster.jpg',
          imageAlt: {
            en: 'Simulated video call demanding refundable security deposit',
            hi: 'सिम्युलेटेड वीडियो कॉल जिसमें रिफंडेबल सिक्योरिटी राशि मांगी जा रही है'
          },
          stageHeader: {
            en: 'FINAL DEMAND • VIDEO SURVEILLANCE ACTIVE',
            hi: 'आखिरी दबाव • वीडियो कॉल जारी'
          },
          liveTag: { en: 'PAY ₹48,500 OR ARREST', hi: '₹48,500 दो या गिरफ्तारी' },
          scammerQuote: {
            en: '"To remove the Cyber Lock and verify your bank balance is legal money, transfer ₹48,500 to our Government Escrow UPI/Account right now. It is 100% refundable in 30 minutes after audit!"',
            hi: '"साइबर लॉक हटाने और यह जांचने के लिए कि आपका पैसा वैध है, अभी ₹48,500 सरकारी एस्क्रो खाते में भेजें। जांच के 30 मिनट बाद पूरे पैसे वापस मिल जाएंगे!"'
          },
          redFlags: [
            { en: 'Police, courts, and government agencies NEVER ask for "refundable security deposits" to clear your name.', hi: 'पुलिस या अदालत कभी बेगुनाही साबित करने के लिए "रिफंडेबल सिक्योरिटी राशि" नहीं मांगती।' },
            { en: '"Escrow verification transfer" is always a one-way theft into mule bank accounts.', hi: '"वेरिफिकेशन ट्रांसफर" हमेशा ठगों के खाते में पैसा हड़पने का तरीका होता है।' },
            { en: 'Urgent 30-minute refund promise is a classic lie so you don\'t verify.', hi: '30 मिनट में पैसे वापसी का वादा झूठ है ताकि आप बिना सोचे ट्रांसफर कर दें।' }
          ],
          choices: [
            {
              id: 'da-s3-pay',
              outcomeType: 'loss',
              label: {
                en: 'Transfer ₹48,500 right now so the Cyber Lock clears and you get it back in 30 minutes',
                hi: 'साइबर लॉक हटाने के लिए अभी ₹48,500 भेज दें ताकि 30 मिनट में वापस मिल जाएं'
              },
              tacticExposed: { en: 'Fake Refundable Verification Trap (-₹48,500)', hi: 'नकली रिफंडेबल जांच जाल (-₹48,500)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹48,500! Once paid, scammers do NOT stop—they immediately invent a "Court Fine" or "Tax Clearance" demand to drain even more money.',
                hi: 'सिम्युलेटेड नुकसान: -₹48,500! पैसे मिलने के बाद भी ठग नहीं रुकते—वे "कोर्ट जुर्माना" या "टैक्स क्लियरेंस" के नाम पर और पैसे मांगते हैं।'
              },
              saferMove: {
                en: 'In real life, if money was transferred, call 1930 within minutes to freeze the recipient mule account!',
                hi: 'असली जीवन में पैसे कटने पर तुरंत 1930 पर कॉल करें ताकि ठग के खाते को फ्रीज़ किया जा सके।'
              }
            },
            {
              id: 'da-s3-partial',
              outcomeType: 'loss',
              label: {
                en: 'Offer to send a smaller ₹5,000 test amount first to confirm they are real',
                hi: 'जांचने के लिए पहले ₹5,000 भेजकर देखें कि वे असली हैं या नहीं'
              },
              tacticExposed: { en: 'Foot-in-the-Door Trap (-₹5,000)', hi: 'छोटी रकम से फंसाने का जाल (-₹5,000)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹5,000! Scammers gladly accept any amount and use your receipt as proof of "guilt" to pressure you for the rest.',
                hi: 'सिम्युलेटेड नुकसान: -₹5,000! ठग कोई भी रकम लेकर उसी रसीद से आपको और डराकर बाकी पैसे वसूलते हैं।'
              },
              saferMove: {
                en: 'Zero rupees! Never send even ₹1 to verify innocence.',
                hi: 'एक रुपया भी नहीं! बेगुनाही साबित करने के लिए कभी पैसे न भेजें।'
              }
            },
            {
              id: 'da-s3-refuse',
              outcomeType: 'safe',
              label: {
                en: 'Refuse all payment, end the call, block the number, and report to 1930 / cybercrime.gov.in',
                hi: 'पैसे देने से साफ मना करें, कॉल काटें, नंबर ब्लॉक करें और 1930 पर रिपोर्ट करें'
              },
              tacticExposed: { en: '100% Immunity Achieved', hi: 'पूरी सुरक्षा! जाल नाकाम' },
              consequence: {
                en: 'YOU BEAT THE SCAM! Zero real police officer ever asks for money on a video call. You kept your savings safe.',
                hi: 'आपने ठगी को हरा दिया! कोई भी असली अधिकारी वीडियो कॉल पर पैसे नहीं मांगता। आपकी मेहनत की कमाई सुरक्षित है।'
              },
              saferMove: {
                en: 'Share this simulation with parents and elders—they are the #1 target of Digital Arrest calls.',
                hi: 'यह अभ्यास अपने माता-पिता और बुजुर्गों को भी दिखाएं—वे इस ठगी का सबसे बड़ा निशाना हैं।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Fake Police / "Digital Arrest" scams combine fear of law enforcement with forced isolation. Scammers dress in fake uniforms on video calls, forge "Cyber Lock" warrants, keep victims alone on camera for hours, and demand "refundable verification deposits" to clear fake cases.',
          hi: 'नकली पुलिस / "डिजिटल अरेस्ट" ठगी कानून के डर और अकेलेपन का इस्तेमाल करती है। ठग वीडियो कॉल पर नकली वर्दी पहनते हैं, नकली "साइबर लॉक" वारंट भेजते हैं और "रिफंडेबल वेरिफिकेशन" के नाम पर पैसे ऐंठते हैं।'
        },
        neverIgnoreFlags: [
          { en: 'There is NO such thing as "Digital Arrest" or "Cyber Lock" in law.', hi: 'कानून में "डिजिटल अरेस्ट" या "साइबर लॉक" नाम की कोई चीज़ नहीं होती।' },
          { en: 'Real officers never use personal mobile numbers or messaging video calls for warrants.', hi: 'असली अधिकारी पर्सनल मोबाइल या चैट वीडियो कॉल पर वारंट नहीं दिखाते।' },
          { en: 'Forced secrecy ("stay alone, do not tell family") is always a scam signal.', hi: 'अकेले रहने और परिवार को न बताने का दबाव हमेशा ठगी का संकेत है।' },
          { en: 'Real agencies NEVER ask you to transfer money to prove innocence.', hi: 'असली एजेंसियां बेगुनाही साबित करने के लिए कभी पैसे ट्रांसफर नहीं करवातीं।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Hang up immediately—even if they shout or threaten an arrest van.', hi: 'तुरंत कॉल काट दें—चाहे वे कितना भी चिल्लाएं या पुलिस वैन की धमकी दें।' },
          { en: 'Talk aloud to a family member or neighbor right away.', hi: 'तुरंत घर के किसी सदस्य या पड़ोसी को पूरी बात बताएं।' },
          { en: 'Report the number on 1930 or cybercrime.gov.in.', hi: 'नंबर को 1930 या cybercrime.gov.in पर रिपोर्ट करें।' }
        ]
      }
    },

    {
      id: 'utility-apk-disconnection',
      featured: true,
      category: 'messages',
      categoryLabel: { en: 'WHATSAPP / SMS & .APK', hi: 'मैसेज और .APK फाइल' },
      badge: { en: 'HIGH RISK • MALWARE APP', hi: 'खतरनाक • नकली ऐप फाइल' },
      title: {
        en: 'Electricity Cut Tonight & Disguised .pdf.apk',
        hi: 'आज रात बिजली कटेगी व नकली .pdf.apk बिल'
      },
      summary: {
        en: 'An urgent message threatens power disconnection at 9:30 PM and sends a fake bill file ending in .pdf.apk to steal your SMS OTPs.',
        hi: 'मैसेज में रात 9:30 बजे बिजली कटने की धमकी दी जाती है और .pdf.apk वाली नकली बिल फाइल भेजी जाती है ताकि आपके SMS OTP चोरी हो सकें।'
      },
      threatLevel: { en: 'HIGH RISK', hi: 'उच्च जोखिम' },
      typicalLoss: '₹25,000 – ₹3,00,000',
      coverImage: '/assets/sim/electricity-notice.svg',
      callerMeta: {
        name: { en: 'Metro Power Helpdesk (Demo)', hi: 'मेट्रो पावर हेल्पडेस्क (डेमो)' },
        number: '+91 81045-XX210',
        channel: { en: 'Chat Message + File Attachment', hi: 'चैट मैसेज व फाइल' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'whatsapp-chat',
          image: '/assets/sim/electricity-notice.svg',
          imageAlt: {
            en: 'Simulated urgent utility disconnection notice and .pdf.apk attachment',
            hi: 'आज रात बिजली कटने का नकली नोटिस और .pdf.apk फाइल'
          },
          stageHeader: {
            en: 'MESSAGE FROM +91 81045-XX210 • FORWARDED',
            hi: '+91 81045-XX210 से संदेश • फॉरवर्डेड'
          },
          liveTag: { en: 'CUT AT 9:30 PM', hi: 'रात 9:30 बजे कटौती' },
          scammerQuote: {
            en: '"DEAR CONSUMER, your electricity meter will be disconnected tonight at 9:30 PM because last bill was not updated. Download & open MetroBill_Notice.pdf.apk to verify ₹12 fee now."',
            hi: '"प्रिय ग्राहक, पिछला बिल अपडेट न होने से आज रात 9:30 बजे आपकी बिजली काट दी जाएगी। ₹12 शुल्क अपडेट करने के लिए तुरंत MetroBill_Notice.pdf.apk खोलें।"'
          },
          redFlags: [
            { en: 'Double extension ".pdf.apk": it looks like a PDF bill, but ".apk" at the end means it is an Android app installer!', hi: 'दोहरा एक्सटेंशन ".pdf.apk": नाम PDF जैसा है, पर अंत में ".apk" मतलब यह एक Android ऐप इंस्टॉलर है!' },
            { en: 'Utility boards never warn of 9:30 PM disconnection from a random mobile number.', hi: 'बिजली विभाग कभी किसी अनजान मोबाइल नंबर से रात को कनेक्शन काटने का मैसेज नहीं भेजता।' },
            { en: 'Tiny ₹12 fee bait is used only to get you to install malware or enter card/UPI details.', hi: '₹12 जैसी छोटी रकम का झांसा सिर्फ ऐप इंस्टॉल कराने या कार्ड डिटेल चुराने के लिए होता है।' }
          ],
          choices: [
            {
              id: 'apk-s1-tap',
              outcomeType: 'escalate',
              label: {
                en: 'Tap MetroBill_Notice.pdf.apk to open the PDF notice and see your bill',
                hi: 'अपना बिल देखने के लिए MetroBill_Notice.pdf.apk फाइल पर टैप करें'
              },
              tacticExposed: { en: 'Double-Extension Disguise', hi: 'दोहरे नाम (.pdf.apk) का धोखा' },
              consequence: {
                en: 'Instead of opening a PDF reader, Android warns "Install unknown app?" If you keep going, the fake app asks for dangerous permissions in Step 2.',
                hi: 'PDF खुलने के बजाय फोन ऐप इंस्टॉल करने की अनुमति मांगने लगता है! आगे बढ़ने पर यह ऐप खतरनाक परमिशन मांगेगा।'
              },
              saferMove: {
                en: 'Always inspect the VERY LAST 3–4 letters of any file name before tapping.',
                hi: 'किसी भी फाइल को खोलने से पहले हमेशा उसके नाम के आखिरी अक्षर (.pdf बनाम .apk) देखें।'
              }
            },
            {
              id: 'apk-s1-call',
              outcomeType: 'escalate',
              label: {
                en: 'Call the personal mobile number (+91 81045-XX210) in the message to ask',
                hi: 'मैसेज में लिखे पर्सनल मोबाइल नंबर पर कॉल करके पूछें'
              },
              tacticExposed: { en: 'Fake Helpdesk Callback', hi: 'नकली हेल्पडेस्क कॉलबैक' },
              consequence: {
                en: 'The scammer answers pretending to be "Electricity Support" and walks you step-by-step into installing the .apk file anyway!',
                hi: 'कॉल उठाने वाला खुद को बिजली ऑफिसर बताकर आपको जबरदस्ती वह .apk ऐप इंस्टॉल करने को गाइड करेगा।'
              },
              saferMove: {
                en: 'Never call numbers inside a suspicious message. Check your paper bill or official utility app.',
                hi: 'संदिग्ध मैसेज के नंबर पर कॉल न करें—कागज़ी बिल या आधिकारिक ऐप से जांचें।'
              }
            },
            {
              id: 'apk-s1-official',
              outcomeType: 'safe',
              label: {
                en: 'Spot the .apk ending, delete the chat, and check your bill in the official power app',
                hi: '.apk एक्सटेंशन पहचानें, चैट डिलीट करें और आधिकारिक बिजली ऐप में बिल जांचें'
              },
              tacticExposed: { en: 'Malware Blocked', hi: 'खतरनाक ऐप रुका' },
              consequence: {
                en: 'Spot-on! Checking your meter status inside your real utility app confirms your electricity is completely fine.',
                hi: 'बिल्कुल सही! आधिकारिक ऐप में जांचते ही पता चल जाता है कि आपका बिजली बिल पूरी तरह ठीक है।'
              },
              saferMove: {
                en: 'Warn family members never to install .apk files received in messaging apps.',
                hi: 'परिवार को सिखाएं कि चैट में आई किसी भी .apk फाइल को कभी इंस्टॉल न करें।'
              }
            }
          ]
        },
        {
          stepNumber: 2,
          uiMode: 'whatsapp-chat',
          image: '/assets/sim/electricity-notice.svg',
          imageAlt: {
            en: 'Simulated Android permission prompt for SMS and Accessibility access',
            hi: 'सिम्युलेटेड फोन स्क्रीन जो SMS और फोन नियंत्रण की अनुमति मांग रही है'
          },
          stageHeader: {
            en: 'FAKE APP PERMISSION POPUP (SIMULATED)',
            hi: 'नकली ऐप की परमिशन मांग (सिम्युलेटेड)'
          },
          liveTag: { en: 'ALLOW SMS & ACCESSIBILITY?', hi: 'SMS व स्क्रीन कंट्रोल दें?' },
          scammerQuote: {
            en: '"Your app update is installed! Now tap ALLOW on Read SMS Messages and Enable Accessibility Service so our system can auto-fetch your ₹12 bill receipt."',
            hi: '"ऐप खुल गया! अब ₹12 की रसीद अपने-आप बनने के लिए Read SMS और Accessibility Service पर ALLOW दबाएं।"'
          },
          redFlags: [
            { en: 'A utility bill viewer NEVER needs "Read SMS" or "Accessibility" permissions.', hi: 'बिजली बिल देखने वाले ऐप को कभी आपके SMS पढ़ने या Accessibility की अनुमति नहीं चाहिए होती।' },
            { en: 'Accessibility + Read SMS lets malware silently read bank OTPs and tap buttons on your screen.', hi: 'इन अनुमतियों से ठग चुपचाप आपके बैंक OTP पढ़कर खुद पैसे ट्रांसफर कर सकते हैं।' }
          ],
          choices: [
            {
              id: 'apk-s2-allow',
              outcomeType: 'loss',
              label: {
                en: 'Tap ALLOW on SMS and Accessibility to finish the ₹12 update quickly',
                hi: 'जल्दी ₹12 अपडेट पूरा करने के लिए SMS और Accessibility पर ALLOW दबा दें'
              },
              tacticExposed: { en: 'Silent OTP Hijack (-₹75,000)', hi: 'चुपचाप OTP चोरी (-₹75,000)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹75,000! Even if you never type a PIN for them, the malware now forwards every bank OTP on your phone directly to the scammer.',
                hi: 'सिम्युलेटेड नुकसान: -₹75,000! अब यह नकली ऐप आपके फोन पर आने वाले हर बैंक OTP को चुपचाप ठग के पास भेज देता है।'
              },
              saferMove: {
                en: 'TURN ON AIRPLANE MODE immediately! Then ask a trusted tech-savvy person to uninstall the unknown app.',
                hi: 'तुरंत AIRPLANE MODE चालू करें और किसी जानकार से उस अनजान ऐप को अनइंस्टॉल करवाएं।'
              }
            },
            {
              id: 'apk-s2-deny',
              outcomeType: 'safe',
              label: {
                en: 'Deny permissions, turn on Airplane Mode briefly, and uninstall the app immediately',
                hi: 'अनुमति न दें, तुरंत Airplane Mode चालू करें और उस ऐप को हटा दें'
              },
              tacticExposed: { en: 'OTP Theft Prevented', hi: 'OTP चोरी रोकी गई' },
              consequence: {
                en: 'Great recovery! Turning on Airplane Mode cuts the malware\'s internet connection immediately so it cannot transmit data while you remove it.',
                hi: 'शानदार बचाव! Airplane Mode चालू करने से नकली ऐप का इंटरनेट कट जाता है और वह आपका कोई डेटा नहीं भेज पाता।'
              },
              saferMove: {
                en: 'Change netbanking/UPI passwords afterward and verify recent transactions.',
                hi: 'ऐप हटाने के बाद बैंक व UPI पासवर्ड बदलें और खाते की जांच करें।'
              }
            },
            {
              id: 'apk-s2-wait',
              outcomeType: 'escalate',
              label: {
                en: 'Leave the app installed and enter your debit card details in the ₹12 form',
                hi: 'ऐप में बने ₹12 वाले फॉर्म में अपने डेबिट कार्ड की जानकारी भर दें'
              },
              tacticExposed: { en: 'Card + OTP Combo Trap', hi: 'कार्ड और OTP दोनों का जाल' },
              consequence: {
                en: 'The fake form steals your card number, CVV, and expiry, while the installed app steals the OTP—complete bank drain in Step 3!',
                hi: 'नकली फॉर्म आपका कार्ड नंबर व CVV चुरा लेता है और ऐप OTP चुरा लेता है—खाता तुरंत खाली हो जाता है!'
              },
              saferMove: {
                en: 'Never enter card details inside an APK sent over chat.',
                hi: 'चैट से आए किसी भी ऐप में कभी कार्ड नंबर या CVV न डालें।'
              }
            }
          ]
        },
        {
          stepNumber: 3,
          uiMode: 'whatsapp-chat',
          image: '/assets/sim/electricity-notice.svg',
          imageAlt: {
            en: 'Simulated post-install recovery emergency',
            hi: 'सिम्युलेटेड ठगी के बाद तुरंत बचाव के कदम'
          },
          stageHeader: {
            en: 'BANK SMS ALERT: ₹25,000 DEBIT ATTEMPT DETECTED',
            hi: 'बैंक अलर्ट: ₹25,000 कटने का प्रयास!'
          },
          liveTag: { en: 'GOLDEN HOUR ACTION', hi: 'गोल्डन-आवर बचाव' },
          scammerQuote: {
            en: '"Do not worry about any bank SMS—that is just a ₹12 server hold. Stay online and do not call your bank!"',
            hi: '"बैंक के किसी भी SMS की चिंता मत कीजिए—वह सिर्फ ₹12 का टेस्ट होल्ड है। बैंक को फोन मत कीजिए!"'
          },
          redFlags: [
            { en: 'Scammers tell you to ignore real bank debit alerts while draining your account.', hi: 'खाता खाली करते समय ठग आपको असली बैंक अलर्ट नज़रअंदाज़ करने को कहते हैं।' }
          ],
          choices: [
            {
              id: 'apk-s3-airplane',
              outcomeType: 'safe',
              label: {
                en: 'Enable Airplane Mode right away, call 1930 from another phone, and alert your bank',
                hi: 'तुरंत Airplane Mode चालू करें, दूसरे फोन से 1930 पर कॉल करें और बैंक को सूचित करें'
              },
              tacticExposed: { en: 'Golden-Hour Playbook Mastery', hi: 'गोल्डन-आवर सुरक्षा नियम सफल' },
              consequence: {
                en: 'PERFECT RESPONSE! Cutting network access stops further OTPs, and calling 1930 fast gives cyber police a chance to freeze the stolen funds before cash-out.',
                hi: 'सटीक कदम! नेटवर्क बंद करने से OTP जाना रुकता है और तुरंत 1930 पर कॉल करने से पैसा निकलने से पहले फ्रीज़ होने की संभावना रहती है।'
              },
              saferMove: {
                en: 'Also lodge the complaint at cybercrime.gov.in with screenshots.',
                hi: 'स्क्रीनशॉट के साथ cybercrime.gov.in पर शिकायत दर्ज करें।'
              }
            },
            {
              id: 'apk-s3-ignore',
              outcomeType: 'loss',
              label: {
                en: 'Believe the caller that it is just a server hold and wait until tomorrow morning',
                hi: 'कॉलर की बात मान लें कि यह सिर्फ टेस्ट है और सुबह तक इंतज़ार करें'
              },
              tacticExposed: { en: 'Delayed Reporting Loss', hi: 'देरी से रिपोर्ट करने का नुकसान' },
              consequence: {
                en: 'SIMULATED LOSS: Waiting even 1 hour lets scammers move the money across multiple mule accounts, making recovery far harder.',
                hi: 'सिम्युलेटेड नुकसान: 1 घंटे की देरी से भी ठग पैसे को कई खातों में बांटकर निकाल लेते हैं।'
              },
              saferMove: {
                en: 'Every minute counts! Call 1930 immediately if an unauthorized debit happens.',
                hi: 'हर मिनट कीमती है—गलत कटौती होते ही तुरंत 1930 पर कॉल करें।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Fake utility disconnection messages create panic ("power cut at 9:30 PM") and push a tiny ₹12 fee inside a disguised .pdf.apk file. Once installed, the Android malware hijacks SMS OTPs and Accessibility controls.',
          hi: 'नकली बिजली कटौती के मैसेज डर पैदा करते हैं और ₹12 शुल्क के बहाने .pdf.apk फाइल इंस्टॉल करवाते हैं। यह ऐप फोन के SMS OTP और स्क्रीन कंट्रोल चुरा लेता है।'
        },
        neverIgnoreFlags: [
          { en: 'Files ending in .apk, .exe, or .bat disguised after .pdf (e.g., Bill.pdf.apk).', hi: '.pdf के बाद .apk लिखा होना (जैसे Bill.pdf.apk) हमेशा खतरनाक है।' },
          { en: 'Night-time power-cut threats sent from random 10-digit numbers.', hi: 'अनजान मोबाइल नंबर से रात को बिजली कटने की धमकी।' },
          { en: 'Any bill app asking for Read SMS or Accessibility permissions.', hi: 'बिल वाले ऐप द्वारा SMS पढ़ने या Accessibility की अनुमति मांगना।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Never tap .apk files in chats. Always pay via your official electricity app.', hi: 'चैट में आई .apk फाइल न खोलें—सिर्फ आधिकारिक ऐप से बिल भरें।' },
          { en: 'If already installed: turn ON Airplane Mode and uninstall it.', hi: 'अगर इंस्टॉल हो गया हो तो तुरंत Airplane Mode ऑन करके ऐप हटाएं।' },
          { en: 'Call 1930 and alert your bank immediately.', hi: 'तुरंत 1930 और अपने बैंक को सूचित करें।' }
        ]
      }
    },

    {
      id: 'upi-qr-cashback',
      featured: false,
      category: 'payments',
      categoryLabel: { en: 'UPI & QR COLLECT', hi: 'UPI व QR जाल' },
      badge: { en: 'CLASSIC • PIN TRAP', hi: 'आम ठगी • PIN जाल' },
      title: {
        en: 'UPI Cashback & Marketplace Buyer QR Trap',
        hi: 'UPI कैशबैक और ऑनलाइन खरीदार QR जाल'
      },
      summary: {
        en: 'A fake reward agent or online marketplace "buyer" sends a QR / Collect card telling you to enter your UPI PIN to RECEIVE ₹4,500.',
        hi: 'नकली इनाम एजेंट या खरीदार आपको QR / कलेक्ट कार्ड भेजता है और ₹4,500 "प्राप्त करने" के लिए UPI PIN डालने को कहता है।'
      },
      threatLevel: { en: 'HIGH RISK', hi: 'उच्च जोखिम' },
      typicalLoss: '₹2,000 – ₹95,000',
      coverImage: '/assets/sim/upi-qr-training.svg',
      callerMeta: {
        name: { en: 'PaySim Rewards / Buyer (Demo)', hi: 'पेसिम रिवॉर्ड्स / खरीदार (डेमो)' },
        number: 'reward-desk@paysim',
        channel: { en: 'UPI Collect / QR Screen', hi: 'UPI कलेक्ट व QR स्क्रीन' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'upi-collect',
          image: '/assets/sim/upi-qr-training.svg',
          imageAlt: {
            en: 'Simulated fake UPI QR cashback claim card for ₹4,500',
            hi: '₹4,500 कैशबैक के नाम पर नकली UPI QR कार्ड'
          },
          stageHeader: {
            en: 'UPI PAYMENT REQUEST • reward-desk@paysim',
            hi: 'UPI भुगतान अनुरोध • reward-desk@paysim'
          },
          liveTag: { en: 'RECEIVE ₹4,500?', hi: '₹4,500 पाएं?' },
          scammerQuote: {
            en: '"Sir/Ma\'am, your ₹4,500 cashback refund is ready! Just scan this QR code or tap Approve on the collect request and enter your UPI PIN to credit ₹4,500 to your bank."',
            hi: '"सर/मैडम, आपका ₹4,500 कैशबैक तैयार है! खाते में ₹4,500 पाने के लिए बस यह QR स्कैन करें या Approve दबाकर अपना UPI PIN डाल दें।"'
          },
          redFlags: [
            { en: 'GOLDEN RULE: You NEVER need to enter a UPI PIN or scan a QR code to RECEIVE money.', hi: 'सुनहरा नियम: पैसे पाने के लिए कभी भी UPI PIN नहीं डालना होता और न QR स्कैन करना होता है।' },
            { en: 'The UPI screen says "Paying TO reward-desk@paysim", NOT receiving!', hi: 'स्क्रीन पर पैसे भेजने (Pay TO) का अनुरोध दिख रहा है, पैसे आने का नहीं।' }
          ],
          choices: [
            {
              id: 'upi-s1-approve',
              outcomeType: 'loss',
              label: {
                en: 'Tap Approve & enter your UPI PIN to receive ₹4,500 in your account',
                hi: 'खाते में ₹4,500 पाने के लिए Approve दबाएं और UPI PIN डाल दें'
              },
              tacticExposed: { en: 'Reversed Pay/Receive Illusion (-₹4,500)', hi: 'लेन-देन का उल्टा भ्रम (-₹4,500)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹4,500! A UPI PIN ONLY authorizes money LEAVING your account. Now they even claim "server error" to trap you for double in Step 2!',
                hi: 'सिम्युलेटेड नुकसान: -₹4,500! UPI PIN से पैसा हमेशा खाते से बाहर जाता है। अब ठग "सर्वर एरर" बोलकर दोगुनी रकम मांगेंगे!'
              },
              saferMove: {
                en: 'Remember: Money IN = zero PIN. Money OUT = UPI PIN.',
                hi: 'याद रखें: पैसे आते समय कभी PIN नहीं लगता; PIN सिर्फ पैसे भेजने के लिए होता है।'
              }
            },
            {
              id: 'upi-s1-ask',
              outcomeType: 'escalate',
              label: {
                en: 'Ask why it shows "Pay ₹4,500" instead of Receive',
                hi: 'पूछें कि इसमें पैसे आने के बजाय "Pay ₹4,500" क्यों दिख रहा है'
              },
              tacticExposed: { en: 'Fake "Merchant Code" Excuse', hi: 'नकली मर्चेंट कोड का बहाना' },
              consequence: {
                en: 'Scammers always have a rehearsed lie ready: "That is just how merchant refund vouchers show up—don\'t worry, it credits automatically!"',
                hi: 'ठग तुरंत रटा-रटाया झूठ बोलते हैं: "मर्चेंट रिफंड में ऐसा ही दिखता है, PIN डालते ही पैसे आपके खाते में आएंगे!"'
              },
              saferMove: {
                en: 'Trust your app screen, never the caller\'s excuse. Decline immediately.',
                hi: 'कॉलर के बहाने पर नहीं, अपने ऐप के "Pay" शब्द पर भरोसा करें और अनुरोध अस्वीकार करें।'
              }
            },
            {
              id: 'upi-s1-decline',
              outcomeType: 'safe',
              label: {
                en: 'Tap Decline / Reject immediately and block reward-desk@paysim',
                hi: 'तुरंत Decline / अस्वीकार दबाएं और भेजने वाले को ब्लॉक करें'
              },
              tacticExposed: { en: 'Collect Trap Dodged', hi: 'कलेक्ट जाल से बचाव' },
              consequence: {
                en: 'WELL DONE! You spotted that a UPI PIN never receives money and protected your ₹4,500.',
                hi: 'शाबाश! आपने पहचान लिया कि UPI PIN से पैसे केवल जाते हैं, आते नहीं।'
              },
              saferMove: {
                en: 'Check Step 2 to see how scammers trick victims even further with a "₹1 verification" trick.',
                hi: 'आगे देखें कि ठग "₹1 वेरिफिकेशन" के नाम पर कैसे फंसाते हैं।'
              }
            }
          ]
        },
        {
          stepNumber: 2,
          uiMode: 'upi-collect',
          image: '/assets/sim/upi-qr-training.svg',
          imageAlt: {
            en: 'Simulated double refund escalation trap',
            hi: 'नकली डबल रिफंड वेरिफिकेशन जाल'
          },
          stageHeader: {
            en: 'FOLLOW-UP TRICK • "TRY ₹1 TEST OR DOUBLE REFUND"',
            hi: 'अगली चाल • "₹1 टेस्ट या डबल रिफंड"'
          },
          liveTag: { en: 'SCAMMER CHANGES TACTIC', hi: 'ठग की नई चाल' },
          scammerQuote: {
            en: '"Okay, don\'t trust ₹4,500? Let\'s do a ₹10 test first—send ₹10 and I will send ₹20 back! Or enter your 4-digit PIN in our automated refund portal so both ₹4,500 + ₹4,500 return together."',
            hi: '"ठीक है, ₹4,500 पर भरोसा नहीं? पहले ₹10 टेस्ट कर लीजिए—₹10 भेजिए, मैं ₹20 वापस भेजता हूँ! या रिफंड के लिए दोबारा ₹9,000 वाला अनुरोध मंज़ूर करें।"'
          },
          redFlags: [
            { en: 'Testing with ₹10 works only as bait—scammers return ₹20 to gain trust before stealing ₹20,000+!', hi: '₹10 के बदले ₹20 लौटाकर भरोसा जीतना सिर्फ बड़े नुकसान के लिए जाल बिछाना है।' },
            { en: 'Asking you to pay AGAIN to "unlock a stuck refund" is the classic double-dip scam.', hi: 'रुके हुए रिफंड को वापस पाने के लिए दोबारा पैसे भेजने को कहना शुद्ध ठगी है।' }
          ],
          choices: [
            {
              id: 'upi-s2-test',
              outcomeType: 'escalate',
              label: {
                en: 'Try the ₹10 test—what harm can ₹10 do?',
                hi: '₹10 का टेस्ट करके देख लें—₹10 में क्या नुकसान होगा?'
              },
              tacticExposed: { en: 'Trust-Building Bait', hi: 'छोटे लालच से भरोसा जीतना' },
              consequence: {
                en: 'Scammers actually send ₹20 back once! That lowers your guard so when they send a ₹15,000 "Merchant Sync" QR next, you trust them.',
                hi: 'ठग एक बार ₹20 वापस भेजकर आपका भरोसा जीत लेते हैं और फिर बड़ा QR भेजकर हज़ारों रुपये उड़ा लेते हैं!'
              },
              saferMove: {
                en: 'Never engage in "test transfers" with strangers.',
                hi: 'अनजान लोगों के साथ कभी कोई "टेस्ट ट्रांसफर" न करें।'
              }
            },
            {
              id: 'upi-s2-block',
              outcomeType: 'safe',
              label: {
                en: 'Refuse all test transfers, block the caller, and report the UPI ID',
                hi: 'किसी भी टेस्ट ट्रांसफर से मना करें, कॉलर को ब्लॉक करें और UPI ID रिपोर्ट करें'
              },
              tacticExposed: { en: 'Double-Dip Trap Stopped', hi: 'दूसरा जाल भी नाकाम' },
              consequence: {
                en: 'SMART! Real refunds go straight back to your original payment method automatically without any QR scan or PIN.',
                hi: 'बिल्कुल सही! असली रिफंड बिना किसी QR या PIN के अपने-आप मूल खाते में वापस आता है।'
              },
              saferMove: {
                en: 'You can inspect any suspicious upi:// link safely using BaitCheck\'s "Check Message" tab!',
                hi: 'आप BaitCheck के "संदेश जाँचें" टैब में किसी भी संदिग्ध upi:// लिंक को सुरक्षित रूप से जांच सकते हैं।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Scammers disguise a "Pay / Collect Request" as a "Receive Cashback / Buyer Advance". Whether on an online marketplace or a customer-care call, they rely on people not realizing that a UPI PIN ONLY sends money out.',
          hi: 'ठग पैसे मांगने वाले अनुरोध को "कैशबैक" या "खरीदार एडवांस" बताकर भेजते हैं। वे इसका फायदा उठाते हैं कि कई लोग यह भूल जाते हैं कि UPI PIN केवल पैसे भेजने के लिए होता है।'
        },
        neverIgnoreFlags: [
          { en: 'Anyone telling you "Scan QR / Enter PIN to RECEIVE money".', hi: 'कोई भी जो कहे कि "पैसे पाने के लिए QR स्कैन करें या PIN डालें"।' },
          { en: 'Payment note saying "Approve to claim prize/refund".', hi: 'भुगतान नोट में "इनाम या रिफंड पाने के लिए Approve करें" लिखा होना।' },
          { en: 'Buyers on classifieds who want to "pay advance via QR" without seeing the item.', hi: 'सामान देखे बिना QR से एडवांस देने की ज़िद करने वाले खरीदार।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Tap Decline immediately on the collect screen.', hi: 'कलेक्ट स्क्रीन पर तुरंत Decline दबाएं।' },
          { en: 'Paste any suspicious payment link into BaitCheck\'s Check Message tool.', hi: 'संदिग्ध लिंक को BaitCheck के "संदेश जाँचें" टूल में जांचें।' },
          { en: 'If debited, call 1930 immediately.', hi: 'पैसे कटने पर तुरंत 1930 पर कॉल करें।' }
        ]
      }
    },

    {
      id: 'customs-seized-parcel',
      featured: false,
      category: 'jobs',
      categoryLabel: { en: 'PARCELS & CUSTOMS', hi: 'पार्सल और कस्टम्स' },
      badge: { en: 'COURIER LURE • ESCALATES', hi: 'कूरियर झांसा' },
      title: {
        en: 'Customs "Seized Parcel" & Clearance Fee Scam',
        hi: 'कस्टम्स में "ज़ब्त पार्सल" और क्लियरेंस फीस ठगी'
      },
      summary: {
        en: 'An SMS warns your international parcel is held at customs for ₹1,850 duty—and quickly escalates into a fake police threat.',
        hi: 'SMS आता है कि आपका पार्सल कस्टम्स में अटका है और ₹1,850 फीस मांगी जाती है—फिर यही कॉल नकली पुलिस धमकी में बदल जाती है।'
      },
      threatLevel: { en: 'HIGH RISK', hi: 'उच्च जोखिम' },
      typicalLoss: '₹1,850 – ₹2,50,000',
      coverImage: '/assets/sim/customs-parcel.svg',
      callerMeta: {
        name: { en: 'Express Courier & Customs Desk (Demo)', hi: 'एक्सप्रेस कूरियर व कस्टम्स डेस्क (डेमो)' },
        number: 'verify-parcel.top',
        channel: { en: 'SMS Link + Callback', hi: 'SMS लिंक और कॉल' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'parcel-portal',
          image: '/assets/sim/customs-parcel.svg',
          imageAlt: {
            en: 'Simulated parcel box with red Customs Hold fee tag',
            hi: 'सिम्युलेटेड पार्सल बॉक्स जिस पर कस्टम्स होल्ड का लाल टैग लगा है'
          },
          stageHeader: {
            en: 'SMS TRACKING PORTAL • verify-parcel.top',
            hi: 'SMS ट्रैकिंग पोर्टल • verify-parcel.top'
          },
          liveTag: { en: 'CUSTOMS HOLD • ₹1,850', hi: 'कस्टम्स होल्ड • ₹1,850' },
          scammerQuote: {
            en: '"Parcel #IND-EXP-7749 is ON HOLD at Customs. Pay ₹1,850 clearance & address update fee within 4 hours at verify-parcel.top or package returns & penalty applies."',
            hi: '"पार्सल #IND-EXP-7749 कस्टम्स में रुका है। 4 घंटे में verify-parcel.top पर ₹1,850 शुल्क भरें वरना जुर्माना लगेगा।"'
          },
          redFlags: [
            { en: 'Suspicious ".top" domain (verify-parcel.top) instead of an official courier website.', hi: 'आधिकारिक कूरियर वेबसाइट के बजाय संदिग्ध ".top" डोमेन।' },
            { en: 'You did not order any international parcel, yet it claims a delivery fee is due.', hi: 'आपने कोई पार्सल मंगवाया ही नहीं, फिर भी डिलीवरी शुल्क मांगा जा रहा है।' }
          ],
          choices: [
            {
              id: 'par-s1-pay',
              outcomeType: 'loss',
              label: {
                en: 'Enter your card details on verify-parcel.top to pay the ₹1,850 fee quickly',
                hi: 'जुर्माने से बचने के लिए verify-parcel.top पर कार्ड से ₹1,850 भर दें'
              },
              tacticExposed: { en: 'Phishing Fee Harvest (-₹1,850+)', hi: 'नकली पोर्टल से कार्ड चोरी' },
              consequence: {
                en: 'SIMULATED LOSS: The fake site steals your card number AND OTP! Worse, scammers then call claiming illegal items were inside the parcel.',
                hi: 'सिम्युलेटेड नुकसान: नकली वेबसाइट आपका कार्ड व OTP चुरा लेती है और फिर ठग पार्सल में गैरकानूनी सामान होने का डर दिखाते हैं!'
              },
              saferMove: {
                en: 'Never pay customs fees via links in random SMS messages.',
                hi: 'SMS में आए किसी भी अनजान लिंक से कभी कस्टम्स फीस न भरें।'
              }
            },
            {
              id: 'par-s1-call',
              outcomeType: 'escalate',
              label: {
                en: 'Click "Support Call" to tell them you never ordered this parcel',
                hi: 'सपोर्ट पर कॉल करके बताएं कि आपने यह पार्सल ऑर्डर नहीं किया'
              },
              tacticExposed: { en: 'Pivot to Digital Arrest Script', hi: 'पार्सल से नकली पुलिस कॉल की ओर मोड़ना' },
              consequence: {
                en: 'This is the exact hook used to launch Digital Arrest scams! As soon as you say "It\'s not mine", they claim someone misused your Aadhaar in Step 2.',
                hi: 'यहीं से "डिजिटल अरेस्ट" ठगी शुरू होती है! आपके मना करते ही वे कहेंगे कि आपके आधार का गलत इस्तेमाल हुआ है।'
              },
              saferMove: {
                en: 'Delete unsolicited parcel SMSes. Only check tracking inside the shopping app you used.',
                hi: 'अनचाहे पार्सल SMS डिलीट करें। हमेशा उसी शॉपिंग ऐप से ट्रैकिंग जांचें जहां ऑर्डर किया हो।'
              }
            },
            {
              id: 'par-s1-ignore',
              outcomeType: 'safe',
              label: {
                en: 'Spot the fake .top domain, ignore the link, and verify inside your real shopping/courier app',
                hi: 'नकली .top लिंक पहचानें, लिंक न खोलें और असली शॉपिंग ऐप में ऑर्डर जांचें'
              },
              tacticExposed: { en: 'Customs Lure Blocked', hi: 'कस्टम्स जाल से बचाव' },
              consequence: {
                en: 'SAFE CHOICE! Real couriers never threaten criminal penalties via .top or .xyz links.',
                hi: 'बिल्कुल सुरक्षित! असली कूरियर कंपनियां कभी .top या .xyz लिंक से धमकी नहीं देतीं।'
              },
              saferMove: {
                en: 'You can test links like verify-parcel.top in BaitCheck\'s "Check Message" tab anytime.',
                hi: 'verify-parcel.top जैसे किसी भी लिंक को BaitCheck के "संदेश जाँचें" टैब में चेक करें।'
              }
            }
          ]
        },
        {
          stepNumber: 2,
          uiMode: 'video-call',
          video: {
            en: '/assets/sim/digital-arrest-call-en.mp4',
            hi: '/assets/sim/digital-arrest-call-hi.mp4'
          },
          image: '/assets/sim/police-video-poster.jpg',
          imageAlt: {
            en: 'Fictional training scene showing a parcel scam escalating into a fake police call',
            hi: 'पार्सल कॉल से नकली साइबर पुलिस वीडियो कॉल में बदलाव'
          },
          stageHeader: {
            en: 'ESCALATION • TRANSFERRED TO "NARCOTICS / CYBER DESK"',
            hi: 'अगला चरण • "नारकोटिक्स / साइबर डेस्क" को कॉल ट्रांसफर'
          },
          liveTag: { en: 'ILLEGAL ITEMS CLAIM', hi: 'गैरकानूनी सामान का झूठ' },
          scammerQuote: {
            en: '"Sir, the parcel #IND-EXP-7749 has your Aadhaar & phone number on it and contained illegal passports and drugs! I am connecting you to Cyber Desk right now to clear your record!"',
            hi: '"सर, इस पार्सल पर आपका आधार और मोबाइल नंबर लिखा है और इसमें नकली पासपोर्ट मिले हैं! मैं अभी आपकी कॉल साइबर डेस्क से जोड़ रहा हूँ!"'
          },
          redFlags: [
            { en: 'Instant leap from a ₹1,850 courier parcel to "drugs/passports & Cyber Desk" is 100% a scripted scam.', hi: 'एक साधारण कूरियर से अचानक "ड्रग्स/पासपोर्ट व साइबर डेस्क" की कहानी 100% स्क्रिप्टेड ठगी है।' }
          ],
          choices: [
            {
              id: 'par-s2-stay',
              outcomeType: 'loss',
              label: {
                en: 'Stay on the transfer because you are scared your Aadhaar was misused',
                hi: 'आधार के गलत इस्तेमाल के डर से ट्रांसफर की गई कॉल पर बने रहें'
              },
              tacticExposed: { en: 'Fear Escalation Trap', hi: 'डर बढ़ाकर फंसाना' },
              consequence: {
                en: 'SIMULATED RISK: You are now inside a full Digital Arrest call where they demand ₹50,000+ to "clear your name".',
                hi: 'सिम्युलेटेड खतरा: अब आप सीधे डिजिटल अरेस्ट जाल में फंस जाते हैं, जहां नाम हटाने के नाम पर ₹50,000+ मांगे जाते हैं।'
              },
              saferMove: {
                en: 'Hang up! Real customs never connects you straight to a video interrogation.',
                hi: 'तुरंत कॉल काटें! असली कस्टम्स कभी ऐसे वीडियो पूछताछ में नहीं जोड़ता।'
              }
            },
            {
              id: 'par-s2-hangup',
              outcomeType: 'safe',
              label: {
                en: 'Hang up immediately—no real courier ever transfers callers to police video interrogations',
                hi: 'तुरंत कॉल काटें—असली कूरियर कभी पुलिस वीडियो पूछताछ में कॉल नहीं जोड़ता'
              },
              tacticExposed: { en: 'Escalation Broken', hi: 'ठगी का जाल टूटा' },
              consequence: {
                en: 'EXCELLENT! Recognizing how parcel scams morph into fake police calls keeps both your money and peace of mind safe.',
                hi: 'शानदार! पार्सल से नकली पुलिस कॉल बनने का तरीका पहचानकर आपने खुद को बचा लिया।'
              },
              saferMove: {
                en: 'Report the SMS and phone number on 1930 / cybercrime.gov.in.',
                hi: 'संदिग्ध SMS और नंबर को 1930 / cybercrime.gov.in पर रिपोर्ट करें।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Parcel/Customs scams start with a small fee lure (₹1,850) on a fake tracking link, or pivot directly into a "seized illegal parcel" story to hand the victim over to a fake Cyber Police Digital Arrest call.',
          hi: 'पार्सल ठगी नकली ट्रैकिंग लिंक पर छोटी फीस से शुरू होती है या सीधे "गैरकानूनी सामान" बताकर पीड़ित को नकली पुलिस डिजिटल अरेस्ट कॉल में फंसाती है।'
        },
        neverIgnoreFlags: [
          { en: 'Delivery links on .top, .xyz, .click, or shortened URLs.', hi: '.top, .xyz, .click या शॉर्ट लिंक वाले डिलीवरी संदेश।' },
          { en: 'Claims about parcels you never ordered containing illegal items.', hi: 'बिना ऑर्डर किए पार्सल में गैरकानूनी सामान होने का दावा।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Never click SMS tracking links—open the official app directly.', hi: 'SMS लिंक न खोलें—सीधे आधिकारिक ऐप खोलें।' },
          { en: 'Hang up if transferred to "Customs / Cyber Police".', hi: '"कस्टम्स या साइबर पुलिस" से कॉल जुड़ते ही काट दें।' }
        ]
      }
    },

    {
      id: 'ai-voice-family-emergency',
      featured: false,
      category: 'calls',
      categoryLabel: { en: 'AI VOICE & FAMILY', hi: 'AI आवाज़ व परिवार' },
      badge: { en: 'AI CLONE • EMOTIONAL PANIC', hi: 'AI आवाज़ • घबराहट' },
      title: {
        en: 'AI Voice-Cloned Family Emergency Call',
        hi: 'AI आवाज़ नकल व परिवार आपातकालीन कॉल'
      },
      summary: {
        en: 'A caller using a voice cloned from social media sounds just like your child or sibling crying for urgent UPI help from an unknown number.',
        hi: 'सोशल मीडिया से आवाज़ की नकल करके कोई अनजान नंबर से बिल्कुल आपके परिवार के सदस्य जैसी आवाज़ में रोकर तुरंत पैसे मांगता है।'
      },
      threatLevel: { en: 'HIGH RISK', hi: 'उच्च जोखिम' },
      typicalLoss: '₹15,000 – ₹1,00,000',
      coverImage: '/assets/sim/voice-video-poster.jpg',
      callerMeta: {
        name: { en: 'Unknown Number • Sounds Like Family', hi: 'अनजान नंबर • परिवार जैसी आवाज़' },
        number: '+91 70112-XX390',
        channel: { en: 'Voice Call + Text Message', hi: 'वॉइस कॉल व चैट' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'voice-call',
          video: '/assets/sim/voice-video-call.mp4',
          image: '/assets/sim/voice-video-poster.jpg',
          imageAlt: {
            en: 'Simulated incoming emergency voice call with audio waveform',
            hi: 'सिम्युलेटेड आपातकालीन कॉल स्क्रीन'
          },
          stageHeader: {
            en: 'ACTIVE CALL • +91 70112-XX390 (UNKNOWN NUMBER)',
            hi: 'कॉल जारी • +91 70112-XX390 (अनजान नंबर)'
          },
          liveTag: { en: 'VOICE SOUNDS FAMILIAR', hi: 'जानी-पहचानी आवाज़' },
          scammerQuote: {
            en: '"Mom/Dad, please help! My phone broke in a minor bike accident and I\'m using a stranger\'s phone. They\'re demanding ₹25,000 hospital/repair UPI right now—please don\'t tell anyone else, just send it fast!"',
            hi: '"मम्मी/पापा, जल्दी मदद करो! छोटा एक्सीडेंट हो गया है और मेरा फोन टूट गया। अभी ₹25,000 अस्पताल/रिपेयर के लिए चाहिए—किसी और को मत बताना, बस अभी भेज दो!"'
          },
          redFlags: [
            { en: 'AI voice cloning needs only 3–5 seconds of audio from Instagram Reels, YouTube, or WhatsApp statuses.', hi: 'AI से आवाज़ की नकल करने के लिए सोशल मीडिया वीडियो के सिर्फ 3-5 सेकंड काफी हैं।' },
            { en: 'Calls from an unknown number and insists: "Don\'t call anyone else / my phone broke."', hi: 'अनजान नंबर से कॉल और ज़िद कि "किसी और को फोन मत करना"।' }
          ],
          choices: [
            {
              id: 'ai-s1-send',
              outcomeType: 'loss',
              label: {
                en: 'Panic because it sounds like their real voice and send ₹25,000 immediately',
                hi: 'उनकी असली आवाज़ समझकर घबरा जाएं और तुरंत ₹25,000 भेज दें'
              },
              tacticExposed: { en: 'Emotional Panic + AI Voice Clone (-₹25,000)', hi: 'भावनात्मक घबराहट (-₹25,000)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹25,000! When you finally call your real family member\'s saved number 10 minutes later, they are sitting safely in class or at work.',
                hi: 'सिम्युलेटेड नुकसान: -₹25,000! 10 मिनट बाद जब आप उनके असली नंबर पर फोन करते हैं तो वे बिल्कुल सुरक्षित होते हैं!'
              },
              saferMove: {
                en: 'Always hang up and call your family member\'s SAVED phone number first.',
                hi: 'पैसे भेजने से पहले हमेशा उनके अपने पहले से सेव नंबर पर कॉल करके पक्का करें।'
              }
            },
            {
              id: 'ai-s1-secret',
              outcomeType: 'safe',
              label: {
                en: 'Hang up, call their SAVED number, and ask a secret family question only they know',
                hi: 'कॉल काटें, उनके सेव नंबर पर फोन करें और परिवार का कोई गुप्त सवाल पूछें'
              },
              tacticExposed: { en: 'Callback & Safe-Word Verification', hi: 'असली नंबर व गुप्त सवाल से जांच' },
              consequence: {
                en: 'PERFECT! Calling their real saved number or asking a family safe-word instantly defeats AI voice cloning.',
                hi: 'बहुत सही! उनके असली सेव नंबर पर फोन करना और गुप्त पारिवारिक सवाल पूछना AI आवाज़ ठगी को तुरंत रोक देता है।'
              },
              saferMove: {
                en: 'Set a simple family "safe-word" tonight that everyone remembers during emergencies.',
                hi: 'आज ही परिवार के साथ एक आसान "कोड वर्ड" तय करें।'
              }
            },
            {
              id: 'ai-s1-ask-on-call',
              outcomeType: 'escalate',
              label: {
                en: 'Stay on this same call and ask them to send the stranger\'s UPI ID on chat',
                hi: 'इसी कॉल पर बने रहें और उनसे चैट पर UPI ID भेजने को कहें'
              },
              tacticExposed: { en: 'Remaining Inside Scammer Loop', hi: 'ठग के जाल में बने रहना' },
              consequence: {
                en: 'Staying on the unknown line lets them play crying background noises to rush you in Step 2.',
                hi: 'उसी कॉल पर बने रहने से ठग रोने-चिल्लाने की नकली आवाज़ें सुनाकर आपको और डराते हैं।'
              },
              saferMove: {
                en: 'Do not verify on the same call—hang up and dial the real saved contact!',
                hi: 'उसी कॉल पर जांच न करें—फोन काटकर असली सेव नंबर मिलाएं।'
              }
            }
          ]
        },
        {
          stepNumber: 2,
          uiMode: 'voice-call',
          video: '/assets/sim/voice-video-call.mp4',
          image: '/assets/sim/voice-video-poster.jpg',
          imageAlt: {
            en: 'Simulated follow-up secret question test',
            hi: 'सिम्युलेटेड गुप्त सवाल जांच'
          },
          stageHeader: {
            en: 'VERIFICATION CHECK • TESTING THE CALLER',
            hi: 'पुष्टि जांच • कॉलर की परीक्षा'
          },
          liveTag: { en: 'ASK FAMILY SAFE-WORD', hi: 'परिवार का गुप्त सवाल पूछें' },
          scammerQuote: {
            en: '"Why are you asking weird questions like our pet\'s name?! I\'m bleeding here, just send ₹25,000 to helpdesk-99@paysim NOW!"',
            hi: '"अभी तुम पालतू जानवर का नाम जैसे अजीब सवाल क्यों पूछ रहे हो?! जल्दी helpdesk-99@paysim पर ₹25,000 भेजो!"'
          },
          redFlags: [
            { en: 'Refuses or gets angry when asked a simple personal question only real family knows.', hi: 'परिवार से जुड़ा आसान सवाल पूछते ही कॉलर का भड़क जाना या बात टालना।' }
          ],
          choices: [
            {
              id: 'ai-s2-cut',
              outcomeType: 'safe',
              label: {
                en: 'Notice they dodged the personal question—hang up, block, and call your relative\'s saved number',
                hi: 'सवाल टालते ही समझ जाएं—कॉल काटें, ब्लॉक करें और असली सेव नंबर पर फोन करें'
              },
              tacticExposed: { en: 'AI Voice Imposter Exposed', hi: 'नकली आवाज़ पकड़ी गई' },
              consequence: {
                en: '100% SAFE! An AI voice clone or scammer can mimic a voice tone, but cannot pass an unscripted family memory check.',
                hi: 'पूरी तरह सुरक्षित! AI आवाज़ की नकल कर सकता है, लेकिन परिवार की निजी यादों का जवाब नहीं दे सकता।'
              },
              saferMove: {
                en: 'Remind elders: a familiar voice on an unknown number still needs callback verification.',
                hi: 'बुजुर्गों को समझाएं कि जानी-पहचानी आवाज़ होने पर भी अनजान नंबर की जांच ज़रूरी है।'
              }
            },
            {
              id: 'ai-s2-pay',
              outcomeType: 'loss',
              label: {
                en: 'Feel guilty for questioning them and transfer ₹25,000 anyway',
                hi: 'सवाल पूछने पर शर्मिंदा होकर ₹25,000 भेज दें'
              },
              tacticExposed: { en: 'Guilt-Trip Trap (-₹25,000)', hi: 'अपराधबोध का दबाव (-₹25,000)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹25,000! Scammers intentionally act offended when questioned so guilt stops you from verifying.',
                hi: 'सिम्युलेटेड नुकसान: -₹25,000! ठग जानबूझकर नाराज़ होने का नाटक करते हैं ताकि आप जांच न करें।'
              },
              saferMove: {
                en: 'Real family members in trouble will never get angry at a 5-second safety check.',
                hi: 'असली परिजन मुसीबत में कभी 5 सेकंड की सुरक्षा जांच पर नाराज़ नहीं होते।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Scammers sample a few seconds of voice from public videos or voicemails, clone it with AI, call relatives from an unknown number claiming a broken phone/accident, and demand instant UPI payment.',
          hi: 'ठग पब्लिक वीडियो से कुछ सेकंड की आवाज़ लेकर AI क्लोन बनाते हैं, अनजान नंबर से एक्सीडेंट या फोन टूटने का नाटक कर तुरंत UPI मांगते हैं।'
        },
        neverIgnoreFlags: [
          { en: 'Urgent money plea from an unknown number sounding like family.', hi: 'अनजान नंबर से परिवार जैसी आवाज़ में तुरंत पैसों की मांग।' },
          { en: '"Do not call anyone else" or "My phone broke".', hi: '"किसी और को मत बताना" या "मेरा फोन टूट गया"।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Hang up and call the person\'s real saved number.', hi: 'कॉल काटकर उनके असली सेव नंबर पर फोन करें।' },
          { en: 'Use a pre-agreed family safe-word or memory question.', hi: 'परिवार का तय किया हुआ गुप्त कोड वर्ड पूछें।' }
        ]
      }
    },

    {
      id: 'prepaid-task-vip-job',
      featured: false,
      category: 'jobs',
      categoryLabel: { en: 'WORK & PREPAID TASKS', hi: 'नौकरी व प्रीपेड टास्क' },
      badge: { en: 'SUNK-COST TRAP • GROWING FAST', hi: 'नौकरी का लालच • तेज़ी से बढ़ता जाल' },
      title: {
        en: 'Work-From-Home "VIP Prepaid Task" Scam',
        hi: 'घर बैठे काम और "VIP प्रीपेड टास्क" ठगी'
      },
      summary: {
        en: 'Starts with easy ₹150 payouts for liking videos/reviews, then traps you inside a fake "TaskPay VIP" dashboard demanding ₹5,000+ to unlock frozen earnings.',
        hi: 'पहले वीडियो लाइक करने पर सच में ₹150 देकर भरोसा जीतते हैं, फिर नकली वॉलेट में ₹18,450 दिखाकर निकालने के लिए ₹5,000 जमा करवाते हैं।'
      },
      threatLevel: { en: 'CRITICAL RISK', hi: 'अत्यधिक जोखिम' },
      typicalLoss: '₹5,000 – ₹4,00,000+',
      coverImage: '/assets/sim/task-wallet.svg',
      callerMeta: {
        name: { en: 'TaskPay VIP Receptionist (Demo)', hi: 'टास्कपे VIP रिसेप्शनिस्ट (डेमो)' },
        number: '@taskpay_vip_desk',
        channel: { en: 'Chat Group + Fake Wallet App', hi: 'चैट ग्रुप व नकली ऐप' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'task-app',
          image: '/assets/sim/task-wallet.svg',
          imageAlt: {
            en: 'Simulated fake VIP task wallet showing ₹18,450 frozen',
            hi: 'सिम्युलेटेड नकली VIP टास्क वॉलेट जिसमें ₹18,450 लॉक दिख रहे हैं'
          },
          stageHeader: {
            en: 'WORK-FROM-HOME CHAT GROUP • EARN ₹3,000/DAY',
            hi: 'पार्ट-टाइम जॉब ग्रुप • रोज़ ₹3,000 कमाएं'
          },
          liveTag: { en: 'FIRST ₹150 PAID!', hi: 'पहले ₹150 मिले!' },
          scammerQuote: {
            en: '"Congrats! You earned ₹150 for liking 3 restaurant reviews and we sent it to your bank. Now unlock VIP Level 4 Merchant Tasks: deposit ₹5,000 and withdraw ₹18,450 immediately!"',
            hi: '"बधाई! 3 रिव्यू लाइक करने पर ₹150 आपके बैंक में भेज दिए गए हैं। अब VIP टास्क अनलॉक करने के लिए ₹5,000 जमा करें और तुरंत ₹18,450 निकालें!"'
          },
          redFlags: [
            { en: 'Sending real ₹150 first is bait—scammers invest ₹150–₹500 so you trust them with ₹50,000+!', hi: 'शुरू में ₹150 सच में भेजना सिर्फ भरोसा जीतने का लालच है ताकि आप बाद में बड़े पैसे लगाएं।' },
            { en: 'Any "job" that asks YOU to deposit money first to earn wages is a scam.', hi: 'कोई भी असली नौकरी कमाई निकालने के लिए आपसे पहले पैसे जमा करने को नहीं कहती।' }
          ],
          choices: [
            {
              id: 'task-s1-deposit',
              outcomeType: 'escalate',
              label: {
                en: 'Deposit ₹5,000 since they already paid you ₹150 honestly',
                hi: 'उन्होंने सच में ₹150 दिए हैं, इसलिए भरोसा करके ₹5,000 जमा कर दें'
              },
              tacticExposed: { en: 'Reciprocity Bait (-₹5,000)', hi: 'छोटे फायदे से बड़े जाल में फंसाना' },
              consequence: {
                en: 'Trap sprung! Your ₹5,000 goes straight to the scammer, and the fake dashboard raises your trapped display balance to ₹18,450—only to freeze it in Step 2!',
                hi: 'जाल बिछ गया! आपके ₹5,000 ठग के खाते में गए और नकली ऐप पर सिर्फ स्क्रीन के नंबर ₹18,450 दिखते हैं—जिन्हें वे लॉक कर देंगे!'
              },
              saferMove: {
                en: 'Stop immediately once ANY job asks you to pay or "recharge" first.',
                hi: 'जैसे ही कोई काम आपसे पहले पैसे जमा करने को कहे, तुरंत रुक जाएं।'
              }
            },
            {
              id: 'task-s1-stop',
              outcomeType: 'safe',
              label: {
                en: 'Never pay a deposit for a job—exit and block the group immediately',
                hi: 'नौकरी के लिए कभी पैसे जमा न करें—तुरंत ग्रुप से निकलकर ब्लॉक करें'
              },
              tacticExposed: { en: 'Prepaid Task Trap Avoided', hi: 'प्रीपेड टास्क ठगी से बचाव' },
              consequence: {
                en: 'SMART! Real employers pay YOU—they never ask workers to fund "merchant orders" or "VIP levels".',
                hi: 'बहुत बढ़िया! असली कंपनियां काम के पैसे देती हैं, कामगारों से "VIP लेवल" के पैसे नहीं मांगतीं।'
              },
              saferMove: {
                en: 'Tap Next Step to see how victims get trapped deeper by the "Frozen Withdrawal" screen.',
                hi: 'नीचे देखें कि वॉलेट फ्रीज़ होने पर ठग आगे कैसे फंसाते हैं।'
              }
            }
          ]
        },
        {
          stepNumber: 2,
          uiMode: 'task-app',
          image: '/assets/sim/task-wallet.svg',
          imageAlt: {
            en: 'Simulated frozen balance ₹18,450 demanding ₹10,000 unlock',
            hi: 'सिम्युलेटेड लॉक बैलेंस ₹18,450 निकालने के लिए और पैसे मांगना'
          },
          stageHeader: {
            en: 'TASKPAY VIP WALLET • WITHDRAWAL FROZEN (92%)',
            hi: 'टास्कपे VIP वॉलेट • निकासी रुकी हुई है (92%)'
          },
          liveTag: { en: 'PAY MORE TO UNLOCK', hi: 'निकालने के लिए और जमा करें' },
          scammerQuote: {
            en: '"Oops! Your credit score dropped because Task #4 wasn\'t finished. ₹18,450 is FROZEN. Deposit ₹10,000 for the final Super-Order to unlock your full ₹28,450 payout!"',
            hi: '"अरे! एक टास्क अधूरा रहने से ₹18,450 फ्रीज़ हो गए हैं। पूरे ₹28,450 निकालने के लिए आखिरी ₹10,000 का सुपर-टास्क पूरा करें!"'
          },
          redFlags: [
            { en: 'The fake wallet numbers (₹18,450) are completely imaginary—just text on a scam website!', hi: 'वॉलेट में दिख रहा ₹18,450 बैलेंस पूरी तरह नकली है—सिर्फ स्क्रीन पर लिखा टेक्स्ट!' },
            { en: 'Fake group members ("I just withdrew ₹45,000!") are all bots/accomplices.', hi: 'ग्रुप में पैसे मिलने का स्क्रीनशॉट डालने वाले बाकी लोग भी ठग के साथी होते हैं।' }
          ],
          choices: [
            {
              id: 'task-s2-chase',
              outcomeType: 'loss',
              label: {
                en: 'Pay ₹10,000 just to recover your stuck ₹5,000 and ₹18,450 balance',
                hi: 'अपने अटके ₹5,000 और ₹18,450 वापस पाने के लिए ₹10,000 और जमा कर दें'
              },
              tacticExposed: { en: 'Sunk-Cost Escalation (-₹15,000+)', hi: 'अटका पैसा निकालने में और नुकसान' },
              consequence: {
                en: 'SIMULATED LOSS: -₹15,000! This loop NEVER ends—after ₹10,000, they invent a ₹25,000 "Tax / GST Release" demand.',
                hi: 'सिम्युलेटेड नुकसान: -₹15,000! यह सिलसिला कभी खत्म नहीं होता—इसके बाद वे "टैक्स/GST" के नाम पर ₹25,000 और मांगेंगे।'
              },
              saferMove: {
                en: 'Accept that the first loss cannot be recovered by paying the scammer more. Stop & report to 1930.',
                hi: 'ठग को और पैसे देकर अटका पैसा कभी वापस नहीं मिलता—तुरंत रुकें और 1930 पर रिपोर्ट करें।'
              }
            },
            {
              id: 'task-s2-cutloss',
              outcomeType: 'safe',
              label: {
                en: 'Stop paying immediately, save all chat screenshots & bank receipts, and report to 1930',
                hi: 'और पैसे देना तुरंत बंद करें, चैट के स्क्रीनशॉट बचाएं और 1930 पर रिपोर्ट करें'
              },
              tacticExposed: { en: 'Sunk-Cost Trap Broken', hi: 'बड़े नुकसान से बचाव' },
              consequence: {
                en: 'BRAVE & SMART MOVE! Stopping now saves your remaining savings. The "₹18,450 balance" never existed.',
                hi: 'सही और हिम्मत वाला फैसला! अभी रुकने से आपकी बाकी पूंजी बच गई—वह ₹18,450 कभी थे ही नहीं।'
              },
              saferMove: {
                en: 'Report all UPI IDs/bank accounts you paid on cybercrime.gov.in immediately.',
                hi: 'जिन खातों में पैसे भेजे थे, उन्हें तुरंत cybercrime.gov.in पर रिपोर्ट करें।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Task scams hook victims with real small payments (₹150) for liking videos/maps, then move them to "Prepaid VIP Tasks" inside a fake dashboard showing imaginary frozen profits that require bigger and bigger deposits to withdraw.',
          hi: 'टास्क ठगी पहले लाइक/रिव्यू के लिए सच में ₹150 देकर भरोसा जीतती है, फिर नकली डैशबोर्ड में बड़ी कमाई दिखाकर "प्रीपेड टास्क" के नाम पर लाखों रुपये जमा करवाती है।'
        },
        neverIgnoreFlags: [
          { en: 'Any job promising ₹2,000–₹5,000/day for liking videos or rating places.', hi: 'वीडियो लाइक करने या रेटिंग देने के बदले रोज़ हज़ारों रुपये का वादा।' },
          { en: 'Asking you to deposit/recharge money before you can withdraw salary.', hi: 'कमाई निकालने से पहले पैसे जमा करने की शर्त।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Never send money to unlock earnings—walk away immediately.', hi: 'कमाई अनलॉक करने के लिए कभी पैसे न भेजें।' },
          { en: 'Keep receipts and report at 1930 / cybercrime.gov.in.', hi: 'रसीद संभालकर 1930 और cybercrime.gov.in पर रिपोर्ट करें।' }
        ]
      }
    },

    {
      id: 'fake-bank-kyc-phish',
      featured: false,
      category: 'payments',
      categoryLabel: { en: 'BANK SMS & PHISHING', hi: 'बैंक SMS व नकली वेबसाइट' },
      badge: { en: 'LOOKALIKE URL • PUNYCODE', hi: 'हमशक्ल लिंक • फिशिंग' },
      title: {
        en: 'Fake Bank "KYC Suspended" SMS & Lookalike Site',
        hi: 'नकली बैंक "KYC बंद" SMS और हमशक्ल वेबसाइट'
      },
      summary: {
        en: 'An urgent SMS warns your bank account will freeze in 2 hours and links to a lookalike Punycode site asking for card details & OTP.',
        hi: 'SMS में 2 घंटे में बैंक खाता बंद होने का डर दिखाकर हमशक्ल वेबसाइट पर कार्ड नंबर व OTP मांगा जाता है।'
      },
      threatLevel: { en: 'HIGH RISK', hi: 'उच्च जोखिम' },
      typicalLoss: '₹20,000 – ₹2,00,000',
      coverImage: '/assets/sim/bank-kyc-browser.svg',
      callerMeta: {
        name: { en: 'MetroBank KYC Alert (Demo)', hi: 'मेट्रोबैंक KYC अलर्ट (डेमो)' },
        number: 'xn--metrobank-kyc-9x2a.example',
        channel: { en: 'SMS + Mobile Browser', hi: 'SMS व मोबाइल ब्राउज़र' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'browser-phish',
          image: '/assets/sim/bank-kyc-browser.svg',
          imageAlt: {
            en: 'Simulated mobile browser showing lookalike xn--metrobank-kyc-9x2a.example phishing site',
            hi: 'सिम्युलेटेड मोबाइल ब्राउज़र जिसमें नकली बैंक KYC वेबसाइट खुली है'
          },
          stageHeader: {
            en: 'URL: https://xn--metrobank-kyc-9x2a.example/kyc-update',
            hi: 'लिंक: https://xn--metrobank-kyc-9x2a.example/kyc-update'
          },
          liveTag: { en: 'ACCOUNT BLOCKED IN 2 HRS', hi: '2 घंटे में खाता बंद' },
          scammerQuote: {
            en: '"ALERT: Your Metro Bank KYC is suspended today. Enter your Debit Card, PIN, and 6-digit OTP on this secure padlock page within 2 hours or your account is permanently frozen!"',
            hi: '"चेतावनी: आज आपका बैंक KYC बंद हो गया है। खाता चालू रखने के लिए 2 घंटे में इस पेज पर डेबिट कार्ड, PIN और 6 अंकों का OTP भरें!"'
          },
          redFlags: [
            { en: 'Address starts with "xn--" (Punycode) or odd suffix ".example/.xyz"—a lookalike fake domain!', hi: 'वेबसाइट के पते में "xn--" (Punycode) या अजीब डोमेन लगा है—यह नकली हमशक्ल साइट है!' },
            { en: 'A real padlock icon (HTTPS) ONLY means the connection is encrypted—scam sites have padlocks too!', hi: 'ताले का निशान (HTTPS) होने का मतलब यह नहीं कि वेबसाइट असली है—नकली साइटों पर भी ताला होता है।' },
            { en: 'Banks never ask for Debit Card PIN or OTP on a web link for KYC.', hi: 'बैंक कभी KYC के लिए वेबसाइट पर कार्ड PIN या OTP नहीं मांगते।' }
          ],
          choices: [
            {
              id: 'kyc-s1-submit',
              outcomeType: 'loss',
              label: {
                en: 'Fill in card details & OTP quickly because the browser shows a green padlock',
                hi: 'ब्राउज़र में हरा ताला दिख रहा है, इसलिए जल्दी कार्ड डिटेल और OTP भर दें'
              },
              tacticExposed: { en: 'Padlock Myth + Phishing (-₹60,000)', hi: 'ताले के निशान का भ्रम (-₹60,000)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹60,000! Scammers capture your card + OTP in real time and immediately authorize a high-value purchase.',
                hi: 'सिम्युलेटेड नुकसान: -₹60,000! नकली साइट तुरंत आपका कार्ड व OTP चुराकर बड़ी रकम की खरीदारी कर लेती है।'
              },
              saferMove: {
                en: 'Check the exact domain name—ignore the padlock myth—and use only your bank\'s official app.',
                hi: 'ताले के बजाय पूरा वेबसाइट पता देखें और हमेशा बैंक के आधिकारिक ऐप से ही KYC जांचें।'
              }
            },
            {
              id: 'kyc-s1-verify',
              outcomeType: 'safe',
              label: {
                en: 'Close the page without typing anything, spot the xn-- domain, and check your official bank app',
                hi: 'बिना कुछ भरे पेज बंद करें, xn-- नकली डोमेन पहचानें और आधिकारिक बैंक ऐप जांचें'
              },
              tacticExposed: { en: 'Phishing Domain Caught', hi: 'नकली वेबसाइट पकड़ी गई' },
              consequence: {
                en: 'EXCELLENT! You looked past the padlock icon, caught the lookalike domain, and verified safely.',
                hi: 'शानदार! आपने ताले के भ्रम से परे जाकर नकली डोमेन पहचान लिया।'
              },
              saferMove: {
                en: 'You can test any SMS link inside BaitCheck\'s "Check Message" X-Ray tab!',
                hi: 'किसी भी संदिग्ध SMS लिंक को BaitCheck के "संदेश जाँचें" टैब में तुरंत जांच सकते हैं।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Phishing SMS messages threaten urgent KYC suspension and send victims to lookalike Punycode or disposable domains with HTTPS padlocks to harvest banking credentials and OTPs.',
          hi: 'फिशिंग SMS में KYC बंद होने का डर दिखाकर नकली हमशक्ल वेबसाइट पर कार्ड, पासवर्ड और OTP चुराए जाते हैं।'
        },
        neverIgnoreFlags: [
          { en: 'Domains with "xn--", misspelled bank names, or .xyz/.top endings.', hi: '"xn--", गलत स्पेलिंग या .xyz/.top वाली वेबसाइटें।' },
          { en: 'Any KYC form asking for Debit Card PIN, CVV, or OTP.', hi: 'KYC के नाम पर कार्ड PIN, CVV या OTP मांगना।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Close the browser tab and verify directly inside your bank\'s official app or branch.', hi: 'ब्राउज़र बंद करें और सीधे बैंक के आधिकारिक ऐप या शाखा से जांचें।' },
          { en: 'Run suspicious texts through BaitCheck\'s Check Message tab.', hi: 'संदिग्ध संदेश को BaitCheck के "संदेश जाँचें" में जांचें।' }
        ]
      }
    },

    {
      id: 'remote-screen-share',
      featured: false,
      category: 'calls',
      categoryLabel: { en: 'SCREEN SHARING & TECH', hi: 'स्क्रीन शेयरिंग ठगी' },
      badge: { en: 'REMOTE ACCESS • FULL CONTROL', hi: 'रिमोट एक्सेस • पूरा कंट्रोल' },
      title: {
        en: 'Fake Tech Support & Screen-Sharing Code Scam',
        hi: 'नकली कस्टमर केयर व स्क्रीन शेयरिंग कोड ठगी'
      },
      summary: {
        en: 'A caller pretending to fix a "blocked refund" or "phone virus" asks you to install a remote-support app and read out a 9-digit screen code.',
        hi: 'रिफंड दिलाने या "फोन वायरस" ठीक करने के नाम पर कॉलर आपसे स्क्रीन-शेयरिंग ऐप इंस्टॉल कराकर 9 अंकों का कोड पूछता है।'
      },
      threatLevel: { en: 'CRITICAL RISK', hi: 'अत्यधिक जोखिम' },
      typicalLoss: '₹30,000 – ₹3,00,000',
      coverImage: '/assets/sim/screen-share-trap.svg',
      callerMeta: {
        name: { en: 'Customer Care Desk (Demo)', hi: 'कस्टमर केयर डेस्क (डेमो)' },
        number: '+91 90011-XX654',
        channel: { en: 'Support Call + Screen Share', hi: 'कॉल व स्क्रीन शेयर' }
      },
      steps: [
        {
          stepNumber: 1,
          uiMode: 'screen-share',
          image: '/assets/sim/screen-share-trap.svg',
          imageAlt: {
            en: 'Simulated screen sharing pairing code 492 810 337 exposing SMS OTPs',
            hi: 'सिम्युलेटेड स्क्रीन शेयरिंग कोड जिससे बैंक OTP दिख जाते हैं'
          },
          stageHeader: {
            en: 'SUPPORT CALL • "INSTALL REMOTE APP TO GET REFUND"',
            hi: 'सपोर्ट कॉल • "रिफंड के लिए रिमोट ऐप डालें"'
          },
          liveTag: { en: 'CODE: 492 810 337', hi: 'कोड: 492 810 337' },
          scammerQuote: {
            en: '"Sir, our refund server isn\'t connecting to your phone. Install this Quick Support app and read me the 9-digit number on your screen so our technician can credit your refund directly!"',
            hi: '"सर, रिफंड आपके फोन से कनेक्ट नहीं हो रहा। यह क्विक सपोर्ट ऐप डालें और स्क्रीन पर दिख रहे 9 अंक बताएं ताकि हमारे टेक्नीशियन सीधे रिफंड डाल सकें!"'
          },
          redFlags: [
            { en: 'Sharing a remote-access code lets a stranger WATCH your screen and see every SMS OTP and banking PIN!', hi: 'स्क्रीन शेयर कोड बताने से अनजान व्यक्ति आपके फोन की पूरी स्क्रीन और बैंक OTP देख सकता है।' },
            { en: 'Real customer care NEVER needs to see or control your phone screen to issue a refund.', hi: 'असली कस्टमर केयर को रिफंड देने के लिए कभी आपके फोन की स्क्रीन देखने की ज़रूरत नहीं होती।' }
          ],
          choices: [
            {
              id: 'scr-s1-read',
              outcomeType: 'loss',
              label: {
                en: 'Read out the 9-digit code (492 810 337) so they can process the refund',
                hi: 'रिफंड पाने के लिए स्क्रीन पर दिख रहा 9 अंकों का कोड बता दें'
              },
              tacticExposed: { en: 'Full Screen Mirroring Hijack (-₹85,000)', hi: 'पूरी स्क्रीन व OTP का कंट्रोल (-₹85,000)' },
              consequence: {
                en: 'SIMULATED LOSS: -₹85,000! Once connected, they ask you to open your UPI/banking app "to check if refund arrived", capture your login & OTPs live, and empty the account!',
                hi: 'सिम्युलेटेड नुकसान: -₹85,000! जुड़ते ही वे आपसे बैंक ऐप खोलने को कहते हैं, स्क्रीन पर आपके OTP देखकर पूरा खाता खाली कर देते हैं!'
              },
              saferMove: {
                en: 'Never install screen-sharing apps or share pairing codes with callers.',
                hi: 'कॉल करने वाले के कहने पर कभी स्क्रीन-शेयर ऐप न डालें और न कोड बताएं।'
              }
            },
            {
              id: 'scr-s1-hangup',
              outcomeType: 'safe',
              label: {
                en: 'Refuse to install or share the code, hang up, and use in-app customer support only',
                hi: 'ऐप डालने या कोड बताने से मना करें, कॉल काटें और आधिकारिक ऐप के भीतर से मदद लें'
              },
              tacticExposed: { en: 'Remote Hijack Stopped', hi: 'रिमोट कंट्रोल से बचाव' },
              consequence: {
                en: 'SAFE & SHARP! Never give a stranger eyes or hands on your phone screen.',
                hi: 'बिल्कुल सुरक्षित! किसी अनजान व्यक्ति को अपने फोन की स्क्रीन का कंट्रोल कभी न दें।'
              },
              saferMove: {
                en: 'Always search customer care numbers inside the official app—never on random search ads.',
                hi: 'कस्टमर केयर नंबर हमेशा आधिकारिक ऐप के अंदर से लें, इंटरनेट विज्ञापन से नहीं।'
              }
            }
          ]
        }
      ],
      fullAnalysis: {
        howItWorks: {
          en: 'Fake customer-care callers found via search ads or unsolicited calls trick victims into installing remote desktop / screen-sharing tools, then read banking OTPs and passwords right off the victim\'s screen.',
          hi: 'नकली कस्टमर केयर वाले स्क्रीन-शेयरिंग ऐप इंस्टॉल कराकर पीड़ित के फोन की स्क्रीन और OTP लाइव देख लेते हैं।'
        },
        neverIgnoreFlags: [
          { en: 'Caller asks you to install a remote support / screen-share app.', hi: 'कॉलर द्वारा रिमोट सपोर्ट या स्क्रीन-शेयर ऐप इंस्टॉल करवाना।' },
          { en: 'Asking for a 9-digit pairing code to process a refund or fix a virus.', hi: 'रिफंड या वायरस ठीक करने के लिए 9 अंकों का कोड मांगना।' }
        ],
        whatToDoIfTargeted: [
          { en: 'Disconnect immediately and uninstall any screen-sharing app.', hi: 'तुरंत कॉल काटें और स्क्रीन-शेयर ऐप हटा दें।' },
          { en: 'If screen was shared while opening a bank app, call 1930 & freeze cards.', hi: 'अगर बैंक ऐप खोलते समय स्क्रीन शेयर हुई हो तो तुरंत 1930 व बैंक को कॉल करें।' }
        ]
      }
    }
  ];

  const PARENT_KID_LESSONS = [
    {
      id: 'pk-dad-told-me',
      badge: { en: 'AI VOICE & UPI • FOR KIDS', hi: 'AI आवाज़ व UPI • बच्चों के लिए' },
      title: {
        en: '"Your Dad told me to tell you: send ₹1,00,000 urgent UPI!"',
        hi: '"पापा ने कहा है कि अभी ₹1,00,000 UPI से भेज दो!"'
      },
      story: {
        en: 'A caller sounds like your parent\'s friend—or even uses an AI-cloned voice of Dad—saying: "Dad\'s phone battery died and he is stuck at a clinic. Send ₹1,00,000 from your or Mom\'s UPI right now, and don\'t disturb him!"',
        hi: 'एक कॉलर पापा के दोस्त जैसा—या AI से पापा जैसी आवाज़ बनाकर—कहता है: "पापा का फोन बंद हो गया है और वे क्लिनिक में फंसे हैं। अभी ₹1,00,000 UPI से भेज दो और उन्हें बार-बार फोन मत करना!"'
      },
      choices: [
        {
          id: 'pk1-send',
          safe: false,
          label: {
            en: 'Send the money quickly because it sounded urgent and mentioned Dad\'s name',
            hi: 'पापा का नाम सुनकर घबरा जाएं और जल्दी पैसे भेज दें'
          }
        },
        {
          id: 'pk1-verify',
          safe: true,
          label: {
            en: 'Hang up, call Dad\'s or Mom\'s saved number directly, and use our Family Safe-Word',
            hi: 'कॉल काटें, सीधे मम्मी या पापा के सेव नंबर पर फोन करें और परिवार का कोड वर्ड पूछें'
          }
        }
      ],
      teachPoint: {
        en: 'Explain to your child: AI can copy anyone\'s voice from social media videos, and scammers often name-drop parents. NEVER transfer money without calling Mom or Dad\'s saved number directly.',
        hi: 'बच्चे को समझाएं: AI किसी की भी आवाज़ की नकल कर सकता है। बिना मम्मी/पापा के सेव नंबर पर बात किए कभी 1 रुपया भी न भेजें।'
      }
    },
    {
      id: 'pk-game-qr',
      badge: { en: 'GAMING & PRIZE QR • FOR KIDS', hi: 'गेम व इनाम QR • बच्चों के लिए' },
      title: {
        en: 'Free Game Coins / Scholarship: "Scan QR & Enter UPI PIN"',
        hi: 'फ्री गेम कॉइन या इनाम: "QR स्कैन करके UPI PIN डालो"'
      },
      story: {
        en: 'An online gaming teammate or social page says you won ₹5,000 or free game credits—just scan their QR code in a UPI app and type the PIN to "unlock" the reward.',
        hi: 'ऑनलाइन गेम का साथी या सोशल मीडिया पेज कहता है कि आपने ₹5,000 या फ्री गेम कॉइन जीते हैं—इनाम पाने के लिए QR स्कैन करके UPI PIN डालें।'
      },
      choices: [
        {
          id: 'pk2-scan',
          safe: false,
          label: {
            en: 'Scan the QR and enter the UPI PIN to claim the prize',
            hi: 'इनाम पाने के लिए QR स्कैन करें और UPI PIN डाल दें'
          }
        },
        {
          id: 'pk2-refuse',
          safe: true,
          label: {
            en: 'Say NO—UPI PIN only sends money out, and ask a parent before scanning any payment QR',
            hi: 'मना करें—UPI PIN से पैसा केवल बाहर जाता है, और किसी भी QR से पहले माता-पिता से पूछें'
          }
        }
      ],
      teachPoint: {
        en: 'Teach kids one crystal-clear rule: Entering a UPI PIN NEVER gives you money or game rewards—it ALWAYS takes money out of the bank account.',
        hi: 'बच्चों को एक पक्का नियम सिखाएं: UPI PIN डालने से कभी पैसे या इनाम नहीं मिलते—इससे हमेशा खाते से पैसे कटते हैं।'
      }
    },
    {
      id: 'pk-secret-call',
      badge: { en: 'SECRECY & BLACKMAIL • FOR TEENS', hi: 'धमकी व गोपनीयता • किशोरों के लिए' },
      title: {
        en: '"I am a Cyber Officer — Do NOT tell your parents!"',
        hi: '"मैं साइबर ऑफिसर हूँ — अपने माता-पिता को बिल्कुल मत बताना!"'
      },
      story: {
        en: 'A stranger on video call threatens a teenager with a fake complaint or AI-edited photo and warns: "Don\'t tell your parents or we will arrest them. Send gift cards or screen-share your phone!"',
        hi: 'वीडियो कॉल पर अनजान व्यक्ति किशोर को नकली केस या एडिटेड फोटो से डराकर कहता है: "माता-पिता को मत बताना वरना उन्हें जेल हो जाएगी। गिफ्ट कार्ड दो या स्क्रीन शेयर करो!"'
      },
      choices: [
        {
          id: 'pk3-hide',
          safe: false,
          label: {
            en: 'Keep it secret out of fear and try to handle it alone',
            hi: 'डर के मारे माता-पिता से छिपाएं और अकेले सुलझाने की कोशिश करें'
          }
        },
        {
          id: 'pk3-tell',
          safe: true,
          label: {
            en: 'Hang up immediately and tell Mom or Dad right away—secrets only help scammers',
            hi: 'तुरंत कॉल काटें और बिना डरे मम्मी/पापा को बताएं—बात छिपाने से केवल ठग को फायदा होता है'
          }
        }
      ],
      teachPoint: {
        en: 'Give your child a "No-Blame Promise": tell them clearly that if anyone ever threatens them online or asks them to keep a secret from parents, coming to you immediately is ALWAYS the safest choice.',
        hi: 'अपने बच्चे से "कोई डांट नहीं" का वादा करें: ऑनलाइन कोई भी डराए या माता-पिता से बात छिपाने को कहे, तो तुरंत आपको बताना सबसे सुरक्षित है।'
      }
    }
  ];

  // Preserve compatibility reference for any reader expecting BaitCheckScenarios
  global.BaitCheckRealLifeScams = REAL_LIFE_SCAMS;
  global.BaitCheckParentLessons = PARENT_KID_LESSONS;
  global.BaitCheckScenarios = REAL_LIFE_SCAMS;
})(window);
