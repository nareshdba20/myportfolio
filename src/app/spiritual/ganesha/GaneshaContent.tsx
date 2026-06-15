"use client";
import Link from "next/link";
import { useLang, type Lang, type FontSize } from "@/contexts/language-context";
import ChantButton from "@/components/chant-button";

// ── Fonts ─────────────────────────────────────────────────────────────────────
const SA = "'Noto Serif Devanagari', serif";

const PROSE_FONT: Record<Lang, string> = {
  kn: "'Noto Serif Kannada', serif",
  hi: "'Noto Serif Devanagari', serif",
  te: "'Noto Serif Telugu', serif",
  ta: "'Noto Serif Tamil', serif",
  ml: "'Noto Serif Malayalam', serif",
};

const SPEECH_LANG: Record<Lang, string> = {
  kn: "kn-IN", hi: "hi-IN", te: "te-IN", ta: "ta-IN", ml: "ml-IN",
};

// ── Font scale ─────────────────────────────────────────────────────────────────
const SCRIPT_SIZE: Record<FontSize, string> = { small: "1.25rem", regular: "1.55rem", large: "2.0rem" };
const DEVA_SIZE:   Record<FontSize, string> = { small: "0.95rem", regular: "1.1rem",  large: "1.4rem"  };
const ROMAN_SIZE:  Record<FontSize, string> = { small: "0.72rem", regular: "0.82rem", large: "0.96rem" };

// ── Shloka lines ──────────────────────────────────────────────────────────────
const LINES = [
  {
    kannada:    "ಅಗಜಾನನ ಪದ್ಮಾರ್ಕಂ ಗಜಾನನಮ್ ಅಹರ್ನಿಶಮ್ ।",
    devanagari: "अगजानन पद्मार्कं गजाननम् अहर्निशम् ।",
    roman:      "Agajānana Padmārkam Gajānanam Aharniśam |",
  },
  {
    kannada:    "ಅನೇಕದಂತಂ ಭಕ್ತಾನಾಂ ಏಕದಂತಮುಪಾಸ್ಮಹೇ ॥",
    devanagari: "अनेकदंतं भक्तानां एकदंतमुपास्महे ॥",
    roman:      "Anekadantam Bhaktānām Ekadantamupāsmahe ||",
  },
];

const WORD_SCRIPTS = [
  { kannada: "ಅಗಜಾನನ",   devanagari: "अगजानन",   roman: "Agajanana"   },
  { kannada: "ಪದ್ಮಾರ್ಕಂ", devanagari: "पद्मार्कं",  roman: "Padmārkam"  },
  { kannada: "ಗಜಾನನಮ್",   devanagari: "गजाननम्",   roman: "Gajānanam"  },
  { kannada: "ಅಹರ್ನಿಶಮ್", devanagari: "अहर्निशम्", roman: "Aharniśam"  },
  { kannada: "ಅನೇಕದಂತಂ", devanagari: "अनेकदंतं",  roman: "Anekadantam" },
  { kannada: "ಭಕ್ತಾನಾಂ",  devanagari: "भक्तानां",  roman: "Bhaktānām"  },
  { kannada: "ಏಕದಂತಮ್",   devanagari: "एकदंतम्",   roman: "Ekadantam"  },
  { kannada: "ಉಪಾಸ್ಮಹೇ",  devanagari: "उपास्महे",  roman: "Upāsmahe"   },
];

// ── Translatable content ──────────────────────────────────────────────────────
interface WordDetail  { breakdown: string; meaning: string }
interface SigItem     { title: string; body: string }
interface LangContent {
  type: string;
  translation: string;
  words: WordDetail[];
  significance: SigItem[];
  howToChant: string[];
  benefits: string[];
}

