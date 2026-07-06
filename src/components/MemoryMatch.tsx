import React, { useState, useEffect } from 'react';
import { audioEngine } from './AudioEngine';
import { Language } from '../data';
import { uiTranslations } from '../translations';

interface MemoryMatchProps {
  lang: Language;
  onGainXp: (amount: number) => void;
  onGainCoins: (amount: number) => void;
  isUnlocked: boolean;
}

interface Card {
  id: number;
  symbol: string;
  label: { en: string; ja: string };
  isFlipped: boolean;
  isMatched: boolean;
}

const SHIELD_ITEMS = [
  { symbol: '🔨', label: { en: 'Metal Hammer', ja: '金槌' } },
  { symbol: '📌', label: { en: 'Cursed Nails', ja: '釘' } },
  { symbol: '🎎', label: { en: 'Straw Doll', ja: '藁人形' } },
  { symbol: '⚡', label: { en: 'Resonance', ja: '共鳴り' } },
  { symbol: '💥', label: { en: 'Hairpin', ja: '簪' } },
  { symbol: '🗼', label: { en: 'Tokyo High', ja: '都立呪術高専' } },
  { symbol: '🛍️', label: { en: 'Shopping', ja: '買い物' } },
  { symbol: '🍉', label: { en: 'Watermelon', ja: '西瓜' } }
];

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ lang, onGainXp, onGainCoins, isUnlocked }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  // Initialize cards
  useEffect(() => {
    if (isUnlocked) {
      initializeGame();
    }
  }, [isUnlocked]);

  const initializeGame = () => {
    // Duplicate symbols to make 8 pairs
    const deck = [...SHIELD_ITEMS, ...SHIELD_ITEMS]
      .map((item, index) => ({
        id: index,
        symbol: item.symbol,
        label: item.label,
        isFlipped: false,
        isMatched: false
      }))
      // Shuffle
      .sort(() => Math.random() - 0.5);
    
    setCards(deck);
    setSelectedIndices([]);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (clickedIdx: number) => {
    // Ignore if already matched, flipped, or if two cards are already active
    if (
      cards[clickedIdx].isMatched ||
      cards[clickedIdx].isFlipped ||
      selectedIndices.length >= 2
    ) {
      return;
    }

    audioEngine.playSound('select');
    
    // Flip card
    const nextCards = [...cards];
    nextCards[clickedIdx].isFlipped = true;
    setCards(nextCards);

    const nextSelected = [...selectedIndices, clickedIdx];
    setSelectedIndices(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(m => m + 1);
      const [firstIdx, secondIdx] = nextSelected;

      // Check match
      if (cards[firstIdx].label === cards[secondIdx].label) {
        // MATCH FOUND
        setTimeout(() => {
          audioEngine.playSound('coin');
          const matchedCards = nextCards.map((c, i) => {
            if (i === firstIdx || i === secondIdx) {
              return { ...c, isMatched: true };
            }
            return c;
          });
          setCards(matchedCards);
          setSelectedIndices([]);
          onGainXp(30); // match reward
          onGainCoins(10); // match coins

          // Check Win Condition
          const allMatched = matchedCards.every(c => c.isMatched);
          if (allMatched) {
            setIsWon(true);
            audioEngine.playSound('powerup');
            onGainXp(200); // completion bonus
            onGainCoins(50); // completion coins bonus
          }
        }, 500);
      } else {
        // MISMATCH
        setTimeout(() => {
          audioEngine.playSound('click');
          const flippedBackCards = nextCards.map((c, i) => {
            if (i === firstIdx || i === secondIdx) {
              return { ...c, isFlipped: false };
            }
            return c;
          });
          setCards(flippedBackCards);
          setSelectedIndices([]);
        }, 1000);
      }
    }
  };

  if (!isUnlocked) {
    return (
      <div className="game-locked-placeholder">
        <div className="locked-shield">🔒</div>
        <h3>{uiTranslations.zone3Title[lang]}</h3>
        <p className="text-pink">
          {lang === 'en' ? "LOCKED! Reach level 7 to unlock this cognitive core." : "ロックされています！このパズルを開始するにはレベル7に到達してください。"}
        </p>
      </div>
    );
  }

  return (
    <div className="memory-match-game">
      {/* Game HUD */}
      <div className="shooter-hud">
        <div className="hud-metric text-glow-green">{lang === 'en' ? 'MOVES' : '手数'}: {moves}</div>
        <div className="hud-title-mini">{uiTranslations.zone3Title[lang]}</div>
        <div className="hud-metric text-glow-yellow">
          {isWon ? (lang === 'en' ? "QUEST CLEARED!" : "クエスト達成！") : (lang === 'en' ? "MATCH THE COGNITIVE SYMBOLS" : "同じシンボルのカードを揃えよう")}
        </div>
      </div>

      {isWon ? (
        <div className="memory-victory-screen">
          <h2 className="text-glow-yellow">{lang === 'en' ? 'VICTORY!' : '完全勝利！'}</h2>
          <p className="mt-2">
            {lang === 'en' ? "You cleared the cognitive matching board and unlocked the cognitive core buffer." : "思考同調ボードを全消去し、記憶コアバッファを解放しました。"}
          </p>
          <div className="bonus-xp-banner text-glow-green mt-3">
            {lang === 'en' ? '+200 XP BONUS RECEIVED' : '＋200 XPボーナス獲得'}
          </div>
          <button className="pixel-start-btn mt-6" onClick={initializeGame}>
            {lang === 'en' ? 'REPLAY MISSION' : '任務再挑戦'}
          </button>
        </div>
      ) : (
        <div className="memory-grid-container">
          {cards.map((card, idx) => (
            <div 
              key={card.id}
              className={`memory-card-box ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(idx)}
            >
              <div className="card-face card-back">
                <span className="card-mystery-symbol">?</span>
              </div>
              <div className="card-face card-front">
                <span className="card-icon">{card.symbol}</span>
                <span className="card-label">{card.label[lang]}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="game-keyboard-tip mt-4">
        {lang === 'en' ? (
          <>🧠 Select cards sequentially to match Nobara's combat tools and interests. Match all 8 pairs to win!</>
        ) : (
          <>🧠 カードを順番に選択し、野薔薇の戦闘道具や好物を揃えてください。全8ペア揃うと勝利！</>
        )}
      </div>
    </div>
  );
};
