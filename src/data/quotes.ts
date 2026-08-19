export type DailyQuote = {
  text: string;
  translation: string;
  author: string;
};

export const dailyQuotes: DailyQuote[] = [
  {
    text: "弱さを隠すのではない、支配するのだ。",
    translation: "Do not hide your weakness — govern it.",
    author: "Ayanokoji Kiyotaka",
  },
  {
    text: "勝つ者は、戦う前に勝っている。",
    translation: "The one who wins has already won before the fight begins.",
    author: "Sun Tzu",
  },
  {
    text: "静かな努力は、最も大きな音を立てる。",
    translation: "Quiet effort makes the loudest noise.",
    author: "Ayanokoji Kiyotaka",
  },
  {
    text: "習慣は第二の天性である。",
    translation: "Habit is second nature.",
    author: "Marcus Tullius Cicero",
  },
  {
    text: "己を知る者は強い。",
    translation: "The one who knows himself is strong.",
    author: "Lao Tzu",
  },
  {
    text: "感情を捨てろ。結果だけが真実だ。",
    translation: "Discard emotion — only results tell the truth.",
    author: "Ayanokoji Kiyotaka",
  },
  {
    text: "小さな石も、山を動かす始まりだ。",
    translation: "Even a small stone is where moving a mountain begins.",
    author: "Japanese proverb",
  },
  {
    text: "七転び八起き。",
    translation: "Fall seven times, rise eight.",
    author: "Japanese proverb",
  },
  {
    text: "支配とは、自分の一日を支配することだ。",
    translation: "Control means controlling your own day.",
    author: "Ayanokoji Kiyotaka",
  },
  {
    text: "継続は力なり。",
    translation: "Persistence is power.",
    author: "Japanese proverb",
  },
  {
    text: "規律は、望みと成果を繋ぐ橋である。",
    translation: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn",
  },
  {
    text: "焦らず、しかし止まらず。",
    translation: "Without haste, but without rest.",
    author: "Goethe",
  },
  {
    text: "強さとは、静けさの中にある。",
    translation: "Strength lives inside stillness.",
    author: "Ayanokoji Kiyotaka",
  },
  {
    text: "今日の一歩が、明日の距離になる。",
    translation: "Today's single step becomes tomorrow's distance.",
    author: "Japanese proverb",
  },
];

export function quoteForDate(date: Date = new Date()): DailyQuote {
  const dayIndex = Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000,
  );
  return dailyQuotes[((dayIndex % dailyQuotes.length) + dailyQuotes.length) % dailyQuotes.length]!;
}