const CONTENT: Record<"kn" | "hi", LangContent> = {
  kn: {
    type: "ಧ್ಯಾನ ಶ್ಲೋಕ",
    translation: "ಪಾರ್ವತಿ ತಾಯಿಯ ತಾಮರೆ ಮುಖಕ್ಕೆ ಸೂರ್ಯನಂತೆ ಆನಂದ ತರುವ ಗಜಾನನನನ್ನು — ಆನೆ ಮುಖದ ಸ್ವಾಮಿಯನ್ನು — ನಾವು ಹಗಲು ರಾತ್ರಿ ಪೂಜಿಸುತ್ತೇವೆ. ತನ್ನ ಭಕ್ತರ ಅನೇಕ ವಿಘ್ನಗಳನ್ನು ನಿವಾರಿಸುವ ಏಕದಂತನನ್ನು ನಾವು ಉಪಾಸಿಸುತ್ತೇವೆ.",
    words: [
      { breakdown: "ಅಗ (ಪರ್ವತ) + ಜಾನನ (ತಾಯಿ)", meaning: "ಪರ್ವತ-ಜಾತೆ — ಹಿಮಾಲಯದ ರಾಜ ಹಿಮವಂತನ ಮಗಳು ಪಾರ್ವತಿ. ಈ ಶ್ಲೋಕ ಗಣೇಶನನ್ನು ಪಾರ್ವತಿ ಅಮ್ಮನ ಪ್ರಿಯ ಪುತ್ರನಾಗಿ ಸ್ಮರಿಸುತ್ತದೆ." },
      { breakdown: "ಪದ್ಮ (ತಾಮರೆ) + ಅರ್ಕ (ಸೂರ್ಯ)", meaning: "ತಾಮರೆಗೆ ಸೂರ್ಯನಂತೆ. ಸೂರ್ಯನ ಬೆಳಕಿನಿಂದ ತಾಮರೆ ಅರಳುವಂತೆ, ಗಣೇಶನ ಉಪಸ್ಥಿತಿಯಿಂದ ಪಾರ್ವತಿ ತಾಯಿಯ ಮೊಗ ಸಂತೋಷದಿಂದ ಪ್ರಕಾಶಿಸುತ್ತದೆ." },
      { breakdown: "ಗಜ (ಆನೆ) + ಆನನ (ಮುಖ)", meaning: "ಆನೆ ಮುಖದವನು — ಗಣೇಶನ ಪ್ರಸಿದ್ಧ ರೂಪ. ಆನೆಯ ತಲೆ ಶ್ರೇಷ್ಠ ಬುದ್ಧಿ, ಸ್ಮರಣಶಕ್ತಿ ಮತ್ತು ಮಂಗಳವನ್ನು ಸೂಚಿಸುತ್ತದೆ." },
      { breakdown: "ಅಹರ್ (ಹಗಲು) + ನಿಶ (ರಾತ್ರಿ)", meaning: "ಹಗಲು ರಾತ್ರಿ — ನಿರಂತರವಾಗಿ, ಅವಿರಾಮವಾಗಿ. ಗಣೇಶ ಉಪಾಸನೆ ಯಾವ ಸಮಯಕ್ಕೂ ಸೀಮಿತವಲ್ಲ; ಸರ್ವಕಾಲದಲ್ಲೂ ಅವನನ್ನು ಪೂಜಿಸಲಾಗುತ್ತದೆ." },
      { breakdown: "ಅನೇಕ (ಹಲವು) + ದಂತ (ದಾಂತ / ವಿಘ್ನ)", meaning: "ಅಸಂಖ್ಯ ವಿಘ್ನಗಳನ್ನು ನಿವಾರಿಸುವವನು. 'ದಂತ' ಎಂಬ ಶಬ್ದಕ್ಕೆ ದಾಂತ ಮತ್ತು ಅಡಚಣೆ ಎಂಬ ಎರಡೂ ಅರ್ಥಗಳಿವೆ." },
      { breakdown: "ಭಕ್ತ — ಷಷ್ಠೀ ಬಹುವಚನ", meaning: "ಭಕ್ತರ. ಗಣೇಶನ ಕೃಪೆ ನಿಷ್ಠೆ ಮತ್ತು ಶರಣಾಗತಿಯಿಂದ ಅವನನ್ನು ಸೇರಿದ ಭಕ್ತರಿಗೆ ವಿಶೇಷವಾಗಿ ಹರಿಯುತ್ತದೆ." },
      { breakdown: "ಏಕ (ಒಂದು) + ದಂತ (ದಾಂತ)", meaning: "ಒಂದೇ ದಾಂತ ಉಳ್ಳವನು. ವ್ಯಾಸರ ಮಹಾಭಾರತ ಬರೆಯಲು ತನ್ನ ದಾಂತ ಮುರಿದ — ಜ್ಞಾನಕ್ಕಾಗಿ ತ್ಯಾಗದ ಶಾಶ್ವತ ಪ್ರತೀಕ." },
      { breakdown: "ಉಪ (ಹತ್ತಿರ) + ಆಸ್ಮಹೇ (ನಾವು ಕುಳಿತು ಧ್ಯಾನಿಸುತ್ತೇವೆ)", meaning: "ನಾವು ಉಪಾಸಿಸುತ್ತೇವೆ, ಧ್ಯಾನಿಸುತ್ತೇವೆ. ಭಕ್ತಿಯಿಂದ ಹತ್ತಿರ ಕುಳಿತಿರುವುದು — ಬರೀ ಯಾಂತ್ರಿಕ ಪಠಣವಲ್ಲ, ಹೃದಯಪೂರ್ವಕ ಚಿಂತನ." },
    ],
    significance: [
      { title: "ಮಂಗಳ ಆರಂಭದ ಸ್ತೋತ್ರ",  body: "ಈ ಶ್ಲೋಕವನ್ನು ಯಾವುದೇ ಪೂಜೆ, ಶಾಸ್ತ್ರ ಅಧ್ಯಯನ ಅಥವಾ ಹೊಸ ಕಾರ್ಯದ ಆರಂಭದಲ್ಲಿ ಪಠಿಸಲಾಗುತ್ತದೆ. ಗಣೇಶ ವಿಘ್ನೇಶ್ವರ — ಎಲ್ಲ ವಿಘ್ನಗಳ ಅಧಿಪತಿ. ಮಾರ್ಗ ತೆರೆಯುವ ಅಥವಾ ಮುಚ್ಚುವ ಶಕ್ತಿ ಅವನೊಬ್ಬನಿಗೇ ಇದೆ." },
      { title: "ಸೂರ್ಯ-ತಾಮರೆ ರೂಪಕ",      body: "ಗಣೇಶ ಸೂರ್ಯನಂತೆ ಪಾರ್ವತಿಯ ತಾಮರೆ ಮುಖ ಅರಳಿಸುತ್ತಾನೆ ಎಂಬ ಹೋಲಿಕೆ ಕೇವಲ ಕಾವ್ಯ ಸೌಂದರ್ಯಕ್ಕಾಗಿ ಅಲ್ಲ. ಗಣೇಶನ ಅಸ್ತಿತ್ವವೇ ಪಾರ್ವತಿ ತಾಯಿಗೆ ಮಹಾ ಆನಂದ. ಅನೇಕ ಸಂಪ್ರದಾಯಗಳಲ್ಲಿ ಶಿವನಿಗಿಂತ ಮೊದಲು ಗಣೇಶನನ್ನು ಪ್ರಾರ್ಥಿಸಲಾಗುತ್ತದೆ." },
      { title: "ಮುರಿದ ದಾಂತದ ಕಥೆ",        body: "ಏಕದಂತ ಗಣೇಶನ ಅತ್ಯಂತ ಪ್ರಸಿದ್ಧ ನಾಮ. ವ್ಯಾಸ ಮಹರ್ಷಿ ಮಹಾಭಾರತ ಹೇಳುತ್ತಿದ್ದಾಗ ಬರೆಯಲು, ವ್ಯಾಸರನ್ನು ನಿರಾಶೆಗೊಳಿಸದಿರಲು ಗಣೇಶ ತನ್ನ ದಾಂತ ಮುರಿದ — ಧರ್ಮ ಕಾರ್ಯಕ್ಕಾಗಿ ವ್ಯಕ್ತಿಗತ ಪೂರ್ಣತೆ ತ್ಯಜಿಸಿದ." },
    ],
    howToChant: [
      "ಬೆಳಿಗ್ಗೆ ಸ್ನಾನದ ನಂತರ ಪೂರ್ವ ಅಥವಾ ಈಶಾನ್ಯ ದಿಕ್ಕಿಗೆ ಮುಖಮಾಡಿ ಪಠಿಸಿ",
      "ತುಪ್ಪ ಅಥವಾ ಎಳ್ಳೆಣ್ಣೆಯ ದೀಪ ಹಚ್ಚಿ",
      "ದೂರ್ವಾ ಹುಲ್ಲು ಮತ್ತು ಮೋದಕ ಅರ್ಪಿಸಿ",
      "ಹೊಸ ಕಾರ್ಯ ಅಥವಾ ಪ್ರಯಾಣದ ಆರಂಭದಲ್ಲಿ ೩ ಬಾರಿ ಪಠಿಸಿ",
      "ವಿಶೇಷ ಕೃಪೆಗಾಗಿ ಚತುರ್ಥಿ ದಿನ ೧೦೮ ಬಾರಿ ಜಪಿಸಿ",
      "ಮಂಗಳವಾರ ಮತ್ತು ಬುಧವಾರ ವಿಶೇಷ ಶುಭ ದಿನಗಳು",
    ],
    benefits: [
      "ಭಕ್ತರ ಮಾರ್ಗದಲ್ಲಿನ ವಿಘ್ನಗಳನ್ನು ನಿವಾರಿಸುತ್ತಾನೆ",
      "ಬುದ್ಧಿ ಮತ್ತು ವಿವೇಕ ನೀಡುತ್ತಾನೆ",
      "ಎಲ್ಲ ಹೊಸ ಆರಂಭಗಳಿಗೆ ಮಂಗಳ ತರುತ್ತಾನೆ",
      "ದೃಢ ನಿಶ್ಚಯ ಮತ್ತು ಆತ್ಮ ವಿಶ್ವಾಸ ನೀಡುತ್ತಾನೆ",
      "ಕಲಿಕೆ ಮತ್ತು ಸೃಜನಶೀಲ ಕಾರ್ಯಕ್ಕೆ ಕೃಪೆ ಅನುಗ್ರಹಿಸುತ್ತಾನೆ",
      "ಪಾರ್ವತಿ ತಾಯಿಯ ಮಾತೃ ಆಶೀರ್ವಾದ ಆಕರ್ಷಿಸುತ್ತಾನೆ",
    ],
  },

  hi: {
    type: "ध्यान श्लोक",
    translation: "पार्वती माता के कमल-मुख को सूर्य की भाँति आनंदित करने वाले गजानन को — हम दिन-रात उपासते हैं। अनेक विघ्नों को हरने वाले एकदंत की हम भक्ति से आराधना करते हैं।",
    words: [
      { breakdown: "अग (पर्वत) + जानन (माता)", meaning: "पर्वत-पुत्री — हिमालय के राजा हिमवान की पुत्री पार्वती। यह श्लोक गणेश को माता पार्वती के प्रिय पुत्र के रूप में स्मरण करता है।" },
      { breakdown: "पद्म (कमल) + अर्क (सूर्य)", meaning: "कमल के लिए सूर्य के समान। जैसे सूर्य के प्रकाश से कमल खिलता है, वैसे ही गणेश की उपस्थिति से माता पार्वती का मुख हर्ष से प्रकाशित होता है।" },
      { breakdown: "गज (हाथी) + आनन (मुख)", meaning: "हाथी-मुखवाले — गणेश का प्रसिद्ध स्वरूप। हाथी का सिर श्रेष्ठ बुद्धि, स्मरण-शक्ति और मंगल का प्रतीक है।" },
      { breakdown: "अहर् (दिन) + निश (रात)", meaning: "दिन-रात — निरंतर, अविराम। गणेश-उपासना किसी समय तक सीमित नहीं; वे सर्वकाल में पूजनीय हैं।" },
      { breakdown: "अनेक (बहुत) + दंत (दाँत / विघ्न)", meaning: "असंख्य विघ्नों को दूर करनेवाले। 'दंत' का अर्थ दाँत भी है और विघ्न भी — दोनों अर्थ यहाँ सार्थक हैं।" },
      { breakdown: "भक्त — षष्ठी विभक्ति बहुवचन", meaning: "भक्तों के लिए। गणेश की कृपा श्रद्धा और शरणागति से उन्हें भजनेवाले भक्तों पर विशेष रूप से बरसती है।" },
      { breakdown: "एक + दंत (दाँत)", meaning: "एक दाँत वाले। महाभारत लिखने के लिए व्यास जी को निराश न करने हेतु उन्होंने अपना दाँत तोड़ा — ज्ञान के लिए त्याग का शाश्वत प्रतीक।" },
      { breakdown: "उप (पास में) + आस्महे (हम बैठकर ध्यान करते हैं)", meaning: "हम उपासना करते हैं, ध्यान करते हैं। भक्तिपूर्वक पास बैठना — केवल यांत्रिक पाठ नहीं, हृदय से किया हुआ चिंतन।" },
    ],
    significance: [
      { title: "मंगल-आरंभ का स्तोत्र",  body: "यह श्लोक किसी भी पूजा, शास्त्र-अध्ययन या नए कार्य के आरंभ में पाठ किया जाता है। गणेश विघ्नेश्वर हैं — समस्त विघ्नों के अधिपति। मार्ग खोलने या बंद करने की शक्ति केवल उन्हीं में है।" },
      { title: "सूर्य-कमल उपमा",          body: "गणेश सूर्य की भाँति पार्वती के कमल-मुख को प्रफुल्लित करते हैं — यह उपमा केवल काव्य-सौंदर्य के लिए नहीं है। गणेश का अस्तित्व ही माता को महान आनंद देता है। अनेक परंपराओं में शिव से पूर्व गणेश की वंदना की जाती है।" },
      { title: "टूटे दाँत की कथा",        body: "एकदंत गणेश का सर्वप्रसिद्ध नाम है। महर्षि व्यास के महाभारत-वाचन को लिखने के लिए गणेश ने अपना दाँत तोड़ लिया — धर्म-कार्य हेतु व्यक्तिगत पूर्णता का त्याग, शाश्वत प्रेरणा का स्रोत।" },
    ],
    howToChant: [
      "प्रातःकाल स्नान के पश्चात पूर्व या ईशान दिशा में मुख करके पाठ करें",
      "घी या तिल के तेल का दीपक प्रज्वलित करें",
      "दूर्वा-तृण और मोदक अर्पित करें",
      "नए कार्य या यात्रा के आरंभ में ३ बार पाठ करें",
      "विशेष कृपा के लिए चतुर्थी के दिन १०८ बार जप करें",
      "मंगलवार और बुधवार विशेष शुभ दिन माने जाते हैं",
    ],
    benefits: [
      "भक्तों के मार्ग में आने वाले विघ्न दूर करते हैं",
      "बुद्धि और विवेक प्रदान करते हैं",
      "सभी नए आरंभों में मंगल लाते हैं",
      "दृढ़ संकल्प और आत्मविश्वास देते हैं",
      "अध्ययन और सृजन-कार्य पर विशेष कृपा करते हैं",
      "माता पार्वती का मातृ-आशीर्वाद आकर्षित करते हैं",
    ],
  },
};

