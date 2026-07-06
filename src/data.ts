export type Language = 'en' | 'ja';

export interface Weapon {
  name: { en: string; ja: string };
  type: { en: string; ja: string };
  icon: string; // matches mapping keys in ConsoleUI
  level: number; // out of 100
  color: string;
  description: { en: string; ja: string };
}

export interface ProjectMission {
  id: string;
  title: { en: string; ja: string };
  category: { en: string; ja: string };
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'BOSS';
  xpReward: number;
  unlockedItem: { en: string; ja: string };
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  description: { en: string; ja: string };
  tech: string[];
  imageUrl: string;
  link?: string;
  details: { en: string[]; ja: string[] };
}

export interface ProfileInfo {
  name: { en: string; ja: string };
  role: { en: string; ja: string };
  level: number;
  xp: number;
  nextLevelXp: number;
  mission: { en: string; ja: string };
  status: { en: string; ja: string };
  trainingLog: {
    degree: { en: string; ja: string };
    specialization: { en: string; ja: string };
    institution: { en: string; ja: string };
    location: { en: string; ja: string };
    duration: string;
  };
  skills: { en: string; ja: string }[];
}

export const profileData: ProfileInfo = {
  name: {
    en: "Nobara Kugisaki",
    ja: "釘崎野薔薇"
  },
  role: {
    en: "Grade 3 Jujutsu Sorcerer",
    ja: "三級呪術師"
  },
  level: 3,
  xp: 750,
  nextLevelXp: 1000,
  mission: {
    en: "Exorcise curses, escape the restrictive countryside, buy stylish Tokyo outfits, and live life unapologetically on my own terms.",
    ja: "呪霊を祓い、窮屈な田舎を脱出し、東京のお洒落な服を買い、自分らしく我が道を行くこと。"
  },
  status: {
    en: "Armed with a hammer, nails, straw doll, and ready to purge curses.",
    ja: "金槌、釘、藁人形を装備。呪霊を祓う準備は万全。"
  },
  trainingLog: {
    degree: {
      en: "First-Year Student",
      ja: "1年生"
    },
    specialization: {
      en: "Straw Doll Technique",
      ja: "芻霊呪法"
    },
    institution: {
      en: "Tokyo Metropolitan Curse Technical College",
      ja: "東京都立呪術高等専門学校"
    },
    location: {
      en: "Tokyo, Japan",
      ja: "日本、東京"
    },
    duration: "2018 - Present"
  },
  skills: [
    {
      en: "Straw Doll Technique (芻霊呪法)",
      ja: "芻霊呪法（すうれいじゅほう）"
    },
    {
      en: "Resonance (共鳴り)",
      ja: "共鳴り（ともなり）"
    },
    {
      en: "Hairpin (簪)",
      ja: "簪（かんざし）"
    },
    {
      en: "Black Flash (黒閃)",
      ja: "黒閃（こくせん）"
    },
    {
      en: "Cursed Energy Manipulation",
      ja: "呪力操作"
    },
    {
      en: "Close-Quarters Combat",
      ja: "近接格闘能力"
    },
    {
      en: "High Pain Tolerance",
      ja: "驚異的な痛覚耐性"
    },
    {
      en: "Ironclad Confidence",
      ja: "確固たる自信"
    },
    {
      en: "Urban Fashion & Shopping",
      ja: "都会のファッション＆買い物"
    },
    {
      en: "Fierce Loyalty",
      ja: "強い仲間意識"
    }
  ]
};

