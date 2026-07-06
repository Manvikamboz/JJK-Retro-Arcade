import { useState, useEffect } from 'react';
import { ConsoleUI } from './components/ConsoleUI';
import { RetroGame } from './components/RetroGame';
import { SpaceShooter } from './components/SpaceShooter';
import { MemoryMatch } from './components/MemoryMatch';
import { audioEngine } from './components/AudioEngine';
import { StoryHistory } from './components/StoryHistory';
import { ProjectMission, Language } from './data';
import { uiTranslations } from './translations';

// Helper to determine XP needed for each level threshold
const getXpThresholdForLevel = (lvl: number): number => {
  const thresholds: Record<number, number> = {
    1: 150,
    2: 200,
    3: 250,
    4: 350,
    5: 450,
    6: 550,
    7: 650,
    8: 800,
    9: 1000,
    10: 99999 // Max Level
  };
  return thresholds[lvl] || 300;
};

export default function App() {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  
  // Dynamic player leveling states
  const [xp, setXp] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1); // Start at level 1 to support 10 levels
  const [showLevelUpSplash, setShowLevelUpSplash] = useState(false);
  const [levelUpNumber, setLevelUpNumber] = useState(1);
  const [unlockedSecret, setUnlockedSecret] = useState(false);

  // Economy & Attributes
  const [coins, setCoins] = useState(0);
  const [atk, setAtk] = useState(70);
  const [def, setDef] = useState(65);
  const [spd, setSpd] = useState(60);

  // Active game zones
  const [activeZoneTab, setActiveZoneTab] = useState<'platformer' | 'shooter' | 'memory' | 'story'>('platformer');
  
  // Selected project mission details
  const [activeMission, setActiveMission] = useState<ProjectMission | null>(null);

  const handleStartGame = () => {
    setStarted(true);
    // Initialize & play 8-bit startup melody
    audioEngine.setMute(false);
    audioEngine.playSound('start');
  };

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    audioEngine.setMute(nextMuted);
    if (!nextMuted) {
      audioEngine.playSound('click');
    }
  };

  const handleGainXp = (amount: number) => {
    setXp(prevXp => {
      let currentXp = prevXp + amount;
      let currentLvl = playerLevel;
      let threshold = getXpThresholdForLevel(currentLvl);
      let leveledUp = false;

      while (currentXp >= threshold && currentLvl < 10) {
        currentXp -= threshold;
        currentLvl += 1;
        threshold = getXpThresholdForLevel(currentLvl);
        leveledUp = true;
      }

      if (leveledUp) {
        setPlayerLevel(currentLvl);
        setLevelUpNumber(currentLvl);
        setShowLevelUpSplash(true);
        audioEngine.playSound('powerup');
      }

      return currentXp;
    });
  };

  const handleGainCoins = (amount: number) => {
    setCoins(prev => prev + amount);
  };

  const handleUpgradeStat = (stat: 'atk' | 'def' | 'spd') => {
    if (coins >= 15) {
      setCoins(prev => prev - 15);
      audioEngine.playSound('powerup');
      if (stat === 'atk') setAtk(prev => prev + 5);
      if (stat === 'def') setDef(prev => prev + 5);
      if (stat === 'spd') setSpd(prev => prev + 5);
    } else {
      audioEngine.playSound('click');
      alert("Not enough Gold! Earn coins by playing games or completing tasks.");
    }
  };

  // Automatically clear Level Up splash banner after 3 seconds
  useEffect(() => {
    if (showLevelUpSplash) {
      const timer = setTimeout(() => {
        setShowLevelUpSplash(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUpSplash]);

  const handleUnlockSecret = () => {
    if (!unlockedSecret) {
      setUnlockedSecret(true);
      audioEngine.playSound('powerup');
    }
  };

  const handleRedirectToStory = () => {
    setActiveZoneTab('story');
    setTimeout(() => {
      const el = document.querySelector('.portfolio-gameplay');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Determine game locks
  const isShooterUnlocked = playerLevel >= 4;
  const isMemoryUnlocked = playerLevel >= 7;

  const currentLevelThreshold = getXpThresholdForLevel(playerLevel);

  return (
    <div className="retro-cabinet-theme">
      {/* Background star animation grid */}
      <div className="pixel-stars-bg"></div>

      {/* START SCREEN OVERLAY */}
      {!started ? (
        <div className="start-screen-overlay">
          <div className="start-screen-frame">
            <div className="system-level-tag">{uiTranslations.systemLevelTag[lang]}</div>
            
            <div className="portfolio-title-group">
              <span className="year-stamp">2026</span>
              <h1 className="main-logo-text">NOBARA KUGISAKI</h1>
              <p style={{ fontFamily: 'var(--font-heading)', fontSize: '10px', color: '#ff79c6', marginTop: '10px', letterSpacing: '1px' }}>
                {lang === 'en' ? 'JUJUTSU KAISEN PORTFOLIO' : '呪術廻戦 ポートフォリオ'}
              </p>
            </div>

            <div className="jjk-seasons-container" style={{ margin: '20px auto 30px auto', padding: '15px', border: '2px dashed var(--color-border-pink)', backgroundColor: '#0f111a', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '16px', maxWidth: '380px', lineHeight: '1.6' }}>
              <div style={{ color: '#fff200', fontFamily: 'var(--font-heading)', fontSize: '11px', marginBottom: '10px', textAlign: 'center', letterSpacing: '1px' }}>{uiTranslations.airingLogTitle[lang]}</div>
              <div>{uiTranslations.season1[lang]}</div>
              <div>{uiTranslations.season2[lang]}</div>
              <div>{uiTranslations.season3[lang]}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', margin: '20px 0 10px 0' }}>
              <button 
                className={`lang-sel-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => { audioEngine.playSound('select'); setLang('en'); }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '11px',
                  padding: '5px 12px',
                  backgroundColor: lang === 'en' ? '#ff79c6' : '#282a36',
                  color: '#fff',
                  border: '2px solid ' + (lang === 'en' ? '#fff200' : '#44475a'),
                  cursor: 'pointer',
                  borderRadius: '3px',
                  boxShadow: '1px 1px 0px #000',
                  fontWeight: 'bold'
                }}
              >
                ENGLISH
              </button>
              <button 
                className={`lang-sel-btn ${lang === 'ja' ? 'active' : ''}`}
                onClick={() => { audioEngine.playSound('select'); setLang('ja'); }}
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '11px',
                  padding: '5px 12px',
                  backgroundColor: lang === 'ja' ? '#ff79c6' : '#282a36',
                  color: '#fff',
                  border: '2px solid ' + (lang === 'ja' ? '#fff200' : '#44475a'),
                  cursor: 'pointer',
                  borderRadius: '3px',
                  boxShadow: '1px 1px 0px #000',
                  fontWeight: 'bold'
                }}
              >
                日本語 (JA)
              </button>
            </div>

            <button className="pixel-start-btn" onClick={handleStartGame}>
              {uiTranslations.startBtn[lang]}
            </button>

            <div className="player-badge">{uiTranslations.sorcererBadge[lang]}</div>
            
            <div className="start-decorations" style={{ display: 'flex', justifyContent: 'center', margin: '25px 0' }}>
              <img 
                src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZW5vNDUxYzJheHVsZ29zY3lreXZubnh0Z3B5c2I4Znh1NmV5enViZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zkNBtlymM6zX4DndrU/giphy.gif" 
                alt="Nobara Kugisaki" 
                style={{ width: '220px', height: '130px', objectFit: 'cover', border: '3px solid var(--color-border-pink)', borderRadius: '4px' }}
              />
            </div>
            
            <p className="start-instructions">
              {uiTranslations.startInstructions[lang]}
            </p>
          </div>
        </div>
      ) : (
        <div className="main-portfolio-layout">
          
          {/* TOP CABINET BAR (HUD STATUS) */}
          <header className="cabinet-hud-header">
            <div className="hud-xp-box">
              <span className="hud-label">{lang === 'en' ? 'XP: JUJUTSU LEVEL' : '経験値: 呪術レベル'} {playerLevel.toString().padStart(2, '0')}</span>
              <div className="hud-xp-bar">
                <div 
                  className="hud-xp-fill" 
                  style={{ width: `${Math.min(100, (xp / currentLevelThreshold) * 100)}%` }}
                ></div>
              </div>
              <span className="xp-numerical">
                {playerLevel === 10 ? (lang === 'en' ? 'MAX LVL' : '最大レベル') : `${xp}/${currentLevelThreshold}`}
              </span>
            </div>


            <div className="hud-player-box" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span className="hud-label">{lang === 'en' ? 'PLAYER 01' : 'プレイヤー 01'}</span>
              <button 
                className="language-toggle-btn"
                onClick={() => { audioEngine.playSound('select'); setLang(lang === 'en' ? 'ja' : 'en'); }}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  backgroundColor: '#ff79c6',
                  color: '#fff',
                  border: '2px solid #5a082c',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  borderRadius: '3px',
                  fontWeight: 'bold',
                  boxShadow: '1px 1px 0px #000'
                }}
              >
                🌐 {lang === 'en' ? 'EN ➔ 日本語' : 'JA ➔ ENGLISH'}
              </button>
              <button 
                className={`mute-toggle-btn ${muted ? 'is-muted' : ''}`}
                onClick={handleToggleMute}
                title={muted ? uiTranslations.unmute[lang] : uiTranslations.mute[lang]}
              >
                {muted ? `🔇 ${uiTranslations.mute[lang]}` : `🔊 ${uiTranslations.unmute[lang]}`}
              </button>
            </div>
          </header>

          {/* SCROLLING MARQUEE 1: ABOUT ME */}
          <div className="retro-scroller scroller-top">
            <div className="scroller-inner">
              <span>{lang === 'en' ? 'ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★\u00A0' : 'プロフィール ★ 自己紹介 ★ プロフィール ★ 自己紹介 ★ プロフィール ★ 自己紹介 ★ プロフィール ★ 自己紹介 ★\u00A0'}</span>
              <span>{lang === 'en' ? 'ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★ ABOUT ME ★\u00A0' : 'プロフィール ★ 自己紹介 ★ プロフィール ★ 自己紹介 ★ プロフィール ★ 自己紹介 ★ プロフィール ★ 自己紹介 ★\u00A0'}</span>
            </div>
          </div>

          {/* SECTION 1: NINTENDO 3DS & DATA WINDOWS */}
          <main className="portfolio-workspace">
            <ConsoleUI 
              lang={lang}
              onSelectMission={(mission) => setActiveMission(mission)} 
              playerLevel={playerLevel}
              playerCoins={coins}
              atk={atk}
              def={def}
              spd={spd}
              onUpgradeStat={handleUpgradeStat}
              onRedirectToStory={handleRedirectToStory}
            />
          </main>

          {/* SCROLLING MARQUEE 2: MISSIONS / PROJECTS */}
          <div className="retro-scroller scroller-bottom">
            <div className="scroller-inner">
              <span>{lang === 'en' ? 'MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★\u00A0' : '任務録 ★ プロジェクト ★ 任務録 ★ プロジェクト ★ 任務録 ★ プロジェクト ★ 任務録 ★ プロジェクト ★\u00A0'}</span>
              <span>{lang === 'en' ? 'MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★ MISSIONS ★\u00A0' : '任務録 ★ プロジェクト ★ 任務録 ★ プロジェクト ★ 任務録 ★ プロジェクト ★ 任務録 ★ プロジェクト ★\u00A0'}</span>
            </div>
          </div>

          {/* SECTION 2: MULTI-GAME ZONE FOOTER */}
          <footer className="portfolio-gameplay">
            {/* Zone Game Selection tabs */}
            <div className="game-zone-tabs">
              <button 
                className={`zone-tab-btn ${activeZoneTab === 'platformer' ? 'active' : ''}`}
                onClick={() => { audioEngine.playSound('select'); setActiveZoneTab('platformer'); }}
              >
                🎮 {uiTranslations.zone1Title[lang]}
              </button>
              
              <button 
                className={`zone-tab-btn ${activeZoneTab === 'shooter' ? 'active' : ''} ${!isShooterUnlocked ? 'is-locked' : ''}`}
                onClick={() => {
                  if (isShooterUnlocked) {
                    audioEngine.playSound('select');
                    setActiveZoneTab('shooter');
                  } else {
                    audioEngine.playSound('click');
                    alert(lang === 'en' ? "Locked! Reach Level 4 in Zone 01 or toggle skills to unlock this game." : "ロックされています！このシミュレーターを開始するにはレベル4に到達してください。");
                  }
                }}
              >
                🚀 {uiTranslations.zone2Title[lang]} {!isShooterUnlocked && '(LV 4)'}
              </button>

              <button 
                className={`zone-tab-btn ${activeZoneTab === 'memory' ? 'active' : ''} ${!isMemoryUnlocked ? 'is-locked' : ''}`}
                onClick={() => {
                  if (isMemoryUnlocked) {
                    audioEngine.playSound('select');
                    setActiveZoneTab('memory');
                  } else {
                    audioEngine.playSound('click');
                    alert(lang === 'en' ? "Locked! Reach Level 7 in active games to unlock this matching quest." : "ロックされています！このマッチクエストを開始するにはレベル7に到達してください。");
                  }
                }}
              >
                🧠 {uiTranslations.zone3Title[lang]} {!isMemoryUnlocked && '(LV 7)'}
              </button>

              <button 
                className={`zone-tab-btn ${activeZoneTab === 'story' ? 'active' : ''}`}
                onClick={() => { audioEngine.playSound('select'); setActiveZoneTab('story'); }}
              >
                📖 {lang === 'en' ? 'STORY & MANGA' : 'ストーリー & 漫画'}
              </button>
            </div>

            {/* Active Game rendering */}
            <div className="active-game-window">
              {activeZoneTab === 'platformer' && (
                <RetroGame 
                  lang={lang}
                  onGainXp={handleGainXp} 
                  onGainCoins={handleGainCoins} 
                  onUnlockSecret={handleUnlockSecret} 
                />
              )}
              {activeZoneTab === 'shooter' && (
                <SpaceShooter 
                  lang={lang}
                  onGainXp={handleGainXp} 
                  onGainCoins={handleGainCoins} 
                  isUnlocked={isShooterUnlocked} 
                />
              )}
              {activeZoneTab === 'memory' && (
                <MemoryMatch 
                  lang={lang}
                  onGainXp={handleGainXp} 
                  onGainCoins={handleGainCoins} 
                  isUnlocked={isMemoryUnlocked} 
                />
              )}
              {activeZoneTab === 'story' && (
                <StoryHistory lang={lang} />
              )}
            </div>
          </footer>

          {/* 1. MISSION DETAILS DIALOG OVERLAY */}
          {activeMission && (
            <div className="retro-modal-overlay">
              <div className="retro-modal-window">
                <div className="modal-header bg-pink">
                  <span>📂 {lang === 'en' ? 'MISSION LOG:' : '任務日誌:'} {activeMission.title[lang]}</span>
                  <button 
                    className="modal-close-btn"
                    onClick={() => { audioEngine.playSound('click'); setActiveMission(null); }}
                  >
                    [X]
                  </button>
                </div>
                
                <div className="modal-content">
                  <div className="modal-grid">
                    {/* Visual box placeholder with styling */}
                    <div className="modal-visual-box">
                      <div className="visual-fallback">
                        <span className="fallback-icon">👾</span>
                        <span className="fallback-category">{activeMission.category[lang].toUpperCase()}</span>
                      </div>
                      <div className="badge-overlay">{uiTranslations.difficultyLabel[lang]}: {activeMission.difficulty}</div>
                    </div>

                    {/* Mission Text information */}
                    <div className="modal-info-column">
                      <h2 className="modal-project-title text-glow-green">{activeMission.title[lang]}</h2>
                      <p className="modal-project-desc">{activeMission.description[lang]}</p>
                      
                      <div className="modal-project-tech-tags">
                        {activeMission.tech.map(t => (
                          <span key={t} className="tech-tag">{t}</span>
                        ))}
                      </div>

                      <div className="modal-quest-rewards">
                        <span className="reward-label">{lang === 'en' ? 'QUEST REWARD:' : '任務報酬:'}</span>
                        <div className="reward-badges">
                          <span className="reward-xp text-glow-yellow">+{activeMission.xpReward} XP</span>
                          <span className="reward-item text-pink">🏆 {activeMission.unlockedItem[lang]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-details-log mt-4">
                    <h3 className="log-heading">📋 {lang === 'en' ? 'DETAILED OBJECTIVES COMPLETED:' : '達成した詳細任務目標:'}</h3>
                    <ul className="objectives-list">
                      {activeMission.details[lang].map((detail, idx) => (
                        <li key={idx} className="objective-item">
                          <span className="check-bullet">✔</span>
                          <span className="objective-text">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="modal-actions-row">
                    <button 
                      className="modal-action-btn primary-action"
                      onClick={() => {
                        audioEngine.playSound('powerup');
                        alert(lang === 'en' ? `Launching ${activeMission.title.en}...` : `${activeMission.title.ja}を起動中...`);
                      }}
                    >
                      🚀 {lang === 'en' ? 'LAUNCH LIVE SITE' : 'サイトを起動'}
                    </button>
                    <button 
                      className="modal-action-btn secondary-action"
                      onClick={() => { audioEngine.playSound('click'); setActiveMission(null); }}
                    >
                      {lang === 'en' ? 'ABORT MISSION' : '任務中止'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SECRET UNLOCKED MODAL */}
          {unlockedSecret && (
            <div className="retro-modal-overlay">
              <div className="retro-modal-window secret-window">
                <div className="modal-header bg-yellow text-black">
                  <span>🔑 {lang === 'en' ? 'SECRET CHEST UNLOCKED' : '秘密の宝箱がアンlocked'}</span>
                  <button 
                    className="modal-close-btn"
                    onClick={() => { audioEngine.playSound('click'); setUnlockedSecret(false); }}
                  >
                    [X]
                  </button>
                </div>
                
                <div className="modal-content text-center">
                  <div className="secret-chest-icon">🎁</div>
                  <h2 className="text-glow-yellow text-2xl font-bold mb-2">{uiTranslations.lootCongrats[lang]}</h2>
                  <p className="mb-4">
                    {uiTranslations.lootStory[lang]}
                    <br />
                    {uiTranslations.lootSecret[lang]}
                  </p>

                  <div className="loot-box-items">
                    <div className="loot-item">
                      <span className="loot-icon">✉️</span>
                      <span className="loot-label">{uiTranslations.emailLabel[lang]}:</span>
                      <a href="mailto:nobara.kugisaki@jujutsuhigh.edu.jp" className="loot-link text-glow-green">nobara.kugisaki@jujutsuhigh.edu.jp</a>
                    </div>
                    <div className="loot-item">
                      <span className="loot-icon">📄</span>
                      <span className="loot-label">{uiTranslations.sorcererIdLabel[lang]}:</span>
                      <a 
                        href="#download" 
                        onClick={(e) => { e.preventDefault(); alert(lang === 'en' ? "Downloading Nobara's Sorcerer Registration PDF..." : "釘崎野薔薇の呪術師登録証PDFをダウンロード中..."); }} 
                        className="loot-link text-glow-green"
                      >
                        {uiTranslations.resumeBtnText[lang]}
                      </a>
                    </div>
                    <div className="loot-item">
                      <span className="loot-icon">🔗</span>
                      <span className="loot-label">{uiTranslations.websiteLabel[lang]}:</span>
                      <a href="https://jujutsukaisen.jp" target="_blank" rel="noreferrer" className="loot-link text-pink">jujutsukaisen.jp/char/nobara</a>
                    </div>
                  </div>

                  <button 
                    className="modal-action-btn primary-action mt-6"
                    onClick={() => { audioEngine.playSound('click'); setUnlockedSecret(false); }}
                  >
                    {uiTranslations.collectLootBtn[lang]}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. LEVEL UP SPLASH BANNER OVERLAY */}
          {showLevelUpSplash && (
            <div className="level-up-splash-overlay">
              <div className="level-up-splash-box">
                <div className="splash-stars-anim">✨ ⭐ ✨</div>
                <h1 className="level-up-title text-glow-yellow">{uiTranslations.levelUp[lang]}</h1>
                <div className="level-up-number text-glow-green">{lang === 'en' ? 'LEVEL' : 'レベル'} {levelUpNumber.toString().padStart(2, '0')}</div>
                <p className="splash-desc mt-2">
                  {levelUpNumber === 4 && uiTranslations.unlockZone2[lang]}
                  {levelUpNumber === 7 && uiTranslations.unlockZone3[lang]}
                  {levelUpNumber === 10 && uiTranslations.achievedGrade1[lang]}
                  {levelUpNumber !== 4 && levelUpNumber !== 7 && levelUpNumber !== 10 && uiTranslations.attributesBoosted[lang]}
                </p>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
