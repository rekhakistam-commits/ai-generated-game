import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Pulse',
    artist: 'AI Voyager',
    coverUrl: 'https://picsum.photos/seed/neon1/800/800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder audio
  },
  {
    id: '2',
    title: 'Cyber Drift',
    artist: 'Digital Ghost',
    coverUrl: 'https://picsum.photos/seed/neon2/800/800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder audio
  },
  {
    id: '3',
    title: 'Synth Sky',
    artist: 'Retro Wave',
    coverUrl: 'https://picsum.photos/seed/neon3/800/800',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder audio
  },
];

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  INITIAL_SNAKE: [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ],
  INITIAL_DIRECTION: 'UP' as const,
  TICK_RATE: 120, // ms
};
