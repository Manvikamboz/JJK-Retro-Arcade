import React, { useState, useEffect, useRef } from 'react';
import { 
  NobaraAvatar, 
  PixelCat, 
  PixelCoin, 
  PixelKey, 
  PixelPipe, 
  PixelPiranha, 
  PixelCastleDoor 
} from './PixelAvatar';
import { audioEngine } from './AudioEngine';
import { Language } from '../data';
import { uiTranslations } from '../translations';

interface RetroGameProps {
  lang: Language;
  onGainXp: (amount: number) => void;
  onGainCoins: (amount: number) => void;
  onUnlockSecret: () => void;
}

interface GameCoin {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

export const RetroGame: React.FC<RetroGameProps> = ({ lang, onGainXp, onGainCoins, onUnlockSecret }) => {
  // --- Render state (used by JSX) ---
  const [posX, setPosX] = useState(120);
  const [posY, setPosY] = useState(40);
  const [isJumping, setIsJumping] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  const [catX, setCatX] = useState(60);
  const [catY, setCatY] = useState(40);

  // Game assets state
  const [hasKey, setHasKey] = useState(false);
  const [keyCollected, setKeyCollected] = useState(false);
  const [coins, setCoins] = useState<GameCoin[]>([
    { id: 1, x: 280, y: 55, collected: false },
    { id: 2, x: 380, y: 55, collected: false },
    { id: 3, x: 480, y: 55, collected: false },
    { id: 4, x: 620, y: 55, collected: false },
    { id: 5, x: 720, y: 55, collected: false },
  ]);
  const [plantBiting, setPlantBiting] = useState(false);
  const [showPortalInfo, setShowPortalInfo] = useState(false);

  // --- Physics refs (read/written by RAF loop — never stale) ---
  // Using refs avoids stale closures and prevents the game loop from
  // restarting on every frame due to state deps changing.
  const posXRef = useRef(120);
  const posYRef = useRef(40);
  const velYRef = useRef(0);          // velY is purely internal physics — no render needed
  const facingRef = useRef<'left' | 'right'>('right');
  const isJumpingRef = useRef(false);
  const catXRef = useRef(60);
  const catYRef = useRef(40);

  // Keyboard / loop refs
  const keysPressed = useRef<Record<string, boolean>>({});
  const gameLoopRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  // One-shot guard — prevents secret from re-firing while player stands at door
  const secretTriggeredRef = useRef<boolean>(false);
  // Stable refs to callbacks so the loop never captures stale versions
  const onGainXpRef = useRef(onGainXp);
  const onGainCoinsRef = useRef(onGainCoins);
  const onUnlockSecretRef = useRef(onUnlockSecret);
  useEffect(() => { onGainXpRef.current = onGainXp; }, [onGainXp]);
  useEffect(() => { onGainCoinsRef.current = onGainCoins; }, [onGainCoins]);
  useEffect(() => { onUnlockSecretRef.current = onUnlockSecret; }, [onUnlockSecret]);

  // Constants
  const GROUND_LEVEL = 40;
  const GRAVITY = 0.8;
  const JUMP_FORCE = 12;
  const SPEED = 4.5;

  // Handle plant biting animation cycle
  useEffect(() => {
    const plantTimer = setInterval(() => {
      setPlantBiting(prev => !prev);
    }, 2000);
    return () => clearInterval(plantTimer);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'];
      if (keys.includes(e.code)) {
        // Prevent scroll on space or arrows
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
  }, []);

  // Main Game Loop — runs ONCE on mount, never restarts.
  // All physics values are read/written via refs to avoid stale closures.
  // setState is called once per frame at the end to batch-trigger one re-render.
  useEffect(() => {
    const COIN_POSITIONS = [
      { id: 1, x: 280, y: 55 },
      { id: 2, x: 380, y: 55 },
      { id: 3, x: 480, y: 55 },
      { id: 4, x: 620, y: 55 },
      { id: 5, x: 720, y: 55 },
    ];
    const collectedCoins = new Set<number>();
    let keyCollectedInLoop = false;

    const updatePhysics = () => {
      // --- Horizontal movement ---
      let dx = 0;
      let walking = false;

      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
        dx = -SPEED;
        walking = true;
        facingRef.current = 'left';
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
        dx = SPEED;
        walking = true;
        facingRef.current = 'right';
      }

      posXRef.current = Math.max(20, Math.min(1000 - 60, posXRef.current + dx));

      // --- Jumping & gravity ---
      const wantToJump =
        keysPressed.current['ArrowUp'] ||
        keysPressed.current['KeyW'] ||
        keysPressed.current['Space'];

      if (wantToJump && !isJumpingRef.current && posYRef.current === GROUND_LEVEL) {
        velYRef.current = JUMP_FORCE;
        isJumpingRef.current = true;
        audioEngine.playSound('jump');
      }

      if (posYRef.current > GROUND_LEVEL || velYRef.current > 0) {
        velYRef.current -= GRAVITY;
        posYRef.current += velYRef.current;
      }

      if (posYRef.current <= GROUND_LEVEL) {
        posYRef.current = GROUND_LEVEL;
        velYRef.current = 0;
        isJumpingRef.current = false;
      }

      // --- Cat follower (reads refs — never stale) ---
      const targetCatX =
        facingRef.current === 'right'
          ? posXRef.current - 45
          : posXRef.current + 45;
      catXRef.current += (targetCatX - catXRef.current) * 0.08;
      catYRef.current += (posYRef.current - catYRef.current) * 0.12;

      // --- Inline coin collision ---
      const px = posXRef.current;
      const py = posYRef.current;
      const pW = 35, pH = 60, cW = 20, cH = 20;
      COIN_POSITIONS.forEach(coin => {
        if (!collectedCoins.has(coin.id)) {
          const hx = px < coin.x + cW && px + pW > coin.x;
          const hy = py < coin.y + cH && py + pH > coin.y;
          if (hx && hy) {
            collectedCoins.add(coin.id);
            audioEngine.playSound('coin');
            onGainXpRef.current(10);
            onGainCoinsRef.current(1);
            setCoins(prev =>
              prev.map(c => (c.id === coin.id ? { ...c, collected: true } : c))
            );
          }
        }
      });

      // --- Inline key collision ---
      const keyX = 540, keyY = 55;
      if (!keyCollectedInLoop) {
        const kx = px < keyX + 24 && px + pW > keyX;
        const ky = py < keyY + 12 && py + pH > keyY;
        if (kx && ky) {
          keyCollectedInLoop = true;
          audioEngine.playSound('powerup');
          setKeyCollected(true);
          setHasKey(true);
          onGainXpRef.current(100);
        }
      }

      // --- Castle door check ---
      const doorX = 860;
      const isNearDoor = px > doorX - 40 && px < doorX + 40;
      setShowPortalInfo(isNearDoor);

      // Read hasKey via a ref-synced flag updated by the setHasKey call
      // (handled by a separate shallow effect below)
      if (isNearDoor && !secretTriggeredRef.current && keyCollectedInLoop) {
        secretTriggeredRef.current = true;
        audioEngine.playSound('start');
        onUnlockSecretRef.current();
        setHasKey(false);
        keyCollectedInLoop = false; // consume key
      }
      if (!isNearDoor) {
        secretTriggeredRef.current = false;
      }

      // --- Batch setState — ONE re-render per frame ---
      setPosX(posXRef.current);
      setPosY(posYRef.current);
      setFacing(facingRef.current);
      setIsWalking(walking);
      setIsJumping(isJumpingRef.current);
      setCatX(catXRef.current);
      setCatY(catYRef.current);

      gameLoopRef.current = requestAnimationFrame(updatePhysics);
    };

    gameLoopRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps → stable single loop, no restarts, no stale closures

  // Collision detection is handled inline inside the stable RAF loop above.
  // No separate effect needed — this avoids re-running on every position change
  // and eliminates the onGainCoins missing-dep warning.

  // Scroll viewport to center the player on mobile/narrow screens
  useEffect(() => {
    const viewport = gameContainerRef.current?.querySelector('.game-viewport');
    if (viewport) {
      const viewportWidth = viewport.clientWidth;
      const targetScroll = posX - viewportWidth / 2;
      viewport.scrollLeft = targetScroll;
    }
  }, [posX]);

  // On-screen mobile/mouse triggers
  const handleMobileLeft = (pressed: boolean) => {
    keysPressed.current['KeyA'] = pressed;
  };

  const handleMobileRight = (pressed: boolean) => {
    keysPressed.current['KeyD'] = pressed;
  };

  const handleMobileJump = () => {
    keysPressed.current['Space'] = true;
    setTimeout(() => {
      keysPressed.current['Space'] = false;
    }, 150);
  };

  return (
    <div className="retro-platformer-section" ref={gameContainerRef}>
      
      {/* HUD Info */}
      <div className="platformer-hud">
        <div className="hud-badge">{uiTranslations.greenGrassZone[lang]}</div>
        <div className="hud-inventory">
          <span>{uiTranslations.inventoryLabel[lang]}:</span>
          <div className="inventory-box">
            {hasKey ? (
              <PixelKey size={24} className="inventory-item animate-pulse" />
            ) : (
              <span className="text-muted">{uiTranslations.empty[lang]}</span>
            )}
          </div>
        </div>
      </div>

      {/* Game Window viewport */}
      <div className="game-viewport" style={{ overflowX: 'hidden', position: 'relative' }}>
        <div className="game-level-stage" style={{ width: 1000, height: '100%', position: 'relative' }}>
          {/* Sky background with retro clouds */}
          <div className="game-sky">
            <div className="pixel-cloud bg-cloud-1"></div>
            <div className="pixel-cloud bg-cloud-2"></div>
          </div>

          {/* Coins display */}
          {coins.map(coin => !coin.collected && (
            <div 
              key={coin.id} 
              className="game-coin-sprite" 
              style={{ left: coin.x, bottom: coin.y }}
            >
              <PixelCoin size={20} className="animate-bounce" />
            </div>
          ))}

          {/* Golden Key display */}
          {!keyCollected && (
            <div 
              className="game-key-sprite" 
              style={{ left: 540, bottom: 55 }}
            >
              <PixelKey size={28} className="floating-key" />
            </div>
          )}

          {/* Mario Pipe with biting plant */}
          <div className="game-pipe-container" style={{ left: 680, bottom: 40 }}>
            <div className={`game-plant-sprite ${plantBiting ? 'bite-up' : 'bite-down'}`}>
              <PixelPiranha size={32} />
            </div>
            <PixelPipe size={48} />
          </div>

          {/* Castle Door Portal */}
          <div className="game-castle-door" style={{ left: 860, bottom: 40 }}>
            <PixelCastleDoor size={70} />
            {showPortalInfo && (
              <div className="portal-tooltip">
                {hasKey ? (lang === 'en' ? "PORTAL UNLOCKED! ENTER..." : "ポータル解放！突入中...") : (lang === 'en' ? "REQUIRES KEY!" : "鍵が必要です！")}
              </div>
            )}
          </div>

          {/* Follower Cat Sprite */}
          <div 
            className="game-cat-sprite"
            style={{ 
              left: catX, 
              bottom: catY,
              transform: `scaleX(${facing === 'right' ? 1 : -1})`,
              transition: 'transform 0.1s ease'
            }}
          >
            <PixelCat size={36} />
          </div>

          {/* Player Character Sprite */}
          <div 
            className={`game-player-sprite ${isWalking ? 'walking' : ''} ${isJumping ? 'jumping' : ''}`}
            style={{ 
              left: posX, 
              bottom: posY,
              transform: `scaleX(${facing === 'right' ? 1 : -1})`
            }}
          >
            <NobaraAvatar size={70} />
          </div>

          {/* Grass ground floor */}
          <div className="game-grass-ground">
            <div className="grass-surface"></div>
            <div className="dirt-underground"></div>
          </div>
        </div>
      </div>

      {/* On-screen control pad for touch/mobile or easier click interaction */}
      <div className="game-controls-overlay">
        <div className="movement-pad">
          <button 
            className="game-pad-btn left-btn"
            onMouseDown={() => handleMobileLeft(true)}
            onMouseUp={() => handleMobileLeft(false)}
            onMouseLeave={() => handleMobileLeft(false)}
            onTouchStart={(e) => { e.preventDefault(); handleMobileLeft(true); }}
            onTouchEnd={(e) => { e.preventDefault(); handleMobileLeft(false); }}
          >
            ◀
          </button>
          <button 
            className="game-pad-btn right-btn"
            onMouseDown={() => handleMobileRight(true)}
            onMouseUp={() => handleMobileRight(false)}
            onMouseLeave={() => handleMobileRight(false)}
            onTouchStart={(e) => { e.preventDefault(); handleMobileRight(true); }}
            onTouchEnd={(e) => { e.preventDefault(); handleMobileRight(false); }}
          >
            ▶
          </button>
        </div>
        
        <button 
          className="game-pad-btn jump-btn"
          onClick={handleMobileJump}
          onTouchStart={(e) => { e.preventDefault(); handleMobileJump(); }}
        >
          {uiTranslations.jumpAction[lang]}
        </button>
      </div>

      <div className="game-keyboard-tip">
        {lang === 'en' ? (
          <>⌨️ Use <strong>A/D</strong> or <strong>Arrow Keys</strong> to run, <strong>Space/W</strong> to jump! Collect the key and unlock the castle door.</>
        ) : (
          <>⌨️ <strong>A/D</strong> または <strong>矢印キー</strong> で走り、<strong>Space/W</strong> でジャンプ！鍵を回収してお城の扉を開けましょう。</>
        )}
      </div>
    </div>
  );
};
