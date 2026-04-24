import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, AudioLines } from 'lucide-react';
import { TRACKS } from '../constants';

interface MusicPlayerProps {
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  currentIndex, 
  setCurrentIndex, 
  isPlaying, 
  setIsPlaying 
}) => {
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentIndex];

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = useCallback(() => {
    setCurrentIndex((currentIndex + 1) % TRACKS.length);
    setIsPlaying(true);
    setProgress(0);
  }, [currentIndex, setCurrentIndex, setIsPlaying]);

  const prevTrack = () => {
    setCurrentIndex((currentIndex - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
    setProgress(0);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex, isPlaying, setIsPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [nextTrack]);

  return (
    <div className="w-80 flex flex-col items-center justify-between py-6 h-full bg-terminal-black border-l-4 border-glitch-magenta p-4">
      <audio ref={audioRef} src={currentTrack.audioUrl} />
      
      <div className="text-center w-full">
        <div className="w-64 h-64 mx-auto bg-terminal-black border-2 border-glitch-cyan relative overflow-hidden glitch-border">
          <div className="absolute inset-0 bg-glitch-cyan/10 animate-pulse pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center mix-blend-difference">
             <motion.img 
                key={currentTrack.id}
                initial={{ filter: 'grayscale(1) invert(0)', opacity: 0 }}
                animate={{ filter: 'grayscale(1) invert(0)', opacity: 0.8 }}
                src={currentTrack.coverUrl}
                className="w-full h-full object-cover pixel-rendering"
             />
          </div>
          <div className="absolute inset-0 crt-overlay opacity-40" />
        </div>
        
        <div className="mt-6 text-left border-l-4 border-glitch-cyan pl-4 bg-glitch-cyan/5 py-4">
          <motion.h2 
            key={currentTrack.title}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-2xl font-black text-glitch-magenta glitch-text italic"
          >
            {currentTrack.title}
          </motion.h2>
          <motion.p 
            key={currentTrack.artist}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-glitch-cyan text-sm mt-2 tracking-[0.3em] font-mono font-bold"
          >
            SND_SRC: {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-6 w-full border-2 border-glitch-cyan bg-terminal-black p-0.5 overflow-hidden">
            <motion.div 
                className="h-full bg-glitch-magenta"
                style={{ width: `${progress}%` }}
                animate={{ skewX: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between font-bold text-[12px] text-glitch-cyan">
            <span className="bg-glitch-cyan text-terminal-black px-1">T:{formatTime(currentTime)}</span>
            <span className="bg-glitch-magenta text-terminal-black px-1">D:{formatTime(duration || 0)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={prevTrack} className="h-16 flex items-center justify-center border-2 border-glitch-cyan text-glitch-cyan hover:bg-glitch-cyan hover:text-terminal-black transition-all font-black">
            <SkipBack size={32} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="h-16 flex items-center justify-center bg-glitch-magenta text-terminal-black shadow-[4px_4px_0_var(--color-glitch-cyan)] active:translate-y-1 active:translate-x-1 transition-all"
          >
            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} className="translate-x-1" fill="currentColor" />}
          </button>

          <button onClick={nextTrack} className="h-16 flex items-center justify-center border-2 border-glitch-cyan text-glitch-cyan hover:bg-glitch-cyan hover:text-terminal-black transition-all font-black">
            <SkipForward size={32} />
          </button>
        </div>

        <div className="p-2 border-2 border-glitch-magenta/30 bg-glitch-magenta/5">
            <p className="text-[10px] text-glitch-magenta font-black tracking-[0.5em] animate-pulse">OUTPUT_SIGNAL_STABLE</p>
        </div>
      </div>
    </div>
  );
};
