'use strict';

/**
 * Bilingual (EN + हिंदी) interactive panic drills for BaitCheck.
 * Strictly uses fictional demo entities and zero real bank/agency/app brand names.
 * Weights sum to 100 (35 + 35 + 30).
 */
const DRILLS = [
  {
    id: 'drill-1-call',
    order: 1,
    weight: 35,
    durationSec: 15,
    mode: 'video-call',
    badge: 'REC • SIMULATED',
    entity: {
      en: 'Central Cyber Desk (Simulated)',
      hi: 'सेंट्रल साइबर डेस्क (सिम्युलेटेड)'
    },
    title: {
      en: 'Digital Arrest Video Call',
      hi: 'डिजिटल अरेस्ट वीडियो कॉल'
    },
    script: {
      en: "Your ID is linked to a seized parcel. Stay alone on this video call for 'Digital Verification' and pay a refundable security deposit now, or an arrest warrant executes.",
      hi: "आपकी ID एक ज़ब्त पार्सल से जुड़ी है। 'डिजिटल वेरिफिकेशन' के लिए इस वीडियो कॉल पर अकेले रहें और अभी सिक्योरिटी राशि जमा करें।"
    },
    timeoutFlag: 'digital-arrest-timeout',
    debrief: {
      trapTitle: {
        en: 'SIMULATED LOSS: -₹50,000',
        hi: 'सिम्युलेटेड नुकसान: -₹50,000'
      },
      passTitle: {
        en: 'TRAP DODGED (+35 IMMUNITY)',
        hi: 'जाल से बचाव (+35 इम्यूनिटी)'
      },
      explanation: {
        en: 'Real agencies NEVER conduct arrests, interrogations, or security-deposit collections on video calls. Forced isolation ("stay alone") is used so you cannot check with family.',
        hi: 'असली एजेंसियां कभी वीडियो कॉल पर गिरफ्तारी या सिक्योरिटी राशि की मांग नहीं करतीं। अकेले रहने का दबाव इसलिए डाला जाता है ताकि आप परिवार से सलाह न ले सकें।'
      }
    },
    // Varied non-spoiler order: B, A, C
    choices: [
      {
        id: 'd1-choice-b',
        passed: true,
        points: 35,
        missed_flag: null,
        loss_label: null,
        simulated_loss_inr: 0,
        label: {
          en: 'Spot Red Flag: Agencies never arrest or demand money on video calls',
          hi: 'खतरा पहचानें: असली एजेंसियां वीडियो कॉल पर गिरफ्तारी या पैसे नहीं मांगतीं'
        }
      },
      {
        id: 'd1-choice-a',
        passed: false,
        points: 0,
        missed_flag: 'digital-arrest-compliance',
        loss_label: '-₹50,000',
        simulated_loss_inr: 50000,
        label: {
          en: 'Comply & Stay Alone on Call (Simulated)',
          hi: 'मान लें और कॉल पर अकेले रहें (सिम्युलेटेड)'
        }
      },
      {
        id: 'd1-choice-c',
        passed: true,
        points: 35,
        missed_flag: null,
        loss_label: null,
        simulated_loss_inr: 0,
        label: {
          en: 'Spot Red Flag: Forced isolation & instant payment threat',
          hi: 'खतरा पहचानें: अकेले रहने का दबाव और तुरंत भुगतान की धमकी'
        }
      }
    ]
  },
  {
    id: 'drill-2-apk',
    order: 2,
    weight: 35,
    durationSec: 15,
    mode: 'chat-attachment',
    badge: 'CHAT LURE • SIMULATED',
    entity: {
      en: 'Metro Power Utility (Demo)',
      hi: 'मेट्रो पावर यूटिलिटी (डेमो)'
    },
    title: {
      en: 'Fake Utility Bill .pdf.apk Forward',
      hi: 'नकली बिजली बिल .pdf.apk मैसेज'
    },
    attachment: {
      filename: 'MetroBill_Notice.pdf.apk',
      sizeLabel: '4.2 MB',
      pillText: 'MetroBill_Notice.pdf.apk • 4.2 MB',
      downloadable: false
    },
    script: {
      en: 'URGENT: Power disconnection tonight at 9:30 PM. Tap and install MetroBill_Notice.pdf.apk to clear ₹12 verification fee immediately.',
      hi: 'जरूरी सूचना: आज रात 9:30 बजे बिजली कट जाएगी। ₹12 शुल्क भरने के लिए तुरंत MetroBill_Notice.pdf.apk इंस्टॉल करें।'
    },
    timeoutFlag: 'apk-disguised-timeout',
    debrief: {
      trapTitle: {
        en: 'SIMULATED LOSS: -₹50,000',
        hi: 'सिम्युलेटेड नुकसान: -₹50,000'
      },
      passTitle: {
        en: 'TRAP DODGED (+35 IMMUNITY)',
        hi: 'जाल से बचाव (+35 इम्यूनिटी)'
      },
      explanation: {
        en: 'MetroBill_Notice.pdf.apk is NOT a PDF—it is an Android .apk installer disguised as a bill. Installing it can grant SMS OTP & Accessibility access to drain bank accounts.',
        hi: 'MetroBill_Notice.pdf.apk कोई PDF नहीं बल्कि बिल के रूप में छिपा Android .apk ऐप है। इसे इंस्टॉल करने पर स्कैमर आपके SMS OTP और फोन का नियंत्रण पा सकते हैं।'
      }
    },
    // Varied non-spoiler order: A, C, B
    choices: [
      {
        id: 'd2-choice-a',
        passed: false,
        points: 0,
        missed_flag: 'apk-disguised-extension',
        loss_label: '-₹50,000',
        simulated_loss_inr: 50000,
        label: {
          en: 'Tap File to Install & Clear ₹12 Fee (Simulated)',
          hi: 'फाइल इंस्टॉल करें और ₹12 शुल्क भरें (सिम्युलेटेड)'
        }
      },
      {
        id: 'd2-choice-c',
        passed: true,
        points: 35,
        missed_flag: null,
        loss_label: null,
        simulated_loss_inr: 0,
        label: {
          en: 'Spot Red Flag: Panic 9:30 PM cutoff & unknown file',
          hi: 'खतरा पहचानें: रात 9:30 बजे बिजली कटने का डर और अनजान फाइल'
        }
      },
      {
        id: 'd2-choice-b',
        passed: true,
        points: 35,
        missed_flag: null,
        loss_label: null,
        simulated_loss_inr: 0,
        label: {
          en: 'Spot Red Flag: Fake .apk app disguised as a .pdf bill',
          hi: 'खतरा पहचानें: .pdf बिल के रूप में छिपा नकली .apk ऐप'
        }
      }
    ]
  },
  {
    id: 'drill-3-upi',
    order: 3,
    weight: 30,
    durationSec: 15,
    mode: 'upi-collect',
    badge: 'COLLECT CARD • SIMULATED',
    entity: {
      en: 'PaySim Wallet Collect (Demo)',
      hi: 'पेसिम वॉलेट कलेक्ट (डेमो)'
    },
    title: {
      en: 'UPI Cashback Collect Trap',
      hi: 'UPI कैशबैक कलेक्ट जाल'
    },
    collectMeta: {
      amountDisplay: '₹4,500',
      prompt: {
        en: 'Amount: ₹4,500 • Action: Approve to Receive?',
        hi: 'राशि: ₹4,500 • क्या पैसे पाने के लिए Approve करें?'
      }
    },
    script: {
      en: 'You received a ₹4,500 cashback refund! Tap Approve and enter your PIN (Simulated) to credit ₹4,500 into your bank account.',
      hi: 'आपको ₹4,500 कैशबैक मिला है! खाते में पैसे पाने के लिए Approve दबाएं और अपना पिन डालें।'
    },
    timeoutFlag: 'upi-collect-timeout',
    debrief: {
      trapTitle: {
        en: 'SIMULATED LOSS: -₹4,500',
        hi: 'सिम्युलेटेड नुकसान: -₹4,500'
      },
      passTitle: {
        en: 'TRAP DODGED (+30 IMMUNITY)',
        hi: 'जाल से बचाव (+30 इम्यूनिटी)'
      },
      explanation: {
        en: 'Golden Rule: Entering a UPI PIN ALWAYS sends money OUT of your account and NEVER receives money. Cashback or refund credits never ask for your PIN.',
        hi: 'सुनहरा नियम: UPI PIN डालने से पैसा हमेशा आपके खाते से बाहर जाता है, कभी अंदर नहीं आता। कैशबैक या रिफंड पाने के लिए कभी पिन नहीं लगता।'
      }
    },
    // Varied non-spoiler order: C, A, B
    choices: [
      {
        id: 'd3-choice-c',
        passed: true,
        points: 30,
        missed_flag: null,
        loss_label: null,
        simulated_loss_inr: 0,
        label: {
          en: 'Decline Request & Report Collect Trap',
          hi: 'रिक्वेस्ट अस्वीकार करें और कलेक्ट ट्रैप रिपोर्ट करें'
        }
      },
      {
        id: 'd3-choice-a',
        passed: false,
        points: 0,
        missed_flag: 'upi-pin-collect-trap',
        loss_label: '-₹4,500',
        simulated_loss_inr: 4500,
        label: {
          en: 'Approve & Enter PIN to Claim ₹4,500 (Simulated)',
          hi: '₹4,500 पाने के लिए Approve करें और पिन डालें (सिम्युलेटेड)'
        }
      },
      {
        id: 'd3-choice-b',
        passed: true,
        points: 30,
        missed_flag: null,
        loss_label: null,
        simulated_loss_inr: 0,
        label: {
          en: 'Spot Red Flag: UPI PIN is NEVER needed to receive money',
          hi: 'खतरा पहचानें: पैसे पाने के लिए कभी भी UPI PIN नहीं डालना होता'
        }
      }
    ]
  }
];

