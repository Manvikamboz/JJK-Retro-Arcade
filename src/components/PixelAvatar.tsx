import React from 'react';

interface PixelArtProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  animate?: boolean;
}

// Helper to convert a string grid to SVG rects
const renderPixelGrid = (grid: string[], colors: Record<string, string>, width: number, height: number) => {
  const rects: React.ReactNode[] = [];
  for (let y = 0; y < height; y++) {
    const row = grid[y] || "";
    for (let x = 0; x < width; x++) {
      const char = row[x];
      if (char && char !== '.' && colors[char]) {
        rects.push(
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={colors[char]}
            shapeRendering="crispEdges"
          />
        );
      }
    }
  }
  return <g>{rects}</g>;
};

// 1. Nobara Kugisaki Avatar (18x21 grid)
export const NobaraAvatar: React.FC<PixelArtProps> = ({ size = 120, className, ...props }) => {
  const colors: Record<string, string> = {
    '.': 'transparent',
    'k': '#1a1c2c', // Outline/Black shoes
    'w': '#ffffff', // White
    's': '#f4b990', // Skin tone
    'h': '#e67e22', // Ginger/orange hair
    'e': '#d35400', // Dark ginger hair shadow
    'u': '#1F243E', // Navy uniform
    'y': '#ffd54f', // Gold button
    'b': '#5d4037', // Brown belt
    'r': '#ff3838', // Red mouth
  };

  const avatarGrid = [
    "......hhhhhh......",
    "....hhhhhhhhhh....",
    "...hhhhhhhhhhhh...",
    "..hhhhsssssshhhh..",
    "..hhkssssssskhhh..",
    ".hhksssssssssskhh.",
    ".hhkssskssksskhh..",
    ".hhksswkskwssehh..",
    "..hksskksskksehh..",
    "..hkssssrssssehh..",
    "...hsssssssssehh..",
    "....sssssssshh....",
    ".....uuuuuu.......",
    "....uuuuuuuu......",
    "...uuyuuuuuyuu....",
    "..uuuuuuuuuuuu....",
    "..uuubbbbbbbbu....",
    "...uuuuuuuuuu.....",
    "....uuuuuuuu......",
    "....uuk..kuu......",
    "....kk....kk......"
  ];

  const w = 18;
  const h = 21;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {renderPixelGrid(avatarGrid, colors, w, h)}
    </svg>
  );
};

// 2. White Pixel Cat (16x16)
export const PixelCat: React.FC<PixelArtProps> = ({ size = 60, className, ...props }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c', // Outline
    'w': '#ffffff', // Fur
    'g': '#a7f070', // Green grey shadow
    'p': '#ff7b94', // Pink inner ears/nose
    'b': '#4fc3f7', // Blue eyes
  };

  const grid = [
    "....w.....w.....",
    "...wpw...wpw....",
    "..wwwww.wwwww...",
    ".wwwwwwwwwwwww..",
    ".wwwbwwwwwbwww..",
    ".wwwwwpwpwwwww..",
    "..wwwwwwwkwww...",
    "...wwwwwwwww....",
    "..wwwwwwwwwww...",
    ".wwwwwwwwwwwww..",
    "wwwwwwwwwwwwww.w",
    "wwwwwwwwwwwwww.w",
    "w.ww.ww.ww.ww.ww",
    "k.kk.kk.kk.kk.kk"
  ];

  return (
    <svg
      viewBox="0 0 16 14"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {renderPixelGrid(grid, colors, 16, 14)}
    </svg>
  );
};

// 3. Yellow Pixel Star (8x8)
export const PixelStar: React.FC<PixelArtProps> = ({ size = 24, className, animate = true, ...props }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'y': '#ffd54f', // Bright yellow
    'o': '#ffb300', // Darker yellow/orange
    'w': '#ffffff', // Highlight
  };

  const grid = [
    "...kk...",
    "..kyyk..",
    ".kywwyk.",
    "kkkwwkkk",
    ".kyyyyk.",
    "..kyyk..",
    ".kyyyyk.",
    "kk....kk"
  ];

  return (
    <svg
      viewBox="0 0 8 8"
      width={size}
      height={size}
      className={`${className} ${animate ? 'animate-bounce' : ''}`}
      style={{ animationDuration: '1.5s' }}
      {...props}
    >
      {renderPixelGrid(grid, colors, 8, 8)}
    </svg>
  );
};