export const weaponsData: Weapon[] = [
  {
    name: {
      en: "Metal Hammer",
      ja: "金槌"
    },
    type: {
      en: "Primary Cursed Tool",
      ja: "主兵装（呪具）"
    },
    icon: "figma", // Mapped to HammerPixelIcon
    level: 95,
    color: "#ff2a85",
    description: {
      en: "Her signature hammer, decorated with a small heart. Used for launching cursed nails and striking curses at close range.",
      ja: "ハートマークがあしらわれたトレードマークの金槌。呪力を込めた釘を打ち出したり、近接格闘で直接打撃を加える。"
    }
  },
  {
    name: {
      en: "Cursed Nails",
      ja: "呪いの釘"
    },
    type: {
      en: "Ammunition & Projections",
      ja: "投射弾（弾薬）"
    },
    icon: "procreate", // Mapped to NailsPixelIcon
    level: 90,
    color: "#29b6f6",
    description: {
      en: "Iron nails loaded with her cursed energy. Can be struck into enemies or environments to set up explosive Hairpin attacks.",
      ja: "自身の呪力を込めた鉄釘。対象や周囲の地形に打ち込み、爆発的な「簪」による奇襲攻撃を仕掛ける。"
    }
  },
  {
    name: {
      en: "Straw Doll",
      ja: "藁人形"
    },
    type: {
      en: "Sympathetic Effigy",
      ja: "媒介用形代"
    },
    icon: "illustrator", // Mapped to StrawDollPixelIcon
    level: 92,
    color: "#ffd54f",
    description: {
      en: "A straw doll used to establish a spiritual link with a target via a part of their body, allowing Resonance to damage their soul.",
      ja: "対象の身体の一部（欠損部など）を埋め込み、精神的なつながりを作って「共鳴り」により直接魂へダメージを与える。"
    }
  },
  {
    name: {
      en: "Rubber Mallet",
      ja: "ピコピコハンマー"
    },
    type: {
      en: "Non-Lethal Weapon",
      ja: "非致死性武器"
    },
    icon: "canva", // Mapped to RubberMalletPixelIcon
    level: 75,
    color: "#26a69a",
    description: {
      en: "Used in situations where lethal force against non-sorcerers is prohibited, or during early combat exercises.",
      ja: "一般人への致命傷を避ける任務や、初期の模擬戦闘訓練などに使用されるゴム製のおもちゃのハンマー。"
    }
  },
  {
    name: {
      en: "Cursed Energy",
      ja: "呪力"
    },
    type: {
      en: "Innate Power Source",
      ja: "生得的エネルギー源"
    },
    icon: "blender", // Mapped to CursedEnergyPixelIcon
    level: 85,
    color: "#2979ff",
    description: {
      en: "Her reservoir of negative emotional energy, harnessed to reinforce physical attacks and trigger high-output technique explosions.",
      ja: "負の感情から生み出すエネルギー。身体能力の強化や、高出力の術式発動のためにコントロールして消費する。"
    }
  }
];

