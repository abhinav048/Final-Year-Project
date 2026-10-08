import React, { createContext, useContext, useState, useEffect } from "react";

export type LanguageCode = "en" | "hi" | "pa" | "mr";

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🌐" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🌾" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🌱" }
];

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
    pa: string;
    mr: string;
  };
}

export const TRANSLATIONS: TranslationDictionary = {
  // Navigation
  marketplace: {
    en: "Marketplace",
    hi: "बीज बाज़ार",
    pa: "ਬੀਜ ਮਾਰਕੀਟ",
    mr: "बियाणे बाजार"
  },
  ethereumEscrow: {
    en: "Ethereum Escrow",
    hi: "इथेरियम एस्क्रो",
    pa: "ਈਥਰਿਅਮ ਐਸਕਰੋ",
    mr: "इथेरियम एस्क्रो"
  },
  howToUse: {
    en: "How to Use",
    hi: "उपयोग विधि",
    pa: "ਵਰਤੋਂ ਵਿਧੀ",
    mr: "कसे वापरावे"
  },
  farmerPortal: {
    en: "Farmer Portal",
    hi: "किसान पोर्टल",
    pa: "ਕਿਸਾਨ ਪੋਰਟਲ",
    mr: "शेतकरी पोर्टल"
  },
  breederHub: {
    en: "Breeder Hub",
    hi: "उत्पादक केंद्र",
    pa: "ਬਰੀਡਰ ਹੱਬ",
    mr: "उत्पादक केंद्र"
  },
  caConsole: {
    en: "CA Console",
    hi: "प्रमाणन प्राधिकरण",
    pa: "ਸਰਟੀਫਿਕੇਸ਼ਨ ਕੌਂਸਲ",
    mr: "प्रमाणन केंद्र"
  },
  verifyBag: {
    en: "Verify Bag",
    hi: "थैली जांचें",
    pa: "ਬੈਗ ਤਸਦੀਕ",
    mr: "पिशवी तपासा"
  },
  login: {
    en: "Log In",
    hi: "लॉग इन",
    pa: "ਲਾਗ ਇਨ",
    mr: "लॉग इन"
  },
  logout: {
    en: "Log Out",
    hi: "लॉग आउट",
    pa: "ਲਾਗ ਆਉਟ",
    mr: "लॉग आउट"
  },
  connectWallet: {
    en: "Web3 Wallet",
    hi: "वेब3 वॉलेट",
    pa: "ਵੈੱਬ3 ਵਾਲਿਟ",
    mr: "वेब3 पाकीट"
  },
  walletConnected: {
    en: "Connected",
    hi: "कनेक्टेड",
    pa: "ਕਨੈਕਟ ਕੀਤਾ",
    mr: "जोडले"
  },
  switchPortal: {
    en: "Switch Active Portal",
    hi: "सक्रिय पोर्टल बदलें",
    pa: "ਸਰਗਰਮ ਪੋਰਟਲ ਬਦਲੋ",
    mr: "सक्रिय पोर्टल बदला"
  },

  // Hero Backdrop & Micro Tagline
  topTagline: {
    en: "Plant more trees to make your home like heaven • Powered by Ethereum",
    hi: "घर को स्वर्ग बनाने के लिए और पेड़ लगाएं • इथेरियम स्मार्ट अनुबंध द्वारा संचालित",
    pa: "ਘਰ ਨੂੰ ਸਵਰਗ ਬਣਾਉਣ ਲਈ ਹੋਰ ਰੁੱਖ ਲਗਾਓ • ਈਥਰਿਅਮ ਦੁਆਰਾ ਸੰਚਾਲਿਤ",
    mr: "घर स्वर्गासारखे करण्यासाठी अधिक झाडे लावा • इथेरियम स्मार्ट कॉन्ट्रॅक्ट्स द्वारे समर्थित"
  },
  heroPillBadge: {
    en: "Sustainable Agriculture, Exceptional Harvests",
    hi: "सतत कृषि, असाधारण उपज और सुरक्षा",
    pa: "ਟਿਕਾਊ ਖੇਤੀਬਾੜੀ, ਬੇਮਿਸਾਲ ਝਾੜ ਅਤੇ ਸੁਰੱਖਿਆ",
    mr: "शाश्वत शेती, उत्तम उत्पादन आणि हमी"
  },
  heroLine1: {
    en: "Green farming helps",
    hi: "हरित कृषि बचाती है",
    pa: "ਹਰੀ ਖੇਤੀ ਮਦਦ ਕਰਦੀ ਹੈ",
    mr: "हरित शेती वाचवते"
  },
  heroLine2: {
    en: "the planet and",
    hi: "धरती और हमारे",
    pa: "ਧਰਤੀ ਅਤੇ ਸਾਡੇ",
    mr: "पृथ्वी आणि आपल्या"
  },
  heroLine3: {
    en: "yields crops.",
    hi: "फसलों की पैदावार।",
    pa: "ਫ਼ਸਲਾਂ ਦੇ ਝਾੜ ਨੂੰ।",
    mr: "पिकांच्या उत्पादनाला।"
  },
  heroSubtitle: {
    en: "Empowering farmers with modern tools, sustainable practices, and expert guidance for bountiful harvests — secured by Ethereum smart contracts.",
    hi: "इथेरियम स्मार्ट एस्क्रो, लैब सर्टिफिकेट सुरक्षा और एआई ब्रीडर ट्रस्ट स्कोरिंग के साथ किसानों को सशक्त बनाना — प्रचुर पैदावार के लिए।",
    pa: "ਈਥਰਿਅਮ ਸਮਾਰਟ ਐਸਕਰੋ, ਲੈਬ ਸਰਟੀਫਿਕੇਟ ਸੁਰੱਖਿਆ ਅਤੇ ਏਆਈ ਬਰੀਡਰ ਟਰੱਸਟ ਸਕੋਰਿੰਗ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸ਼ਕਤੀਸ਼ਾਲੀ ਬਣਾਉਣਾ।",
    mr: "इथेरियम स्मार्ट एस्क्रो, लॅब प्रमाणपत्र सुरक्षा आणि एआय ब्रीडर ट्रस्ट स्कोअरिंगसह शेतकऱ्यांना सक्षम करणे — भरघोस उत्पादनासाठी."
  },
  getServiceToday: {
    en: "Get Service Today",
    hi: "प्रमाणित बीज खरीदें",
    pa: "ਅੱਜ ਹੀ ਸੇਵਾ ਲਓ",
    mr: "आजच बियाणे खरेदी करा"
  },
  exploreServices: {
    en: "Explore Services",
    hi: "सेवाएं देखें",
    pa: "ਸੇਵਾਵਾਂ ਵੇਖੋ",
    mr: "सेवा पहा"
  },

  // Live Metrics Bar
  metricEscrow: {
    en: "Escrow Active",
    hi: "सक्रिय एस्क्रो",
    pa: "ਸਰਗਰਮ ਐਸਕਰੋ",
    mr: "सक्रिय एस्क्रो"
  },
  metricEscrowSub: {
    en: "Locked in Ethereum Smart Escrow",
    hi: "इथेरियम स्मार्ट एस्क्रो में सुरक्षित",
    pa: "ਈਥਰਿਅਮ ਸਮਾਰਟ ਐਸਕਰੋ ਵਿੱਚ ਸੁਰੱਖਿਅਤ",
    mr: "इथेरियम स्मार्ट एस्क्रोमध्ये सुरक्षित"
  },
  metricBatches: {
    en: "Verified Batches",
    hi: "प्रमाणित बीज लॉट",
    pa: "ਤਸਦੀਕਸ਼ੁਦਾ ਬੈਚ",
    mr: "प्रमाणित बियाणे बॅच"
  },
  metricBatchesSub: {
    en: "100% On-Chain SeedRegistry",
    hi: "100% ऑन-चेन सीडरजिस्ट्री",
    pa: "100% ਆਨ-ਚੇਨ ਸੀਡ-ਰਜਿਸਟਰੀ",
    mr: "100% ऑन-चेन सीडरजिस्ट्री"
  },
  metricTrust: {
    en: "Breeder Trust",
    hi: "उत्पादक विश्वसनीयता",
    pa: "ਬਰੀਡਰ ਭਰੋਸੇਯੋਗਤਾ",
    mr: "उत्पादक विश्वासार्हता"
  },
  metricTrustSub: {
    en: "AI Multi-Factor ML Oracle",
    hi: "एआई मल्टी-फैक्टर एमएल ओरेकल",
    pa: "ਏਆਈ ਮਲਟੀ-ਫੈਕਟਰ ਐਮਐਲ ਓਰੇਕਲ",
    mr: "एआय मल्टी-फॅक्टर एमएल ओरॅकल"
  },
  metricNetwork: {
    en: "Ethereum Network",
    hi: "इथेरियम नेटवर्क",
    pa: "ਈਥਰਿਅਮ ਨੈੱਟਵਰਕ",
    mr: "इथेरियम नेटवर्क"
  },
  metricNetworkSub: {
    en: "EVM viaIR Optimizer Verified",
    hi: "ईवीएम ऑप्टिमाइज़र सत्यापित",
    pa: "ਈਵੀਐਮ ਆਪਟੀਮਾਈਜ਼ਰ ਤਸਦੀਕਸ਼ੁਦਾ",
    mr: "ईव्हीएम ऑप्टिमायझर सत्यापित"
  },

  // How to Use Section
  howToUseBadge: {
    en: "Interactive User Guide",
    hi: "इंटरैक्टिव उपयोगकर्ता गाइड",
    pa: "ਇੰਟਰਐਕਟਿਵ ਯੂਜ਼ਰ ਗਾਈਡ",
    mr: "इंटरअॅक्टिव्ह मार्गदर्शक"
  },
  howToUseHeading: {
    en: "How to Use SeedSure",
    hi: "सीडश्योर का उपयोग कैसे करें",
    pa: "SeedSure ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੀਏ",
    mr: "SeedSure चा वापर कसा करावा"
  },
  howToUseSub: {
    en: "Select your role below to explore the complete step-by-step workflow for seed buyers and agricultural breeders.",
    hi: "बीज खरीदारों (किसानों) और बीज उत्पादकों (ब्रीडर्स) के लिए पूर्ण चरण-दर-चरण कार्यप्रणाली देखें।",
    pa: "ਬੀਜ ਖਰੀਦਦਾਰਾਂ (ਕਿਸਾਨਾਂ) ਅਤੇ ਬੀਜ ਉਤਪਾਦਕਾਂ (ਬਰੀਡਰਾਂ) ਲਈ ਕਦਮ-ਦਰ-ਕਦਮ ਕਾਰਜ ਪ੍ਰਣਾਲੀ ਵੇਖੋ।",
    mr: "बियाणे खरेदीदार (शेतकरी) आणि बियाणे उत्पादक (ब्रीडर्स) यांच्यासाठी टप्प्याटप्प्याने कार्यपद्धती पहा."
  },
  tabFarmer: {
    en: "For Farmers (Seed Buyers)",
    hi: "किसानों के लिए (बीज खरीदार)",
    pa: "ਕਿਸਾਨਾਂ ਲਈ (ਬੀਜ ਖਰੀਦਦਾਰ)",
    mr: "शेतकऱ्यांसाठी (बियाणे खरेदीदार)"
  },
  tabSeller: {
    en: "For Breeders & Sellers (Seed Producers)",
    hi: "उत्पादकों और विक्रेताओं के लिए",
    pa: "ਬਰੀਡਰਾਂ ਅਤੇ ਵਿਕਰੇਤਾਵਾਂ ਲਈ",
    mr: "उत्पादक आणि विक्रेत्यांसाठी"
  },

  // Farmer Steps
  fStep1Title: {
    en: "Browse & Trust Audit",
    hi: "बीज खोजें और ट्रस्ट स्कोर जांचें",
    pa: "ਬੀਜ ਲੱਭੋ ਅਤੇ ਟਰੱਸਟ ਸਕੋਰ ਜਾਂਚੋ",
    mr: "बियाणे शोधा आणि ट्रस्ट स्कोअर तपासा"
  },
  fStep1Desc: {
    en: "Explore certified wheat, rice, and pulses. Review lab parameters and dynamic ML Trust Scores. Unvetted sellers (<40) are automatically gated.",
    hi: "प्रमाणित गेहूं, चावल और दालें खोजें। लैब पैरामीटर और एआई ट्रस्ट स्कोर देखें। 40 से कम स्कोर वाले अविश्वसनीय विक्रेता स्वतः ब्लॉक होते हैं।",
    pa: "ਪ੍ਰਮਾਣਿਤ ਕਣਕ, ਝੋਨਾ ਅਤੇ ਦਾਲਾਂ ਵੇਖੋ। ਲੈਬ ਮਾਪਦੰਡ ਅਤੇ ਏਆਈ ਟਰੱਸਟ ਸਕੋਰ ਵੇਖੋ। 40 ਤੋਂ ਘੱਟ ਸਕੋਰ ਵਾਲੇ ਵਿਕਰੇਤਾ ਬਲਾਕ ਹੁੰਦੇ ਹਨ।",
    mr: "प्रमाणित गहू, तांदूळ आणि डाळी शोधा. लॅब पॅरामीटर्स आणि एआय ट्रस्ट स्कोअर पहा. 40 पेक्षा कमी स्कोअर असलेले विक्रेते ब्लॉक केले जातात."
  },
  fStep2Title: {
    en: "Lock Escrow Payment",
    hi: "स्मार्ट एस्क्रो में भुगतान सुरक्षित करें",
    pa: "ਸਮਾਰਟ ਐਸਕਰੋ ਵਿੱਚ ਭੁਗਤਾਨ ਲਾਕ ਕਰੋ",
    mr: "स्मार्ट एस्क्रोमध्ये पैसे सुरक्षित करा"
  },
  fStep2Desc: {
    en: "Select quantity and order. Funds are locked non-custodially in Ethereum Marketplace.sol. Seller cannot withdraw until you verify.",
    hi: "मात्रा चुनें और ऑर्डर करें। आपके पैसे इथेरियम स्मार्ट कॉन्ट्रैक्ट में सुरक्षित रहते हैं। विक्रेता इसे तब तक नहीं निकाल सकता जब तक आप पुष्टि न करें।",
    pa: "ਮਾਤਰਾ ਚੁਣੋ ਅਤੇ ਆਰਡਰ ਕਰੋ। ਤੁਹਾਡੇ ਪੈਸੇ ਈਥਰਿਅਮ ਸਮਾਰਟ ਕੰਟਰੈਕਟ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦੇ ਹਨ। ਵਿਕਰੇਤਾ ਤੁਹਾਡੀ ਪੁਸ਼ਟੀ ਤੋਂ ਬਿਨਾਂ ਪੈਸੇ ਨਹੀਂ ਕਢਵਾ ਸਕਦਾ।",
    mr: "प्रमाण निवडा आणि ऑर्डर करा. आपले पैसे इथेरियम स्मार्ट कॉन्ट्रॅक्टमध्ये सुरक्षित राहतात. आपण पडताळणी करेपर्यंत विक्रेता पैसे काढू शकत नाही."
  },
  fStep3Title: {
    en: "Scan Bag QR Tag",
    hi: "थैली पर लगा QR कोड स्कैन करें",
    pa: "ਬੈਗ 'ਤੇ ਲੱਗਿਆ QR ਕੋਡ ਸਕੈਨ ਕਰੋ",
    mr: "पिशवीवरील QR कोड स्कॅन करा"
  },
  fStep3Desc: {
    en: "When bags arrive, scan the physical QR tag with your camera. Re-hashes the lab report with client SHA-256 to verify genetic purity against the blockchain.",
    hi: "डिलीवरी मिलने पर फोन से QR कोड स्कैन करें। यह लैब रिपोर्ट का SHA-256 हैश बनाकर ब्लॉकचेन से मिलान करता है और मिलावट तुरंत पकड़ता है।",
    pa: "ਡਿਲੀਵਰੀ ਮਿਲਣ 'ਤੇ ਫ਼ੋਨ ਨਾਲ QR ਸਕੈਨ ਕਰੋ। ਇਹ ਲੈਬ ਰਿਪੋਰਟ ਦਾ SHA-256 ਹੈਸ਼ ਬਣਾ ਕੇ ਬਲਾਕਚੈਨ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ।",
    mr: "डिलिव्हरी मिळाल्यावर फोनने QR कोड स्कॅन करा. हे लॅब रिपोर्टचे SHA-256 हॅश ब्लॉकचेनशी जुळवून भेसळ ताबडतोब ओळखते."
  },
  fStep4Title: {
    en: "Release or Dispute",
    hi: "पेमेंट रिलीज करें या विवाद उठाएं",
    pa: "ਭੁਗਤਾਨ ਜਾਰੀ ਕਰੋ ਜਾਂ ਵਿਵਾਦ ਦਰਜ ਕਰੋ",
    mr: "पैसे रिलीज करा किंवा तक्रार नोंदवा"
  },
  fStep4Desc: {
    en: "Click 'Confirm Delivery' in Farmer Portal to release escrow. If seeds are unviable, click 'Raise Dispute' to freeze funds for an arbitration refund.",
    hi: "बीज सही होने पर 'Confirm Delivery' दबाकर पैसे रिलीज करें। यदि बीज खराब या मिलावटी निकले, तो 'Raise Dispute' दबाकर 100% रिफंड पाएं।",
    pa: "ਬੀਜ ਸਹੀ ਹੋਣ 'ਤੇ ਪੈਸੇ ਜਾਰੀ ਕਰੋ। ਜੇਕਰ ਬੀਜ ਖਰਾਬ ਨਿਕਲਣ, ਤਾਂ 100% ਰਿਫੰਡ ਲਈ ਵਿਵਾਦ ਦਰਜ ਕਰੋ।",
    mr: "बियाणे योग्य असल्यास 'Confirm Delivery' दाबून पैसे द्या. बियाणे निकृष्ट असल्यास 'Raise Dispute' दाबून 100% परतावा मिळवा."
  },
  fStep5Title: {
    en: "Verified On-Chain Rating",
    hi: "ब्लॉकचेन पर रेटिंग दें",
    pa: "ਬਲਾਕਚੈਨ 'ਤੇ ਰੇਟਿੰਗ ਦਿਓ",
    mr: "ब्लॉकचेनवर रेटिंग द्या"
  },
  fStep5Desc: {
    en: "Submit verified 1-5 star reviews on FeedbackRegistry.sol. Only verified buyers of delivered batches can review, eliminating fake ratings.",
    hi: "1-5 स्टार रेटिंग दें। केवल वास्तविक खरीदार ही समीक्षा दे सकते हैं, जिससे नकली रेटिंग और फर्जी समीक्षाओं की संभावना समाप्त हो जाती है।",
    pa: "1-5 ਸਟਾਰ ਰੇਟਿੰਗ ਦਿਓ। ਸਿਰਫ਼ ਅਸਲ ਖਰੀਦਦਾਰ ਹੀ ਰਿਵਿਊ ਦੇ ਸਕਦੇ ਹਨ, ਜਿਸ ਨਾਲ ਜਾਅਲੀ ਰੇਟਿੰਗਾਂ ਖਤਮ ਹੁੰਦੀਆਂ ਹਨ।",
    mr: "1-5 स्टार रेटिंग द्या. केवळ अस्सल खरेदीदारच पुनरावलोकन देऊ शकतात, ज्यामुळे बनावट रेटिंग पूर्णपणे थांबतात."
  },
  farmerCtaTitle: {
    en: "Ready to test the Farmer flow?",
    hi: "किसान अनुभव का परीक्षण करने के लिए तैयार हैं?",
    pa: "ਕਿਸਾਨ ਅਨੁਭਵ ਦੀ ਜਾਂਚ ਕਰਨ ਲਈ ਤਿਆਰ ਹੋ?",
    mr: "शेतकरी अनुभवाची चाचणी घेण्यासाठी तयार आहात?"
  },
  farmerCtaDesc: {
    en: "Experience buying certified wheat with live smart escrow protection.",
    hi: "लाइव स्मार्ट एस्क्रो सुरक्षा के साथ प्रमाणित गेहूं खरीदने का अनुभव लें।",
    pa: "ਲਾਈਵ ਸਮਾਰਟ ਐਸਕਰੋ ਸੁਰੱਖਿਆ ਨਾਲ ਪ੍ਰਮਾਣਿਤ ਕਣਕ ਖਰੀਦਣ ਦਾ ਅਨੁਭਵ ਲਓ।",
    mr: "थेट स्मार्ट एस्क्रो संरक्षणासह प्रमाणित गहू खरेदीचा अनुभव घ्या."
  },
  farmerCtaBtn: {
    en: "Launch Farmer Experience",
    hi: "किसान पोर्टल खोलें",
    pa: "ਕਿਸਾਨ ਪੋਰਟਲ ਖੋਲ੍ਹੋ",
    mr: "शेतकरी पोर्टल उघडा"
  },

  // Breeder Steps
  bStep1Title: {
    en: "Breeder Accreditation",
    hi: "उत्पादक मान्यता पंजीकरण",
    pa: "ਬਰੀਡਰ ਮਾਨਤਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
    mr: "उत्पादक मान्यता नोंदणी"
  },
  bStep1Desc: {
    en: "Register institutional breeder credentials on SellerRegistry.sol. Certification Authority reviews credentials and grants verified status.",
    hi: "अपनी संस्थागत साख SellerRegistry.sol पर पंजीकृत करें। प्रमाणन प्राधिकरण (CA) समीक्षा कर ऑन-चेन सत्यापित दर्जा देता है।",
    pa: "ਆਪਣੇ ਬਰੀਡਰ ਪ੍ਰਮਾਣ ਪੱਤਰ ਰਜਿਸਟਰ ਕਰੋ। ਅਥਾਰਟੀ ਜਾਂਚ ਕਰਕੇ ਤਸਦੀਕਸ਼ੁਦਾ ਦਰਜਾ ਦਿੰਦੀ ਹੈ।",
    mr: "आपली संस्थात्मक माहिती SellerRegistry.sol वर नोंदवा. प्रमाणन संस्था पडताळणी करून ऑन-चेन मान्यता देते."
  },
  bStep2Title: {
    en: "Register Seed Lot",
    hi: "लैब रिपोर्ट के साथ बैच दर्ज करें",
    pa: "ਲੈਬ ਰਿਪੋਰਟ ਨਾਲ ਬੈਚ ਦਰਜ ਕਰੋ",
    mr: "लॅब रिपोर्टसह बॅच नोंदवा"
  },
  bStep2Desc: {
    en: "Enter germination %, purity %, vigor, and harvest dates. Upload official lab certificate. Smart contract stores the SHA-256 fingerprint on Ethereum.",
    hi: "अंकुरण क्षमता %, आनुवंशिक शुद्धता % और लैब सर्टिफिकेट अपलोड करें। स्मार्ट कॉन्ट्रैक्ट इसका क्रिप्टोग्राफिक हैश इथेरियम पर दर्ज करता है।",
    pa: "ਜੰਮਣ ਸਮਰੱਥਾ % ਅਤੇ ਲੈਬ ਸਰਟੀਫਿਕੇਟ ਅੱਪਲੋਡ ਕਰੋ। ਸਮਾਰਟ ਕੰਟਰੈਕਟ ਇਸ ਨੂੰ ਈਥਰਿਅਮ 'ਤੇ ਦਰਜ ਕਰਦਾ ਹੈ।",
    mr: "उगवण क्षमता %, शुद्धता % आणि लॅब रिपोर्ट अपलोड करा. स्मार्ट कॉन्ट्रॅक्ट त्याचा क्रिप्टोग्राफिक हॅश इथेरियमवर नोंदवतो."
  },
  bStep3Title: {
    en: "Official CA Certification",
    hi: "प्रमाणन प्राधिकरण (CA) स्वीकृति",
    pa: "ਸਰਕਾਰੀ CA ਸਰਟੀਫਿਕੇਸ਼ਨ",
    mr: "प्रमाणन संस्था (CA) मान्यता"
  },
  bStep3Desc: {
    en: "The Certification Authority audits laboratory documentation and issues the on-chain certification, boosting marketplace placement.",
    hi: "सरकारी प्रमाणन प्राधिकरण लैब रिपोर्ट का ऑडिट करता है और certifyBatch() जारी करता है, जिससे आपके बीज सबसे ऊपर दिखते हैं।",
    pa: "ਸਰਟੀਫਿਕੇਸ਼ਨ ਅਥਾਰਟੀ ਲੈਬ ਰਿਪੋਰਟਾਂ ਦੀ ਜਾਂਚ ਕਰਦੀ ਹੈ ਅਤੇ ਆਨ-ਚੇਨ ਸਰਟੀਫਿਕੇਟ ਜਾਰੀ ਕਰਦੀ ਹੈ।",
    mr: "प्रमाणन संस्था लॅब रिपोर्टचे ऑडिट करते आणि ऑन-चेन प्रमाणपत्र जारी करते."
  },
  bStep4Title: {
    en: "Dispatch with QR Tag",
    hi: "QR टैग लगाकर डिस्पैच करें",
    pa: "QR ਟੈਗ ਨਾਲ ਡਿਸਪੈਚ ਕਰੋ",
    mr: "QR टॅग लावून पाठवा"
  },
  bStep4Desc: {
    en: "Receive escrow notifications. Package seed bags with unique physical QR verification tags, ship via carrier, and record tracking number.",
    hi: "एस्क्रो ऑर्डर प्राप्त करें। बीज बोरियों पर अद्वितीय QR कोड लगाएं, कूरियर से भेजें और ट्रैकिंग नंबर दर्ज करें।",
    pa: "ਐਸਕਰੋ ਆਰਡਰ ਪ੍ਰਾਪਤ ਕਰੋ। ਬੈਗਾਂ 'ਤੇ QR ਕੋਡ ਲਗਾਓ ਅਤੇ ਕੋਰੀਅਰ ਰਾਹੀਂ ਭੇਜੋ।",
    mr: "एस्क्रो ऑर्डर प्राप्त करा. बियाणे पिशव्यांवर QR कोड लावा, कुरिअरने पाठवा आणि ट्रॅकिंग नंबर नोंदवा."
  },
  bStep5Title: {
    en: "Escrow Payout & AI Trust",
    hi: "तुरंत भुगतान और ट्रस्ट स्कोर वृद्धि",
    pa: "ਤੁਰੰਤ ਭੁਗਤਾਨ ਅਤੇ ਟਰੱਸਟ ਵਾਧਾ",
    mr: "त्वरित पेमेंट आणि ट्रस्ट स्कोअर वाढ"
  },
  bStep5Desc: {
    en: "Farmer delivery confirmation instantly transfers payment to your wallet. The AI Engine recalculates your Trust Score upwards, ranking you higher.",
    hi: "किसान की पुष्टि होते ही एस्क्रो से सीधा भुगतान आपके वॉलेट में आ जाता है। आपका एआई ट्रस्ट स्कोर 90-100 (उत्कृष्ट) की ओर बढ़ता है।",
    pa: "ਕਿਸਾਨ ਦੀ ਪੁਸ਼ਟੀ ਹੁੰਦੇ ਹੀ ਪੈਸੇ ਸਿੱਧੇ ਤੁਹਾਡੇ ਵਾਲਿਟ ਵਿੱਚ ਆ ਜਾਂਦੇ ਹਨ ਅਤੇ ਤੁਹਾਡਾ ਟਰੱਸਟ ਸਕੋਰ ਵਧਦਾ ਹੈ।",
    mr: "शेतकऱ्याने खात्री करताच थेट पेमेंट आपल्या खात्यात जमा होते आणि आपला एआय ट्रस्ट स्कोअर वाढतो."
  },
  breederCtaTitle: {
    en: "Ready to test the Breeder Hub?",
    hi: "उत्पादक हब का परीक्षण करने के लिए तैयार हैं?",
    pa: "ਬਰੀਡਰ ਹੱਬ ਦੀ ਜਾਂਚ ਲਈ ਤਿਆਰ ਹੋ?",
    mr: "उत्पादक केंद्राची चाचणी घेण्यासाठी तयार आहात?"
  },
  breederCtaDesc: {
    en: "Register seed lots, dispatch orders, and monitor your AI Trust Score.",
    hi: "बीज लॉट पंजीकृत करें, ऑर्डर भेजें और अपना एआई ट्रस्ट स्कोर देखें।",
    pa: "ਬੀਜ ਲਾਟ ਰਜਿਸਟਰ ਕਰੋ, ਆਰਡਰ ਭੇਜੋ ਅਤੇ ਆਪਣਾ ਸਕੋਰ ਵੇਖੋ।",
    mr: "बियाणे लॉट नोंदवा, ऑर्डर पाठवा आणि आपला ट्रस्ट स्कोअर पहा."
  },
  breederCtaBtn: {
    en: "Launch Breeder Hub",
    hi: "उत्पादक हब खोलें",
    pa: "ਬਰੀਡਰ ਹੱਬ ਖੋਲ੍ਹੋ",
    mr: "उत्पादक केंद्र उघडा"
  },

  // 3 Ethereum Pillars
  archBadge: {
    en: "Agricultural Security Architecture",
    hi: "कृषि सुरक्षा वास्तुकला",
    pa: "ਖੇਤੀਬਾੜੀ ਸੁਰੱਖਿਆ ਢਾਂਚਾ",
    mr: "कृषी सुरक्षा रचना"
  },
  archHeading: {
    en: "How Ethereum Secures Your Harvest",
    hi: "इथेरियम आपकी फसल को कैसे सुरक्षित करता है",
    pa: "ਈਥਰਿਅਮ ਤੁਹਾਡੀ ਫ਼ਸਲ ਨੂੰ ਕਿਵੇਂ ਸੁਰੱਖਿਅਤ ਕਰਦਾ ਹੈ",
    mr: "इथेरियम आपले पीक कसे सुरक्षित करते"
  },
  archSub: {
    en: "SeedSure acts before and during purchase to eliminate counterfeit seeds, forged lab certificates, and breeder payment risk.",
    hi: "सीडश्योर खरीद से पहले और खरीद के दौरान नकली बीज, फर्जी लैब रिपोर्ट और भुगतान जोखिम को समाप्त करता है।",
    pa: "SeedSure ਨਕਲੀ ਬੀਜਾਂ, ਜਾਅਲੀ ਲੈਬ ਰਿਪੋਰਟਾਂ ਅਤੇ ਭੁਗਤਾਨ ਦੇ ਜੋਖਮ ਨੂੰ ਖਤਮ ਕਰਦਾ ਹੈ।",
    mr: "SeedSure बनावट बियाणे, खोट्या लॅब रिपोर्ट्स आणि पेमेंटचा धोका पूर्णपणे नष्ट करते."
  },
  pillar1Title: {
    en: "Breeder Accreditation & Lab Hashing",
    hi: "उत्पादक मान्यता और लैब हैशिंग",
    pa: "ਬਰੀਡਰ ਮਾਨਤਾ ਅਤੇ ਲੈਬ ਹੈਸ਼ਿੰਗ",
    mr: "उत्पादक मान्यता आणि लॅब हॅशिंग"
  },
  pillar1Desc: {
    en: "Seed breeders register foundation seed batches. The official laboratory test certificate is converted into an immutable SHA-256 fingerprint registered on the Ethereum SeedRegistry.sol contract.",
    hi: "बीज उत्पादक अपनी लॉट दर्ज करते हैं। आधिकारिक लैब टेस्ट रिपोर्ट को SHA-256 डिजिटल फिंगरप्रिंट में बदलकर इथेरियम SeedRegistry.sol पर स्थायी रूप से सुरक्षित किया जाता है।",
    pa: "ਬੀਜ ਉਤਪਾਦਕ ਆਪਣੇ ਲਾਟ ਦਰਜ ਕਰਦੇ ਹਨ। ਲੈਬ ਟੈਸਟ ਰਿਪੋਰਟ ਨੂੰ ਈਥਰਿਅਮ SeedRegistry.sol 'ਤੇ ਸੁਰੱਖਿਅਤ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
    mr: "बियाणे उत्पादक लॉट नोंदवतात. अधिकृत लॅब टेस्ट रिपोर्ट SHA-256 फिंगरप्रिंटमध्ये रूपांतरित करून इथेरियम SeedRegistry.sol वर कायमस्वरूपी नोंदवली जाते."
  },
  pillar2Title: {
    en: "Non-Custodial Ethereum Escrow",
    hi: "गैर-कस्टोडियल इथेरियम एस्क्रो",
    pa: "ਗੈਰ-ਕਸਟੋਡੀਅਲ ਈਥਰਿਅਮ ਐਸਕਰੋ",
    mr: "नॉन-कस्टोडियल इथेरियम एस्क्रो"
  },
  pillar2Desc: {
    en: "When farmers purchase seed bags, payments are safely locked in Marketplace.sol. Unvetted sellers with trust scores <40 are automatically blocked by the smart contract from taking orders.",
    hi: "जब किसान बीज खरीदते हैं, तो भुगतान Marketplace.sol में सुरक्षित लॉक रहता है। 40 से कम ट्रस्ट स्कोर वाले विक्रेताओं को स्मार्ट कॉन्ट्रैक्ट स्वतः ब्लॉक कर देता है।",
    pa: "ਜਦੋਂ ਕਿਸਾਨ ਬੀਜ ਖਰੀਦਦੇ ਹਨ, ਤਾਂ ਭੁਗਤਾਨ Marketplace.sol ਵਿੱਚ ਲਾਕ ਰਹਿੰਦਾ ਹੈ। 40 ਤੋਂ ਘੱਟ ਸਕੋਰ ਵਾਲੇ ਵਿਕਰੇਤਾ ਬਲਾਕ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।",
    mr: "जेव्हा शेतकरी बियाणे खरेदी करतात, तेव्हा पेमेंट Marketplace.sol मध्ये सुरक्षित लॉक राहते. 40 पेक्षा कमी स्कोअर असलेले विक्रेते ब्लॉक होतात."
  },
  pillar3Title: {
    en: "Delivery Confirmation & Release",
    hi: "डिलीवरी पुष्टि और फंड रिलीज",
    pa: "ਡਿਲੀਵਰੀ ਪੁਸ਼ਟੀ ਅਤੇ ਫੰਡ ਰਿਲੀਜ਼",
    mr: "डिलिव्हरी खात्री आणि फंड रिलीज"
  },
  pillar3Desc: {
    en: "Farmers scan the physical QR tag on the seed bag to run the tamper check. Upon inspecting viability and confirming delivery, the contract releases funds to the breeder and recalculates their credibility score.",
    hi: "किसान बीज थैली पर लगे QR कोड को स्कैन कर प्रामाणिकता जांचते हैं। फसल व्यवहार्यता से संतुष्ट होने पर ही कॉन्ट्रैक्ट उत्पादक को पैसे रिलीज करता है।",
    pa: "ਕਿਸਾਨ ਬੈਗ 'ਤੇ QR ਕੋਡ ਸਕੈਨ ਕਰਕੇ ਜਾਂਚ ਕਰਦੇ ਹਨ। ਪੁਸ਼ਟੀ ਹੋਣ 'ਤੇ ਹੀ ਪੈਸੇ ਵਿਕਰੇਤਾ ਨੂੰ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ।",
    mr: "शेतकरी बियाणे पिशवीवरील QR कोड स्कॅन करून सत्यता तपासतात. समाधानी झाल्यावरच कॉन्ट्रॅक्ट उत्पादकाला पैसे ट्रान्सफर करते."
  },

  // Smart Contracts Banner
  bannerBadge: {
    en: "Ethereum Blockchain Integration Live",
    hi: "इथेरियम ब्लॉकचेन एकीकरण लाइव",
    pa: "ਈਥਰਿਅਮ ਬਲਾਕਚੈਨ ਏਕੀਕਰਣ ਲਾਈਵ",
    mr: "इथेरियम ब्लॉकचेन इंटिग्रेशन लाइव्ह"
  },
  bannerTitle: {
    en: "5 Solidity Smart Contracts Deployed",
    hi: "5 सॉलिडिटी स्मार्ट कॉन्ट्रैक्ट्स तैनात",
    pa: "5 ਸੋਲਿਡਿਟੀ ਸਮਾਰਟ ਕੰਟਰੈਕਟ ਤੈਨਾਤ",
    mr: "5 सॉलिडिटी स्मार्ट कॉन्ट्रॅक्ट्स डिप्लॉय केले"
  },
  bannerDesc: {
    en: "Inspect verified contract bytecode, live escrow balances, cryptographic testbenches, and real-time transaction ledger.",
    hi: "सत्यापित अनुबंध कोड, लाइव एस्क्रो बैलेंस, क्रिप्टोग्राफिक टेस्टबेंच और वास्तविक समय ट्रांजेक्शन लेजर देखें।",
    pa: "ਤਸਦੀਕਸ਼ੁਦਾ ਕੰਟਰੈਕਟ ਕੋਡ, ਲਾਈਵ ਐਸਕਰੋ ਬੈਲੇਂਸ ਅਤੇ ਰੀਅਲ-ਟਾਈਮ ਟ੍ਰਾਂਜੈਕਸ਼ਨ ਵੇਖੋ।",
    mr: "सत्यापित कॉन्ट्रॅक्ट कोड, थेट एस्क्रो शिल्लक आणि रिअल-टाइम व्यवहार लेजर पहा."
  },
  openExplorerBtn: {
    en: "Open Ethereum Explorer",
    hi: "इथेरियम एक्सप्लोरर खोलें",
    pa: "ਈਥਰਿਅਮ ਐਕਸਪਲੋਰਰ ਖੋਲ੍ਹੋ",
    mr: "इथेरियम एक्सप्लोरर उघडा"
  },

  // FAQs Section
  faqBadge: {
    en: "Common Questions",
    hi: "अक्सर पूछे जाने वाले सवाल",
    pa: "ਆਮ ਸਵਾਲ",
    mr: "वारंवार विचारले जाणारे प्रश्न"
  },
  faqHeading: {
    en: "Frequently Asked Questions",
    hi: "अक्सर पूछे जाने वाले प्रश्न (FAQs)",
    pa: "ਅਕਸਰ ਪੁੱਛੇ ਜਾਂਦੇ ਸਵਾਲ (FAQs)",
    mr: "वारंवार विचारले जाणारे प्रश्न (FAQs)"
  },
  faq1Q: {
    en: "How does the Ethereum smart contract escrow protect farmers?",
    hi: "इथेरियम स्मार्ट अनुबंध एस्क्रो किसानों की सुरक्षा कैसे करता है?",
    pa: "ਈਥਰਿਅਮ ਸਮਾਰਟ ਕੰਟਰੈਕਟ ਐਸਕਰੋ ਕਿਸਾਨਾਂ ਦੀ ਰੱਖਿਆ ਕਿਵੇਂ ਕਰਦਾ ਹੈ?",
    mr: "इथेरियम स्मार्ट कॉन्ट्रॅक्ट एस्क्रो शेतकऱ्यांचे रक्षण कसे करते?"
  },
  faq1A: {
    en: "When you purchase certified seeds on SeedSure, your payment is securely locked in an immutable Ethereum smart contract (Marketplace.sol). The seller cannot access the funds until you physically receive the seeds, verify the cryptographic QR tag on the bag, and confirm delivery. If the seed lot is defective, you can raise a dispute to freeze the escrow funds for an administrative refund.",
    hi: "जब आप सीडश्योर पर प्रमाणित बीज खरीदते हैं, तो आपका भुगतान इथेरियम स्मार्ट अनुबंध (Marketplace.sol) में सुरक्षित रूप से बंद रहता है। विक्रेता तब तक धनराशि नहीं निकाल सकता जब तक आप बीज प्राप्त करके, थैली पर लगे QR कोड की जांच करके डिलीवरी की पुष्टि नहीं कर देते। यदि बीज खराब है, तो आप विवाद दर्ज कर रिफंड प्राप्त कर सकते हैं।",
    pa: "ਜਦੋਂ ਤੁਸੀਂ SeedSure 'ਤੇ ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਖਰੀਦਦੇ ਹੋ, ਤੁਹਾਡਾ ਭੁਗਤਾਨ ਈਥਰਿਅਮ ਸਮਾਰਟ ਕੰਟਰੈਕਟ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦਾ ਹੈ। ਜਦੋਂ ਤੱਕ ਤੁਸੀਂ ਬੀਜ ਪ੍ਰਾਪਤ ਕਰਕੇ QR ਕੋਡ ਦੀ ਜਾਂਚ ਨਹੀਂ ਕਰਦੇ, ਵਿਕਰੇਤਾ ਪੈਸੇ ਨਹੀਂ ਕਢਵਾ ਸਕਦਾ।",
    mr: "जेव्हा तुम्ही SeedSure वर प्रमाणित बियाणे खरेदी करता, तेव्हा तुमचे पेमेंट इथेरियम स्मार्ट कॉन्ट्रॅक्टमध्ये सुरक्षित लॉक असते. बियाणे मिळून QR कोड तपासून डिलिव्हरीची पुष्टी करेपर्यंत विक्रेता पैसे काढू शकत नाही. बियाणे सदोष असल्यास, तक्रार नोंदवून रिफंड मिळवता येतो."
  },
  faq2Q: {
    en: "How does the QR tag on physical seed bags prove authenticity?",
    hi: "बीज की बोरियों पर लगा QR टैग प्रामाणिकता कैसे साबित करता है?",
    pa: "ਬੀਜ ਦੀਆਂ ਬੋਰੀਆਂ 'ਤੇ ਲੱਗਿਆ QR ਟੈਗ ਅਸਲੀਅਤ ਕਿਵੇਂ ਸਾਬਤ ਕਰਦਾ ਹੈ?",
    mr: "बियाण्यांच्या पिशव्यांवरील QR टॅग अस्सलपणा कसा सिद्ध करतो?"
  },
  faq2A: {
    en: "Every seed bag has a cryptographic tag linking to its on-chain record. When scanned with any smartphone camera, it computes the SHA-256 hash of the official laboratory certificate and compares it directly against the Ethereum SeedRegistry contract. If a counterfeiter altered even a single germination percentage or expiry date, the check triggers a 'FORGERY DETECTED' warning.",
    hi: "प्रत्येक बीज थैली पर एक क्रिप्टोग्राफिक टैग होता है जो इसके ब्लॉकचेन रिकॉर्ड से जुड़ा होता है। स्मार्टफोन से स्कैन करने पर यह आधिकारिक प्रयोगशाला रिपोर्ट का SHA-256 हैश बनाता है और इथेरियम अनुबंध से मिलान करता है। यदि किसी ने अंकुरण दर या विवरण में छेड़छाड़ की हो, तो तुरंत 'जालसाजी पकड़ी गई' की चेतावनी मिलती है।",
    pa: "ਹਰ ਬੀਜ ਬੋਰੀ 'ਤੇ ਇੱਕ QR ਟੈਗ ਹੁੰਦਾ ਹੈ। ਫ਼ੋਨ ਨਾਲ ਸਕੈਨ ਕਰਨ 'ਤੇ ਇਹ ਲੈਬ ਰਿਪੋਰਟ ਦਾ SHA-256 ਹੈਸ਼ ਬਣਾ ਕੇ ਬਲਾਕਚੈਨ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ। ਜੇਕਰ ਕਿਸੇ ਨੇ ਛੇੜਛਾੜ ਕੀਤੀ ਹੋਵੇ, ਤਾਂ ਤੁਰੰਤ ਚੇਤਾਵਨੀ ਮਿਲਦੀ ਹੈ।",
    mr: "प्रत्येक बियाणे पिशवीवर क्रिप्टोग्राफिक QR टॅग असतो. फोनने स्कॅन केल्यावर हे लॅब प्रमाणपत्राचे SHA-256 हॅश ब्लॉकचेनशी जुळवून पाहते. कोणताही बदल किंवा बनावटपणा असल्यास लगेच चेतावणी दाखवली जाते."
  },
  faq3Q: {
    en: "How does the AI Multi-Factor Trust Engine evaluate breeders?",
    hi: "एआई मल्टी-फैक्टर ट्रस्ट इंजन उत्पादकों का मूल्यांकन कैसे करता है?",
    pa: "ਏਆਈ ਮਲਟੀ-ਫੈਕਟਰ ਟਰੱਸਟ ਇੰਜਨ ਬਰੀਡਰਾਂ ਦਾ ਮੁਲਾਂਕਣ ਕਿਵੇਂ ਕਰਦਾ ਹੈ?",
    mr: "एआय मल्टी-फॅक्टर ट्रस्ट इंजिन उत्पादकांचे मूल्यांकन कसे करते?"
  },
  faq3A: {
    en: "The SeedSure AI Trust Model scores breeders across 5 objective metrics: Lab Certification Ratio (25%), On-Time Logistics (25%), Transaction Success Rate (20%), Farmer Community Ratings (15%), and Escrow Dispute History (15%). Dynamic scores are periodically published to the Ethereum TrustScoreRegistry with canonical feature vector hashes for complete mathematical auditability.",
    hi: "सीडश्योर एआई मॉडल 5 वस्तुनिष्ठ मानकों पर उत्पादकों को अंक देता है: लैब प्रमाणन अनुपात (25%), समय पर डिलीवरी (25%), सफल लेनदेन दर (20%), किसान समुदाय रेटिंग (15%), और एस्क्रो विवाद इतिहास (15%)। यह स्कोर पूर्ण पारदर्शिता के साथ इथेरियम पर दर्ज होता है।",
    pa: "SeedSure ਏਆਈ ਮਾਡਲ 5 ਮਾਪਦੰਡਾਂ 'ਤੇ ਅੰਕ ਦਿੰਦਾ ਹੈ: ਲੈਬ ਸਰਟੀਫਿਕੇਸ਼ਨ (25%), ਸਮੇਂ ਸਿਰ ਡਿਲਿਵਰੀ (25%), ਸਫਲ ਸੌਦੇ (20%), ਕਿਸਾਨ ਰੇਟਿੰਗ (15%), ਅਤੇ ਵਿਵਾਦ ਇਤਿਹਾਸ (15%)।",
    mr: "SeedSure एआय मॉडेल 5 निकषांवर उत्पादकांना गुण देते: लॅब प्रमाणन (25%), वेळेवर डिलिव्हरी (25%), यशस्वी व्यवहार (20%), शेतकरी रेटिंग (15%), आणि विवाद इतिहास (15%). हे गुण इथेरियमवर पारदर्शकपणे नोंदवले जातात."
  },
  faq4Q: {
    en: "Can high-risk or unvetted sellers list fake seeds?",
    hi: "क्या उच्च जोखिम वाले या असत्यापित विक्रेता नकली बीज बेच सकते हैं?",
    pa: "ਕੀ ਅਸੁਰੱਖਿਅਤ ਜਾਂ ਬਿਨਾਂ ਜਾਂਚ ਵਾਲੇ ਵਿਕਰੇਤਾ ਨਕਲੀ ਬੀਜ ਵੇਚ ਸਕਦੇ ਹਨ?",
    mr: "धोकादायक किंवा असत्यापित विक्रेते बनावट बियाणे विकू शकतात का?"
  },
  faq4A: {
    en: "No! SeedSure implements an automated Ethereum Smart Contract Gate: sellers whose AI trust score drops below the safety threshold (<40/100) are automatically blocked by the smart contract from listing new batches or accepting escrow payments.",
    hi: "बिल्कुल नहीं! सीडश्योर में स्वचालित इथेरियम स्मार्ट कॉन्ट्रैक्ट गेट है: जिन विक्रेताओं का एआई ट्रस्ट स्कोर सुरक्षा सीमा (<40/100) से नीचे चला जाता है, उन्हें स्मार्ट कॉन्ट्रैक्ट द्वारा नए बीज दर्ज करने या ऑर्डर लेने से तुरंत ब्लॉक कर दिया जाता है।",
    pa: "ਬਿਲਕੁਲ ਨਹੀਂ! ਜਿਨ੍ਹਾਂ ਵਿਕਰੇਤਾਵਾਂ ਦਾ ਸਕੋਰ 40 ਤੋਂ ਘੱਟ ਹੁੰਦਾ ਹੈ, ਸਮਾਰਟ ਕੰਟਰੈਕਟ ਉਨ੍ਹਾਂ ਨੂੰ ਨਵੇਂ ਬੀਜ ਵੇਚਣ ਜਾਂ ਆਰਡਰ ਲੈਣ ਤੋਂ ਤੁਰੰਤ ਰੋਕ ਦਿੰਦਾ ਹੈ।",
    mr: "नाही! ज्या विक्रेत्यांचा एआय ट्रस्ट स्कोअर 40 पेक्षा कमी होतो, त्यांना स्मार्ट कॉन्ट्रॅक्ट नवीन बियाणे विकण्यापासून किंवा ऑर्डर्स घेण्यापासून त्वरित ब्लॉक करते."
  },
  faq5Q: {
    en: "Can farmers use SeedSure without complex crypto knowledge?",
    hi: "क्या किसान जटिल क्रिप्टो ज्ञान के बिना सीडश्योर का उपयोग कर सकते हैं?",
    pa: "ਕੀ ਕਿਸਾਨ ਬਿਨਾਂ ਗੁੰਝਲਦਾਰ ਕ੍ਰਿਪਟੋ ਜਾਣਕਾਰੀ ਦੇ SeedSure ਵਰਤ ਸਕਦੇ ਹਨ?",
    mr: "शेतकरी क्लिष्ट क्रिप्टो ज्ञानाशिवाय SeedSure वापरू शकतात का?"
  },
  faq5A: {
    en: "Yes! SeedSure is built with intuitive, farmer-first workflows. You can log in via demo farmer personas or phone credentials, review quality parameters in plain terms, and interact with the platform seamlessly. For Web3 users and evaluators, direct MetaMask connection to local Ethereum and Sepolia testnets is also fully supported.",
    hi: "हाँ! सीडश्योर को विशेष रूप से किसानों के लिए बेहद सरल बनाया गया है। आप आसान फोन नंबर या किसान प्रोफ़ाइल से लॉगिन कर सकते हैं और सरल भाषा में गुणवत्ता जांच सकते हैं। वेब3 उपयोगकर्ताओं के लिए मेटामास्क वॉलेट भी समर्थित है।",
    pa: "ਹਾਂ! SeedSure ਵਿਸ਼ੇਸ਼ ਤੌਰ 'ਤੇ ਕਿਸਾਨਾਂ ਲਈ ਬਹੁਤ ਆਸਾਨ ਬਣਾਇਆ ਗਿਆ ਹੈ। ਤੁਸੀਂ ਆਸਾਨ ਪ੍ਰੋਫਾਈਲ ਨਾਲ ਲਾਗਇਨ ਕਰ ਸਕਦੇ ਹੋ ਅਤੇ ਆਮ ਭਾਸ਼ਾ ਵਿੱਚ ਜਾਣਕਾਰੀ ਵੇਖ ਸਕਦੇ ਹੋ।",
    mr: "होय! SeedSure शेतकऱ्यांसाठी अत्यंत सोपे बनवले आहे. तुम्ही सोप्या प्रोफाईलने लॉगिन करू शकता आणि साध्या भाषेत गुणवत्तेची माहिती मिळवू शकता."
  },

  // Marketplace & General Platform Strings
  marketplaceTitle: {
    en: "Verified Seed Lots Marketplace",
    hi: "सत्यापित बीज लॉट बाज़ार",
    pa: "ਤਸਦੀਕਸ਼ੁਦਾ ਬੀਜ ਲਾਟ ਮਾਰਕੀਟ",
    mr: "सत्यापित बियाणे लॉट बाजार"
  },
  marketplaceSubtitle: {
    en: "All batches verified by Certification Authorities with non-custodial Ethereum escrow.",
    hi: "प्रमाणन प्राधिकरण द्वारा सत्यापित सभी बैच, गैर-कस्टोडियल इथेरियम एस्क्रो सुरक्षा के साथ।",
    pa: "ਸਾਰੇ ਬੈਚ ਪ੍ਰਮਾਣੀਕਰਨ ਅਥਾਰਟੀ ਦੁਆਰਾ ਤਸਦੀਕਸ਼ੁਦਾ, ਈਥਰਿਅਮ ਐਸਕਰੋ ਸੁਰੱਖਿਆ ਨਾਲ।",
    mr: "प्रमाणन प्राधिकरणाद्वारे तपासलेले सर्व लॉट्स, सुरक्षित इथेरियम एस्क्रो हमीसह."
  },
  searchPlaceholder: {
    en: "Search seed variety, breeder, crop, or batch ID...",
    hi: "बीज किस्म, उत्पादक, फसल या बैच आईडी खोजें...",
    pa: "ਬੀਜ ਦੀ ਕਿਸਮ, ਬਰੀਡਰ, ਫ਼ਸਲ ਜਾਂ ਬੈਚ ਆਈਡੀ ਖੋਜੋ...",
    mr: "बियाणे प्रकार, उत्पादक, पीक किंवा बॅच आयडी शोधा..."
  },
  all: { en: "All", hi: "सभी", pa: "ਸਾਰੇ", mr: "सर्व" },
  cereals: { en: "Cereals", hi: "अनाज", pa: "ਅਨਾਜ", mr: "तृणधान्ये" },
  pulses: { en: "Pulses", hi: "दालें", pa: "ਦਾਲਾਂ", mr: "कडधान्ये" },
  oilseeds: { en: "Oilseeds", hi: "तिलहन", pa: "ਤੇਲ ਬੀਜ", mr: "गळित धान्ये" },
  vegetables: { en: "Vegetables", hi: "सब्जियां", pa: "ਸਬਜ਼ੀਆਂ", mr: "भाजीपाला" },
  cashCrops: { en: "Cash Crops", hi: "नकदी फसलें", pa: "ਨਕਦੀ ਫ਼ਸਲਾਂ", mr: "नगदी पिके" },
  certifiedOnly: { en: "Certified Only", hi: "केवल प्रमाणित", pa: "ਸਿਰਫ਼ ਪ੍ਰਮਾਣਿਤ", mr: "केवळ प्रमाणित" },
  filterTrust: { en: "Min Trust", hi: "न्यूनतम ट्रस्ट", pa: "ਘੱਟੋ-ਘੱਟ ਟਰੱਸਟ", mr: "किमान विश्वास" },
  sortBy: { en: "Sort By", hi: "क्रमबद्ध करें", pa: "ਤਰਤੀਬ", mr: "क्रमवारी" },
  sortTrust: { en: "Highest Trust Score", hi: "सर्वोच्च ट्रस्ट स्कोर", pa: "ਉੱਚਤਮ ਟਰੱਸਟ ਸਕੋਰ", mr: "सर्वोच्च ट्रस्ट स्कोअर" },
  sortPriceLow: { en: "Price: Low to High", hi: "कीमत: कम से अधिक", pa: "ਕੀਮਤ: ਘੱਟ ਤੋਂ ਵੱਧ", mr: "किंमत: कमी ते जास्त" },
  sortPriceHigh: { en: "Price: High to Low", hi: "कीमत: अधिक से कम", pa: "ਕੀਮਤ: ਵੱਧ ਤੋਂ ਘੱਟ", mr: "किंमत: जास्त ते कमी" },
  sortGermination: { en: "Highest Germination %", hi: "सर्वोच्च अंकुरण %", pa: "ਉੱਚਤਮ ਜੰਮਣ ਸਮਰੱਥਾ %", mr: "सर्वोच्च उगवण क्षमता %" },
  germinationRate: { en: "Germination", hi: "अंकुरण क्षमता", pa: "ਜੰਮਣ ਸਮਰੱਥਾ", mr: "उगवण क्षमता" },
  purity: { en: "Purity", hi: "आनुवंशिक शुद्धता", pa: "ਸ਼ੁੱਧਤਾ", mr: "शुद्धता" },
  available: { en: "Available", hi: "उपलब्ध स्टॉक", pa: "ਉਪਲਬਧ", mr: "उपलब्ध" },
  pricePerKg: { en: "Price", hi: "मूल्य", pa: "ਕੀਮਤ", mr: "किंमत" },
  buyEscrowBtn: { en: "Buy with Escrow", hi: "एस्क्रो से खरीदें", pa: "ਐਸਕਰੋ ਨਾਲ ਖਰੀਦੋ", mr: "एस्क्रोने खरेदी करा" },
  verifySeedBtn: { en: "Verify QR Tag", hi: "QR टैग जांचें", pa: "QR ਟੈਗ ਜਾਂਚੋ", mr: "QR टॅग तपासा" },
  viewDetails: { en: "Details", hi: "विवरण", pa: "ਵੇਰਵੇ", mr: "तपशील" },
  escrowNotice: {
    en: "Payment locked in Ethereum smart contract until you verify delivery.",
    hi: "जब तक आप डिलीवरी की पुष्टि नहीं करते, भुगतान इथेरियम स्मार्ट कॉन्ट्रैक्ट में सुरक्षित रहता है।",
    pa: "ਤੁਹਾਡੀ ਪੁਸ਼ਟੀ ਤੱਕ ਭੁਗਤਾਨ ਸਮਾਰਟ ਕੰਟਰੈਕਟ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰਹਿੰਦਾ ਹੈ।",
    mr: "आपण पडताळणी करेपर्यंत पेमेंट स्मार्ट कॉन्ट्रॅक्टमध्ये सुरक्षित राहते."
  },

  // Common Platform Actions
  confirm: { en: "Confirm", hi: "पुष्टि करें", pa: "ਪੁਸ਼ਟੀ ਕਰੋ", mr: "पुष्टी करा" },
  cancel: { en: "Cancel", hi: "रद्द करें", pa: "ਰੱਦ ਕਰੋ", mr: "रद्द करा" },
  status: { en: "Status", hi: "स्थिति", pa: "ਸਥਿਤੀ", mr: "स्थिती" },
  actions: { en: "Actions", hi: "कार्रवाई", pa: "ਕਾਰਵਾਈਆਂ", mr: "कृती" },
  orderId: { en: "Order ID", hi: "ऑर्डर आईडी", pa: "ਆਰਡਰ ਆੀਡੀ", mr: "ऑर्डर आयडी" },
  totalAmount: { en: "Total Amount", hi: "कुल राशि", pa: "ਕੁੱਲ ਰਕਮ", mr: "एकूण रक्कम" },
  quantity: { en: "Quantity", hi: "मात्रा", pa: "ਮਾਤਰਾ", mr: "प्रमाण" },
  date: { en: "Date", hi: "तारीख", pa: "ਤਾਰੀਖ", mr: "तारीख" },
  confirmDeliveryBtn: { en: "Confirm Delivery", hi: "डिलीवरी की पुष्टि करें", pa: "ਡਿਲੀਵਰੀ ਪੁਸ਼ਟੀ ਕਰੋ", mr: "डिलिव्हरी पुष्टी करा" },
  raiseDisputeBtn: { en: "Raise Dispute", hi: "विवाद दर्ज करें", pa: "ਵਿਵਾਦ ਦਰਜ ਕਰੋ", mr: "तक्रार नोंदवा" },
  rateSellerBtn: { en: "Rate Breeder", hi: "रेटिंग दें", pa: "ਰੇਟਿੰਗ ਦਿਓ", mr: "रेटिंग द्या" }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("seedsure_lang") as LanguageCode;
    return saved && ["en", "hi", "pa", "mr"].includes(saved) ? saved : "en";
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem("seedsure_lang", lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, fallback?: string): string => {
    if (TRANSLATIONS[key] && TRANSLATIONS[key][language]) {
      return TRANSLATIONS[key][language];
    }
    if (TRANSLATIONS[key] && TRANSLATIONS[key].en) {
      return TRANSLATIONS[key].en;
    }
    return fallback !== undefined ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

