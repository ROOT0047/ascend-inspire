export type DailyQuote = {
  text: string;
  transliteration: string;
  translation: string;
  author: string;
};

export const dailyQuotes: DailyQuote[] = [
  {
    text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
    transliteration: "Karmaṇy-evādhikāras te mā phaleṣu kadācana",
    translation: "You have a right to your action alone, never to its fruits.",
    author: "Bhagavad Gita 2.47",
  },
  {
    text: "योगः कर्मसु कौशलम्।",
    transliteration: "Yogaḥ karmasu kauśalam",
    translation: "Yoga is excellence in action.",
    author: "Bhagavad Gita 2.50",
  },
  {
    text: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
    transliteration: "Uddhared ātmanātmānaṁ nātmānam avasādayet",
    translation: "Lift yourself by yourself; never let yourself sink.",
    author: "Bhagavad Gita 6.5",
  },
  {
    text: "श्रद्धावाँल्लभते ज्ञानम्।",
    transliteration: "Śraddhāvāṁl labhate jñānam",
    translation: "The one with conviction attains knowledge.",
    author: "Bhagavad Gita 4.39",
  },
  {
    text: "अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते।",
    transliteration: "Abhyāsena tu kaunteya vairāgyeṇa ca gṛhyate",
    translation: "The restless mind is mastered by practice and detachment.",
    author: "Bhagavad Gita 6.35",
  },
  {
    text: "समत्वं योग उच्यते।",
    transliteration: "Samatvaṁ yoga ucyate",
    translation: "Evenness of mind is called yoga.",
    author: "Bhagavad Gita 2.48",
  },
  {
    text: "उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत।",
    transliteration: "Uttiṣṭhata jāgrata prāpya varān nibodhata",
    translation: "Arise, awake, and stop not till the goal is reached.",
    author: "Katha Upanishad 1.3.14",
  },
  {
    text: "सत्यमेव जयते नानृतम्।",
    transliteration: "Satyam eva jayate nānṛtam",
    translation: "Truth alone triumphs, never falsehood.",
    author: "Mundaka Upanishad 3.1.6",
  },
  {
    text: "तत्त्वमसि।",
    transliteration: "Tat tvam asi",
    translation: "That thou art — the self you seek is already within.",
    author: "Chandogya Upanishad 6.8.7",
  },
  {
    text: "आलस्यं हि मनुष्याणां शरीरस्थो महान् रिपुः।",
    transliteration: "Ālasyaṁ hi manuṣyāṇāṁ śarīrastho mahān ripuḥ",
    translation: "Laziness is the greatest enemy dwelling in a person's own body.",
    author: "Chanakya Niti",
  },
  {
    text: "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः।",
    transliteration: "Udyamena hi sidhyanti kāryāṇi na manorathaiḥ",
    translation: "Work accomplishes tasks — not mere wishing.",
    author: "Hitopadesha",
  },
  {
    text: "विद्या ददाति विनयं विनयाद्याति पात्रताम्।",
    transliteration: "Vidyā dadāti vinayaṁ vinayād yāti pātratām",
    translation: "Knowledge gives humility; from humility comes worthiness.",
    author: "Hitopadesha",
  },
  {
    text: "अहिंसा परमो धर्मः।",
    transliteration: "Ahiṁsā paramo dharmaḥ",
    translation: "Non-violence is the highest duty.",
    author: "Mahabharata",
  },
  {
    text: "मनः एव मनुष्याणां कारणं बन्धमोक्षयोः।",
    transliteration: "Manaḥ eva manuṣyāṇāṁ kāraṇaṁ bandha-mokṣayoḥ",
    translation: "The mind alone is the cause of bondage and of liberation.",
    author: "Amritabindu Upanishad 2",
  },
  {
    text: "क्षणशः कणशश्चैव विद्यामर्थं च साधयेत्।",
    transliteration: "Kṣaṇaśaḥ kaṇaśaś caiva vidyām arthaṁ ca sādhayet",
    translation: "Gather knowledge moment by moment, wealth particle by particle.",
    author: "Chanakya Niti",
  },
  {
    text: "श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात्।",
    transliteration: "Śreyān sva-dharmo viguṇaḥ para-dharmāt sv-anuṣṭhitāt",
    translation: "Better your own duty done imperfectly than another's done well.",
    author: "Bhagavad Gita 3.35",
  },
  {
    text: "न हि ज्ञानेन सदृशं पवित्रमिह विद्यते।",
    transliteration: "Na hi jñānena sadṛśaṁ pavitram iha vidyate",
    translation: "In this world there is nothing as purifying as knowledge.",
    author: "Bhagavad Gita 4.38",
  },
  {
    text: "चरैवेति चरैवेति।",
    transliteration: "Caraiveti caraiveti",
    translation: "Keep moving, keep moving.",
    author: "Aitareya Brahmana 7.15",
  },
];

export function quoteForDate(date: Date = new Date()): DailyQuote {
  const dayIndex = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  return dailyQuotes[((dayIndex % dailyQuotes.length) + dailyQuotes.length) % dailyQuotes.length]!;
}
