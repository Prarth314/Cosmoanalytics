import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Gem, Globe2, Satellite, Rocket, LayoutGrid,
  Menu, X, ChevronDown
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/asteroids', label: 'Asteroids', icon: Gem },
  { path: '/meteorites', label: 'Meteorites', icon: Globe2 },
  { path: '/exoplanets', label: 'Exoplanets', icon: Satellite },
  { path: '/mission-planner', label: 'Mission Planner', icon: Rocket },
  { path: '/custom-dashboard', label: 'Custom Dashboard', icon: LayoutGrid },
];

export default function Navigation() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass" style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center relative"
              style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
              <div className="w-3 h-3 bg-white rounded-full" />
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ boxShadow: '0 0 20px rgba(139,92,246,0.5)' }} />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider gradient-text">COSMOLYTICS</span>
              <span className="hidden sm:block text-[10px] text-gray-500 tracking-widest uppercase -mt-1">
                Space Data Intelligence
              </span>
            </div>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`tab-cosmos flex items-center gap-2 ${isActive ? 'active' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-800"
            style={{ background: 'rgba(10,10,26,0.95)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`tab-cosmos flex items-center gap-3 w-full py-3 ${isActive ? 'active' : ''}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
