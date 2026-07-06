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
  const [posX, setPosX] = useState(120);
  const [posY, setPosY] = useState(40); // 40px is ground level
  const [velY, setVelY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [facing, setFacing] = useState<'left' | 'right'>('right');
  const [isWalking, setIsWalking] = useState(false);
  
  // Follower cat coordinates
  const [catX, setCatX] = useState(60);
  const [catY, setCatY] = useState(40);
  
  // Game assets state
  const [hasKey, setHasKey] = useState(false);
  const [keyCollected, setKeyCollected] = useState(false);
  const [coins, setCoins] = useState<GameCoin[]>([
    { id: 1, x: 280, y: 110, collected: false },
    { id: 2, x: 380, y: 130, collected: false },
    { id: 3, x: 480, y: 110, collected: false },
    { id: 4, x: 620, y: 120, collected: false },
    { id: 5, x: 720, y: 140, collected: false },
  ]);
  const [plantBiting, setPlantBiting] = useState(false);
  const [showPortalInfo, setShowPortalInfo] = useState(false);
  
  // Keyboard keys active
  const keysPressed = useRef<Record<string, boolean>>({});
  const gameLoopRef = useRef<number | null>(null);
  const gameContainerRef = useRef<HTMLDivElement | null>(null);
  // Prevents onUnlockSecret from re-firing while player stays near the door
  const secretTriggeredRef = useRef<boolean>(false);

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

  // Main Game Loop (Physics and collision)
  useEffect(() => {
    const updatePhysics = () => {
      let dx = 0;
      let walking = false;
      let currentFacing = facing;

      if (keysPressed.current['ArrowLeft'] || keysPressed.current['KeyA']) {
        dx = -SPEED;
        walking = true;
        currentFacing = 'left';
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['KeyD']) {
        dx = SPEED;
        walking = true;
        currentFacing = 'right';
      }

      setFacing(currentFacing);
      setIsWalking(walking);

      // Apply horizontal movement & boundaries
      setPosX(prevX => {
        const nextX = prevX + dx;
        const levelWidth = 1000;
        // Clamp between borders
        return Math.max(20, Math.min(levelWidth - 60, nextX));
      });

      // Handle jumping
      const wantToJump = keysPressed.current['ArrowUp'] || keysPressed.current['KeyW'] || keysPressed.current['Space'];
      
      setPosY(prevY => {
        let nextY = prevY;
        let nextVelY = velY;

        if (wantToJump && !isJumping && prevY === GROUND_LEVEL) {
          nextVelY = JUMP_FORCE;
          setIsJumping(true);
          audioEngine.playSound('jump');
        }

        // Apply gravity if in the air
        if (prevY > GROUND_LEVEL || nextVelY > 0) {
          nextVelY -= GRAVITY;
          nextY += nextVelY;
        }

        // Hit the ground
        if (nextY <= GROUND_LEVEL) {
          nextY = GROUND_LEVEL;
          nextVelY = 0;
          setIsJumping(false);
        }

        setVelY(nextVelY);
        return nextY;
      });

      // Cat following logic (simple interpolation)
      setCatX(prevCatX => {
        const targetX = facing === 'right' ? posX - 45 : posX + 45;
        const diffX = targetX - prevCatX;
        return prevCatX + diffX * 0.08;
      });

      setCatY(prevCatY => {
        const diffY = posY - prevCatY;
        return prevCatY + diffY * 0.12;
      });

      gameLoopRef.current = requestAnimationFrame(updatePhysics);
    };

    gameLoopRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [facing, isJumping, posX, posY, velY]);

  // Coin and Key Collisions Check
  useEffect(() => {
    // 1. Coin check
    setCoins(prevCoins => 
      prevCoins.map(coin => {
        if (!coin.collected) {
          // Bounding box collision
          const playerWidth = 35;
          const playerHeight = 60;
          const coinWidth = 20;
          const coinHeight = 20;

          const collideX = posX < coin.x + coinWidth && posX + playerWidth > coin.x;
          const collideY = posY < coin.y + coinHeight && posY + playerHeight > coin.y;

          if (collideX && collideY) {
            audioEngine.playSound('coin');
            onGainXp(10); // Reward XP
            onGainCoins(1); // Earn 1 gold/coin!
            return { ...coin, collected: true };
          }
        }
        return coin;
      })
    );

    // 2. Key check
    const keyX = 540;
    const keyY = 120;
    if (!keyCollected) {
      const collideKeyX = posX < keyX + 24 && posX + 35 > keyX;
      const collideKeyY = posY < keyY + 12 && posY + 60 > keyY;

      if (collideKeyX && collideKeyY) {
        audioEngine.playSound('powerup');
        setKeyCollected(true);
        setHasKey(true);
        onGainXp(100);
      }
    }

    // 3. Castle Portal Door Check
    const doorX = 860;
    const isNearDoor = posX > doorX - 40 && posX < doorX + 40;
    setShowPortalInfo(isNearDoor);

    if (isNearDoor && hasKey && !secretTriggeredRef.current) {
      // Trigger unlock secret — guard with ref so it only fires once per key
      secretTriggeredRef.current = true;
      audioEngine.playSound('start');
      onUnlockSecret();
      setHasKey(false); // Consume key
    }

    // Reset the trigger guard when player moves away from the door,
    // so a newly collected key can open the portal again in the same session
    if (!isNearDoor) {
      secretTriggeredRef.current = false;
    }

  }, [posX, posY, keyCollected, hasKey, onGainXp, onUnlockSecret]);

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
              style={{ left: 540, bottom: 120 }}
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
