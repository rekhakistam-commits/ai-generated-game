import React from 'react';

export const NeonBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 -z-10 bg-terminal-black overflow-hidden">
            {/* High intensity magenta/cyan flares */}
            <div 
                className="absolute top-0 left-0 w-full h-[2px] bg-glitch-magenta/30 animate-[scanline_4s_linear_infinite]"
            />
            <div 
                className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-glitch-cyan/5 blur-[120px] mix-blend-screen"
            />
            <div 
                className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-glitch-magenta/5 blur-[120px] mix-blend-screen"
            />
            
            {/* Distorted Grid */}
            <div 
                className="absolute inset-0 opacity-[0.1] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(var(--color-glitch-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-glitch-cyan) 1px, transparent 1px)`,
                    backgroundSize: '20px 20px',
                    transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
                }}
            />

            {/* Noise Overlays */}
            <div className="absolute inset-0 static-noise pointer-events-none" />
            <div className="absolute inset-0 crt-overlay pointer-events-none" />
        </div>
    );
};