// 4. Gold Coin (8x8)
export const PixelCoin: React.FC<PixelArtProps> = ({ size = 20, className, ...props }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'y': '#ffeb3b',
    'o': '#f57f17',
    'w': '#ffffff'
  };

  const grid = [
    "..kkkk..",
    ".kyyyyok.",
    "kyywwyyok",
    "kyywwyyok",
    "kyyyyyyok",
    "kyyyyyyok",
    ".kyyyyok.",
    "..kkkk.."
  ];

  return (
    <svg
      viewBox="0 0 9 8"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {renderPixelGrid(grid, colors, 9, 8)}
    </svg>
  );
};

// 5. Golden Key (16x8)
export const PixelKey: React.FC<PixelArtProps> = ({ size = 24, className, ...props }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'y': '#ffca28',
    'o': '#ff8f00',
    'w': '#ffffff'
  };

  const grid = [
    "....kkkkkk......",
    "...kyyyywwk.....",
    "..kyykkkyywkkkk.",
    "..kyykkkyyyyyywk",
    "..kyykkkyywkkkky",
    "...kyyyywwk...kk",
    "....kkkkkk......"
  ];

  return (
    <svg
      viewBox="0 0 16 7"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {renderPixelGrid(grid, colors, 16, 7)}
    </svg>
  );
};

// 6. Mario Green Pipe (16x16)
export const PixelPipe: React.FC<PixelArtProps> = ({ size = 50, className, ...props }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'g': '#4caf50', // Mid green
    'l': '#81c784', // Light green
    'd': '#2e7d32', // Dark green
  };

  const grid = [
    "kkkkkkkkkkkkkkkk",
    "kllllllllgdddddk",
    "kllllllllgdddddk",
    "kkkkkkkkkkkkkkkk",
    ".kllllllgdddddk.",
    ".kllllllgdddddk.",
    ".kllllllgdddddk.",
    ".kllllllgdddddk.",
    ".kllllllgdddddk.",
    ".kllllllgdddddk.",
    ".kllllllgdddddk.",
    ".kllllllgdddddk."
  ];

  return (
    <svg
      viewBox="0 0 16 12"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {renderPixelGrid(grid, colors, 16, 12)}
    </svg>
  );
};

// 7. Piranha Plant (16x16)
export const PixelPiranha: React.FC<PixelArtProps> = ({ size = 32, className, ...props }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'r': '#f44336', // Red
    'w': '#ffffff', // White teeth/dots
    'g': '#4caf50', // Green leaves
    'y': '#ffeb3b', // Inside mouth yellow
  };

  const grid = [
    "......kkkk......",
    "....kkrrwwkk....",
    "...krrwwrrwwk...",
    "..krrwyyyywrrk..",
    "..kwwyyyyyywwk..",
    "...kkwwwwwkkk...",
    "....kwwwwwk.....",
    ".....kgggk......",
    "....kgggggk.....",
    "...kggkkkggk....",
    "....k.k..k.k...."
  ];

  return (
    <svg
      viewBox="0 0 16 11"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {renderPixelGrid(grid, colors, 16, 11)}
    </svg>
  );
};

// 8. Castle Door/Portal (24x24)
export const PixelCastleDoor: React.FC<PixelArtProps> = ({ size = 60, className, ...props }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'g': '#90a4ae', // Grey brick
    'd': '#455a64', // Dark grey
    'w': '#b0bec5', // Light grey brick
    'b': '#795548', // Brown wood door
    'y': '#ffd54f', // Door handle gold
    'p': '#5c3a21', // Dark brown wood
  };

  const grid = [
    "......kkkkkkkk......",
    "....kkggwwddggkk....",
    "...kggwwddggwwddk...",
    "..kggwwddkkddggwwk..",
    ".kggwwddkkkkddggwwk.",
    ".kggwwdkkbbkkddgwwk.",
    "kggwwdkkbbbbkkdggwwk",
    "kggwwdkkbbbbkkdggwwk",
    "kggwwdkkbpypkkdggwwk",
    "kggwwdkkbbbbkkdggwwk",
    "kggwwdkkbbbbkkdggwwk",
    "kggwwdkkbbbbkkdggwwk",
    "kkkkkkkkkkkkkkkkkkkk"
  ];

  return (
    <svg
      viewBox="0 0 20 13"
      width={size}
      height={size}
      className={className}
      {...props}
    >
      {renderPixelGrid(grid, colors, 20, 13)}
    </svg>
  );
};

