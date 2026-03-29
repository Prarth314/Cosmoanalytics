import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import {
  LayoutGrid, DollarSign, Target, Rocket, PieChart as PieIcon, TrendingUp,
  Calendar, Globe2, Save, Share2, RotateCcw, X, Settings, GripVertical, Plus
} from 'lucide-react';
import { asteroids, meteorites, exoplanets, discoveryTrendData, formatValue, getCompositionColor } from '../data';

interface Widget {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  defaultW: number;
  defaultH: number;
}

interface PlacedWidget extends Widget {
  instanceId: string;
}

const availableWidgets: Widget[] = [
  { id: 'value-counter', name: 'Total Value Counter', icon: <DollarSign className="w-4 h-4" />, description: 'Live total of all asteroid values', defaultW: 1, defaultH: 1 },
  { id: 'top-targets', name: 'Top Mining Targets', icon: <Target className="w-4 h-4" />, description: 'Ranked list of best opportunities', defaultW: 1, defaultH: 2 },
  { id: 'launch-windows', name: 'Launch Windows', icon: <Rocket className="w-4 h-4" />, description: 'Upcoming optimal windows', defaultW: 1, defaultH: 2 },
  { id: 'composition-pie', name: 'Composition Breakdown', icon: <PieIcon className="w-4 h-4" />, description: 'Distribution of asteroid types', defaultW: 1, defaultH: 1 },
  { id: 'risk-matrix', name: 'Risk-Return Matrix', icon: <TrendingUp className="w-4 h-4" />, description: 'Opportunity vs difficulty', defaultW: 2, defaultH: 1 },
  { id: 'discovery-trend', name: 'Discovery Trends', icon: <Calendar className="w-4 h-4" />, description: 'Object discoveries over time', defaultW: 2, defaultH: 1 },
  { id: 'habitability', name: 'Habitability Leaderboard', icon: <Globe2 className="w-4 h-4" />, description: 'Top habitable exoplanets', defaultW: 1, defaultH: 2 },
  { id: 'meteorite-stats', name: 'Meteorite Stats', icon: <Globe2 className="w-4 h-4" />, description: 'Key meteorite statistics', defaultW: 1, defaultH: 1 },
];

function renderWidgetContent(id: string) {
  switch (id) {
    case 'value-counter': {
      const total = asteroids.reduce((s, a) => s + a.value, 0);
      return (
        <div className="text-center py-2">
          <div className="text-3xl font-bold gradient-text-gold font-mono">{formatValue(total)}</div>
          <div className="text-xs text-gray-500 mt-1">Total tracked value</div>
          <div className="text-[10px] text-gray-600 mt-0.5">{asteroids.length} asteroids</div>
        </div>
      );
    }
    case 'top-targets': {
      const top = [...asteroids].sort((a, b) => b.accessibility.score - a.accessibility.score).slice(0, 6);
      return (
        <div className="space-y-2">
          {top.map((a, i) => (
            <div key={a.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-white/5 transition">
              <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold" style={{
                background: i < 3 ? 'linear-gradient(135deg, #FFD700, #F59E0B)' : 'rgba(55,65,81,0.5)',
                color: i < 3 ? '#000' : '#9CA3AF',
              }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{a.name}</div>
                <div className="text-[10px] text-gray-500">{formatValue(a.value)}</div>
              </div>
              <span className="font-mono text-green-400">{a.accessibility.score}</span>
            </div>
          ))}
        </div>
      );
    }
    case 'launch-windows': {
      const upcoming = [...asteroids].sort((a, b) => a.accessibility.nextWindow.localeCompare(b.accessibility.nextWindow)).slice(0, 6);
      return (
        <div className="space-y-2">
          {upcoming.map(a => (
            <div key={a.id} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-white/5">
              <div>
                <div className="font-semibold">{a.name}</div>
                <div className="text-[10px] text-gray-500">ΔV: {a.accessibility.deltaV} km/s</div>
              </div>
              <span className="font-mono text-blue-400 text-[11px]">{a.accessibility.nextWindow}</span>
            </div>
          ))}
        </div>
      );
    }
    case 'composition-pie': {
      const counts = { M: 0, C: 0, S: 0 };
      asteroids.forEach(a => counts[a.composition]++);
      const data = [
        { name: 'Metallic', value: counts.M, color: '#FFD700' },
        { name: 'Carbonaceous', value: counts.C, color: '#8B8B8B' },
        { name: 'Silicaceous', value: counts.S, color: '#CD5C5C' },
      ];
      return (
        <div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={data} innerRadius={30} outerRadius={50} paddingAngle={3} dataKey="value">
                {data.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent" />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-3 text-[10px]">
            {data.map(d => (
              <span key={d.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: d.color }} /> {d.name}
              </span>
            ))}
          </div>
        </div>
      );
    }
    case 'risk-matrix': {
      const data = asteroids.map(a => ({ name: a.name, access: a.accessibility.score, risk: a.riskScore }));
      return (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data.slice(0, 8)}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 9 }} angle={-30} textAnchor="end" height={50} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(75,85,99,0.3)', borderRadius: '8px', fontSize: 11 }} />
            <Bar dataKey="access" fill="#10B981" name="Accessibility" radius={[2, 2, 0, 0]} />
            <Bar dataKey="risk" fill="#EF4444" name="Risk" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    case 'discovery-trend': {
      return (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={discoveryTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
            <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 10 }} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(75,85,99,0.3)', borderRadius: '8px', fontSize: 11 }} />
            <Line type="monotone" dataKey="asteroids" stroke="#8B5CF6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="exoplanets" stroke="#10B981" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    case 'habitability': {
      const top = [...exoplanets].sort((a, b) => b.habitability.score - a.habitability.score).slice(0, 6);
      return (
        <div className="space-y-2">
          {top.map(e => (
            <div key={e.id} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-white/5">
              <div className="min-w-0 flex-1">
                <div className="font-semibold truncate">{e.name}</div>
                <div className="text-[10px] text-gray-500">{e.distance.toFixed(1)} ly · {e.starType}-type</div>
              </div>
              <span className="font-mono font-bold" style={{ color: e.habitability.score >= 75 ? '#10B981' : '#F59E0B' }}>
                {e.habitability.score}
              </span>
            </div>
          ))}
        </div>
      );
    }
    case 'meteorite-stats': {
      const totalMass = meteorites.reduce((s, m) => s + m.mass, 0);
      const fell = meteorites.filter(m => m.fell).length;
      return (
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded" style={{ background: 'rgba(31,41,55,0.4)' }}>
            <div className="text-[10px] text-gray-500">Total</div>
            <div className="text-lg font-bold">{meteorites.length}</div>
          </div>
          <div className="p-2 rounded" style={{ background: 'rgba(31,41,55,0.4)' }}>
            <div className="text-[10px] text-gray-500">Witnessed</div>
            <div className="text-lg font-bold text-red-400">{fell}</div>
          </div>
          <div className="p-2 rounded col-span-2" style={{ background: 'rgba(31,41,55,0.4)' }}>
            <div className="text-[10px] text-gray-500">Combined Mass</div>
            <div className="text-lg font-bold text-amber-400">{(totalMass / 1e6).toFixed(0)}t</div>
          </div>
        </div>
      );
    }
    default:
      return <div className="text-gray-500 text-sm">Widget not found</div>;
  }
}

