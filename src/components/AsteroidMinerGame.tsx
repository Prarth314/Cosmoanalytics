import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Play, RotateCcw, Trophy, AlertTriangle, Share2, X, Gamepad2 } from 'lucide-react';
import { formatValue } from '../data';

interface GameAsteroid {
  x: number; y: number; size: number; speed: number;
  composition: 'M' | 'C' | 'S'; value: number;
}

interface Star { x: number; y: number; speed: number; }

export default function AsteroidMinerGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'over'>('menu');
  const [score, setScore] = useState(0);
  const [fuel, setFuel] = useState(100);
  const [timer, setTimer] = useState(60);
  const [highScore, setHighScore] = useState(0);

  const gameRef = useRef({
    spacecraft: { x: 400, y: 400, radius: 12 },
    asteroids: [] as GameAsteroid[],
    stars: [] as Star[],
    keys: {} as Record<string, boolean>,
    score: 0,
    fuel: 100,
    timer: 60,
    running: false,
    lastTime: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; life: number; color: string }[],
  });

  const startGame = useCallback(() => {
    const g = gameRef.current;
    g.spacecraft = { x: 400, y: 400, radius: 12 };
    g.asteroids = [];
    g.stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 500,
      speed: Math.random() * 1 + 0.3,
    }));
    g.score = 0;
    g.fuel = 100;
    g.timer = 60;
    g.running = true;
    g.particles = [];
    setScore(0);
    setFuel(100);
    setTimer(60);
    setGameState('playing');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { gameRef.current.keys[e.key] = true; };
    const handleKeyUp = (e: KeyboardEvent) => { gameRef.current.keys[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const g = gameRef.current;
    let animId: number;

    const compColors: Record<string, string> = { M: '#FFD700', C: '#8B8B8B', S: '#CD5C5C' };
    const compValues: Record<string, number> = { M: 3, C: 1, S: 2 };

    function gameLoop(timestamp: number) {
      if (!g.running || !ctx || !canvas) return;
      const dt = Math.min((timestamp - (g.lastTime || timestamp)) / 1000, 0.05);
      g.lastTime = timestamp;

      ctx.clearRect(0, 0, 800, 500);

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, 500);
      grad.addColorStop(0, '#050510');
      grad.addColorStop(1, '#0a0a2e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 500);

      // Stars
      g.stars.forEach(star => {
        ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.4})`;
        ctx.fillRect(star.x, star.y, 1.5, 1.5);
        star.y += star.speed;
        if (star.y > 500) { star.y = 0; star.x = Math.random() * 800; }
      });

      // Spawn asteroids
      if (Math.random() < 0.03 + g.timer * 0.0005) {
        const comp = (['M', 'C', 'S'] as const)[Math.floor(Math.random() * 3)];
        g.asteroids.push({
          x: Math.random() * 760 + 20,
          y: -30,
          size: 8 + Math.random() * 18,
          speed: 60 + Math.random() * 120,
          composition: comp,
          value: Math.pow(10, 6 + Math.random() * 5) * compValues[comp],
        });
      }

      // Move spacecraft
      const speed = 300;
      if (g.keys['ArrowLeft'] || g.keys['a']) g.spacecraft.x -= speed * dt;
      if (g.keys['ArrowRight'] || g.keys['d']) g.spacecraft.x += speed * dt;
      if (g.keys['ArrowUp'] || g.keys['w']) g.spacecraft.y -= speed * dt;
      if (g.keys['ArrowDown'] || g.keys['s']) g.spacecraft.y += speed * dt;
      g.spacecraft.x = Math.max(15, Math.min(785, g.spacecraft.x));
      g.spacecraft.y = Math.max(15, Math.min(485, g.spacecraft.y));

      // Draw & update asteroids
      for (let i = g.asteroids.length - 1; i >= 0; i--) {
        const a = g.asteroids[i];
        a.y += a.speed * dt;

        // Draw asteroid with glow
        ctx.save();
        ctx.shadowColor = compColors[a.composition];
        ctx.shadowBlur = 8;
        ctx.fillStyle = compColors[a.composition];
        ctx.beginPath();
        // Irregular shape
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2;
          const r = a.size * (0.8 + Math.sin(j * 3.7) * 0.2);
          const px = a.x + Math.cos(angle) * r;
          const py = a.y + Math.sin(angle) * r;
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Value label
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '9px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(formatValue(a.value), a.x, a.y - a.size - 4);

        // Collision check
        const dist = Math.hypot(g.spacecraft.x - a.x, g.spacecraft.y - a.y);
        if (dist < g.spacecraft.radius + a.size) {
          g.score += a.value;
          // Spawn particles
          for (let p = 0; p < 10; p++) {
            g.particles.push({
              x: a.x, y: a.y,
              vx: (Math.random() - 0.5) * 200,
              vy: (Math.random() - 0.5) * 200,
              life: 0.5 + Math.random() * 0.5,
              color: compColors[a.composition],
            });
          }
          g.asteroids.splice(i, 1);
          continue;
        }

        if (a.y > 530) { g.asteroids.splice(i, 1); }
      }

      // Particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) { g.particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
        ctx.globalAlpha = 1;
      }

      // Draw spacecraft
      ctx.save();
      ctx.translate(g.spacecraft.x, g.spacecraft.y);

      // Engine glow
      ctx.shadowColor = '#3B82F6';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.moveTo(-5, 10);
      ctx.lineTo(0, 10 + 5 + Math.random() * 8);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.fill();

      // Ship body
      ctx.shadowColor = '#60A5FA';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#3B82F6';
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-3, 8);
      ctx.lineTo(0, 12);
      ctx.lineTo(3, 8);
      ctx.lineTo(10, 10);
      ctx.closePath();
      ctx.fill();

      // Cockpit
      ctx.fillStyle = '#93C5FD';
      ctx.beginPath();
      ctx.arc(0, -2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Update timers
      g.fuel -= dt * 1.5;
      g.timer -= dt;

      // HUD
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.font = 'bold 14px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`SCORE: ${formatValue(g.score)}`, 15, 25);
      ctx.textAlign = 'right';
      ctx.fillText(`FUEL: ${Math.max(0, g.fuel).toFixed(0)}%`, 785, 25);
      ctx.fillText(`TIME: ${Math.max(0, g.timer).toFixed(0)}s`, 785, 45);

      // Fuel bar
      ctx.fillStyle = 'rgba(55,65,81,0.5)';
      ctx.fillRect(15, 35, 150, 6);
      ctx.fillStyle = g.fuel > 30 ? '#10B981' : g.fuel > 10 ? '#F59E0B' : '#EF4444';
      ctx.fillRect(15, 35, Math.max(0, (g.fuel / 100) * 150), 6);

      // Goal
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Collect $1 Trillion to Win!', 400, 490);

      // Check game over
      if (g.fuel <= 0 || g.timer <= 0 || g.score >= 1e12) {
        g.running = false;
        setScore(g.score);
        setFuel(Math.max(0, g.fuel));
        setTimer(Math.max(0, g.timer));
        if (g.score > highScore) setHighScore(g.score);
        setGameState('over');
        return;
      }

      setScore(g.score);
      setFuel(g.fuel);
      setTimer(g.timer);
      animId = requestAnimationFrame(gameLoop);
    }

    animId = requestAnimationFrame(gameLoop);
    return () => { g.running = false; cancelAnimationFrame(animId); };
  }, [gameState, highScore]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative" style={{
        background: '#000',
        borderRadius: '16px',
        border: '1px solid rgba(75,85,99,0.3)',
        overflow: 'hidden',
        boxShadow: '0 30px 100px rgba(0,0,0,0.7)',
      }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3"
          style={{ background: 'rgba(17,24,39,0.9)', borderBottom: '1px solid rgba(75,85,99,0.2)' }}>
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-bold text-lg">Asteroid Miner</h2>
              <p className="text-[10px] text-gray-500">Collect $1 trillion to win!</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm font-mono">
            <div><span className="text-gray-500 text-xs">Score </span><span className="text-green-400">{formatValue(score)}</span></div>
            <div><span className="text-gray-500 text-xs">Fuel </span><span className={fuel > 30 ? 'text-emerald-400' : 'text-red-400'}>{fuel.toFixed(0)}%</span></div>
            <div><span className="text-gray-500 text-xs">Time </span><span className="text-blue-400">{timer.toFixed(0)}s</span></div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Canvas */}
        <div className="relative">
          <canvas ref={canvasRef} width={800} height={500} style={{ display: 'block' }} />

          {/* Menu Overlay */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
              <div className="text-center">
                <Rocket className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-2xl font-bold mb-2">Ready to Mine?</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                  Arrow keys / WASD to navigate<br />
                  Collect asteroids • Gold = 3x • Red = 2x
                </p>
                <button className="btn-cosmos text-lg px-8 py-3 flex items-center gap-2 mx-auto" onClick={startGame}>
                  <Play className="w-5 h-5" /> Start Mission
                </button>
                {highScore > 0 && (
                  <p className="text-xs text-gray-500 mt-3">High Score: {formatValue(highScore)}</p>
                )}
              </div>
            </div>
          )}

          {/* Game Over */}
          {gameState === 'over' && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.9)' }}>
              <div className="text-center">
                {score >= 1e12 ? (
                  <>
                    <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h3 className="text-3xl font-bold mb-2 gradient-text-gold">Mission Success!</h3>
                    <p className="text-xl text-green-400 mb-6">You collected {formatValue(score)}</p>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-3xl font-bold mb-2">Mission Failed</h3>
                    <p className="text-lg text-gray-400 mb-6">Score: {formatValue(score)}</p>
                  </>
                )}
                <div className="flex gap-3 justify-center">
                  <button className="btn-cosmos flex items-center gap-2" onClick={startGame}>
                    <RotateCcw className="w-4 h-4" /> Try Again
                  </button>
                  <button className="btn-ghost flex items-center gap-2" onClick={onClose}>
                    Exit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard */}
        <div className="px-5 py-2 flex items-center justify-between"
          style={{ background: 'rgba(17,24,39,0.9)', borderTop: '1px solid rgba(75,85,99,0.2)' }}>
          <span className="text-[11px] text-gray-500">Leaderboard</span>
          <div className="flex gap-4 text-[11px]">
            <span><span className="text-gray-500">#1 </span><span className="text-yellow-400">SpaceX Fan</span> <span className="text-green-400 font-mono">$2.4T</span></span>
            <span><span className="text-gray-500">#2 </span><span className="text-gray-300">AstroMiner</span> <span className="text-green-400 font-mono">$890B</span></span>
            <span><span className="text-gray-500">#3 </span><span className="text-gray-300">CosmicDust</span> <span className="text-green-400 font-mono">$445B</span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
