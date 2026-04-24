export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface Point {
  x: number;
  y: number;
}

export interface GameState {
  snake: Point[];
  food: Point;
  direction: Direction;
  score: number;
  isPaused: boolean;
  isGameOver: boolean;
  highScore: number;
}

export interface GameContextType {
  state: GameState;
  resetGame: () => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}