/**
 * Bilingual 3-step emergency response playbook shown after drills & in sidebar.
 */
const GOLDEN_HOUR_PLAYBOOK = {
  title: {
    en: '1930 Golden-Hour Emergency Playbook',
    hi: '1930 गोल्डन-आवर आपातकालीन गाइड'
  },
  steps: [
    {
      step: 1,
      code: 'AIRPLANE_MODE',
      title: {
        en: 'Switch to Airplane Mode if an .apk was tapped',
        hi: 'यदि .apk फाइल दबा दी हो तो तुरंत एयरप्लेन मोड ऑन करें'
      },
      detail: {
        en: 'Disconnects mobile data and Wi-Fi immediately to block remote OTP forwarding and malicious app commands.',
        hi: 'मोबाइल डेटा और वाई-फाई बंद होने से स्कैमर आपके SMS OTP या फोन तक नहीं पहुंच पाएंगे।'
      }
    },
    {
      step: 2,
      code: 'CALL_1930',
      title: {
        en: 'Call 1930 immediately',
        hi: 'तुरंत 1930 पर कॉल करें'
      },
      detail: {
        en: 'Dial the National Cybercrime Helpline (1930) within the golden hour to freeze stolen funds before they are withdrawn.',
        hi: 'गोल्डन-आवर के भीतर राष्ट्रीय साइबर क्राइम हेल्पलाइन 1930 पर कॉल करके धोखाधड़ी की रकम फ्रीज कराएं।'
      }
    },
    {
      step: 3,
      code: 'REPORT_PORTAL',
      title: {
        en: 'Report at cybercrime.gov.in',
        hi: 'cybercrime.gov.in पर शिकायत दर्ज करें'
      },
      detail: {
        en: 'File an official cyber fraud report with screenshots, transaction IDs, and caller details to obtain an acknowledgement number.',
        hi: 'स्क्रीनशॉट, ट्रांजैक्शन आईडी और कॉलर विवरण के साथ आधिकारिक पोर्टल पर रिपोर्ट दर्ज करें।'
      }
    }
  ]
};

