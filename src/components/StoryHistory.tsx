import React, { useState } from 'react';
import { Language } from '../data';
import { audioEngine } from './AudioEngine';

interface StoryHistoryProps {
  lang: Language;
}

interface StoryArc {
  title: { en: string; ja: string };
  period: { en: string; ja: string };
  desc: { en: string; ja: string };
  highlight: { en: string; ja: string };
  energyColor: 'pink' | 'blue' | 'purple' | 'green';
}

const storyArcs: StoryArc[] = [
  {
    title: { en: "Volume 0: Cursed Child Arc", ja: "東京都立呪術高等専門学校 (0巻)" },
    period: { en: "Prequel Story", ja: "前日譚" },
    desc: {
      en: "Yuta Okkotsu, a high schooler haunted by the vengeful cursed spirit of his childhood friend Rika, joins Tokyo Jujutsu High under Satoru Gojo. He learns to harness the curse, ultimately facing off against the rogue special-grade sorcerer Suguru Geto during the Night Parade of a Hundred Demons.",
      ja: "幼馴染の祈本里香の強大な呪いに憑りつかれた乙骨憂太は、五条悟の導きで都立呪術高専に入学する。仲間と出会い、呪力をコントロールすることを学ぶ中、百鬼夜行を企てる最悪の呪詛師・夏油傑との死闘に臨む。"
    },
    highlight: { en: "Yuta & Rika's pure love curse", ja: "乙骨と里香の「純愛」の呪い" },
    energyColor: 'blue'
  },
  {
    title: { en: "Fearsome Womb & Intro Arc", ja: "呪胎戴天・始まりの物語" },
    period: { en: "Season 1 (Ep 1-8)", ja: "アニメ第1期 第1話〜第8話" },
    desc: {
      en: "Yuji Itadori swallows a dried finger of Ryomen Sukuna, the King of Curses, to save his friends. Becoming Sukuna's vessel, he enters Jujutsu High and teams up with Megumi Fushiguro and Nobara Kugisaki. Their training is quickly cut short by a deadly Special Grade curse at a detention center.",
      ja: "虎杖悠仁は、友人を救うため特級呪物「両面宿儺の指」を喰らい、その身に呪いの王を宿す。五条悟のもとで伏黒恵、釘崎野薔薇と共に呪術高専に入学するが、少年院に突如現れた呪胎（特級呪霊）との戦闘で過酷な現実を突きつけられる。"
    },
    highlight: { en: "Nobara joins Tokyo's first-years", ja: "釘崎野薔薇が上京、1年生チーム結成" },
    energyColor: 'pink'
  },
  {
    title: { en: "Vs. Mahito Arc", ja: "幼魚と逆罰 (対真人編)" },
    period: { en: "Season 1 (Ep 9-13)", ja: "アニメ第1期 第9話〜第13話" },
    desc: {
      en: "While investigating mysterious curse deaths, Yuji meets Junpei Yoshino, a bullied teenager manipulated by the malicious patchwork curse Mahito. Yuji fights to save Junpei, resulting in a brutal encounter that sparks a deep, personal feud between Yuji and Mahito.",
      ja: "不審死事件を調査中、虎杖は真人の謀略によって歪められた少年・吉野順平と出会い心を通わせる。しかし真人の無為転変により非情な運命を辿った順平をめぐり、虎杖は怒りと共に特級呪霊・真人との因縁の戦いへ身を投じる。"
    },
    highlight: { en: "The tragic fate of Junpei", ja: "真人の悪意と順平の悲劇" },
    energyColor: 'purple'
  },
  {
    title: { en: "Kyoto Goodwill Event Arc", ja: "京都姉妹校交流会編" },
    period: { en: "Season 1 (Ep 14-21)", ja: "アニメ第1期 第14話〜第21話" },
    desc: {
      en: "The Tokyo and Kyoto Jujutsu High campuses face off in a combat event. Tensions run high as the Kyoto principal orders his students to assassinate Yuji. The games are interrupted when Hanami, Mahito, and other curses launch an organized invasion to steal Sukuna's fingers.",
      ja: "東京校と京都校の姉妹校交流会が幕を開ける。宿儺の器である虎杖の抹殺を目論む京都校の思惑が交錯する中、特級呪霊の花御や真人が呪術高専の結界を破り強襲。学生達と共闘し、侵入者を迎え撃つ。"
    },
    highlight: { en: "Yuji and Todo unlock Black Flash", ja: "虎杖と東堂のコンビ、黒閃発動" },
    energyColor: 'green'
  },
  {
    title: { en: "Death Painting Arc", ja: "起首雷同編 (呪胎九相図)" },
    period: { en: "Season 1 (Ep 22-24)", ja: "アニメ第1期 第22話〜第24話" },
    desc: {
      en: "Yuji, Megumi, and Nobara investigate a curse linked to Megumi's old middle school. They encounter the Death Painting Wombs, Eso and Kechizu. In a high-stakes forest battle, Nobara unleashes her devastating Resonance technique alongside Yuji's martial arts to secure victory.",
      ja: "八十八橋の怪談呪霊を追う虎杖、伏黒、釘崎の一年生トリオは、真人によって肉体を得た受肉体「呪胎九相図」の壊相・血塗と激突。極限状態の森の戦いで、釘崎は黒閃を極め、術式「共鳴り」により二人を討ち滅ぼす。"
    },
    highlight: { en: "Nobara's legendary Resonance scene", ja: "釘崎野薔薇の覚醒「共鳴り」と黒閃" },
    energyColor: 'pink'
  },
  {
    title: { en: "Shibuya Incident Arc", ja: "渋谷事変編" },
    period: { en: "Season 2 (Ep 30-47)", ja: "アニメ第2期 第30話〜第47話" },
    desc: {
      en: "On Halloween night 2018, Kenjaku (in Geto's body) launches a massive operation to seal Satoru Gojo. With Gojo captured, the entire city of Shibuya transforms into a warzone. Sorcerers suffer immense losses, Sukuna wreaks absolute havoc, and Nobara fights valiantly against Mahito.",
      ja: "2018年10月31日、渋谷駅周辺に非術師が閉じ込められ「五条悟の封印」が実行される。最強のカードを失った高専側は渋谷全域で呪詛師・呪霊と激戦を展開。宿儺の目覚めと虐殺、そして釘崎野薔薇と真人の死闘により大打撃を受ける。"
    },
    highlight: { en: "The sealing of Satoru Gojo", ja: "五条悟の封印と、破滅の一夜" },
    energyColor: 'purple'
  },
  {
    title: { en: "Culling Game Arc", ja: "死滅回游編" },
    period: { en: "Manga Ch 144-221", ja: "原作漫画 第144話〜第221話" },
    desc: {
      en: "To save Megumi's sister Tsumiki and unseal Satoru Gojo, Yuji and Megumi enter Kenjaku's Culling Game—a nationwide jujutsu battle royale. They recruit powerful ancient sorcerers and allies like Hakari and Kashimo, navigating deadly rules and Sukuna's sudden, shocking betrayal.",
      ja: "伏黒津美紀の救済と五条悟の封印解除のため、虎杖達は前代未聞の呪術殺し合いゲーム「死滅回游」に参加する。強力な過去の呪術師達と渡り合い、点（ポイント）を集める中、両面宿儺による衝撃的な憑依（器の乗っ取り）が起きる。"
    },
    highlight: { en: "Ancient sorcerers battle royale", ja: "現代VS過去の呪術師、死滅回游の幕開け" },
    energyColor: 'blue'
  },
  {
    title: { en: "Shinjuku Showdown Arc", ja: "人外魔境新宿決戦編" },
    period: { en: "Manga Ch 222-271 (Finale)", ja: "原作漫画 第222話〜第271話 (完結)" },
    desc: {
      en: "Satoru Gojo, finally freed, faces the King of Curses, Ryomen Sukuna, in a duel that devastates Shinjuku. After Gojo's fall, the surviving jujutsu sorcerers organize a relentless relay battle. In the final climax, Yuji combines cursed energy strikes with critical aid to end the curse era.",
      ja: "封印から帰還した五条悟と、両面宿儺による「現代最強VS史上最強」の決戦が新宿で勃発。五条散華の後、高専の総戦力が宿 wild な猛攻に順次挑む。絶望的な死闘の中、虎杖悠仁と仲間たちの魂をかけた魂の共鳴が宿儺を撃破へと導く。"
    },
    highlight: { en: "The ultimate showdown and final victory", ja: "史上最強の両面宿儺との決戦と大団円" },
    energyColor: 'green'
  }
];