// 9. Weapon Brand SVGs (Custom pixelated styled logos for Nobara's tools)
export const HammerPixelIcon: React.FC<PixelArtProps> = ({ size = 24, className }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'h': '#ff7b94', // Pink heart motif
    's': '#90a4ae', // Steel hammer head
    'w': '#ffffff', // Steel highlight
    'b': '#795548', // Brown handle
  };

  const grid = [
    "...kk.....",
    "..ksswk...",
    ".kssshwk..",
    "..ksswk...",
    "...kbk....",
    "....bk....",
    "....bk....",
    "....bk....",
    "....kk....",
    ".........."
  ];

  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className}>
      {renderPixelGrid(grid, colors, 10, 10)}
    </svg>
  );
};

export const NailsPixelIcon: React.FC<PixelArtProps> = ({ size = 24, className }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    's': '#b0bec5', // Silver nail body
    'w': '#ffffff', // Shine
    'c': '#29b6f6', // Cyan blue cursed sparks
  };

  // Let's make sure the grid is exactly 10 rows
  const cleanGrid = [
    "..kkk.....",
    ".kssswk...",
    "..ksk.....",
    "...sk..cc.",
    "...sk.c..c",
    "...sk..cc.",
    "...sk.....",
    "...sk.....",
    "...k......",
    ".........."
  ];

  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className}>
      {renderPixelGrid(cleanGrid, colors, 10, 10)}
    </svg>
  );
};

export const StrawDollPixelIcon: React.FC<PixelArtProps> = ({ size = 24, className }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'y': '#ffd54f', // Straw yellow
    'o': '#ffb300', // Shadow straw
    'r': '#e53935', // Red heart/nail spot
  };

  const grid = [
    "...kkk....",
    "..kyyyk...",
    ".kyyryyk..",
    "..kyyyk...",
    "kkkyyykkk.",
    "kyyyyyyyk.",
    ".kyyyyyk..",
    "..kyyyk...",
    "..ky.yk...",
    "..kk.kk..."
  ];

  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className}>
      {renderPixelGrid(grid, colors, 10, 10)}
    </svg>
  );
};

export const RubberMalletPixelIcon: React.FC<PixelArtProps> = ({ size = 24, className }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'r': '#ef5350', // Red rubber head
    'w': '#ffffff',
    'b': '#8d6e63', // Wooden handle
  };

  const grid = [
    "..kkkk....",
    ".krrrwk...",
    ".krrrwk...",
    "..kkkk....",
    "...kbk....",
    "....bk....",
    "....bk....",
    "....bk....",
    "....kk....",
    ".........."
  ];

  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className}>
      {renderPixelGrid(grid, colors, 10, 10)}
    </svg>
  );
};

export const CursedEnergyPixelIcon: React.FC<PixelArtProps> = ({ size = 24, className }) => {
  const colors: Record<string, string> = {
    'k': '#1a1c2c',
    'b': '#00e5ff', // Cyan blue cursed flame
    'd': '#2979ff', // Darker blue flame
    'w': '#ffffff', // Flame core
  };

  const grid = [
    "....kk....",
    "...kbbk...",
    "..kbwwbk..",
    ".kbwddwbk.",
    "kbbddddbbk",
    "kbddddddbk",
    ".kbddddbk.",
    "..kbddbk..",
    "...kkkk...",
    ".........."
  ];

  return (
    <svg viewBox="0 0 10 10" width={size} height={size} className={className}>
      {renderPixelGrid(grid, colors, 10, 10)}
    </svg>
  );
};
