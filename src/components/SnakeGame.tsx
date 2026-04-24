import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { Point, Direction, GameState } from '../types';
import { GAME_CONFIG } from '../constants';

interface SnakeGameProps {
  state: GameState;
  setState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ state, setState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(0);
  const lastTickRef = useRef<number>(0);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
        y: Math.floor(Math.random() * GAME_CONFIG.GRID_SIZE),
      };
      if (!snake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (state.isPaused || state.isGameOver) return;

    setState(prev => {
      const head = { ...prev.snake[0] };
      switch (prev.direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      if (
        head.x < 0 || head.x >= GAME_CONFIG.GRID_SIZE ||
        head.y < 0 || head.y >= GAME_CONFIG.GRID_SIZE ||
        prev.snake.some(p => p.x === head.x && p.y === head.y)
      ) {
        return { ...prev, isGameOver: true, highScore: Math.max(prev.highScore, prev.score) };
      }

      const newSnake = [head, ...prev.snake];
      let newScore = prev.score;
      let newFood = prev.food;

      if (head.x === prev.food.x && head.y === prev.food.y) {
        newScore += 50; // Match design point values
        newFood = generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake, score: newScore, food: newFood };
    });
  }, [state.isPaused, state.isGameOver, generateFood, setState]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setState(prev => {
        if (prev.isGameOver) return prev;
        const key = e.key.toLowerCase();
        let newDir: Direction | null = null;
        
        if (key === 'arrowup' || key === 'w') newDir = 'UP';
        if (key === 'arrowdown' || key === 's') newDir = 'DOWN';
        if (key === 'arrowleft' || key === 'a') newDir = 'LEFT';
        if (key === 'arrowright' || key === 'd') newDir = 'RIGHT';

        const opposites: Record<string, string> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
        if (newDir && opposites[newDir] !== prev.direction) {
          return { ...prev, direction: newDir, isPaused: false };
        }
        if (e.code === 'Space') return { ...prev, isPaused: !prev.isPaused };
        return prev;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setState]);

  const gameLoop = useCallback((time: number) => {
    if (time - lastTickRef.current >= GAME_CONFIG.TICK_RATE) {
      moveSnake();
      lastTickRef.current = time;
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(gameLoopRef.current);
  }, [gameLoop]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GAME_CONFIG.GRID_SIZE;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Raw Cyan)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GAME_CONFIG.GRID_SIZE; i++) {
      ctx.beginPath(); ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
    }

    // Draw Snake (Harsh Cyan)
    state.snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? '#00ffff' : '#000000';
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      
      ctx.fillRect(p.x * cellSize, p.y * cellSize, cellSize, cellSize);
      ctx.strokeRect(p.x * cellSize, p.y * cellSize, cellSize, cellSize);
      
      if (i === 0) {
        // Glitch head effect
        ctx.fillStyle = '#ff00ff';
        ctx.fillRect(p.x * cellSize + 4, p.y * cellSize + 4, 4, 4);
      }
    });

    // Draw Food (Magenta Pulse)
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(
        state.food.x * cellSize + 4,
        state.food.y * cellSize + 4,
        cellSize - 8,
        cellSize - 8
    );
    ctx.shadowBlur = 0;

  }, [state]);

  return (
    <section className="flex-1 relative flex items-center justify-center bg-terminal-black border-4 border-glitch-cyan shadow-[4px_4px_0_var(--color-glitch-magenta)] overflow-hidden min-h-[500px]">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="pixel-rendering"
        />
        
        <AnimatePresence>
          {(state.isPaused || state.isGameOver) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-terminal-black/90 backdrop-blur-none"
            >
              {state.isGameOver ? (
                <motion.div
                  initial={{ skewX: 20, opacity: 0 }}
                  animate={{ skewX: 0, opacity: 1 }}
                  className="text-center"
                >
                  <h2 className="text-6xl font-black glitch-text text-glitch-magenta mb-4 tracking-tighter">FATAL_ERROR</h2>
                  <p className="text-glitch-cyan mb-8 uppercase tracking-[0.5em] text-xl font-bold bg-glitch-cyan/10 py-2">DATA_LOSS: {state.score.toLocaleString()}</p>
                  <button
                    onClick={() => setState(prev => ({ 
                        ...prev, 
                        snake: GAME_CONFIG.INITIAL_SNAKE,
                        score: 0,
                        isGameOver: false,
                        isPaused: true,
                        direction: GAME_CONFIG.INITIAL_DIRECTION
                    }))}
                    className="px-12 py-4 bg-glitch-cyan text-terminal-black font-black hover:bg-white active:translate-y-1 transition-all uppercase tracking-[0.3em] text-lg glitch-border"
                  >
                    RE_REBOOT
                  </button>
                </motion.div>
              ) : (
                <div className="text-center">
                  <Play className="w-20 h-20 text-glitch-cyan mx-auto mb-4 animate-[pulse_0.5s_infinite]" />
                  <p className="text-glitch-magenta uppercase tracking-[0.4em] font-black text-xl glitch-text">SYS_STANDBY_MODE</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-4 left-4 text-glitch-cyan font-bold tracking-tighter uppercase p-2 border-2 border-glitch-cyan/50 bg-terminal-black">
          CMD: <span className="text-glitch-magenta">MOV_DIR</span> [WASD/ARROWS]
        </div>
    </section>
  );
};
