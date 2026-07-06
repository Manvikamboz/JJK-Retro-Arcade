import React, { useState, useEffect, useRef } from 'react';
import { PixelStar } from './PixelAvatar';
import { audioEngine } from './AudioEngine';
import { Language } from '../data';
import { uiTranslations } from '../translations';

interface SpaceShooterProps {
  lang: Language;
  onGainXp: (amount: number) => void;
  onGainCoins: (amount: number) => void;
  isUnlocked: boolean;
}

interface Laser {
  id: number;
  x: number;
  y: number;
}

interface EnemyBug {
  id: number;
  x: number;
  y: number;
  type: number; // different colored bugs
  width: number;
}

export const SpaceShooter: React.FC<SpaceShooterProps> = ({ lang, onGainXp, onGainCoins, isUnlocked }) => {
  // --- Render state (drives JSX) ---
  const [shipX, setShipX] = useState(50);
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [enemies, setEnemies] = useState<EnemyBug[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // --- Game logic refs (read/written imperatively by RAF loop) ---
  // Keeping game state in refs prevents:
  //   Bug #5: loop restarting on every laser fired (was: lasers in deps array)
  //   Bug #3: nested setState inside setLasers updater (forbidden React pattern)
  const shipXRef = useRef(50);
  const lasersRef = useRef<Laser[]>([]);
  const enemiesRef = useRef<EnemyBug[]>([]);
  // Stable callback refs so the loop never captures stale versions
  const onGainXpRef = useRef(onGainXp);
  const onGainCoinsRef = useRef(onGainCoins);
  useEffect(() => { onGainXpRef.current = onGainXp; }, [onGainXp]);
  useEffect(() => { onGainCoinsRef.current = onGainCoins; }, [onGainCoins]);

  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const keysPressed = useRef<Record<string, boolean>>({});
  const gameLoopRef = useRef<number | null>(null);
  const nextLaserId = useRef(0);
  const nextEnemyId = useRef(0);

  const SHIP_SPEED = 2;

  // Keyboard controls
  useEffect(() => {
    if (!gameStarted || gameOver || !isUnlocked) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'KeyA', 'KeyD', 'Space'];
      if (keys.includes(e.code)) {
        e.preventDefault();
        keysPressed.current[e.code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (keysPressed.current[e.code]) {
        keysPressed.current[e.code] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, isUnlocked]);

  // Game Loop — runs once per game session, never on laser/enemy state changes.
  // All mutations happen on refs; setState is called once per frame for rendering.
  useEffect(() => {
    if (!gameStarted || gameOver || !isUnlocked) return;

    const updateGame = () => {
      // --- Move ship ---
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
        shipXRef.current = Math.max(5, shipXRef.current - SHIP_SPEED);
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
        shipXRef.current = Math.min(95, shipXRef.current + SHIP_SPEED);
      }

      // --- Shoot via Space key ---
      if (keysPressed.current['Space']) {
        keysPressed.current['Space'] = false; // one shot per press
        audioEngine.playSound('click');
        lasersRef.current = [
          ...lasersRef.current,
          { id: nextLaserId.current++, x: shipXRef.current, y: 15 }
        ];
      }

      // --- Move lasers up ---
      lasersRef.current = lasersRef.current
        .map(l => ({ ...l, y: l.y + 4 }))
        .filter(l => l.y < 100);

      // --- Move enemies down, detect player hits ---
      let hitPlayer = false;
      enemiesRef.current = enemiesRef.current
        .map(e => ({ ...e, y: e.y - 0.7 }))
        .filter(e => {
          if (e.y <= 10) {
            hitPlayer = true;
            return false;
          }
          return true;
        });

      if (hitPlayer) {
        audioEngine.playSound('select');
        setLives(prevLives => {
          if (prevLives <= 1) {
            setGameOver(true);
            return 0;
          }
          return prevLives - 1;
        });
      }

      // --- Collision detection: Lasers vs Enemies ---
      // Computed together on refs — no nested setState, no forbidden updater pattern.
      const hitLaserIdxs = new Set<number>();
      const hitEnemyIds = new Set<number>();

      enemiesRef.current.forEach(enemy => {
        lasersRef.current.forEach((laser, lIdx) => {
          if (Math.abs(laser.x - enemy.x) < 6 && Math.abs(laser.y - enemy.y) < 8) {
            hitLaserIdxs.add(lIdx);
            hitEnemyIds.add(enemy.id);
          }
        });
      });

      if (hitEnemyIds.size > 0) {
        audioEngine.playSound('coin');
        hitEnemyIds.forEach(() => {
          setScore(s => s + 10);
          onGainXpRef.current(15);
          onGainCoinsRef.current(5);
        });
      }

      lasersRef.current = lasersRef.current.filter((_, idx) => !hitLaserIdxs.has(idx));
      enemiesRef.current = enemiesRef.current.filter(e => !hitEnemyIds.has(e.id));

      // --- Batch render — ONE setState call per entity type per frame ---
      setShipX(shipXRef.current);
      setLasers([...lasersRef.current]);
      setEnemies([...enemiesRef.current]);

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  // No `lasers` in deps — loop is stable regardless of laser count.
  // gameStarted/gameOver/isUnlocked are intentionally kept so the loop
  // starts/stops cleanly when game state changes.
  }, [gameStarted, gameOver, isUnlocked]);

  // Spawn enemies — writes to ref directly so the loop picks them up next tick
  useEffect(() => {
    if (!gameStarted || gameOver || !isUnlocked) return;

    const spawnTimer = setInterval(() => {
      const newEnemy: EnemyBug = {
        id: nextEnemyId.current++,
        x: 10 + Math.random() * 80,
        y: 95,
        type: Math.floor(Math.random() * 3),
        width: 25
      };
      // Write to ref — the RAF loop will pick it up on the next frame and
      // call setEnemies([...enemiesRef.current]) to sync the render state.
      enemiesRef.current = [...enemiesRef.current, newEnemy];
    }, 1800);

    return () => clearInterval(spawnTimer);
  }, [gameStarted, gameOver, isUnlocked]);

  // handleShoot for mobile/button — updates ref so next RAF frame renders it
  const handleShoot = () => {
    audioEngine.playSound('click');
    lasersRef.current = [
      ...lasersRef.current,
      { id: nextLaserId.current++, x: shipXRef.current, y: 15 }
    ];
  };

  const handleRestart = () => {
    // Reset both refs and state on restart
    lasersRef.current = [];
    enemiesRef.current = [];
    shipXRef.current = 50;
    setEnemies([]);
    setLasers([]);
    setShipX(50);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameStarted(true);
    audioEngine.playSound('start');
  };

  if (!isUnlocked) {
    return (
      <div className="game-locked-placeholder">
        <div className="locked-shield">🔒</div>
        <h3>{uiTranslations.zone2Title[lang]}</h3>
        <p className="text-pink">
          {lang === 'en' ? "LOCKED! Reached level 4 to unlock this simulator." : "ロックされています！このシミュレーターを解除するにはレベル4に到達してください。"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-shooter-game" ref={gameAreaRef}>
      
      {/* Game HUD */}
      <div className="shooter-hud">
        <div className="hud-metric text-glow-green">{lang === 'en' ? 'SCORE' : 'スコア'}: {score}</div>
        <div className="hud-title-mini">{uiTranslations.zone2Title[lang]}</div>
        <div className="hud-metric text-pink">
          {lang === 'en' ? 'SHIELDS:' : 'シールド:'} {'💚'.repeat(lives) || (lang === 'en' ? 'DEAD' : '大破')}
        </div>
      </div>

      <div className="shooter-canvas-area">
        {/* Star backdrop */}
        <div className="shooter-stars">
          <PixelStar className="absolute top-4 left-1/4" size={10} animate={false} />
          <PixelStar className="absolute top-12 right-1/3" size={14} animate={false} />
          <PixelStar className="absolute top-20 left-10" size={8} animate={false} />
          <PixelStar className="absolute top-3 right-10" size={12} animate={false} />
        </div>

        {!gameStarted ? (
          <div className="game-start-prompt">
            <h2>👾 {lang === 'en' ? 'CURSE BLASTER' : '呪霊駆除シミュレーター'} 👾</h2>
            <p>
              {lang === 'en' ? "Shoot down the rogue curses before they invade Nobara's territory!" : "野薔薇の縄張りに侵入する野良呪霊たちを撃ち落とせ！"}
            </p>
            <button className="pixel-start-btn mt-4" onClick={() => { setGameStarted(true); audioEngine.playSound('start'); }}>
              {lang === 'en' ? 'INITIALIZE SCANNER' : 'スキャナー初期化'}
            </button>
          </div>
        ) : gameOver ? (
          <div className="game-start-prompt">
            <h2 className="text-pink">{lang === 'en' ? 'SYSTEM FAILURE' : 'システム障害'}</h2>
            <p>{lang === 'en' ? 'Terminal encountered critical errors.' : 'ターミナルに致命的なエラーが発生しました。'}</p>
            <button className="pixel-start-btn mt-4" onClick={handleRestart}>
              {lang === 'en' ? 'REBOOT' : '再起動'}
            </button>
          </div>
        ) : (
          <>
            {/* Player Spaceship */}
            <div 
              className="player-spaceship-sprite"
              style={{ left: `${shipX}%` }}
            >
              {/* Retro SVG Spaceship */}
              <svg viewBox="0 0 16 16" width="36" height="36" className="pixel-ship">
                <path d="M8,0 L11,4 L11,10 L15,13 L15,16 L1,16 L1,13 L5,10 L5,4 Z" fill="#39ff14" shapeRendering="crispEdges" />
                <rect x="7" y="6" width="2" height="6" fill="#fff" />
                <rect x="3" y="14" width="2" height="2" fill="#ff2a85" />
                <rect x="11" y="14" width="2" height="2" fill="#ff2a85" />
              </svg>
            </div>

            {/* Lasers */}
            {lasers.map(l => (
              <div 
                key={l.id} 
                className="shooter-laser-sprite"
                style={{ left: `${l.x}%`, bottom: `${l.y}%` }}
              ></div>
            ))}

            {/* Enemy Bugs */}
            {enemies.map(e => (
              <div 
                key={e.id}
                className={`enemy-bug-sprite bug-type-${e.type}`}
                style={{ left: `${e.x}%`, bottom: `${e.y}%` }}
              >
                {/* SVG Enemy Bug */}
                <svg viewBox="0 0 16 16" width="30" height="30">
                  <rect x="2" y="2" width="12" height="12" fill={e.type === 0 ? '#ff2a85' : e.type === 1 ? '#fff200' : '#4fc3f7'} shapeRendering="crispEdges" />
                  <rect x="4" y="5" width="2" height="2" fill="#000" />
                  <rect x="10" y="5" width="2" height="2" fill="#000" />
                  <rect x="6" y="10" width="4" height="2" fill="#000" />
                  {/* Legs */}
                  <rect x="0" y="4" width="2" height="2" fill="#fff" />
                  <rect x="14" y="4" width="2" height="2" fill="#fff" />
                  <rect x="0" y="8" width="2" height="2" fill="#fff" />
                  <rect x="14" y="8" width="2" height="2" fill="#fff" />
                </svg>
              </div>
            ))}
          </>
        )}
      </div>

      {gameStarted && !gameOver && (
        <div className="shooter-mobile-controls">
          <button 
            className="game-pad-btn"
            onMouseDown={() => { keysPressed.current['KeyA'] = true; }}
            onMouseUp={() => { keysPressed.current['KeyA'] = false; }}
            onTouchStart={(e) => { e.preventDefault(); keysPressed.current['KeyA'] = true; }}
            onTouchEnd={(e) => { e.preventDefault(); keysPressed.current['KeyA'] = false; }}
          >
            ◀
          </button>
          
          <button 
            className="game-pad-btn jump-btn" 
            onClick={handleShoot}
            onTouchStart={(e) => { e.preventDefault(); handleShoot(); }}
          >
            💥 {lang === 'en' ? 'FIRE' : '射撃'}
          </button>

          <button 
            className="game-pad-btn"
            onMouseDown={() => { keysPressed.current['KeyD'] = true; }}
            onMouseUp={() => { keysPressed.current['KeyD'] = false; }}
            onTouchStart={(e) => { e.preventDefault(); keysPressed.current['KeyD'] = true; }}
            onTouchEnd={(e) => { e.preventDefault(); keysPressed.current['KeyD'] = false; }}
          >
            ▶
          </button>
        </div>
      )}

      <div className="game-keyboard-tip">
        {lang === 'en' ? (
          <>⌨️ Controls: <strong>A/D</strong> (or Left/Right) to move. <strong>Space</strong> (or click Fire) to shoot lasers.</>
        ) : (
          <>⌨️ 操作方法: <strong>A/D</strong>（または左右キー）で移動、<strong>Space</strong>（または射撃ボタン）で光線を発射。</>
        )}
      </div>
    </div>
  );
};
