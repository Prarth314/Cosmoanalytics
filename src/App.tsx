import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Starfield from './components/Starfield';
import Navigation from './components/Navigation';
import TimeMachine from './components/TimeMachine';
import CosmosChat from './components/CosmosChat';
import { GhostCursors, ActivityFeed, PresenceIndicator } from './components/LiveCollaboration';
import AsteroidMinerGame from './components/AsteroidMinerGame';

import DashboardPage from './pages/DashboardPage';
import AsteroidsPage from './pages/AsteroidsPage';
import MeteoritesPage from './pages/MeteoritesPage';
import ExoplanetsPage from './pages/ExoplanetsPage';
import MissionPlannerPage from './pages/MissionPlannerPage';
import CustomDashboardPage from './pages/CustomDashboardPage';

export default function App() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [showGame, setShowGame] = useState(false);
  const [konamiProgress, setKonamiProgress] = useState(0);
  const [logoClicks, setLogoClicks] = useState(0);

  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Konami code easter egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiProgress]) {
        const next = konamiProgress + 1;
        setKonamiProgress(next);
        if (next === konamiCode.length) {
          setShowGame(true);
          setKonamiProgress(0);
        }
      } else {
        setKonamiProgress(0);
      }

      // Ctrl+Shift+G for game
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        setShowGame(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiProgress]);

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background layers */}
      <Starfield />
      <div className="nebula-bg" />

      {/* Navigation */}
      <Navigation />

      {/* Time Machine */}
      <TimeMachine year={selectedYear} onYearChange={handleYearChange} />

      {/* Main content */}
      <main className="relative z-10 pt-[120px] px-4 sm:px-6 pb-24 max-w-[1600px] mx-auto">
        <Routes>
          <Route path="/" element={<DashboardPage selectedYear={selectedYear} />} />
          <Route path="/asteroids" element={<AsteroidsPage selectedYear={selectedYear} />} />
          <Route path="/meteorites" element={<MeteoritesPage selectedYear={selectedYear} />} />
          <Route path="/exoplanets" element={<ExoplanetsPage selectedYear={selectedYear} />} />
          <Route path="/mission-planner" element={<MissionPlannerPage />} />
          <Route path="/custom-dashboard" element={<CustomDashboardPage />} />
        </Routes>
      </main>

      {/* AI Chat */}
      <CosmosChat />

      {/* Live Collaboration */}
      <GhostCursors />
      <ActivityFeed />
      <PresenceIndicator />

      {/* Asteroid Miner Game */}
      <AnimatePresence>
        {showGame && (
          <AsteroidMinerGame onClose={() => setShowGame(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