/**
 * Four one-tap presets for Tab 2 (Link, Message & UPI X-Ray).
 * Strictly fictional demo domains and handles — zero real brand/bank names.
 */
const XRAY_PRESETS = [
  {
    id: 'preset-punycode-kyc',
    label: {
      en: 'Punycode + KYC SMS',
      hi: 'Punycode + KYC SMS'
    },
    text: 'ALERT: Your bank KYC suspended today. Update immediately at https://xn--metrobank-kyc-9x2a.example/update or account blocked.'
  },
  {
    id: 'preset-pdf-apk',
    label: {
      en: '.pdf.apk Utility Lure',
      hi: '.pdf.apk बिजली बिल जाल'
    },
    text: 'URGENT: Electricity cut tonight 9:30 PM. Install MetroBill_Notice.pdf.apk to pay Rs 12 verification.'
  },
  {
    id: 'preset-upi-collect',
    label: {
      en: 'UPI Cashback Trap',
      hi: 'UPI कैशबैक ट्रैप'
    },
    text: 'Congratulations! Claim Rs 4500 cashback refund: upi://pay?pa=reward-desk@paysim&pn=Prize%20Refund%20Demo&am=4500&cu=INR&tn=Approve%20PIN%20to%20Receive'
  },
  {
    id: 'preset-safe-link',
    label: {
      en: 'Safe Portal Link',
      hi: 'सुरक्षित पोर्टल लिंक'
    },
    text: 'Official cyber safety portal reminder: report fraud at https://cybercrime.gov.in or dial 1930.'
  }
];

/**
 * Helper to look up a drill definition by scenario ID.
 * @param {string} scenarioId
 */
function getDrillById(scenarioId) {
  return DRILLS.find((d) => d.id === scenarioId) || null;
}

module.exports = {
  DRILLS,
  GOLDEN_HOUR_PLAYBOOK,
  XRAY_PRESETS,
  getDrillById
};
