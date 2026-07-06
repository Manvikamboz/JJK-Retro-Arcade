import React, { useState } from 'react';
import { 
  profileData, 
  weaponsData, 
  missionsData, 
  ProjectMission, 
  Weapon,
  Language
} from '../data';
import { uiTranslations } from '../translations';
import { audioEngine } from './AudioEngine';

interface ConsoleUIProps {
  lang: Language;
  onSelectMission: (mission: ProjectMission) => void;
  playerLevel: number;
  playerCoins: number;
  atk: number;
  def: number;
  spd: number;
  onUpgradeStat: (stat: 'atk' | 'def' | 'spd') => void;
  onRedirectToStory?: () => void;
}

export const ConsoleUI: React.FC<ConsoleUIProps> = ({ 
  lang,
  onSelectMission, 
  playerLevel,
  playerCoins,
  atk,
  def,
  spd,
  onUpgradeStat,
  onRedirectToStory
}) => {
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(weaponsData[0]);
  const [consolePower, setConsolePower] = useState<boolean>(true);
  const [activeScreenTab, setActiveScreenTab] = useState<'status' | 'missions' | 'weapons' | 'soundboard'>('status');
  const [selectedMissionIndex, setSelectedMissionIndex] = useState<number>(0);
  const [joystickOffset, setJoystickOffset] = useState({ x: 0, y: 0 });
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({});

  const handleWeaponClick = (weapon: Weapon) => {
    audioEngine.playSound('select');
    setSelectedWeapon(weapon);
  };

  const handleSkillToggle = (skill: string) => {
    audioEngine.playSound('coin');
    setCompletedSkills(prev => ({
      ...prev,
      [skill]: !prev[skill]
    }));
  };

  const handlePowerToggle = () => {
    audioEngine.playSound('click');
    setConsolePower(!consolePower);
  };

  const handleDpadPress = (direction: 'up' | 'down' | 'left' | 'right') => {
    audioEngine.playSound('click');
    if (activeScreenTab === 'missions') {
      if (direction === 'up' || direction === 'left') {
        setSelectedMissionIndex(prev => (prev > 0 ? prev - 1 : missionsData.length - 1));
      } else {
        setSelectedMissionIndex(prev => (prev < missionsData.length - 1 ? prev + 1 : 0));
      }
    } else if (activeScreenTab === 'weapons') {
      const currentIndex = weaponsData.findIndex(w => w.name.en === selectedWeapon?.name.en);
      if (direction === 'up' || direction === 'left') {
        const nextIndex = currentIndex > 0 ? currentIndex - 1 : weaponsData.length - 1;
        setSelectedWeapon(weaponsData[nextIndex]);
      } else {
        const nextIndex = currentIndex < weaponsData.length - 1 ? currentIndex + 1 : 0;
        setSelectedWeapon(weaponsData[nextIndex]);
      }
    }
  };

  const handleButtonPress = (btn: 'A' | 'B' | 'X' | 'Y') => {
    if (!consolePower) return;

    if (btn === 'A') {
      audioEngine.playSound('powerup');
      if (activeScreenTab === 'missions') {
        onSelectMission(missionsData[selectedMissionIndex]);
      } else if (activeScreenTab === 'weapons' && selectedWeapon) {
        // Trigger a fun weapon sound/details
      }
    } else if (btn === 'B') {
      audioEngine.playSound('select');
      setActiveScreenTab('status');
    } else if (btn === 'X') {
      audioEngine.playSound('start');
    } else if (btn === 'Y') {
      audioEngine.playSound('jump');
      // Toggle tabs
      const tabs: ('status' | 'missions' | 'weapons' | 'soundboard')[] = ['status', 'missions', 'weapons', 'soundboard'];
      const nextTabIdx = (tabs.indexOf(activeScreenTab) + 1) % tabs.length;
      setActiveScreenTab(tabs[nextTabIdx]);
    }
  };

  const handleJoystickDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30; // Max offset
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
    setJoystickOffset({ x, y });
    audioEngine.playSound('click');
  };

  const handleJoystickRelease = () => {
    setJoystickOffset({ x: 0, y: 0 });
  };


  return (
    <div className="retro-dashboard-container">
      {/* Three floating panels on top of the console */}
      <div className="retro-panels-grid">
        
        {/* WEAPONS MASTERY PANEL */}
        <div className="retro-panel weapons-panel" id="weapons-mastery">
          <div className="panel-header bg-pink text-white">
            <span className="panel-title">{uiTranslations.weaponsMasteryTitle[lang]}</span>
            <div className="panel-dots">
              <span className="dot bg-white"></span>
              <span className="dot bg-white"></span>
            </div>
          </div>
          <div className="panel-content">
            <p className="panel-subheader">{uiTranslations.weaponsSubheader[lang]}</p>
            <div className="weapons-list">
              {weaponsData.map((w) => (
                <button 
                  key={w.name.en} 
                  className={`weapon-item ${selectedWeapon?.name.en === w.name.en ? 'active' : ''}`}
                  onClick={() => handleWeaponClick(w)}
                  style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '12px 15px' }}
                >
                  <span className="weapon-name">{w.name[lang]}</span>
                  <span className="weapon-lvl" style={{ fontSize: '12px' }}>LV. {w.level}</span>
                </button>
              ))}
            </div>

            {selectedWeapon && (
              <div className="weapon-details-card mt-3">
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <img 
                    src={
                      selectedWeapon.name.en === "Metal Hammer" ? "https://media.tenor.com/ob4qP-jLrNUAAAAd/jujutsu-kaisen-kugisaki-nobara.gif" :
                      selectedWeapon.name.en === "Cursed Nails" ? "https://media.tenor.com/ob4qP-jLrNUAAAAd/jujutsu-kaisen-kugisaki-nobara.gif" :
                      selectedWeapon.name.en === "Straw Doll" ? "https://media.tenor.com/ob4qP-jLrNUAAAAd/jujutsu-kaisen-kugisaki-nobara.gif" :
                      selectedWeapon.name.en === "Rubber Mallet" ? "https://media.tenor.com/EMVfLnBoRr0AAAAC/jujutsu-kaisen-megumi-nobara-10-points-jujutsu-kaisen.gif" :
                      "https://media.tenor.com/DSyo0NKX8gMAAAAM/gojo-satoru.gif"
                    }
                    alt={selectedWeapon.name[lang]}
                    style={{ width: '110px', height: '80px', objectFit: 'cover', border: `2px solid ${selectedWeapon.color}`, borderRadius: '4px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div className="weapon-card-header" style={{ color: selectedWeapon.color, marginBottom: '5px' }}>
                      {selectedWeapon.name[lang].toUpperCase()} - {selectedWeapon.type[lang]}
                    </div>
                    <div className="progress-bar-container" style={{ marginBottom: '5px' }}>
                      <div className="progress-bar-label">{uiTranslations.atkPowerLabel[lang]}</div>
                      <div className="progress-bar-track">
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${selectedWeapon.level}%`, 
                            backgroundColor: selectedWeapon.color,
                            boxShadow: `0 0 8px ${selectedWeapon.color}`
                          }}
                        ></div>
                      </div>
                    </div>
                    <p className="weapon-desc" style={{ fontSize: '15px', lineHeight: '1.3' }}>{selectedWeapon.description[lang]}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TRAINING LOG PANEL */}
        <div className="retro-panel training-panel" id="training-log">
          <div className="panel-header bg-pink text-white">
            <span className="panel-title">{uiTranslations.trainingLogTitle[lang]}</span>
            <div className="panel-dots">
              <span className="dot bg-white"></span>
              <span className="dot bg-white"></span>
            </div>
          </div>
          <div className="panel-content flex flex-col justify-between">
            <div>
              <p className="panel-subheader">{uiTranslations.trainingSubheader[lang]}</p>
              <div className="academy-badge-container">
                <div className="academy-icon">🎓</div>
                <div>
                  <h4 className="academy-degree">{profileData.trainingLog.degree[lang]}</h4>
                  <p className="academy-specialization">({profileData.trainingLog.specialization[lang]})</p>
                </div>
              </div>
              
              <div className="training-timeline">
                <div className="timeline-node">
                  <span className="timeline-dot"></span>
                  <div className="timeline-info">
                    <span className="timeline-label">INSTITUTION</span>
                    <span className="timeline-value text-glow-green">{profileData.trainingLog.institution[lang]}</span>
                  </div>
                </div>
                <div className="timeline-node">
                  <span className="timeline-dot"></span>
                  <div className="timeline-info">
                    <span className="timeline-label">LOCATION</span>
                    <span className="timeline-value">{profileData.trainingLog.location[lang]}</span>
                  </div>
                </div>
                <div className="timeline-node">
                  <span className="timeline-dot"></span>
                  <div className="timeline-info">
                    <span className="timeline-label">DURATION</span>
                    <span className="timeline-value text-pink">{profileData.trainingLog.duration}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="training-quote">
              <div className="quote-label">{lang === 'en' ? 'QUEST OBJECTIVE:' : '任務目標:'}</div>
              <p>"{profileData.mission[lang]}"</p>
            </div>
          </div>
        </div>

        {/* SKILLS MASTERY PANEL */}
        <div className="retro-panel skills-panel" id="skills-mastery">
          <div className="panel-header bg-pink text-white">
            <span className="panel-title">{uiTranslations.skillsTitle[lang]}</span>
            <div className="panel-dots">
              <span className="dot bg-white"></span>
              <span className="dot bg-white"></span>
            </div>
          </div>
          <div className="panel-content">
            <p className="panel-subheader">{uiTranslations.skillsSubheader[lang]}</p>
            <div className="skills-checklist">
              {profileData.skills.map((skill) => (
                <div 
                  key={skill.en} 
                  className={`skill-check-item ${completedSkills[skill.en] ? 'mastered' : ''}`}
                  onClick={() => handleSkillToggle(skill.en)}
                >
                  <div className="pixel-checkbox">
                    {completedSkills[skill.en] && <span className="checkmark">✔</span>}
                  </div>
                  <span className="skill-name">{skill[lang]}</span>
                  {completedSkills[skill.en] && <span className="skill-xp-tag">+50 XP</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* DASHED LINE CONNECTORS */}
      <div className="connector-lines-container">
        <svg className="connector-svg" width="100%" height="120" viewBox="0 0 1000 120" preserveAspectRatio="none">
          {/* Left panel connector */}
          <path d="M 180,0 L 180,50 L 380,100" fill="none" stroke="#ff79c6" strokeWidth="3" strokeDasharray="6,6" className="connector-path-1" />
          {/* Middle panel connector */}
          <path d="M 500,0 L 500,100" fill="none" stroke="#ff79c6" strokeWidth="3" strokeDasharray="6,6" className="connector-path-2" />
          {/* Right panel connector */}
          <path d="M 820,0 L 820,50 L 620,100" fill="none" stroke="#ff79c6" strokeWidth="3" strokeDasharray="6,6" className="connector-path-3" />
        </svg>
      </div>

      {/* 3DS RETRO CONSOLE (CENTERPIECE) */}
      <div className="nintendo-3ds-container">
        <div className="nintendo-3ds">
          
          {/* UPPER HINGE & SCREEN */}
          <div className="console-top-lid">
            <div className="upper-screen-bezel">
              <div className="speaker-holes left-speaker">
                <span></span><span></span><span></span>
              </div>
              
              <div className="upper-screen-frame">
                {consolePower ? (
                  <div className="upper-screen-display" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#000' }}>
                    {/* Full screen JJK GIF in Console Upper Screen */}
                    <img 
                      src="https://media.tenor.com/ob4qP-jLrNUAAAAd/jujutsu-kaisen-kugisaki-nobara.gif" 
                      alt="Nobara Kugisaki" 
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderBottom: '3px solid var(--color-border-pink)' }}
                    />

                    {/* Lower HUD text inside Upper Screen */}
                    <div className="screen-hud-overlay">
                      {activeScreenTab === 'status' && (
                        <div className="hud-content">
                          <h2 className="hud-title text-glow-green">{profileData.name[lang]}</h2>
                          <p className="hud-subtitle text-pink">{profileData.role[lang]}</p>
                          <div className="hud-stats">
                            <span>HP: 99/99</span>
                            <span>MP: 50/50</span>
                            <span className="text-glow-yellow">LV. {playerLevel}</span>
                          </div>
                        </div>
                      )}

                      {activeScreenTab === 'missions' && (
                        <div className="hud-content">
                          <div className="hud-header-tab">{uiTranslations.selectMissionPrompt[lang]}</div>
                          <h3 className="hud-mission-title text-glow-green">
                            {missionsData[selectedMissionIndex].title[lang]}
                          </h3>
                          <div className="hud-mission-sub">
                            <span>{uiTranslations.difficultyLabel[lang]}: {missionsData[selectedMissionIndex].difficulty}</span>
                            <span className="text-glow-yellow">{uiTranslations.xpLabel[lang]}: +{missionsData[selectedMissionIndex].xpReward}</span>
                          </div>
                          <div className="hud-mission-reward">
                            <span>{uiTranslations.itemLabel[lang]}: {missionsData[selectedMissionIndex].unlockedItem[lang]}</span>
                          </div>
                        </div>
                      )}

                      {activeScreenTab === 'weapons' && (
                        <div className="hud-content">
                          <div className="hud-header-tab">{uiTranslations.weaponDetailsHeader[lang]}</div>
                          <h3 className="hud-mission-title" style={{ color: selectedWeapon?.color }}>
                            {selectedWeapon?.name[lang]}
                          </h3>
                          <p className="hud-weapon-desc-short text-ellipsis">{selectedWeapon?.description[lang]}</p>
                          <div className="hud-stats">
                            <span>POWER: {selectedWeapon?.level}%</span>
                            <span style={{ color: selectedWeapon?.color }}>{lang === 'en' ? 'READY' : '準備完了'}</span>
                          </div>
                        </div>
                      )}

                      {activeScreenTab === 'soundboard' && (
                        <div className="hud-content">
                          <div className="hud-header-tab">{lang === 'en' ? '8-BIT SYNTH BOARD' : '8ビット音源盤'}</div>
                          <p className="hud-music-msg">{lang === 'en' ? 'Tweak sounds using the Lower Screen' : '下画面でサウンドを調整してください'}</p>
                          <div className="soundboard-viz">
                            <div className="viz-bar"></div>
                            <div className="viz-bar"></div>
                            <div className="viz-bar"></div>
                            <div className="viz-bar"></div>
                            <div className="viz-bar"></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="upper-screen-off"></div>
                )}
              </div>
              
              <div className="speaker-holes right-speaker">
                <span></span><span></span><span></span>
              </div>
              
              {/* 3D Depth Slider (aesthetic) */}
              <div className="depth-slider-container">
                <span className="slider-label">3D</span>
                <div className="slider-track">
                  <div className="slider-nub"></div>
                </div>
              </div>
            </div>
          </div>

          {/* SYSTEM HINGE JOINT */}
          <div className="console-hinge">
            <div className="hinge-left-led"></div>
            <div className="hinge-center"></div>
            <div className="hinge-right-power">
              <span className={`power-led ${consolePower ? 'active' : ''}`}></span>
            </div>
          </div>

          {/* LOWER BODY & TOUCH SCREEN */}
          <div className="console-bottom-base">
            <div className="bottom-layout">
              
              {/* LEFT CONTROLS: Joystick & D-pad */}
              <div className="left-controls">
                {/* Circle Pad Joystick */}
                <div 
                  className="circle-pad-outer"
                  onMouseMove={handleJoystickDrag}
                  onMouseLeave={handleJoystickRelease}
                  onMouseUp={handleJoystickRelease}
                >
                  <div 
                    className="circle-pad-inner"
                    style={{
                      transform: `translate(${joystickOffset.x}px, ${joystickOffset.y}px)`
                    }}
                  ></div>
                </div>
                
                {/* Classic D-pad */}
                <div className="dpad-container">
                  <div className="dpad-cross">
                    <button className="dpad-btn up" onClick={() => handleDpadPress('up')}></button>
                    <button className="dpad-btn right" onClick={() => handleDpadPress('right')}></button>
                    <button className="dpad-btn down" onClick={() => handleDpadPress('down')}></button>
                    <button className="dpad-btn left" onClick={() => handleDpadPress('left')}></button>
                    <div className="dpad-center-nub"></div>
                  </div>
                </div>
              </div>

              {/* CENTER TOUCH SCREEN */}
              <div className="touch-screen-bezel">
                <div className="touch-screen-frame">
                  {consolePower ? (
                    <div className="touch-screen-display">
                      <div className="touch-screen-header">
                        <span>{lang === 'en' ? 'SELECT MENU TAB' : 'メニュータブ選択'}</span>
                      </div>
                      
                      <div className="touch-screen-menu-grid">
                        <button 
                          className={`menu-grid-item ${activeScreenTab === 'status' ? 'active' : ''}`}
                          onClick={() => { audioEngine.playSound('select'); setActiveScreenTab('status'); }}
                        >
                          <span className="item-icon">👤</span>
                          <span className="item-label">{uiTranslations.statusTabBtn[lang]}</span>
                        </button>
                        <button 
                          className={`menu-grid-item ${activeScreenTab === 'missions' ? 'active' : ''}`}
                          onClick={() => { audioEngine.playSound('select'); setActiveScreenTab('missions'); }}
                        >
                          <span className="item-icon">⚔️</span>
                          <span className="item-label">{uiTranslations.missionsTabBtn[lang]}</span>
                        </button>
                        <button 
                          className={`menu-grid-item ${activeScreenTab === 'weapons' ? 'active' : ''}`}
                          onClick={() => { audioEngine.playSound('select'); setActiveScreenTab('weapons'); }}
                        >
                          <span className="item-icon">🛠️</span>
                          <span className="item-label">{uiTranslations.weaponsTabBtn[lang]}</span>
                        </button>
                        <button 
                          className={`menu-grid-item ${activeScreenTab === 'soundboard' ? 'active' : ''}`}
                          onClick={() => { audioEngine.playSound('select'); setActiveScreenTab('soundboard'); }}
                        >
                          <span className="item-icon">🎵</span>
                          <span className="item-label">{uiTranslations.synthsTabBtn[lang]}</span>
                        </button>
                      </div>

                      {/* Sub touch content based on selection */}
                      <div className="touch-sub-interface">
                        {activeScreenTab === 'status' && (
                          <div className="touch-status-pad">
                            <div className="status-tip">{uiTranslations.upgradePrompt[lang]}</div>
                            <div className="status-attributes-grid mt-1">
                              <div className="attribute-row">
                                <span>{uiTranslations.meleeStat[lang]}: {atk}</span>
                                <button className="stat-upgrade-btn" onClick={() => onUpgradeStat('atk')}>
                                  {uiTranslations.upgradeBtn[lang]} (15💰)
                                </button>
                              </div>
                              <div className="attribute-row mt-1">
                                <span>{uiTranslations.barrierStat[lang]}: {def}</span>
                                <button className="stat-upgrade-btn" onClick={() => onUpgradeStat('def')}>
                                  {uiTranslations.upgradeBtn[lang]} (15💰)
                                </button>
                              </div>
                              <div className="attribute-row mt-1">
                                <span>{uiTranslations.reflexesStat[lang]}: {spd}</span>
                                <button className="stat-upgrade-btn" onClick={() => onUpgradeStat('spd')}>
                                  {uiTranslations.upgradeBtn[lang]} (15💰)
                                </button>
                              </div>
                            </div>
                            <div className="quick-stats-row mt-3">
                              <span>{uiTranslations.gold[lang]}: {playerCoins}</span>
                              <span>{lang === 'en' ? 'LEVEL' : 'レベル'}: {playerLevel.toString().padStart(2, '0')}</span>
                            </div>
                            <button 
                              className="story-redirect-link-btn"
                              onClick={() => {
                                audioEngine.playSound('start');
                                if (onRedirectToStory) onRedirectToStory();
                              }}
                              style={{
                                marginTop: '8px',
                                backgroundColor: '#fff200',
                                color: '#000',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '10px',
                                border: '2px solid #5a5a00',
                                padding: '3px 6px',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                width: '100%',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                boxShadow: '1px 1px 0px #000'
                              }}
                            >
                              📖 {lang === 'en' ? 'STORY & MANGA ➔' : 'ストーリー＆漫画を読む ➔'}
                            </button>
                          </div>
                        )}

                        {activeScreenTab === 'missions' && (
                          <div className="touch-missions-scroller">
                            {missionsData.map((mission, idx) => (
                              <button 
                                key={mission.id}
                                className={`scroller-mission-btn ${selectedMissionIndex === idx ? 'selected' : ''}`}
                                onClick={() => { audioEngine.playSound('click'); setSelectedMissionIndex(idx); }}
                              >
                                <span className={`status-dot ${mission.status}`}></span>
                                <span className="m-title">{mission.title[lang]}</span>
                              </button>
                            ))}
                            <div className="mission-trigger-prompt">{uiTranslations.pressAPrompt[lang]}</div>
                          </div>
                        )}

                        {activeScreenTab === 'weapons' && (
                          <div className="touch-weapons-grid">
                            {weaponsData.map((w) => (
                              <button 
                                key={w.name.en} 
                                className={`weapon-grid-btn ${selectedWeapon?.name.en === w.name.en ? 'selected' : ''}`}
                                onClick={() => handleWeaponClick(w)}
                              >
                                {w.name[lang]}
                              </button>
                            ))}
                          </div>
                        )}

                        {activeScreenTab === 'soundboard' && (
                          <div className="touch-synth-board">
                            <button className="synth-btn" onClick={() => audioEngine.playSound('jump')}>{lang === 'en' ? 'JUMP' : 'ジャンプ'}</button>
                            <button className="synth-btn" onClick={() => audioEngine.playSound('coin')}>{lang === 'en' ? 'COIN' : 'コイン'}</button>
                            <button className="synth-btn" onClick={() => audioEngine.playSound('powerup')}>{lang === 'en' ? 'ITEM' : 'アイテム'}</button>
                            <button className="synth-btn" onClick={() => audioEngine.playSound('start')}>{lang === 'en' ? 'START' : 'スタート'}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="touch-screen-off"></div>
                  )}
                </div>
              </div>

              {/* RIGHT CONTROLS: Action Buttons */}
              <div className="right-controls">
                <div className="action-buttons-diamond">
                  <div className="btn-row top-row">
                    <button className="action-btn X-btn" onClick={() => handleButtonPress('X')}>
                      <span>X</span>
                    </button>
                  </div>
                  <div className="btn-row middle-row">
                    <button className="action-btn Y-btn" onClick={() => handleButtonPress('Y')}>
                      <span>Y</span>
                    </button>
                    <button className="action-btn A-btn" onClick={() => handleButtonPress('A')}>
                      <span>A</span>
                    </button>
                  </div>
                  <div className="btn-row bottom-row">
                    <button className="action-btn B-btn" onClick={() => handleButtonPress('B')}>
                      <span>B</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* LOWER CONTROLS: SELECT, HOME, START buttons */}
            <div className="console-bottom-bar">
              <button className="bar-btn select-btn" onClick={() => handleButtonPress('Y')}>
                <span>SELECT</span>
              </button>
              
              <button className="bar-btn home-btn" onClick={() => { audioEngine.playSound('click'); setActiveScreenTab('status'); }}>
                <span className="home-icon">🏠</span>
              </button>
              
              <button className="bar-btn start-btn" onClick={handlePowerToggle}>
                <span>{consolePower ? 'OFF' : 'POWER'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
