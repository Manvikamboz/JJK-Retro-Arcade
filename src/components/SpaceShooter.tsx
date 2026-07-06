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
  const [shipX, setShipX] = useState(50); // percentage 0 - 100
  const [lasers, setLasers] = useState<Laser[]>([]);
  const [enemies, setEnemies] = useState<EnemyBug[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const keysPressed = useRef<Record<string, boolean>>({});
  const gameLoopRef = useRef<number | null>(null);
  const nextLaserId = useRef(0);
  const nextEnemyId = useRef(0);

  const SHIP_SPEED = 2; // movement increment

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

  // Game Loop
  useEffect(() => {
    if (!gameStarted || gameOver || !isUnlocked) return;

    const updateGame = () => {
      // Move ship
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
        setShipX(prev => Math.max(5, prev - SHIP_SPEED));
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
        setShipX(prev => Math.min(95, prev + SHIP_SPEED));
      }

      // Handle shooting via Space
      if (keysPressed.current['Space']) {
        keysPressed.current['Space'] = false; // single shoot per press
        handleShoot();
      }

      // Move lasers
      setLasers(prev => 
        prev
          .map(l => ({ ...l, y: l.y + 4 }))
          .filter(l => l.y < 100) // remove off-screen
      );

      // Move enemies down
      setEnemies(prev => {
        let hitPlayer = false;
        const updated = prev
          .map(e => ({ ...e, y: e.y - 0.7 }))
          .filter(e => {
            if (e.y <= 10) {
              hitPlayer = true; // hit bottom
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
        return updated;
      });

      // Collision detection (Lasers vs Enemies)
      setLasers(prevLasers => {
        let laserHitIdxs: number[] = [];
        let enemyHitIds: number[] = [];

        setEnemies(prevEnemies => {
          const remainingEnemies = prevEnemies.filter((enemy) => {
            let hit = false;
            prevLasers.forEach((laser, lIdx) => {
              // Convert ship x (percentage) to approximate game coordinates
              // Laser: x (percentage), y (0-100)
              // Enemy: x (percentage), y (0-100)
              const xDiff = Math.abs(laser.x - enemy.x);
              const yDiff = Math.abs(laser.y - enemy.y);

              if (xDiff < 6 && yDiff < 8) {
                hit = true;
                laserHitIdxs.push(lIdx);
                enemyHitIds.push(enemy.id);
              }
            });

            if (hit) {
              audioEngine.playSound('coin');
              setScore(s => s + 10);
              onGainXp(15);
              onGainCoins(5);
              return false;
            }
            return true;
          });

          return remainingEnemies;
        });

        return prevLasers.filter((_, idx) => !laserHitIdxs.includes(idx));
      });

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameStarted, gameOver, lasers, isUnlocked]);

  // Spawn enemies periodically
  useEffect(() => {
    if (!gameStarted || gameOver || !isUnlocked) return;

    const spawnTimer = setInterval(() => {
      const randomX = 10 + Math.random() * 80;
      const randomType = Math.floor(Math.random() * 3);
      setEnemies(prev => [
        ...prev,
        {
          id: nextEnemyId.current++,
          x: randomX,
          y: 95,
          type: randomType,
          width: 25
        }
      ]);
    }, 1800);

    return () => clearInterval(spawnTimer);
  }, [gameStarted, gameOver, isUnlocked]);

  const handleShoot = () => {
    audioEngine.playSound('click');
    setLasers(prev => [
      ...prev,
      { id: nextLaserId.current++, x: shipX, y: 15 }
    ]);
  };

  const handleRestart = () => {
    setEnemies([]);
    setLasers([]);
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
            <button className="pixel-start-btn mt-4" onClick={() => { setGameStarted(true); restartMusic(); }}>
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

  function restartMusic() {
    audioEngine.playSound('start');
  }
};