const COMING_SOON: Partial<Record<Lang, string>> = {
  te: "ఈ భాషలో అనువాదం త్వరలో వస్తుంది",
  ta: "இந்த மொழியில் மொழிபெயர்ப்பு விரைவில் வரும்",
  ml: "ഈ ഭാഷയിൽ വിവർത്തനം ഉടൻ വരും",
};

interface Labels {
  wordSection: string; sigSection: string; chantSection: string; benefitSection: string;
  scriptLabel: string; translitLabel: string; translationLabel: string;
  backLink: string; chantBtn: string; stopBtn: string;
}

const LABELS: Record<Lang, Labels> = {
  kn: { wordSection: "ಪದ-ಪರಿಚಯ", sigSection: "ಮಹತ್ವ", chantSection: "ಜಪ ವಿಧಿ", benefitSection: "ಫಲ", scriptLabel: "ಕನ್ನಡ", translitLabel: "ಉಚ್ಚಾರಣೆ", translationLabel: "ಅನುವಾದ", backLink: "← ಅಧ್ಯಾತ್ಮ", chantBtn: "ಪಠಿಸು", stopBtn: "ನಿಲ್ಲಿಸು" },
  hi: { wordSection: "पद-परिचय", sigSection: "महत्त्व", chantSection: "जप-विधि", benefitSection: "फल", scriptLabel: "देवनागरी", translitLabel: "उच्चारण", translationLabel: "अनुवाद", backLink: "← आध्यात्म", chantBtn: "पाठ करें", stopBtn: "रोकें" },
  te: { wordSection: "పద పరిచయం", sigSection: "మహత్వం", chantSection: "జప విధి", benefitSection: "ఫలం", scriptLabel: "లిపి", translitLabel: "ఉచ్చారణ", translationLabel: "అనువాదం", backLink: "← ఆధ్యాత్మికం", chantBtn: "పఠించు", stopBtn: "ఆపు" },
  ta: { wordSection: "பத விளக்கம்", sigSection: "முக்கியத்துவம்", chantSection: "ஜப முறை", benefitSection: "பலன்", scriptLabel: "எழுத்து", translitLabel: "உச்சரிப்பு", translationLabel: "மொழிபெயர்ப்பு", backLink: "← ஆன்மீகம்", chantBtn: "பாடு", stopBtn: "நிறுத்து" },
  ml: { wordSection: "പദ പരിചയം", sigSection: "മഹത്ത്വം", chantSection: "ജപ വിധി", benefitSection: "ഫലം", scriptLabel: "ലിപി", translitLabel: "ഉച്ചാരണം", translationLabel: "വിവർത്തനം", backLink: "← ആദ്ധ്യാത്മികം", chantBtn: "ചൊല്ലുക", stopBtn: "നിർത്തുക" },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function LotusMandala() {
  const C = 200;
  return (
    <svg viewBox="0 0 400 400" aria-hidden className="w-full h-full">
      <circle cx={C} cy={C} r="188" fill="none" stroke="#8B6914" strokeWidth="0.5" opacity="0.30" />
      <circle cx={C} cy={C} r="182" fill="none" stroke="#8B6914" strokeWidth="0.3" opacity="0.18" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        const px = C + Math.cos(a) * 118, py = C + Math.sin(a) * 118;
        return <ellipse key={`op${i}`} cx={px} cy={py} rx="14" ry="38" transform={`rotate(${(a * 180 / Math.PI) + 90} ${px} ${py})`} fill="none" stroke="#8B6914" strokeWidth="0.6" opacity="0.38" />;
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        const px = C + Math.cos(a) * 62, py = C + Math.sin(a) * 62;
        return <ellipse key={`ip${i}`} cx={px} cy={py} rx="11" ry="32" transform={`rotate(${(a * 180 / Math.PI) + 90} ${px} ${py})`} fill="none" stroke="#C65C00" strokeWidth="0.55" opacity="0.32" />;
      })}
      <circle cx={C} cy={C} r="32" fill="none" stroke="#8B6914" strokeWidth="0.7" opacity="0.38" />
      <circle cx={C} cy={C} r="22" fill="none" stroke="#C65C00" strokeWidth="0.5" opacity="0.28" />
      <circle cx={C} cy={C} r="13" fill="none" stroke="#8B6914" strokeWidth="0.5" opacity="0.32" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2;
        return <line key={`sp${i}`} x1={C + Math.cos(a) * 13} y1={C + Math.sin(a) * 13} x2={C + Math.cos(a) * 180} y2={C + Math.sin(a) * 180} stroke="#8B6914" strokeWidth="0.2" opacity="0.10" />;
      })}
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-10">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(139,105,20,0.20))" }} />
      <span style={{ color: "#C65C00", opacity: 0.50 }}>✦</span>
      <span style={{ fontFamily: SA, color: "#8B6914", opacity: 0.32, fontSize: "0.9rem" }}>ॐ</span>
      <span style={{ color: "#C65C00", opacity: 0.50 }}>✦</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(139,105,20,0.20))" }} />
    </div>
  );
}

function SecLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] font-mono uppercase tracking-[0.28em] mb-4" style={{ color: "rgba(198,92,0,0.65)" }}>
      {children}
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function GaneshaContent() {
  const { lang, fields, fontSize } = useLang();
  const lbl  = LABELS[lang];
  const pf   = PROSE_FONT[lang];
  const contentLang: "kn" | "hi" = lang === "hi" ? "hi" : "kn";
  const content    = CONTENT[contentLang];
  const comingSoon = COMING_SOON[lang];

  const scriptSz = SCRIPT_SIZE[fontSize];
  const devaSz   = DEVA_SIZE[fontSize];
  const romanSz  = ROMAN_SIZE[fontSize];

  return (
    <div className="relative min-h-screen">

      {/* Subtle warm top glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,153,51,0.10) 0%, transparent 65%)" }} />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-5 py-10 md:py-16">

        {/* Top bar: back link only (settings button is fixed in layout) */}
        <div className="flex items-center mb-10">
          <Link
            href="/spiritual"
            className="text-[11px] font-mono transition-opacity opacity-40 hover:opacity-70"
            style={{ color: "#8B6914", fontFamily: pf }}
          >
            {lbl.backLink}
          </Link>
        </div>

        {/* Coming-soon banner */}
        {comingSoon && (
          <div className="mb-6 rounded-xl px-4 py-3 text-center text-sm"
            style={{ background: "rgba(198,92,0,0.05)", border: "1px solid rgba(198,92,0,0.18)", fontFamily: pf, color: "rgba(198,92,0,0.75)" }}>
            {comingSoon}
          </div>
        )}

        {/* ── HERO ── */}
        <div className="text-center mb-14">
          <div className="relative w-44 h-44 mx-auto mb-7 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(198,92,0,0.10) 0%, rgba(139,105,20,0.04) 45%, transparent 70%)" }} />
            <div className="absolute rounded-full" style={{ inset: "6px",  border: "1px solid rgba(139,105,20,0.16)" }} />
            <div className="absolute rounded-full" style={{ inset: "18px", border: "1px solid rgba(139,105,20,0.10)" }} />
            <div className="absolute rounded-full" style={{ inset: "30px", border: "1px solid rgba(198,92,0,0.08)"  }} />
            <span style={{
              fontFamily: SA, fontSize: "5.5rem", lineHeight: 1,
              background: "linear-gradient(160deg, #C65C00 0%, #8B6914 50%, #A07720 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(139,105,20,0.25))", position: "relative", zIndex: 1,
            }}>
              ॐ
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2"
            style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#3B2000" }}>
            ಗಣೇಶ
          </h1>
          <p className="text-xl mb-1" style={{ fontFamily: SA, color: "rgba(139,105,20,0.55)" }}>श्री गणेशाय नमः</p>
          <p className="text-xs tracking-widest mt-3"
            style={{ fontFamily: "'Noto Serif Kannada', serif", color: "rgba(198,92,0,0.55)" }}>
            ವಿಘ್ನಹರ್ತ · ಗಜಾನನ · ಏಕದಂತ · ಬುದ್ಧಿಪ್ರಿಯ
          </p>
        </div>

        <Divider />

        {/* ── SHLOKA CARD ── */}
        <div className="relative rounded-3xl overflow-hidden mb-8"
          style={{ background: "rgba(139,105,20,0.04)", border: "1px solid rgba(139,105,20,0.14)", boxShadow: "0 2px 24px rgba(44,24,16,0.06)" }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ opacity: 0.06 }}>
            <div className="w-[380px] h-[380px]"><LotusMandala /></div>
          </div>

          <div className="relative z-10 p-7 md:p-10 text-center">
            <SecLabel>ಅಗಜಾನನ ಪದ್ಮಾರ್ಕಂ · {content.type}</SecLabel>

            {/* Script — Kannada */}
            {fields.script && (
              <div className="mb-5 space-y-3">
                <p className="text-[9px] font-mono uppercase tracking-widest mb-3" style={{ color: "rgba(198,92,0,0.55)" }}>
                  {lbl.scriptLabel}
                </p>
                {LINES.map((line, i) => (
                  <p key={i} className="leading-loose"
                    style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#1C0F00", fontSize: scriptSz }}>
                    {line.kannada}
                  </p>
                ))}
                {/* Devanagari sub-box */}
                <div className="rounded-xl px-4 py-3 mt-3 space-y-1.5"
                  style={{ background: "rgba(139,105,20,0.05)", border: "1px solid rgba(139,105,20,0.10)" }}>
                  {LINES.map((line, i) => (
                    <p key={i} className="leading-loose"
                      style={{ fontFamily: SA, color: "rgba(44,24,16,0.62)", fontSize: devaSz }}>
                      {line.devanagari}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Transliteration — Roman */}
            {fields.transliteration && (
              <div className="mb-6 space-y-1.5">
                <p className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(198,92,0,0.55)" }}>
                  {lbl.translitLabel}
                </p>
                {LINES.map((line, i) => (
                  <p key={i} className="italic leading-relaxed"
                    style={{ color: "rgba(44,24,16,0.50)", letterSpacing: "0.03em", fontSize: romanSz }}>
                    {line.roman}
                  </p>
                ))}
              </div>
            )}

            {/* Chant button */}
            <div className="flex justify-center mb-6">
              <ChantButton
                lines={LINES.map(l => l.kannada)}
                chantLabel={lbl.chantBtn}
                stopLabel={lbl.stopBtn}
                speechLang={SPEECH_LANG[lang]}
              />
            </div>

            {/* Translation */}
            {fields.translation && (
              <div className="rounded-2xl px-5 py-4 text-left"
                style={{ background: "rgba(198,92,0,0.04)", border: "1px solid rgba(198,92,0,0.12)" }}>
                <p className="text-[9px] font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(198,92,0,0.58)" }}>
                  {lbl.translationLabel}
                </p>
                <p className="text-sm leading-relaxed italic"
                  style={{ fontFamily: pf, color: "rgba(44,24,16,0.80)" }}>
                  "{content.translation}"
                </p>
              </div>
            )}
          </div>
        </div>

        <Divider />

        {/* ── WORD BREAKDOWN ── */}
        {fields.wordMeanings && (
          <div className="mb-8">
            <SecLabel>{lbl.wordSection}</SecLabel>
            <div className="grid grid-cols-1 gap-3">
              {WORD_SCRIPTS.map((w, i) => (
                <div key={i} className="rounded-xl p-4"
                  style={{ background: "rgba(0,0,0,0.02)", border: "1px solid rgba(139,105,20,0.10)" }}>
                  <div className="flex items-start gap-4">
                    <span className="text-[10px] font-mono mt-1 shrink-0 w-4 text-right"
                      style={{ color: "rgba(139,105,20,0.35)" }}>{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-3 flex-wrap mb-1">
                        <span className="text-xl font-semibold"
                          style={{ fontFamily: "'Noto Serif Kannada', serif", color: "#5C3A00" }}>{w.kannada}</span>
                        <span className="text-base"
                          style={{ fontFamily: SA, color: "rgba(139,105,20,0.55)" }}>{w.devanagari}</span>
                        <span className="text-[11px] italic"
                          style={{ color: "rgba(198,92,0,0.55)" }}>{w.roman}</span>
                      </div>
                      <p className="text-[10px] font-mono mb-2"
                        style={{ fontFamily: pf, color: "rgba(198,92,0,0.65)" }}>
                        {content.words[i].breakdown}
                      </p>
                      <p className="text-sm leading-relaxed"
                        style={{ fontFamily: pf, color: "rgba(44,24,16,0.70)" }}>
                        {content.words[i].meaning}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Divider />

        {/* ── SIGNIFICANCE ── */}
        <div className="mb-10">
          <SecLabel>{lbl.sigSection}</SecLabel>
          <div className="space-y-4">
            {content.significance.map((item, i) => (
              <div key={i} className="rounded-xl p-4"
                style={{ background: "rgba(198,92,0,0.03)", border: "1px solid rgba(198,92,0,0.10)", borderLeft: "3px solid rgba(198,92,0,0.40)" }}>
                <p className="text-xs font-semibold mb-2" style={{ fontFamily: pf, color: "#5C3A00" }}>{item.title}</p>
                <p className="text-sm leading-relaxed" style={{ fontFamily: pf, color: "rgba(44,24,16,0.68)" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW TO CHANT + BENEFITS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div>
            <SecLabel>{lbl.chantSection}</SecLabel>
            <ul className="space-y-3">
              {content.howToChant.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ fontFamily: pf, color: "rgba(44,24,16,0.65)" }}>
                  <span style={{ color: "rgba(198,92,0,0.55)" }} className="mt-1 shrink-0">✦</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SecLabel>{lbl.benefitSection}</SecLabel>
            <ul className="space-y-3">
              {content.benefits.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed"
                  style={{ fontFamily: pf, color: "rgba(44,24,16,0.65)" }}>
                  <span style={{ color: "rgba(139,105,20,0.55)" }} className="mt-1 shrink-0">◆</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Divider />

        {/* ── FOOTER ── */}
        <div className="text-center pb-6">
          <div className="w-24 h-24 mx-auto mb-6 opacity-12"><LotusMandala /></div>
          <p className="text-base mb-1"
            style={{ fontFamily: "'Noto Serif Kannada', serif", color: "rgba(139,105,20,0.45)" }}>ಗಣಪತಯೇ ನಮಃ</p>
          <p className="text-sm"
            style={{ fontFamily: SA, color: "rgba(139,105,20,0.28)" }}>गणपतये नमः</p>
          <Link href="/spiritual"
            className="inline-block mt-8 text-[11px] font-mono transition-opacity opacity-30 hover:opacity-60"
            style={{ color: "#8B6914", fontFamily: pf }}>
            {lbl.backLink}
          </Link>
        </div>

      </div>
    </div>
  );
}
