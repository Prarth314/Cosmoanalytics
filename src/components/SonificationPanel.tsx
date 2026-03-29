import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Square, Download } from 'lucide-react';
import type { Asteroid, Exoplanet, Meteorite } from '../types';

interface SonificationPanelProps {
  mode: 'asteroids' | 'meteorites' | 'exoplanets';
  asteroids?: Asteroid[];
  meteorites?: Meteorite[];
  exoplanets?: Exoplanet[];
}

export default function SonificationPanel({ mode, asteroids = [], meteorites = [], exoplanets = [] }: SonificationPanelProps) {
  const [enabled, setEnabled] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);
  const stopRef = useRef(false);
  const toneRef = useRef<any>(null);
  const synthsRef = useRef<Record<string, any>>({});

  const loadTone = async () => {
    if (!toneRef.current) {
      toneRef.current = await import('tone');
    }
    return toneRef.current;
  };

  const initSynths = useCallback(async () => {
    const Tone = await loadTone();
    await Tone.start();
    if (!synthsRef.current.M) {
      synthsRef.current = {
        M: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.01, decay: 0.3, sustain: 0.2, release: 0.5 } }).toDestination(),
        C: new Tone.Synth({ oscillator: { type: 'sawtooth' }, envelope: { attack: 0.05, decay: 0.4, sustain: 0.3, release: 0.8 } }).toDestination(),
        S: new Tone.Synth({ oscillator: { type: 'square' }, envelope: { attack: 0.02, decay: 0.2, sustain: 0.15, release: 0.4 } }).toDestination(),
        piano: new Tone.Synth({ oscillator: { type: 'triangle' }, envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 1.0 } }).toDestination(),
        pad: new Tone.Synth({ oscillator: { type: 'sine' }, envelope: { attack: 0.3, decay: 1.0, sustain: 0.5, release: 2.0 } }).toDestination(),
      };
    }
  }, []);

  const noteFromValue = async (val: number, min: number, max: number, lowNote: number = 220, highNote: number = 880): Promise<string> => {
    const Tone = await loadTone();
    const normalized = Math.max(0, Math.min(1, (val - min) / (max - min || 1)));
    const freq = lowNote + normalized * (highNote - lowNote);
    return Tone.Frequency(freq, 'hz').toNote();
  };

  const playSonification = useCallback(async () => {
    const Tone = await loadTone();
    await initSynths();
    stopRef.current = false;
    setPlaying(true);
    setProgress(0);

    const totalDuration = 10 / speed;

    if (mode === 'asteroids' && asteroids.length > 0) {
      const sorted = [...asteroids].sort((a, b) => a.orbit.semiMajorAxis - b.orbit.semiMajorAxis);
      const total = sorted.length;
      for (let i = 0; i < total; i++) {
        if (stopRef.current) break;
        const a = sorted[i];
        const synth = synthsRef.current[a.composition];
        if (!synth) continue;
        const pitch = 880 - (a.orbit.semiMajorAxis * 120);
        const note = Tone.Frequency(Math.max(110, Math.min(880, pitch)), 'hz').toNote();
        const velocity = Math.min(1, Math.max(0.1, Math.log10(a.value + 1) / 20));
        synth.triggerAttackRelease(note, '8n', Tone.now(), velocity);
        setProgress(((i + 1) / total) * 100);
        await new Promise(resolve => setTimeout(resolve, (totalDuration / total) * 1000));
      }
    }

    if (mode === 'meteorites' && meteorites.length > 0) {
      const sorted = [...meteorites].sort((a, b) => a.year - b.year);
      const total = sorted.length;
      for (let i = 0; i < total; i++) {
        if (stopRef.current) break;
        const m = sorted[i];
        const synth = synthsRef.current.piano;
        const note = await noteFromValue(m.location.lat, -80, 80, 200, 800);
        const duration = Math.min(2, Math.max(0.1, Math.log10(m.mass + 1) / 4));
        const velocity = Math.min(1, Math.max(0.1, m.scientificValue / 100));
        synth.triggerAttackRelease(note, `${duration}`, Tone.now(), velocity);
        setProgress(((i + 1) / total) * 100);
        await new Promise(resolve => setTimeout(resolve, (totalDuration / total) * 1000));
      }
    }

    if (mode === 'exoplanets' && exoplanets.length > 0) {
      const sorted = [...exoplanets].sort((a, b) => a.distance - b.distance);
      const total = sorted.length;
      for (let i = 0; i < total; i++) {
        if (stopRef.current) break;
        const e = sorted[i];
        const synth = synthsRef.current.pad;
        const baseFreq = e.habitability.score > 70 ? 261.63 : 233.08;
        const multiplier = 1 + (e.habitability.score / 100) * 0.5;
        const note = Tone.Frequency(baseFreq * multiplier, 'hz').toNote();
        const velocity = Math.min(1, Math.max(0.1, 1 - e.distance / 2000));
        synth.triggerAttackRelease(note, '4n', Tone.now(), velocity);
        setProgress(((i + 1) / total) * 100);
        await new Promise(resolve => setTimeout(resolve, (totalDuration / total) * 1000));
      }
    }

    setPlaying(false);
    setProgress(100);
  }, [mode, asteroids, meteorites, exoplanets, speed, initSynths]);

  const stopSonification = useCallback(() => {
    stopRef.current = true;
    setPlaying(false);
    setProgress(0);
  }, []);

  const exportMIDI = async () => {
    const Tone = await loadTone();
    const data = mode === 'asteroids' ? asteroids.map(a => ({
      name: a.name,
      note: Tone.Frequency(Math.max(110, 880 - a.orbit.semiMajorAxis * 120), 'hz').toNote(),
      velocity: Math.min(1, Math.log10(a.value + 1) / 20),
      instrument: a.composition,
    })) : [];
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cosmolytics-${mode}-sonification.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const modeLabels = {
    asteroids: {
      title: 'Asteroid Sonification',
      description: 'Each asteroid becomes a note. Distance → pitch, value → volume, composition → instrument.',
      mappings: [
        { label: 'M-type', desc: 'Sine (metallic)', color: '#FFD700', icon: '🎹' },
        { label: 'C-type', desc: 'Sawtooth (organic)', color: '#8B8B8B', icon: '🎻' },
        { label: 'S-type', desc: 'Square (rocky)', color: '#CD5C5C', icon: '🥁' },
      ],
    },
    meteorites: {
      title: 'Meteorite Sonification',
      description: 'Mass → duration, latitude → pitch, plays chronologically through discovery history.',
      mappings: [
        { label: 'Mass', desc: 'Note length', color: '#3B82F6', icon: '⏱' },
        { label: 'Latitude', desc: 'Pitch (high/low)', color: '#8B5CF6', icon: '🎵' },
        { label: 'Value', desc: 'Volume', color: '#10B981', icon: '🔊' },
      ],
    },
    exoplanets: {
      title: 'Exoplanet Sonification',
      description: 'Habitability → harmony (consonant/dissonant), distance → reverb, plays nearest to farthest.',
      mappings: [
        { label: 'Habitable', desc: 'Major key (warm)', color: '#10B981', icon: '🌍' },
        { label: 'Hostile', desc: 'Minor key (cold)', color: '#EF4444', icon: '🔴' },
        { label: 'Distance', desc: 'Echo amount', color: '#8B5CF6', icon: '🌌' },
      ],
    },
  };

  const info = modeLabels[mode];

  return (
    <div className="data-card" style={{
      background: 'linear-gradient(135deg, rgba(88,28,135,0.15), rgba(29,78,216,0.1))',
      borderColor: 'rgba(139,92,246,0.25)',
    }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold">{info.title}</h3>
        </div>
        <button
          className={`switch-cosmos ${enabled ? 'active' : ''}`}
          onClick={() => setEnabled(!enabled)}
        >
          <div className="knob" />
        </button>
      </div>

      <p className="text-xs text-gray-400 mb-4">{info.description}</p>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <div className="flex gap-2">
              <button
                className="btn-cosmos flex-1 flex items-center justify-center gap-2 text-sm"
                onClick={playing ? stopSonification : playSonification}
              >
                {playing ? (
                  <><Square className="w-4 h-4" /> Stop</>
                ) : (
                  <><Play className="w-4 h-4" /> Play Sonification</>
                )}
              </button>
            </div>

            {playing && (
              <div className="progress-cosmos">
                <div className="fill" style={{ width: `${progress}%` }} />
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Speed:</span>
              <input
                type="range"
                min={0.5}
                max={5}
                step={0.5}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="slider-cosmos flex-1"
              />
              <span className="text-xs font-mono text-gray-300 w-8">{speed}x</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {info.mappings.map((m, i) => (
                <div key={i} className="p-2 rounded-lg" style={{ background: 'rgba(31,41,55,0.5)' }}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-sm">{m.icon}</span>
                    <span className="text-xs font-medium" style={{ color: m.color }}>{m.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{m.desc}</span>
                </div>
              ))}
            </div>

            <button className="btn-ghost w-full text-xs flex items-center justify-center gap-2" onClick={exportMIDI}>
              <Download className="w-3 h-3" />
              Export Sonification Data
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
