import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis
} from 'recharts';
import {
  Gem, Globe2, Satellite, Rocket, TrendingUp, Zap, Target,
  ArrowRight, DollarSign, Activity, Star
} from 'lucide-react';
import { asteroids, meteorites, exoplanets, discoveryTrendData, formatValue, getCompositionColor } from '../data';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function DashboardPage({ selectedYear }: { selectedYear: number }) {
  const totalAsteroidValue = useMemo(() => asteroids.reduce((s, a) => s + a.value, 0), []);
  const avgAccessibility = useMemo(() => asteroids.reduce((s, a) => s + a.accessibility.score, 0) / asteroids.length, []);
  const habitableCount = useMemo(() => exoplanets.filter(e => e.habitability.score >= 60).length, []);

  const compositionData = useMemo(() => {
    const counts = { M: 0, C: 0, S: 0 };
    asteroids.forEach(a => counts[a.composition]++);
    return [
      { name: 'Metallic', value: counts.M, color: '#FFD700' },
      { name: 'Carbonaceous', value: counts.C, color: '#8B8B8B' },
      { name: 'Silicaceous', value: counts.S, color: '#CD5C5C' },
    ];
  }, []);

  const scatterData = useMemo(() =>
    asteroids.map(a => ({
      name: a.name,
      x: a.accessibility.score,
      y: Math.log10(a.value),
      z: a.physical.diameter,
      comp: a.composition,
    }))
  , []);

  const topTargets = useMemo(() =>
    [...asteroids]
      .sort((a, b) => (b.accessibility.score * Math.log10(b.value)) - (a.accessibility.score * Math.log10(a.value)))
      .slice(0, 5)
  , []);

  const stats = [
    { label: 'Total Asteroid Value', value: formatValue(totalAsteroidValue), icon: DollarSign, color: '#FFD700', sub: `${asteroids.length} tracked` },
    { label: 'Avg. Accessibility', value: `${avgAccessibility.toFixed(0)}/100`, icon: Target, color: '#3B82F6', sub: 'Score across NEOs' },
    { label: 'Habitable Planets', value: habitableCount.toString(), icon: Satellite, color: '#10B981', sub: `of ${exoplanets.length} catalogued` },
    { label: 'Meteorites Found', value: meteorites.length.toString(), icon: Globe2, color: '#F59E0B', sub: 'Historical recoveries' },
  ];

  const filteredTrends = useMemo(() =>
    discoveryTrendData.filter(d => d.year <= selectedYear)
  , [selectedYear]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div {...fadeUp} className="relative overflow-hidden rounded-2xl p-8"
        style={{
          background: 'linear-gradient(135deg, rgba(88,28,135,0.3), rgba(29,78,216,0.2), rgba(16,185,129,0.1))',
          border: '1px solid rgba(139,92,246,0.2)',
        }}>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            <span className="gradient-text">Space Data Intelligence</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg mb-6">
            Explore the cosmos through data. Analyze {asteroids.length} asteroids worth {formatValue(totalAsteroidValue)},&nbsp;
            {meteorites.length} meteorites, and {exoplanets.length} exoplanets — all with real-time sonification,
            AI queries, and predictive analytics.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/asteroids" className="btn-cosmos flex items-center gap-2 text-sm" style={{ textDecoration: 'none' }}>
              <Gem className="w-4 h-4" /> Explore Asteroids <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/mission-planner" className="btn-ghost flex items-center gap-2 text-sm" style={{ textDecoration: 'none' }}>
              <Rocket className="w-4 h-4" /> Plan a Mission
            </Link>
          </div>
        </div>
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent)' }} />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.5), transparent)' }} />
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="data-card flex items-start gap-4"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                <Icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-2xl font-bold font-mono">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
                <div className="text-[10px] text-gray-600 mt-0.5">{stat.sub}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Discovery Trends */}
        <motion.div {...fadeUp} className="data-card lg:col-span-2" style={{ transition: 'none' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              Discovery Trends
              <span className="text-xs text-gray-500 font-normal">(to {selectedYear})</span>
            </h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={filteredTrends}>
              <defs>
                <linearGradient id="gradAst" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradMet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
              <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 11 }} />
              <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: 12 }}
                labelStyle={{ color: '#e5e7eb' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} />
              <Area type="monotone" dataKey="asteroids" stroke="#8B5CF6" fill="url(#gradAst)" strokeWidth={2} />
              <Area type="monotone" dataKey="meteorites" stroke="#F59E0B" fill="url(#gradMet)" strokeWidth={2} />
              <Area type="monotone" dataKey="exoplanets" stroke="#10B981" fill="url(#gradExo)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Composition Breakdown */}
        <motion.div {...fadeUp} className="data-card" style={{ transition: 'none' }}>
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-purple-400" />
            Asteroid Composition
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={compositionData}
                cx="50%" cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {compositionData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs mt-2">
            {compositionData.map(c => (
              <div key={c.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-gray-400">{c.name} ({c.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk-Value scatter + Top Targets */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div {...fadeUp} className="data-card lg:col-span-3" style={{ transition: 'none' }}>
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            Accessibility vs Value Matrix
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
              <XAxis type="number" dataKey="x" name="Accessibility" tick={{ fill: '#6B7280', fontSize: 11 }} label={{ value: 'Accessibility Score', position: 'bottom', fill: '#6B7280', fontSize: 11 }} />
              <YAxis type="number" dataKey="y" name="Value (log10)" tick={{ fill: '#6B7280', fontSize: 11 }} label={{ value: 'Value (log₁₀ $)', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 11 }} />
              <ZAxis type="number" dataKey="z" range={[40, 400]} />
              <Tooltip
                contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: 12 }}
                formatter={(value: number, name: string) => {
                  if (name === 'Value (log10)') return [`$10^${value.toFixed(1)}`, 'Value'];
                  return [value, name];
                }}
                labelFormatter={(label) => {
                  const item = scatterData.find(d => d.x === label);
                  return item?.name || '';
                }}
              />
              <Scatter data={scatterData.filter(d => d.comp === 'M')} fill="#FFD700" name="Metallic" />
              <Scatter data={scatterData.filter(d => d.comp === 'C')} fill="#8B8B8B" name="Carbonaceous" />
              <Scatter data={scatterData.filter(d => d.comp === 'S')} fill="#CD5C5C" name="Silicaceous" />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div {...fadeUp} className="data-card lg:col-span-2" style={{ transition: 'none' }}>
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-yellow-400" />
            Top Mining Targets
          </h3>
          <div className="space-y-3">
            {topTargets.map((a, i) => (
              <Link
                key={a.id}
                to="/asteroids"
                className="flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-white/5"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{
                    background: i === 0 ? 'linear-gradient(135deg, #FFD700, #F59E0B)' : 'rgba(55,65,81,0.5)',
                    color: i === 0 ? '#000' : '#9CA3AF',
                  }}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{a.name}</div>
                  <div className="text-[11px] text-gray-500">
                    {formatValue(a.value)} · ΔV {a.accessibility.deltaV} km/s
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-mono" style={{ color: getCompositionColor(a.composition) }}>
                    {a.accessibility.score}
                  </div>
                  <div className="text-[10px] text-gray-500">Score</div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick access cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { to: '/asteroids', icon: Gem, title: 'Asteroid Mining', desc: 'Explore near-Earth asteroids and their economic potential', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(59,130,246,0.1))', iconColor: '#8B5CF6' },
          { to: '/meteorites', icon: Globe2, title: 'Meteorite Explorer', desc: 'Browse historical meteorite falls and finds worldwide', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))', iconColor: '#F59E0B' },
          { to: '/exoplanets', icon: Satellite, title: 'Exoplanet Catalog', desc: 'Discover habitable worlds beyond our solar system', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))', iconColor: '#10B981' },
        ].map(card => {
          const Icon = card.icon;
          return (
            <Link key={card.to} to={card.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <motion.div
                whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
                className="data-card h-full flex flex-col justify-between"
                style={{ background: card.gradient }}
              >
                <div>
                  <Icon className="w-8 h-8 mb-3" style={{ color: card.iconColor }} />
                  <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-400">{card.desc}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm" style={{ color: card.iconColor }}>
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
