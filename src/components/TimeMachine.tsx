import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Play, Pause, History, X, Camera } from 'lucide-react';
import { historicalEvents } from '../data';

interface TimeMachineProps {
  year: number;
  onYearChange: (year: number) => void;
}

export default function TimeMachine({ year, onYearChange }: TimeMachineProps) {
  const currentYear = 2026;
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(1);
  const [showEvent, setShowEvent] = useState(true);
  const [snapshots, setSnapshots] = useState<number[]>([]);

  const event = historicalEvents.find(e => e.year === year);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      onYearChange(Math.min(2100, year + 1));
      if (year >= 2100) setIsPlaying(false);
    }, 1000 / playSpeed);
    return () => clearInterval(interval);
  }, [isPlaying, year, playSpeed, onYearChange]);

  const handleSnapshot = () => {
    setSnapshots(prev => [...prev, year]);
  };

  const getTimeBadge = () => {
    if (year < currentYear) return { label: '📚 Historical Data', color: 'rgba(107,114,128,0.3)', border: 'rgba(107,114,128,0.5)' };
    if (year === currentYear) return { label: '🔴 Live Data', color: 'rgba(239,68,68,0.2)', border: 'rgba(239,68,68,0.5)' };
    return { label: '🔮 Predictions', color: 'rgba(139,92,246,0.2)', border: 'rgba(139,92,246,0.5)' };
  };

  const badge = getTimeBadge();

  return (
    <>
      <div className="fixed top-16 left-0 right-0 z-40 glass"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.1)', height: '56px' }}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-full flex items-center gap-4">
          {/* Today button */}
          <button className="btn-ghost text-xs flex items-center gap-1.5 shrink-0"
            onClick={() => onYearChange(currentYear)}>
            <Calendar className="w-3.5 h-3.5" />
            Today
          </button>

          {/* Year navigation */}
          <div className="flex items-center gap-1 shrink-0">
            <button className="btn-ghost p-1.5" onClick={() => onYearChange(Math.max(1900, year - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-center min-w-[90px]">
              <div className="text-xl font-bold font-mono tabular-nums">{year}</div>
              <div className="text-[10px] text-gray-500">
                {year < currentYear && `${currentYear - year}y ago`}
                {year === currentYear && 'Present'}
                {year > currentYear && `+${year - currentYear}y`}
              </div>
            </div>
            <button className="btn-ghost p-1.5" onClick={() => onYearChange(Math.min(2100, year + 1))}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Play controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              className={`p-1.5 rounded-lg transition-all ${isPlaying ? 'bg-purple-600 text-white' : 'btn-ghost'}`}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <select
              value={playSpeed}
              onChange={(e) => setPlaySpeed(Number(e.target.value))}
              className="bg-transparent border border-gray-700 rounded px-2 py-1 text-xs text-gray-400 outline-none"
            >
              <option value={1}>1x</option>
              <option value={5}>5x</option>
              <option value={10}>10x</option>
              <option value={50}>50x</option>
            </select>
          </div>

          {/* Timeline slider */}
          <div className="flex-1 hidden sm:block max-w-2xl mx-4">
            <input
              type="range"
              min={1900}
              max={2100}
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="slider-cosmos"
            />
            <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
              <span>1900</span>
              <span className="font-semibold text-gray-400">{currentYear}</span>
              <span>2100</span>
            </div>
          </div>

          {/* Time badge */}
          <div className="shrink-0 hidden lg:flex items-center gap-2">
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: badge.color, border: `1px solid ${badge.border}` }}>
              {badge.label}
            </span>
            {year !== currentYear && (
              <button className="btn-ghost text-xs flex items-center gap-1" onClick={handleSnapshot}>
                <Camera className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Historical event toast */}
      <AnimatePresence>
        {event && showEvent && (
          <motion.div
            key={event.year}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[120px] left-1/2 -translate-x-1/2 z-30 max-w-md"
            style={{
              background: 'rgba(88,28,135,0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(139,92,246,0.4)',
              borderRadius: '12px',
              padding: '12px 16px',
            }}
          >
            <div className="flex items-start gap-3">
              <History className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-purple-300 mb-1">
                  {year} — {event.category === 'prediction' ? 'Prediction' : 'Historical Event'}
                </div>
                <div className="text-xs text-gray-300">{event.event}</div>
              </div>
              <button onClick={() => setShowEvent(false)}
                className="text-gray-500 hover:text-gray-300 transition">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Future prediction warning */}
      {year > currentYear && (
        <div className="fixed top-[120px] right-4 z-30 max-w-xs hidden xl:block"
          style={{
            background: 'rgba(120,53,15,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: '10px',
            padding: '10px 14px',
          }}>
          <div className="text-xs text-amber-300 font-semibold mb-1">⚠️ Predictive Data</div>
          <div className="text-[11px] text-amber-200/70">
            Confidence: {Math.max(30, 100 - (year - currentYear) * 2)}%
          </div>
        </div>
      )}
    </>
  );
}