export default function CustomDashboardPage() {
  const [placed, setPlaced] = useState<PlacedWidget[]>([]);
  const [draggedWidget, setDraggedWidget] = useState<Widget | null>(null);

  const addWidget = useCallback((widget: Widget) => {
    setPlaced(prev => [...prev, { ...widget, instanceId: `${widget.id}-${Date.now()}` }]);
  }, []);

  const removeWidget = useCallback((instanceId: string) => {
    setPlaced(prev => prev.filter(w => w.instanceId !== instanceId));
  }, []);

  const resetLayout = useCallback(() => setPlaced([]), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-cyan-400" />
            <span className="gradient-text">Custom Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Build your own analytics view</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost text-xs flex items-center gap-2">
            <Save className="w-3.5 h-3.5" /> Save Layout
          </button>
          <button className="btn-ghost text-xs flex items-center gap-2">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="btn-ghost text-xs flex items-center gap-2" onClick={resetLayout}>
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Widget Library */}
        <div className="w-56 shrink-0">
          <h3 className="text-sm font-semibold mb-3 text-gray-400">Widgets</h3>
          <div className="space-y-2">
            {availableWidgets.map(widget => (
              <button
                key={widget.id}
                onClick={() => addWidget(widget)}
                className="w-full text-left p-3 rounded-lg transition-all hover:bg-purple-500/10 border border-gray-800 hover:border-purple-500/30"
                style={{ background: 'rgba(16,16,42,0.5)' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {widget.icon}
                  <span className="text-xs font-semibold">{widget.name}</span>
                </div>
                <p className="text-[10px] text-gray-500">{widget.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex-1">
          {placed.length === 0 ? (
            <div className="h-96 flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-800">
              <div className="text-center">
                <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-gray-700" />
                <p className="text-lg font-medium text-gray-500 mb-2">Your dashboard is empty</p>
                <p className="text-sm text-gray-600">Click widgets from the sidebar to add them</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {placed.map(widget => (
                  <motion.div
                    key={widget.instanceId}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`data-card ${widget.defaultW > 1 ? 'md:col-span-2' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-3 pb-2" style={{ borderBottom: '1px solid rgba(75,85,99,0.2)' }}>
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-gray-600 cursor-move" />
                        <span className="text-sm font-semibold">{widget.name}</span>
                      </div>
                      <button onClick={() => removeWidget(widget.instanceId)} className="text-gray-600 hover:text-gray-300 transition">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {renderWidgetContent(widget.id)}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
