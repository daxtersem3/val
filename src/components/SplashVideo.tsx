import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';

interface SplashVideoProps {
  onFinish: () => void;
}

export const SplashVideo: React.FC<SplashVideoProps> = ({ onFinish }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);

  // HARD 5-second auto-skip timer
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFinish();
    }, 5000);
    return () => clearTimeout(timeout);
  }, [onFinish]);

  // Progress bar animation (0 -> 100 in 5 seconds)
  useEffect(() => {
    let frame: number;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.floor((elapsed / 5000) * 100));
      setProgress(pct);
      if (pct < 100) {
        frame = requestAnimationFrame(tick);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      video.play().catch(() => {
        setIsMuted(true);
      });
    };

    const handleError = () => {
      setVideoFailed(true);
    };

    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('error', handleError);

    const fallbackTimer = setTimeout(() => {
      if (video.readyState < 2) {
        setVideoFailed(true);
      }
    }, 1500);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('error', handleError);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black overflow-hidden select-none"
    >
      {/* Pure Video Animation Background */}
      {!videoFailed ? (
        <video
          ref={videoRef}
          src="/intro-video.mp4"
          playsInline
          muted={isMuted}
          autoPlay
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-80 filter brightness-95"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
      )}

      {/* Subtle Bottom & Top Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 pointer-events-none" />

      {/* Top Bar: Minimal Audio Toggle */}
      <div className="relative z-10 w-full max-w-6xl p-6 flex justify-end items-center">
        {!videoFailed && (
          <button
            onClick={toggleMute}
            className="p-3 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/80 rounded-full text-white backdrop-blur-md transition-all flex items-center gap-2 text-xs font-semibold"
            title={isMuted ? "Ativar Áudio" : "Mutar Áudio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-yellow-400" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
            <span className="hidden sm:inline">{isMuted ? 'SEM SOM' : 'COM SOM'}</span>
          </button>
        )}
      </div>

      {/* Empty Center Space */}
      <div className="flex-1" />

      {/* Footer Controls & Progress Bar */}
      <div className="relative z-10 w-full max-w-xl p-6 flex flex-col items-center gap-4 mb-4">
        <div className="w-full bg-zinc-800/80 rounded-full h-2 overflow-hidden border border-zinc-700/50 p-0.5 backdrop-blur-md">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5, ease: 'linear' }}
            className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-amber-300 h-full rounded-full"
          />
        </div>

        <div className="flex justify-between items-center w-full text-xs text-zinc-400 font-semibold">
          <span className="flex items-center gap-1.5 text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            Carregando... {progress}%
          </span>

          <button
            onClick={onFinish}
            className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-extrabold rounded-full flex items-center gap-2 transition-all hover:scale-105 shadow-[0_0_20px_rgba(250,204,21,0.4)]"
          >
            ENTRAR NA LOJA
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
