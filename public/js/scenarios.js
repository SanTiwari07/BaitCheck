'use strict';

(function (global) {
  const SCAM_LEARNING_SCENARIOS = [
    {
      id: 'family-emergency-call',
      category: { en: 'FAMILY & CALLS', hi: 'परिवार और कॉल' },
      title: { en: 'A family emergency voice call', hi: 'परिवार के नाम पर आपातकालीन कॉल' },
      story: {
        en: 'A caller sounds like someone in your family. They say they need money now and tell you not to call anyone else.',
        hi: 'कॉलर की आवाज़ परिवार के किसी व्यक्ति जैसी लगती है। वे तुरंत पैसे माँगते हैं और कहते हैं कि किसी और को फोन न करें।'
      },
      choices: [
        { id: 'send', label: { en: 'Send the money now to help them.', hi: 'मदद के लिए अभी पैसे भेज दें।' }, safe: false },
        { id: 'verify', label: { en: 'Hang up. Call their saved number or ask a family question only they know.', hi: 'कॉल काटें। उनके सेव किए नंबर पर फोन करें या परिवार का तय सवाल पूछें।' }, safe: true }
      ],
      clue: {
        en: 'A familiar voice can be copied. Panic, secrecy, and “act now” are warning signs.',
        hi: 'जानी-पहचानी आवाज़ की नकल हो सकती है। घबराहट, गोपनीयता और “अभी करो” चेतावनी के संकेत हैं।'
      },
      action: {
        en: 'Pause and verify through a number you already trust. Never use a number supplied by the caller.',
        hi: 'रुकें और पहले से भरोसेमंद नंबर से पुष्टि करें। कॉलर के दिए नंबर पर भरोसा न करें।'
      }
    },
    {
      id: 'parcel-qr-fee',
      category: { en: 'MESSAGES & QR CODES', hi: 'संदेश और QR कोड' },
      title: { en: 'A parcel is “stuck”', hi: 'आपका पार्सल “रुका हुआ” है' },
      story: {
        en: 'A text says your parcel cannot be delivered until you scan a QR code and pay a small fee.',
        hi: 'एक संदेश कहता है कि QR कोड स्कैन करके छोटी फीस देने तक आपका पार्सल नहीं पहुँचेगा।'
      },
      choices: [
        { id: 'scan', label: { en: 'Scan the QR code to pay the fee.', hi: 'फीस देने के लिए QR कोड स्कैन करें।' }, safe: false },
        { id: 'track', label: { en: 'Do not scan it. Check tracking in the delivery company’s official app or website.', hi: 'QR स्कैन न करें। डिलीवरी कंपनी के आधिकारिक ऐप या वेबसाइट पर ट्रैकिंग देखें।' }, safe: true }
      ],
      clue: {
        en: 'Unexpected fees and QR codes can send you to a fake payment page.',
        hi: 'अचानक फीस और QR कोड आपको नकली भुगतान पेज पर ले जा सकते हैं।'
      },
      action: {
        en: 'Open the official app yourself or type its known website address. Do not follow the message link.',
        hi: 'आधिकारिक ऐप खुद खोलें या उसका जाना-पहचाना पता लिखें। संदेश का लिंक न खोलें।'
      }
    },
    {
      id: 'job-fee-scam',
      category: { en: 'WORK & MONEY', hi: 'काम और पैसे' },
      title: { en: 'A job that asks you to pay first', hi: 'ऐसी नौकरी जो पहले पैसे माँगे' },
      story: {
        en: 'A message promises easy online work and asks for a “refundable” joining or training fee before you can earn.',
        hi: 'एक संदेश आसान ऑनलाइन काम का वादा करता है और कमाई से पहले “वापस मिलने वाली” जॉइनिंग या ट्रेनिंग फीस माँगता है।'
      },
      choices: [
        { id: 'pay', label: { en: 'Pay the small fee so you do not lose the job.', hi: 'नौकरी न छूटे इसलिए छोटी फीस दे दें।' }, safe: false },
        { id: 'check', label: { en: 'Do not pay. Check the company independently and ask a trusted adult if unsure.', hi: 'पैसे न दें। कंपनी की खुद जाँच करें और शक हो तो भरोसेमंद बड़े से पूछें।' }, safe: true }
      ],
      clue: {
        en: 'A real job should not pressure you to pay to unlock your wages. “Refundable” does not make a fee safe.',
        hi: 'असली नौकरी में वेतन पाने के लिए पैसे देने का दबाव नहीं होना चाहिए। “वापस मिलने वाली” फीस भी सुरक्षित होने की गारंटी नहीं है।'
      },
      action: {
        en: 'Stop the chat. Find the company’s contact details independently and verify the offer before sharing money or documents.',
        hi: 'चैट रोकें। कंपनी का संपर्क खुद खोजें और पैसे या दस्तावेज़ देने से पहले ऑफर की पुष्टि करें।'
      }
    },
    {
      id: 'fake-tech-support',
      category: { en: 'DEVICES & SUPPORT', hi: 'डिवाइस और सहायता' },
      title: { en: 'A caller wants to “fix” your phone', hi: 'कॉलर आपका फोन “ठीक” करना चाहता है' },
      story: {
        en: 'A stranger says your phone has a virus. They ask you to install a screen-sharing app and read out a code.',
        hi: 'एक अनजान व्यक्ति कहता है कि आपके फोन में वायरस है। वे स्क्रीन साझा करने वाला ऐप इंस्टॉल करने और एक कोड बताने को कहते हैं।'
      },
      choices: [
        { id: 'share', label: { en: 'Install the app and share the code so they can help.', hi: 'मदद के लिए ऐप इंस्टॉल करें और कोड बता दें।' }, safe: false },
        { id: 'end', label: { en: 'End the call. Do not install it or share codes; contact support through the official app.', hi: 'कॉल काटें। ऐप इंस्टॉल या कोड साझा न करें; आधिकारिक ऐप से सहायता लें।' }, safe: true }
      ],
      clue: {
        en: 'Remote access can let a stranger see or control your screen. Unsolicited support calls are not trustworthy.',
        hi: 'रिमोट एक्सेस से अनजान व्यक्ति आपकी स्क्रीन देख या चला सकता है। बिना माँगी सहायता वाली कॉल पर भरोसा न करें।'
      },
      action: {
        en: 'End the call. Never share one-time codes, passwords, or screen access with an unexpected caller.',
        hi: 'कॉल काटें। अनजान कॉलर को OTP, पासवर्ड या स्क्रीन का एक्सेस न दें।'
      }
    }
  ];

  global.BaitCheckScenarios = SCAM_LEARNING_SCENARIOS;
})(window);
