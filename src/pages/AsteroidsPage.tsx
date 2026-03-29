import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, ScatterChart, Scatter, ResponsiveContainer, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, ZAxis, Legend
} from 'recharts';
import {
  Gem, Search, Filter, SortAsc, SortDesc, ChevronDown, MessageCircle,
  Info, ArrowUpDown, ExternalLink
} from 'lucide-react';
import { asteroids, formatValue, getCompositionColor, getCompositionLabel } from '../data';
import SonificationPanel from '../components/SonificationPanel';
import AnnotationsPanel from '../components/AnnotationsPanel';
import type { Asteroid } from '../types';

export default function AsteroidsPage({ selectedYear }: { selectedYear: number }) {
  const [search, setSearch] = useState('');
  const [compFilter, setCompFilter] = useState<'all' | 'M' | 'C' | 'S'>('all');
  const [sortBy, setSortBy] = useState<'value' | 'accessibility' | 'name' | 'deltaV'>('value');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [annotationTarget, setAnnotationTarget] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const filtered = useMemo(() => {
    let list = asteroids.filter(a => a.discoveryYear <= selectedYear);
    if (search) list = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
    if (compFilter !== 'all') list = list.filter(a => a.composition === compFilter);
    list.sort((a, b) => {
      let va: number, vb: number;
      switch (sortBy) {
        case 'value': va = a.value; vb = b.value; break;
        case 'accessibility': va = a.accessibility.score; vb = b.accessibility.score; break;
        case 'deltaV': va = a.accessibility.deltaV; vb = b.accessibility.deltaV; break;
        default: return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return list;
  }, [search, compFilter, sortBy, sortDir, selectedYear]);

  const valueChartData = useMemo(() =>
    filtered.slice(0, 10).map(a => ({
      name: a.name.replace(/^\d+\s*/, '').substring(0, 12),
      value: Math.log10(a.value),
      rawValue: a.value,
      comp: a.composition,
    }))
  , [filtered]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Gem className="w-8 h-8 text-purple-400" />
            <span className="gradient-text">Asteroid Mining Intelligence</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {filtered.length} asteroids tracked · Total value: {formatValue(filtered.reduce((s, a) => s + a.value, 0))}
          </p>
        </div>
        <div className="flex gap-2">
          <button className={`tab-cosmos ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>Table</button>
          <button className={`tab-cosmos ${viewMode === 'chart' ? 'active' : ''}`} onClick={() => setViewMode('chart')}>Charts</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            className="input-cosmos pl-10 text-sm"
            placeholder="Search asteroids..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'M', 'C', 'S'] as const).map(c => (
            <button
              key={c}
              className={`tab-cosmos text-xs ${compFilter === c ? 'active' : ''}`}
              onClick={() => setCompFilter(c)}
              style={compFilter === c && c !== 'all' ? { borderColor: getCompositionColor(c as 'M' | 'C' | 'S') + '50' } : {}}
            >
              {c === 'all' ? 'All Types' : (
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCompositionColor(c as 'M' | 'C' | 'S') }} />
                  {getCompositionLabel(c as 'M' | 'C' | 'S')}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="xl:col-span-3 space-y-6">
          {viewMode === 'chart' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="data-card">
              <h3 className="font-semibold mb-4">Top 10 by Value (log scale)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={valueChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} angle={-30} textAnchor="end" height={60} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} label={{ value: 'log₁₀($)', angle: -90, position: 'insideLeft', fill: '#6B7280', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', fontSize: 12 }}
                    formatter={(val: number, name: string, props: any) => [formatValue(props.payload.rawValue), 'Value']}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {valueChartData.map((entry, i) => (
                      <Cell key={i} fill={getCompositionColor(entry.comp as 'M' | 'C' | 'S')} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Table */}
          <div className="data-card overflow-hidden" style={{ padding: 0 }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(75,85,99,0.3)' }}>
                    {[
                      { key: 'name', label: 'Asteroid' },
                      { key: 'value', label: 'Est. Value' },
                      { key: 'accessibility', label: 'Accessibility' },
                      { key: 'deltaV', label: 'Delta-V' },
                    ].map(col => (
                      <th key={col.key}
                        className="text-left px-4 py-3 text-xs text-gray-400 font-medium cursor-pointer hover:text-gray-200 transition select-none"
                        onClick={() => toggleSort(col.key as typeof sortBy)}
                      >
                        <span className="flex items-center gap-1">
                          {col.label}
                          {sortBy === col.key && (sortDir === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                        </span>
                      </th>
                    ))}
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Type</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Window</th>
                    <th className="px-4 py-3 text-xs text-gray-400 font-medium w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((asteroid, i) => (
                    <motion.tr
                      key={asteroid.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid rgba(75,85,99,0.15)' }}
                      onClick={() => setSelectedAsteroid(selectedAsteroid?.id === asteroid.id ? null : asteroid)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(139,92,246,0.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '')}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold">{asteroid.name}</div>
                        <div className="text-[10px] text-gray-600">Disc. {asteroid.discoveryYear}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-sm" style={{ color: '#10B981' }}>
                        {formatValue(asteroid.value)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="progress-cosmos w-16">
                            <div className="fill" style={{
                              width: `${asteroid.accessibility.score}%`,
                              background: asteroid.accessibility.score > 70 ? '#10B981' : asteroid.accessibility.score > 40 ? '#F59E0B' : '#EF4444',
                            }} />
                          </div>
                          <span className="text-xs font-mono">{asteroid.accessibility.score}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-300">
                        {asteroid.accessibility.deltaV} km/s
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full badge-${asteroid.composition === 'M' ? 'metallic' : asteroid.composition === 'C' ? 'carbonaceous' : 'silicaceous'}`}>
                          {asteroid.composition}-type
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {asteroid.accessibility.nextWindow}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="text-gray-600 hover:text-purple-400 transition"
                          onClick={(e) => { e.stopPropagation(); setAnnotationTarget(asteroid.id); }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {selectedAsteroid && (
              <motion.div
                key={selectedAsteroid.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="data-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedAsteroid.name}</h3>
                    <p className="text-xs text-gray-500">{selectedAsteroid.fullName}</p>
                  </div>
                  <span className={`badge-${selectedAsteroid.composition === 'M' ? 'metallic' : selectedAsteroid.composition === 'C' ? 'carbonaceous' : 'silicaceous'} text-xs px-3 py-1 rounded-full`}>
                    {selectedAsteroid.compositionLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Estimated Value', value: formatValue(selectedAsteroid.value), color: '#10B981' },
                    { label: 'Diameter', value: `${selectedAsteroid.physical.diameter} km`, color: '#3B82F6' },
                    { label: 'Delta-V Required', value: `${selectedAsteroid.accessibility.deltaV} km/s`, color: '#F59E0B' },
                    { label: 'Next Window', value: selectedAsteroid.accessibility.nextWindow, color: '#8B5CF6' },
                    { label: 'Transfer Time', value: `${selectedAsteroid.accessibility.transferTime} years`, color: '#06B6D4' },
                    { label: 'Mining Score', value: `${selectedAsteroid.miningFeasibility}/100`, color: '#10B981' },
                    { label: 'Risk Score', value: `${selectedAsteroid.riskScore}/100`, color: '#EF4444' },
                    { label: 'Rotation', value: `${selectedAsteroid.physical.rotationPeriod}h`, color: '#8B8B8B' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg" style={{ background: 'rgba(31,41,55,0.4)' }}>
                      <div className="text-[10px] text-gray-500 mb-1">{item.label}</div>
                      <div className="text-lg font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2 text-gray-300">Value Breakdown</h4>
                  <div className="flex gap-2 h-6 rounded-full overflow-hidden">
                    <div className="rounded-l-full" style={{ width: `${(selectedAsteroid.valueBreakdown.metals / selectedAsteroid.value) * 100}%`, background: '#FFD700' }} title="Metals" />
                    <div style={{ width: `${(selectedAsteroid.valueBreakdown.water / selectedAsteroid.value) * 100}%`, background: '#3B82F6' }} title="Water" />
                    <div className="rounded-r-full" style={{ width: `${(selectedAsteroid.valueBreakdown.rareEarth / selectedAsteroid.value) * 100}%`, background: '#8B5CF6' }} title="Rare Earth" />
                  </div>
                  <div className="flex gap-4 mt-2 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400" /> Metals {formatValue(selectedAsteroid.valueBreakdown.metals)}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Water {formatValue(selectedAsteroid.valueBreakdown.water)}</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /> Rare Earth {formatValue(selectedAsteroid.valueBreakdown.rareEarth)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Sonification */}
        <div className="xl:col-span-1 space-y-6">
          <SonificationPanel mode="asteroids" asteroids={filtered} />
        </div>
      </div>

      {/* Annotations panel */}
      <AnimatePresence>
        {annotationTarget && (
          <AnnotationsPanel
            dataPointId={annotationTarget}
            onClose={() => setAnnotationTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
