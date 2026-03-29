import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ZAxis
} from 'recharts';
import {
  Satellite, Search, SortAsc, SortDesc, Star, Droplets, Wind, Globe, ThermometerSun
} from 'lucide-react';
import { exoplanets, getStarTypeColor } from '../data';
import SonificationPanel from '../components/SonificationPanel';
import type { Exoplanet } from '../types';

export default function ExoplanetsPage({ selectedYear }: { selectedYear: number }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'habitability' | 'distance' | 'name' | 'temperature'>('habitability');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [starFilter, setStarFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Exoplanet | null>(null);
  const [showHabitableOnly, setShowHabitableOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = exoplanets.filter(e => e.discoveryYear <= selectedYear);
    if (search) list = list.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.starName.toLowerCase().includes(search.toLowerCase()));
    if (starFilter !== 'all') list = list.filter(e => e.starType === starFilter);
    if (showHabitableOnly) list = list.filter(e => e.habitability.score >= 65);
    list.sort((a, b) => {
      let va: number, vb: number;
      switch (sortBy) {
        case 'habitability': va = a.habitability.score; vb = b.habitability.score; break;
        case 'distance': va = a.distance; vb = b.distance; break;
        case 'temperature': va = a.physical.temperature; vb = b.physical.temperature; break;
        default: return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return list;
  }, [search, starFilter, sortBy, sortDir, selectedYear, showHabitableOnly]);

  const scatterData = useMemo(() =>
    filtered.map(e => ({
      name: e.name,
      x: e.distance,
      y: e.habitability.score,
      z: e.physical.radius * 5,
      starType: e.starType,
    }))
  , [filtered]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const getHabitabilityColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Satellite className="w-8 h-8 text-emerald-400" />
          <span className="gradient-text">Exoplanet Catalog</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          {filtered.length} confirmed exoplanets · {filtered.filter(e => e.habitability.score >= 65).length} potentially habitable
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input className="input-cosmos pl-10 text-sm" placeholder="Search planets or stars..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {['all', 'G', 'K', 'M'].map(st => (
            <button key={st} className={`tab-cosmos text-xs ${starFilter === st ? 'active' : ''}`} onClick={() => setStarFilter(st)}>
              {st === 'all' ? 'All Stars' : (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStarTypeColor(st) }} />
                  {st}-type
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          className={`tab-cosmos text-xs ${showHabitableOnly ? 'active' : ''}`}
          onClick={() => setShowHabitableOnly(!showHabitableOnly)}
        >
          🌍 Habitable Only
        </button>
      </div>

      {/* Scatter chart */}
      <div className="data-card">
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-emerald-400" />
          Distance vs Habitability Score
          <span className="text-[10px] text-gray-500 font-normal">(bubble size = planet radius)</span>
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
            <XAxis type="number" dataKey="x" name="Distance (ly)" tick={{ fill: '#6B7280', fontSize: 11 }}
              label={{ value: 'Distance (light years)', position: 'bottom', fill: '#6B7280', fontSize: 11 }} />
            <YAxis type="number" dataKey="y" name="Habitability" domain={[40, 100]} tick={{ fill: '#6B7280', fontSize: 11 }}
              label={{ value: 'Habitability Score', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 11 }} />
            <ZAxis type="number" dataKey="z" range={[40, 300]} />
            <Tooltip
              contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontSize: 12 }}
              formatter={(value: number, name: string) => [name === 'Distance (ly)' ? `${value.toFixed(1)} ly` : `${value}/100`, name]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ''}
            />
            {['G', 'K', 'M'].map(st => (
              <Scatter
                key={st}
                data={scatterData.filter(d => d.starType === st)}
                fill={getStarTypeColor(st)}
                name={`${st}-type star`}
                fillOpacity={0.7}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((planet, i) => (
              <motion.div
                key={planet.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`data-card cursor-pointer ${selected?.id === planet.id ? 'ring-1 ring-purple-500/50' : ''}`}
                onClick={() => setSelected(selected?.id === planet.id ? null : planet)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{planet.name}</h4>
                    <div className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getStarTypeColor(planet.starType) }} />
                      {planet.starName} ({planet.starType}-type)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold font-mono" style={{ color: getHabitabilityColor(planet.habitability.score) }}>
                      {planet.habitability.score}
                    </div>
                    <div className="text-[10px] text-gray-500">Habitability</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="p-2 rounded" style={{ background: 'rgba(31,41,55,0.4)' }}>
                    <div className="text-[10px] text-gray-500">Distance</div>
                    <div className="text-xs font-mono">{planet.distance.toFixed(1)} ly</div>
                  </div>
                  <div className="p-2 rounded" style={{ background: 'rgba(31,41,55,0.4)' }}>
                    <div className="text-[10px] text-gray-500">Mass</div>
                    <div className="text-xs font-mono">{planet.physical.mass.toFixed(1)} M⊕</div>
                  </div>
                  <div className="p-2 rounded" style={{ background: 'rgba(31,41,55,0.4)' }}>
                    <div className="text-[10px] text-gray-500">Temp</div>
                    <div className="text-xs font-mono">{planet.physical.temperature} K</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {planet.habitability.hasWater && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 flex items-center gap-1">
                      <Droplets className="w-2.5 h-2.5" /> Water
                    </span>
                  )}
                  {planet.habitability.hasAtmosphere && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 flex items-center gap-1">
                      <Wind className="w-2.5 h-2.5" /> Atmosphere
                    </span>
                  )}
                  {planet.habitability.inHabitableZone && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/25 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" /> HZ
                    </span>
                  )}
                  {planet.habitability.tidallyLocked && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/25">
                      🔒 Locked
                    </span>
                  )}
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {selected?.id === planet.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4"
                      style={{ borderTop: '1px solid rgba(75,85,99,0.2)' }}
                    >
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div><span className="text-gray-500">Discovered: </span>{planet.discoveryYear}</div>
                        <div><span className="text-gray-500">Method: </span>{planet.discoveryMethod}</div>
                        <div><span className="text-gray-500">Radius: </span>{planet.physical.radius.toFixed(2)} R⊕</div>
                        <div><span className="text-gray-500">Gravity: </span>{planet.physical.gravity.toFixed(2)} g</div>
                        <div><span className="text-gray-500">Period: </span>{planet.orbital.period.toFixed(1)} days</div>
                        <div><span className="text-gray-500">Semi-major: </span>{planet.orbital.semiMajorAxis} AU</div>
                      </div>
                      <div className="mt-3">
                        <span className="text-[10px] text-gray-500">Atmosphere: </span>
                        <span className="text-xs">{planet.atmosphere.join(', ')}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-1">
          <SonificationPanel mode="exoplanets" exoplanets={filtered} />
        </div>
      </div>
    </div>
  );
}