export const missionsData: ProjectMission[] = [
  {
    id: "roppongi-cursed-womb",
    title: {
      en: "Roppongi Abandoned Building",
      ja: "六本木の廃ビル"
    },
    category: {
      en: "Exorcism Mission",
      ja: "呪霊討伐任務"
    },
    difficulty: "EASY",
    xpReward: 150,
    unlockedItem: {
      en: "Rubber Mallet",
      ja: "ピコピコハンマー"
    },
    status: "COMPLETED",
    description: {
      en: "Exorcised a low-grade curse hiding in an abandoned Roppongi building while protecting a young hostage.",
      ja: "六本木の廃ビルに潜んでいた低級呪霊を討伐し、人質の少年を無事保護した任務。"
    },
    tech: ["Straw Doll", "Basic Melee", "Hostage Rescue"],
    imageUrl: "/roppongi_building.png",
    link: "#",
    details: {
      en: [
        "Secured the perimeter and entered the building with Yuji Itadori.",
        "Identified and cornered a cunning curse holding a child hostage.",
        "Utilized a straw doll effigy through the wall to pierce the curse's core without harming the hostage.",
        "Safely rescued the child and proved her quick-witted tactical capabilities."
      ],
      ja: [
        "虎杖悠仁と共に現場を封鎖し、廃ビルへ進入。",
        "少年を人質に取る狡猾な呪霊の居場所を特定し追い詰めた。",
        "壁越しに藁人形の術式を発動させ、人質を傷つけることなく呪霊の核を破壊。",
        "少年を無事救出し、機転の利く戦術的才能を証明した。"
      ]
    }
  },
  {
    id: "yasohachi-bridge",
    title: {
      en: "Yasohachi Bridge Curse",
      ja: "八十八橋の呪い"
    },
    category: {
      en: "Special Grade Combat",
      ja: "特級呪霊戦"
    },
    difficulty: "BOSS",
    xpReward: 500,
    unlockedItem: {
      en: "Black Flash Mastery",
      ja: "「黒閃」の極意"
    },
    status: "COMPLETED",
    description: {
      en: "Fought and exorcised the Special Grade Death Paintings Kechizu and Eso under the barrier of Yasohachi Bridge.",
      ja: "八十八橋の結界内にて、特級呪物・呪胎九相図の壊相・血塗と交戦し撃破した過酷な任務。"
    },
    tech: ["Resonance", "Hairpin", "Black Flash"],
    imageUrl: "/yasohachi_bridge.png",
    link: "#",
    details: {
      en: [
        "Tracked the mysterious source of the Yasohachi Bridge curse.",
        "Engaged in intense double combat alongside Yuji Itadori.",
        "Executed 'Resonance' on Eso's severed arm to bypass defense barriers and inflict direct soul damage.",
        "Triggered a space-distorting 'Black Flash' to instantly obliterate Kechizu's defenses."
      ],
      ja: [
        "八十八橋における不審死事件の発生源を追跡。",
        "虎杖悠仁と連携し、高度なダブルス戦闘を展開。",
        "壊相の切り離された腕に対して「共鳴り」を発動、結界を無視して魂へ直接ダメージを与えた。",
        "空間の歪みを生む「黒閃」を放ち、血塗の防御壁を一挙に粉砕・消滅させた。"
      ]
    }
  },
  {
    id: "eishu-juvenile-womb",
    title: {
      en: "Juvenile Detention Center",
      ja: "英集少年院"
    },
    category: {
      en: "Investigative Combat",
      ja: "調査・交戦任務"
    },
    difficulty: "HARD",
    xpReward: 300,
    unlockedItem: {
      en: "Leather Nail Holster",
      ja: "革製釘ホルダー"
    },
    status: "COMPLETED",
    description: {
      en: "Investigated a Cursed Womb outbreak at Eishu Detention Center, surviving a run-in with a Special Grade Curse.",
      ja: "英集少年院にて発生した特級呪胎の事件を調査し、現れた圧倒的呪霊との一時遭遇を切り抜けた。"
    },
    tech: ["Cursed Nails", "Tactical Retreat", "Evasion"],
    imageUrl: "/detention_center.png",
    link: "#",
    details: {
      en: [
        "Infiltrated the detention center complex and navigated the shifting pocket dimension.",
        "Faced off against an overwhelmingly powerful Special Grade curse birth.",
        "Managed space and kept distance using nail traps to secure routes.",
        "Escaped successfully after Yuji Itadori bought time for the team's retreat."
      ],
      ja: [
        "少年院の施設内部へ潜入し、変化した生得領域の迷宮を進んだ。",
        "極めて凶悪な特級呪霊の出現に直面。",
        "釘による牽制やトラップを仕掛けつつ距離を取り、退路を確保。",
        "虎杖悠仁が時間を稼いでいる間に、領域外への脱出に成功した。"
      ]
    }
  },
  {
    id: "shibuya-incident",
    title: {
      en: "Shibuya Incident Defense",
      ja: "渋谷事変・防衛戦"
    },
    category: {
      en: "War / City Defense",
      ja: "大規模都市防衛戦"
    },
    difficulty: "BOSS",
    xpReward: 800,
    unlockedItem: {
      en: "Battle Scar Eye Patch",
      ja: "眼帯（戦傷の証）"
    },
    status: "IN_PROGRESS",
    description: {
      en: "Engaging in large-scale defense of Tokyo against the Curse alliance, facing off against Haruta Shigemo and Mahito.",
      ja: "呪詛師・呪霊連合による渋谷襲撃に対し、一般市民救出や重面春太、真人の分身と激突する最高難度の防衛任務。"
    },
    tech: ["Resonance", "Cursed Combat", "High Output Hairpin"],
    imageUrl: "/shibuya_incident.png",
    link: "#",
    details: {
      en: [
        "Deployed to Shibuya to maintain lines of communication and rescue civilians.",
        "Fought Haruta Shigemo, neutralizing his miracle-based luck parameters.",
        "Tracked down and engaged Mahito's double, exploiting his double nature to deal direct soul damage with Resonance.",
        "Endured extreme physical trauma while maintaining offensive stance to support Yuji."
      ],
      ja: [
        "通信網の維持と一般市民の救出にあたるため渋谷に派遣。",
        "奇跡を蓄積する特異な能力を持つ重面春太と対峙、これを攻略。",
        "真人の分身に「共鳴り」を打ち込み、魂を繋げて本体にも強烈な魂のダメージをフィードバックさせた。",
        "致命的な戦傷を負いながらも、最後まで虎杖の闘志を支えるため戦闘に尽力した。"
      ]
    }
  }
];