interface MangaStore {
  name: string;
  url: string;
  logo: string;
  desc: { en: string; ja: string };
  badge: { en: string; ja: string };
}

const mangaStores: MangaStore[] = [
  {
    name: "VIZ Media",
    url: "https://www.viz.com/shonenjump/chapters/jujutsu-kaisen",
    logo: "https://seeklogo.com/images/V/viz-media-logo-4B35122CD9-seeklogo.com.png",
    desc: {
      en: "Official North American publisher. Read the latest chapters digitally on Shonen Jump or purchase official print collections.",
      ja: "北米の公式パブリッシャー。Shonen Jumpアプリで最新話をデジタルで読めるほか、公式の単行本を購入可能。"
    },
    badge: { en: "Official Publisher", ja: "公式出版社" }
  },
  {
    name: "Manga Plus by Shueisha",
    url: "https://mangaplus.shueisha.co.jp/titles/100034",
    logo: "https://seeklogo.com/images/M/manga-plus-logo-7B27C172A2-seeklogo.com.png",
    desc: {
      en: "Shueisha's official global digital service. Read new Jujutsu Kaisen chapters simultaneously with their Japanese release for free.",
      ja: "集英社が運営するグローバル向け公式アプリ。日本での週刊少年ジャンプ発売と同時に最新話を無料で多言語翻訳配信。"
    },
    badge: { en: "Simulpub Free", ja: "公式同時配信" }
  },
  {
    name: "Book Walker",
    url: "https://global.bookwalker.jp/search/?word=Jujutsu+Kaisen",
    logo: "https://seeklogo.com/images/B/book-walker-logo-C727D331A4-seeklogo.com.png",
    desc: {
      en: "Kadokawa's premier digital storefront. Get digital volumes of Jujutsu Kaisen with exclusive coins and reader-app functionality.",
      ja: "角川直営の電子書籍ストア。お得なコイン還元や専用ビューアアプリで、呪術廻戦のデジタル単行本を購入・閲覧可能。"
    },
    badge: { en: "Best for Digital", ja: "電子書籍に最適" }
  },
  {
    name: "Crunchyroll Store",
    url: "https://store.crunchyroll.com/collections/jujutsu-kaisen-manga",
    logo: "https://seeklogo.com/images/C/crunchyroll-logo-C427B332F2-seeklogo.com.png",
    desc: {
      en: "The ultimate shop for anime fans. Buy physical manga books, box sets, and official Jujutsu Kaisen figures and merchandise.",
      ja: "アニオタ向けの最大級ショップ。印刷版コミックスやボックスセット、公式フィギュア・キャラクターグッズをまとめて購入可能。"
    },
    badge: { en: "Physical Books & Merch", ja: "紙単行本＆グッズ" }
  },
  {
    name: "Amazon Manga Store",
    url: "https://www.amazon.com/dp/B07KKDGLRP",
    logo: "https://seeklogo.com/images/A/amazon-logo-C227E331A1-seeklogo.com.png",
    desc: {
      en: "Global e-commerce availability. Purchase physical paperback volumes or instant Kindle e-book formats with fast delivery.",
      ja: "世界最大のECサイト。ペーパーバック版単行本や、即時読書可能なKindle電子書籍版を迅速な配送・決済で購入可能。"
    },
    badge: { en: "Fastest Worldwide Delivery", ja: "世界スピード配送" }
  }
];

