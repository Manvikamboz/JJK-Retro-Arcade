import { Language } from './data';

export const uiTranslations: Record<string, Record<Language, string>> = {
  // Start screen
  systemLevelTag: {
    en: "XP: JUJUTSU LEVEL 01 - 10 QUEST",
    ja: "経験値: 呪術レベル 01 - 10 クエスト"
  },
  airingLogTitle: {
    en: "JUJUTSU KAISEN AIRING LOG",
    ja: "呪術廻戦 放送スケジュールログ"
  },
  season1: {
    en: "SEASON 1: Oct 2020 - Mar 2021",
    ja: "第1期：2020年10月 〜 2021年3月"
  },
  season2: {
    en: "SEASON 2: Jul 2023 - Dec 2023",
    ja: "第2期：2023年7月 〜 2023年12月"
  },
  season3: {
    en: "SEASON 3: Jan 2026 - Mar 2026",
    ja: "第3期：2026年1月 〜 2026年3月"
  },
  startBtn: {
    en: "START",
    ja: "スタート"
  },
  sorcererBadge: {
    en: "SORCERER 01",
    ja: "呪術師 01"
  },
  startInstructions: {
    en: "Click Start to launch retro dashboard and cursed energy sound engine",
    ja: "スタートをクリックしてレトロダッシュボードと呪力音響エンジンを起動します"
  },

  // Main Cabinet Header
  mute: {
    en: "MUTE",
    ja: "消音"
  },
  unmute: {
    en: "UNMUTE",
    ja: "音量オン"
  },

  // Dashboard Zone Tabs
  zone1Title: {
    en: "ZONE 01: PLATFORMER",
    ja: "ゾーン 01: 2Dアクション"
  },
  zone2Title: {
    en: "ZONE 02: CURSE BLASTER",
    ja: "ゾーン 02: 呪霊シューティング"
  },
  zone3Title: {
    en: "ZONE 03: MATCH QUEST",
    ja: "ゾーン 03: 神経衰弱クエスト"
  },

  // Weapons Mastery Panel
  weaponsMasteryTitle: {
    en: "⭐ Weapons Mastery",
    ja: "⭐ 呪具・技術習得度"
  },
  weaponsSubheader: {
    en: "Equipped software & tools",
    ja: "装備中の呪具と操術技術"
  },
  atkPowerLabel: {
    en: "MASTERY POWER",
    ja: "術式・呪具熟練度"
  },

  // Training Log Panel
  trainingLogTitle: {
    en: "🎒 Training Log",
    ja: "🎒 修練・所属履歴"
  },
  trainingSubheader: {
    en: "Jujutsu academy timeline",
    ja: "都立呪術高専所属タイムライン"
  },

  // Skills Checklist Panel
  skillsTitle: {
    en: "📋 Skills Checklist",
    ja: "📋 習得術式・能力リスト"
  },
  skillsSubheader: {
    en: "Click to toggle mastered status",
    ja: "クリックで習得済み状態を切り替え"
  },

  // Nintendo 3DS Console
  selectMissionPrompt: {
    en: "SELECT MISSION [A]",
    ja: "任務選択 [A]"
  },
  difficultyLabel: {
    en: "DIFF",
    ja: "難易度"
  },
  xpLabel: {
    en: "XP",
    ja: "経験値"
  },
  itemLabel: {
    en: "ITEM",
    ja: "報酬"
  },
  pressAPrompt: {
    en: "Press A button to OPEN",
    ja: "Aボタンで詳細を開く"
  },
  statusTabBtn: {
    en: "STATUS",
    ja: "ステータス"
  },
  missionsTabBtn: {
    en: "MISSIONS",
    ja: "任務一覧"
  },
  weaponsTabBtn: {
    en: "WEAPONS",
    ja: "呪具詳細"
  },
  synthsTabBtn: {
    en: "SYNTHS",
    ja: "音源盤"
  },
  weaponDetailsHeader: {
    en: "WEAPON DETAILS",
    ja: "呪具仕様詳細"
  },

  // Upgrade / Stats Tab
  upgradePrompt: {
    en: "Spend 15 Gold to boost sorcerer attributes!",
    ja: "15ゴールド消費して能力値を強化！"
  },
  upgradeBtn: {
    en: "UPGRADE",
    ja: "強化する"
  },
  hp: {
    en: "HP",
    ja: "体力"
  },
  mp: {
    en: "MP",
    ja: "呪力"
  },
  gold: {
    en: "GOLD",
    ja: "所持金"
  },
  meleeStat: {
    en: "ATK (MELEE)",
    ja: "攻撃力 (近接)"
  },
  barrierStat: {
    en: "DEF (BARRIER)",
    ja: "防御力 (結界)"
  },
  reflexesStat: {
    en: "SPD (REFLEXES)",
    ja: "速度 (反射)"
  },

  // Platformer Game (Zone 1)
  greenGrassZone: {
    en: "LEVEL 01: ROLLING HILLS",
    ja: "ステージ 01: 丘陵領域"
  },
  inventoryLabel: {
    en: "INVENTORY",
    ja: "所持品"
  },
  empty: {
    en: "EMPTY",
    ja: "空"
  },
  key: {
    en: "KEY",
    ja: "鍵"
  },
  jumpAction: {
    en: "A (JUMP)",
    ja: "A (跳躍)"
  },
  platformerInstructions: {
    en: "Use A/D or Arrow Keys to run, Space/W to jump! Collect the key and unlock the castle door.",
    ja: "A/Dまたは矢印キーで移動、Space/Wでジャンプ！鍵を拾ってお城の門を開けよう。"
  },
  enterPortalPrompt: {
    en: "PRESS START TO ENTER CASTLE PORTAL",
    ja: "スタートキーを押して城のポータルに突入！"
  },

  // Space Shooter Game (Zone 2)
  shooterTitle: {
    en: "ZONE 02: CURSE BLASTER",
    ja: "ゾーン 02: 呪霊ブラスター"
  },
  score: {
    en: "SCORE",
    ja: "スコア"
  },
  shields: {
    en: "SHIELDS",
    ja: "バリア"
  },
  shooterLocked: {
    en: "LOCKED! Reached level 4 to unlock this simulator.",
    ja: "封印中！レベル4に到達すると呪術シミュレーターが解放されます。"
  },
  shooterInstructions: {
    en: "Shoot down the rogue curses before they invade Nobara's territory!",
    ja: "野薔薇の領域を侵入する野良呪霊たちを射撃して全滅させよう！"
  },
  initScanner: {
    en: "INITIALIZE SCANNER",
    ja: "術式スキャン起動"
  },
  gameOver: {
    en: "GAME OVER",
    ja: "任務失敗"
  },
  finalScore: {
    en: "FINAL SCORE:",
    ja: "最終戦果スコア:"
  },
  restartSimulator: {
    en: "RESTART SIMULATOR",
    ja: "シミュレーター再起動"
  },

  // Memory Match Game (Zone 3)
  matchTitle: {
    en: "ZONE 03: BRAIN MATCH QUEST",
    ja: "ゾーン 03: 脳内マッチクエスト"
  },
  moves: {
    en: "MOVES",
    ja: "手数"
  },
  questCleared: {
    en: "QUEST CLEARED!",
    ja: "任務完了！"
  },
  matchHeader: {
    en: "MATCH THE COGNITIVE SYMBOLS",
    ja: "呪術記憶のシンボル一致"
  },
  matchLocked: {
    en: "LOCKED! Reached level 7 to unlock this simulation.",
    ja: "封印中！レベル7に到達するとこの呪術演習が解放されます。"
  },
  matchInstructions: {
    en: "Select cards sequentially to match Nobara's combat tools and interests. Match all 8 pairs to win!",
    ja: "カードを順にめくり、野薔薇の武器や趣味を一致させよう。全8ペアを揃えて完了！"
  },
  replayQuest: {
    en: "REPLAY QUEST",
    ja: "演習をもう一度プレイ"
  },

  // Loot Box Modal
  lootCongrats: {
    en: "CONGRATULATIONS PLAYER 01!",
    ja: "おめでとう、プレイヤー 01！"
  },
  lootStory: {
    en: "You retrieved the golden key and entered the castle portal!",
    ja: "黄金の鍵を獲得し、お城のポータルへの突入に成功しました！"
  },
  lootSecret: {
    en: "You have unlocked Nobara Kugisaki's Secret Sorcerer Contact Loot Box.",
    ja: "釘崎野薔薇の「極秘呪術師連絡先」ルートボックスが解放されました。"
  },
  emailLabel: {
    en: "EMAIL",
    ja: "メールアドレス"
  },
  sorcererIdLabel: {
    en: "SORCERER ID",
    ja: "呪術師登録番号"
  },
  websiteLabel: {
    en: "WEBSITE",
    ja: "公式関連サイト"
  },
  resumeBtnText: {
    en: "DOWNLOAD_SORCERER_REGISTRATION.PDF",
    ja: "呪術師登録証をダウンロード.PDF"
  },
  collectLootBtn: {
    en: "COLLECT LOOT & CLOSE",
    ja: "ルートを回収して閉じる"
  },

  // Level Up Overlay
  levelUp: {
    en: "LEVEL UP!",
    ja: "レベルアップ！"
  },
  unlockZone2: {
    en: "UNLOCKED ZONE 02: CURSE BLASTER!",
    ja: "ゾーン 02: 呪霊ブラスター が解放されました！"
  },
  unlockZone3: {
    en: "UNLOCKED ZONE 03: MATCH QUEST!",
    ja: "ゾーン 03: マッチクエスト が解放されました！"
  },
  achievedGrade1: {
    en: "ACHIEVED GRADE 1 SORCERER STATUS!",
    ja: "一級呪術師の推薦・昇格資格を獲得！"
  },
  attributesBoosted: {
    en: "Attributes boosted! Gained strike power.",
    ja: "ステータス上昇！呪術の破壊力が上昇しました。"
  }
};
