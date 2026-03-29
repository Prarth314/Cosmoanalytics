import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2 } from 'lucide-react';
import { simulatedUsers } from '../data';
import type { Activity, SimUser } from '../types';

interface GhostCursor {
  id: string;
  user: SimUser;
  x: number;
  y: number;
}

export function GhostCursors() {
  const [cursors, setCursors] = useState<GhostCursor[]>([]);

  useEffect(() => {
    // Initialize 2-3 ghost cursors
    const initial = simulatedUsers.slice(0, 3).map((user, i) => ({
      id: `cursor-${i}`,
      user,
      x: 200 + Math.random() * 800,
      y: 200 + Math.random() * 400,
    }));
    setCursors(initial);

    // Move cursors around
    const interval = setInterval(() => {
      setCursors(prev => prev.map(c => ({
        ...c,
        x: Math.max(50, Math.min(window.innerWidth - 100, c.x + (Math.random() - 0.5) * 200)),
        y: Math.max(100, Math.min(window.innerHeight - 100, c.y + (Math.random() - 0.5) * 150)),
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {cursors.map(cursor => (
        <motion.div
          key={cursor.id}
          className="fixed pointer-events-none z-[45]"
          animate={{ x: cursor.x, y: cursor.y }}
          transition={{ type: 'spring', damping: 30, stiffness: 200, duration: 2 }}
        >
          <MousePointer2 className="w-4 h-4" style={{ color: cursor.user.color }} />
          <span
            className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.user.color, opacity: 0.8 }}
          >
            {cursor.user.name}
          </span>
        </motion.div>
      ))}
    </>
  );
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const actions = ['viewed', 'filtered', 'compared', 'bookmarked', 'shared', 'exported analysis for'];
    const targets = ['16 Psyche', 'Bennu', 'TRAPPIST-1 e', 'Apophis', 'Eros', 'Meteorite Map', 'Exoplanet Catalog'];

    function addActivity() {
      const user = simulatedUsers[Math.floor(Math.random() * simulatedUsers.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const target = targets[Math.floor(Math.random() * targets.length)];

      setActivities(prev => [{
        id: Date.now(),
        user,
        action,
        target,
        timestamp: new Date(),
      }, ...prev].slice(0, 15));
    }

    // Add initial activities
    for (let i = 0; i < 4; i++) {
      setTimeout(addActivity, i * 200);
    }

    const interval = setInterval(addActivity, 5000 + Math.random() * 10000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed top-[82px] right-4 w-72 z-30 hidden xl:block"
      style={{
        background: 'rgba(10,10,26,0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(75,85,99,0.2)',
        borderRadius: '12px',
        maxHeight: '320px',
        overflow: 'hidden',
      }}
    >
      <div className="px-3 py-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(75,85,99,0.2)' }}>
        <span className="text-xs font-semibold text-gray-400">Live Activity</span>
        <button
          className="text-gray-600 hover:text-gray-400 text-xs"
          onClick={() => setVisible(false)}
        >✕</button>
      </div>
      <div className="py-1 overflow-y-auto" style={{ maxHeight: '280px' }}>
        <AnimatePresence initial={false}>
          {activities.map(activity => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 px-3 py-1.5 text-[11px] hover:bg-white/5 transition"
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 mt-0.5"
                style={{ backgroundColor: activity.user.color }}>
                {activity.user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-semibold text-gray-300">{activity.user.name}</span>
                <span className="text-gray-500"> {activity.action} </span>
                <span className="text-blue-400">{activity.target}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function PresenceIndicator() {
  const [count] = useState(Math.floor(Math.random() * 8) + 3);

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 px-3 py-2 rounded-full"
      style={{
        background: 'rgba(10,10,26,0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(75,85,99,0.2)',
      }}
    >
      <div className="flex -space-x-1.5">
        {simulatedUsers.slice(0, Math.min(5, count)).map((user, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
            style={{
              backgroundColor: user.color,
              border: '2px solid #0a0a1a',
              zIndex: 5 - i,
            }}
          >
            {user.initials}
          </div>
        ))}
      </div>
      <span className="text-[11px] text-gray-400">
        {count} exploring
      </span>
    </div>
  );
}
