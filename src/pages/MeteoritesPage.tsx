import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';
import {
  Globe2, Search, MapPin, Calendar, Scale, SortAsc, SortDesc
} from 'lucide-react';
import { meteorites, formatValue } from '../data';
import SonificationPanel from '../components/SonificationPanel';
import type { Meteorite } from '../types';

export default function MeteoritesPage({ selectedYear }: { selectedYear: number }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'mass' | 'year' | 'name' | 'scientificValue'>('scientificValue');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [selected, setSelected] = useState<Meteorite | null>(null);
  const [filterFell, setFilterFell] = useState<'all' | 'fell' | 'found'>('all');
  const mapRef = useRef<HTMLCanvasElement>(null);

  const filtered = useMemo(() => {
    let list = meteorites.filter(m => m.year <= selectedYear);
    if (search) list = list.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.location.country.toLowerCase().includes(search.toLowerCase()));
    if (filterFell === 'fell') list = list.filter(m => m.fell);
    if (filterFell === 'found') list = list.filter(m => !m.fell);
    list.sort((a, b) => {
      let va: number, vb: number;
      switch (sortBy) {
        case 'mass': va = a.mass; vb = b.mass; break;
        case 'year': va = a.year; vb = b.year; break;
        case 'scientificValue': va = a.scientificValue; vb = b.scientificValue; break;
        default: return sortDir === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      return sortDir === 'asc' ? va - vb : vb - va;
    });
    return list;
  }, [search, sortBy, sortDir, selectedYear, filterFell]);

  const massData = useMemo(() =>
    filtered.slice(0, 10).map(m => ({
      name: m.name.substring(0, 14),
      mass: Math.log10(m.mass + 1),
      rawMass: m.mass,
      fell: m.fell,
    }))
  , [filtered]);

  // Simple map visualization
  useEffect(() => {
    const canvas = mapRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = canvas.offsetWidth * 2;
    const h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const dw = w / 2;
    const dh = h / 2;

    // Dark background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, dw, dh);

    // Simple world outline (approximation)
    ctx.strokeStyle = 'rgba(75,85,99,0.3)';
    ctx.lineWidth = 1;
    // Grid lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = dh / 2 - (lat / 90) * (dh / 2);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(dw, y);
      ctx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 60) {
      const x = (lng + 180) / 360 * dw;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, dh);
      ctx.stroke();
    }

    // Plot meteorites
    filtered.forEach(m => {
      const x = ((m.location.lng + 180) / 360) * dw;
      const y = dh / 2 - (m.location.lat / 90) * (dh / 2);
      const size = Math.max(3, Math.min(12, Math.log10(m.mass + 1)));

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = m.fell
        ? `rgba(239,68,68,${0.4 + m.scientificValue / 200})`
        : `rgba(59,130,246,${0.4 + m.scientificValue / 200})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(x, y, size + 3, 0, Math.PI * 2);
      ctx.fillStyle = m.fell ? 'rgba(239,68,68,0.1)' : 'rgba(59,130,246,0.1)';
      ctx.fill();

      // Label for selected
      if (selected?.id === m.id) {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, size + 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '10px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.name, x, y - size - 8);
      }
    });
  }, [filtered, selected]);

  const formatMass = (g: number): string => {
    if (g >= 1e6) return `${(g / 1e6).toFixed(1)} t`;
    if (g >= 1e3) return `${(g / 1e3).toFixed(1)} kg`;
    return `${g.toFixed(0)} g`;
  };

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Globe2 className="w-8 h-8 text-amber-400" />
          <span className="gradient-text-gold">Meteorite Explorer</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">{filtered.length} meteorites catalogued</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input className="input-cosmos pl-10 text-sm" placeholder="Search by name or country..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-1">
          {(['all', 'fell', 'found'] as const).map(f => (
            <button key={f} className={`tab-cosmos text-xs ${filterFell === f ? 'active' : ''}`} onClick={() => setFilterFell(f)}>
              {f === 'all' ? 'All' : f === 'fell' ? '🔴 Fell (witnessed)' : '🔵 Found'}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="data-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(75,85,99,0.2)' }}>
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold">Global Distribution</span>
          <span className="text-[10px] text-gray-500 ml-2">Click a row to highlight · Size = mass</span>
        </div>
        <canvas ref={mapRef} className="w-full" style={{ height: '250px', display: 'block' }} />
        <div className="px-4 py-2 flex gap-4 text-[10px] text-gray-500" style={{ borderTop: '1px solid rgba(75,85,99,0.1)' }}>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> Witnessed falls</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Found</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-6">
          {/* Mass chart */}
          <div className="data-card">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" /> Largest Meteorites (log mass)
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={massData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 10 }} angle={-25} textAnchor="end" height={50} />
                <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '8px', fontSize: 12 }}
                  formatter={(val: number, name: string, props: any) => [formatMass(props.payload.rawMass), 'Mass']}
                />
                <Bar dataKey="mass" radius={[4, 4, 0, 0]}>
                  {massData.map((entry, i) => (
                    <Cell key={i} fill={entry.fell ? '#EF4444' : '#3B82F6'} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="data-card overflow-hidden" style={{ padding: 0 }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(75,85,99,0.3)' }}>
                    {[
                      { key: 'name', label: 'Meteorite' },
                      { key: 'mass', label: 'Mass' },
                      { key: 'year', label: 'Year' },
                      { key: 'scientificValue', label: 'Sci. Value' },
                    ].map(col => (
                      <th key={col.key} className="text-left px-4 py-3 text-xs text-gray-400 font-medium cursor-pointer hover:text-gray-200 transition select-none" onClick={() => toggleSort(col.key as typeof sortBy)}>
                        <span className="flex items-center gap-1">
                          {col.label}
                          {sortBy === col.key && (sortDir === 'asc' ? <SortAsc className="w-3 h-3" /> : <SortDesc className="w-3 h-3" />)}
                        </span>
                      </th>
                    ))}
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Location</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, i) => (
                    <motion.tr
                      key={m.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid rgba(75,85,99,0.15)', background: selected?.id === m.id ? 'rgba(139,92,246,0.08)' : '' }}
                      onClick={() => setSelected(selected?.id === m.id ? null : m)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = selected?.id === m.id ? 'rgba(139,92,246,0.08)' : 'rgba(139,92,246,0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = selected?.id === m.id ? 'rgba(139,92,246,0.08)' : '')}
                    >
                      <td className="px-4 py-2.5">
                        <div className="font-semibold text-sm">{m.name}</div>
                        <div className="text-[10px] text-gray-600">{m.classification}</div>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-xs text-gray-300">{formatMass(m.mass)}</td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">{m.year}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="progress-cosmos w-14">
                            <div className="fill" style={{ width: `${m.scientificValue}%`, background: m.scientificValue > 90 ? '#FFD700' : '#3B82F6' }} />
                          </div>
                          <span className="text-xs font-mono">{m.scientificValue}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-xs text-gray-400">{m.location.country}</td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${m.fell ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {m.fell ? 'Fell' : 'Found'}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail */}
          <AnimatePresence>
            {selected && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="data-card">
                <h3 className="text-xl font-bold mb-3">{selected.name}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Classification', value: selected.classification, color: '#F59E0B' },
                    { label: 'Mass', value: formatMass(selected.mass), color: '#3B82F6' },
                    { label: 'Year', value: selected.year.toString(), color: '#8B5CF6' },
                    { label: 'Country', value: selected.location.country, color: '#10B981' },
                    { label: 'Coordinates', value: `${selected.location.lat.toFixed(2)}°, ${selected.location.lng.toFixed(2)}°`, color: '#06B6D4' },
                    { label: 'Composition', value: selected.composition, color: '#FFD700' },
                    { label: 'Scientific Value', value: `${selected.scientificValue}/100`, color: '#EC4899' },
                    { label: 'Market Value', value: `$${selected.marketValue}/g`, color: '#10B981' },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-lg" style={{ background: 'rgba(31,41,55,0.4)' }}>
                      <div className="text-[10px] text-gray-500 mb-1">{item.label}</div>
                      <div className="text-sm font-bold font-mono" style={{ color: item.color }}>{item.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="xl:col-span-1">
          <SonificationPanel mode="meteorites" meteorites={filtered} />
        </div>
      </div>
    </div>
  );
}
