/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { NeonBackground } from './components/NeonBackground';
import { Headphones, Terminal, Play, Pause } from 'lucide-react';
import { TRACKS, GAME_CONFIG } from './constants';
import { GameState } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    snake: GAME_CONFIG.INITIAL_SNAKE,
    food: { x: 5, y: 5 },
    direction: GAME_CONFIG.INITIAL_DIRECTION,
    score: 0,
    isPaused: true,
    isGameOver: false,
    highScore: 0,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: GAME_CONFIG.INITIAL_SNAKE,
      score: 0,
      isGameOver: false,
      isPaused: true,
      direction: GAME_CONFIG.INITIAL_DIRECTION,
    }));
  };

  return (
    <div className="w-full h-screen bg-terminal-black text-glitch-cyan flex flex-col font-mono overflow-hidden relative">
      <NeonBackground />
      <div className="absolute inset-0 static-noise opacity-10 pointer-events-none" />

      {/* Cryptic Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b-4 border-glitch-cyan bg-terminal-black z-20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-glitch-cyan flex items-center justify-center glitch-border">
             <Terminal size={32} className="text-terminal-black" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white glitch-text italic">
                SNAKE_PROTOCOL<span className="text-glitch-magenta">_V4</span>
            </h1>
            <p className="text-[10px] text-glitch-magenta font-black tracking-[0.4em] transform -translate-y-1">AUTHORIZED_ACCESS_ONLY</p>
          </div>
        </div>
        
        <div className="flex space-x-12 items-center">
          <div className="flex space-x-8 bg-glitch-cyan/10 border-l-4 border-glitch-cyan px-8 py-2">
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-glitch-magenta mb-1">SCORE:DATA</span>
              <span className="text-2xl font-black leading-none tracking-tighter text-white">
                {gameState.score.toString().padStart(6, '0')}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-glitch-cyan mb-1">MAX:MEMORY</span>
              <span className="text-2xl font-black leading-none tracking-tighter text-glitch-cyan opacity-80">
                {gameState.highScore.toString().padStart(6, '0')}
              </span>
            </div>
          </div>
          <button 
            onClick={resetGame}
            className="px-8 py-3 bg-glitch-magenta text-terminal-black font-black hover:bg-white active:scale-95 transition-all uppercase text-[14px] tracking-[0.2em] glitch-border"
          >
            SYS_RESET
          </button>
        </div>
      </header>

      {/* Main Grid Viewport */}
      <main className="flex-1 flex p-8 gap-8 overflow-hidden z-10">
        
        {/* Left Column: Data Streams */}
        <section className="w-80 flex flex-col space-y-6">
          <h3 className="text-[12px] uppercase tracking-[0.5em] text-glitch-magenta font-black flex items-center gap-2 border-b-2 border-glitch-magenta pb-2">
            AUDIO_STREAMS
          </h3>
          <div className="space-y-2 overflow-y-auto pr-2 flex-1">
            {TRACKS.map((track, index) => {
              const isActive = index === currentIndex;
              return (
                <div 
                    key={track.id}
                    onClick={() => {
                        setCurrentIndex(index);
                        setIsPlaying(true);
                    }}
                    className={`p-4 transition-all border-2 flex items-center gap-4 cursor-pointer ${
                        isActive 
                        ? 'bg-glitch-cyan text-terminal-black border-white' 
                        : 'bg-terminal-black border-glitch-cyan/30 text-glitch-cyan hover:border-glitch-cyan'
                    }`}
                >
                    <span className="text-xs font-black opacity-40">[{index.toString().padStart(2, '0')}]</span>
                    <div className="flex-1 overflow-hidden">
                        <p className={`text-sm font-black truncate uppercase ${isActive ? 'italic' : ''}`}>
                            {track.title}
                        </p>
                    </div>
                    {isActive && isPlaying && <div className="w-2 h-2 bg-glitch-magenta animate-ping" />}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-glitch-cyan/5 border-2 border-glitch-cyan/20">
            <p className="text-[10px] text-glitch-cyan mb-2 font-black tracking-widest border-b border-glitch-cyan/20 pb-1">KERNEL_LOG</p>
            <div className="space-y-1 font-mono text-[9px] text-glitch-cyan/60 uppercase">
              <p>Buffer overflow suppressed...</p>
              <p>Rhythm sync established.</p>
              <p className="text-glitch-magenta animate-pulse italic">Awaiting critical input.</p>
            </div>
          </div>
        </section>

        {/* Center: Grid Engine */}
        <SnakeGame state={gameState} setState={setGameState} />

        {/* Right Column: Signal Modulation */}
        <MusicPlayer 
          currentIndex={currentIndex} 
          setCurrentIndex={setCurrentIndex} 
          isPlaying={isPlaying} 
          setIsPlaying={setIsPlaying} 
        />
      </main>

      {/* Footer Meta: Terminal */}
      <footer className="h-12 bg-terminal-black border-t-4 border-glitch-magenta px-8 flex items-center justify-between z-20">
        <div className="flex space-x-12 text-[11px] text-glitch-cyan font-black tracking-[0.4em]">
          <span className="hover:text-white cursor-pointer transition-colors italic">PR_SETTING</span>
          <span className="hover:text-white cursor-pointer transition-colors italic">NEURAL_DRIVE</span>
          <span className="hover:text-white cursor-pointer transition-colors italic">CORE_DUMP</span>
        </div>
        <div className="text-[11px] font-mono text-glitch-magenta font-black uppercase tracking-[0.3em]">
          ENCRYPTION: AES-256_ACTIVE // SIGNAL: 42.9_GHZ
        </div>
      </footer>
    </div>
  );
}