export const StoryHistory: React.FC<StoryHistoryProps> = ({ lang }) => {
  const [activeArc, setActiveArc] = useState<number | null>(0);

  const handleArcClick = (index: number) => {
    audioEngine.playSound('select');
    setActiveArc(activeArc === index ? null : index);
  };

  const handleStoreClick = () => {
    audioEngine.playSound('coin');
  };

  return (
    <div className="story-history-container">
      {/* SCANLINE / GLOW FILTERS */}
      <div className="scanlines"></div>
      
      {/* HEADER SECTION */}
      <div className="story-header-box">
        <h2 className="story-main-title neon-text-glow">
          {lang === 'en' ? '★ JUJUTSU KAISEN STORY LOG ★' : '★ 呪術廻戦・全編ストーリー記録 ★'}
        </h2>
        <p className="story-subtitle">
          {lang === 'en' 
            ? 'Interactive database recording the cursed history, major battles, and arcs of the Sorcery World.' 
            : '呪術界における歴史的な事件、戦闘、及び各章のアーカイブ記録データベース。'}
        </p>
      </div>

      {/* STORY TIMELINE */}
      <div className="story-timeline-wrapper">
        {storyArcs.map((arc, idx) => {
          const isOpen = activeArc === idx;
          return (
            <div 
              key={idx} 
              className={`timeline-arc-card ${isOpen ? 'active' : ''} border-${arc.energyColor}`}
            >
              {/* Card Header */}
              <div 
                className="arc-card-header" 
                onClick={() => handleArcClick(idx)}
              >
                <div className="arc-indicator">
                  <div className={`energy-orb pulse-${arc.energyColor}`}></div>
                  <span className="arc-index">ARC {String(idx + 1).padStart(2, '0')}</span>
                </div>
                <div className="arc-title-group">
                  <h3 className="arc-title">{arc.title[lang]}</h3>
                  <span className="arc-period">{arc.period[lang]}</span>
                </div>
                <div className="arc-chevron-icon">
                  {isOpen ? '▲' : '▼'}
                </div>
              </div>

              {/* Card Body */}
              {isOpen && (
                <div className="arc-card-body">
                  <p className="arc-description">{arc.desc[lang]}</p>
                  <div className="arc-highlight-tag">
                    <span className="tag-label">{lang === 'en' ? 'CRITICAL EVENT:' : '重要事項:'}</span>
                    <span className="tag-content">{arc.highlight[lang]}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MANGA RETAILERS / BUY SECTION */}
      <div className="manga-buy-section">
        <div className="buy-header-box">
          <div className="buy-title-glow">
            <span className="cart-icon">🛒</span>
            <h3>{lang === 'en' ? 'WANT TO READ THE MANGA?' : '原作漫画を読んで術式を深める'}</h3>
          </div>
          <p className="buy-subtitle">
            {lang === 'en'
              ? 'Support Gege Akutami’s masterpiece. Here are the top 5 official retailers to buy Jujutsu Kaisen volumes:'
              : '芥見下々先生の傑作を公式ルートで支援しよう。呪術廻戦単行本を購入・購読できるおすすめ公式ショップ5選：'}
          </p>
        </div>

        <div className="retailers-grid">
          {mangaStores.map((store, idx) => (
            <a 
              key={idx} 
              href={store.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="retailer-card"
              onClick={handleStoreClick}
            >
              <div className="retailer-badge">{store.badge[lang]}</div>
              <div className="retailer-card-header">
                <span className="retailer-index">0{idx + 1}</span>
                <h4 className="retailer-name">{store.name}</h4>
              </div>
              <p className="retailer-desc">{store.desc[lang]}</p>
              <div className="retailer-redirect-btn">
                <span>{lang === 'en' ? 'VISIT STORE ➔' : 'ストアへ移動 ➔'}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
