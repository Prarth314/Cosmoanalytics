import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip
} from 'recharts';
import {
  Rocket, Search, ChevronRight, ChevronLeft, Check, Target, DollarSign,
  TrendingUp, Clock, Download, Share2, RotateCcw, Zap, Shield
} from 'lucide-react';
import { asteroids, spacecraftTypes, formatValue, calculateDeltaV, calculateMissionCost } from '../data';
import type { Asteroid, SpacecraftType, MissionProfile } from '../types';

const steps = ['Select Target', 'Choose Spacecraft', 'Mission Profile', 'Review & Launch'];

export default function MissionPlannerPage() {
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState<Asteroid | null>(null);
  const [spacecraft, setSpacecraft] = useState<SpacecraftType | null>(null);
  const [profile, setProfile] = useState<MissionProfile>('orbital');
  const [searchQ, setSearchQ] = useState('');

  const sortedAsteroids = useMemo(() =>
    [...asteroids]
      .filter(a => !searchQ || a.name.toLowerCase().includes(searchQ.toLowerCase()))
      .sort((a, b) => b.accessibility.score - a.accessibility.score)
  , [searchQ]);

  const missionResult = useMemo(() => {
    if (!target || !spacecraft) return null;
    const dv = calculateDeltaV(1.0, target.orbit.semiMajorAxis);
    const transferTime = target.accessibility.transferTime;
    const profileMultiplier = { flyby: 0.6, orbital: 1.0, landing: 1.5, 'sample-return': 2.2 }[profile];
    const totalDuration = transferTime * profileMultiplier;
    const cost = calculateMissionCost(spacecraft.size, spacecraft.baseCost, totalDuration, profile);

    const feasibility = Math.min(100, Math.max(10,
      100 - (dv / spacecraft.deltavCapacity * 50) - (target.riskScore * 0.3) + (target.accessibility.score * 0.3)
    ));

    const returnValue = profile === 'sample-return'
      ? (spacecraft.payloadCapacity * 0.1 * target.value / (target.physical.mass || 1e10))
      : 0;

    const roi = profile === 'sample-return' ? returnValue - cost.total : 0;

    const roiTimeline = Array.from({ length: 12 }, (_, i) => ({
      year: 2027 + i,
      value: i < Math.ceil(totalDuration) ? -cost.total * (i / Math.ceil(totalDuration))
        : i < Math.ceil(totalDuration) + 2 ? -cost.total + (returnValue * (i - Math.ceil(totalDuration)) / 2)
        : roi,
    }));

    const costBreakdown = [
      { name: 'Launch', value: cost.launch, color: '#3B82F6' },
      { name: 'Spacecraft', value: cost.spacecraft, color: '#8B5CF6' },
      { name: 'Operations', value: cost.operations, color: '#F59E0B' },
      { name: 'Instruments', value: cost.instruments, color: '#10B981' },
    ];

    const milestones = [
      { name: 'Launch', date: '2027-03-15', color: '#3B82F6', position: '0%' },
      { name: 'Course Correction', date: `2027-08-${10 + Math.floor(Math.random() * 20)}`, color: '#8B5CF6', position: '20%' },
      { name: 'Arrival', date: `${2027 + Math.ceil(transferTime)}-${String(1 + Math.floor(Math.random() * 11)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`, color: '#F59E0B', position: '55%' },
      ...(profile === 'sample-return' ? [
        { name: 'Sample Collection', date: `${2028 + Math.ceil(transferTime)}-06-01`, color: '#10B981', position: '70%' },
        { name: 'Return', date: `${2027 + Math.ceil(totalDuration)}-01-19`, color: '#10B981', position: '100%' },
      ] : [
        { name: 'Mission Complete', date: `${2027 + Math.ceil(totalDuration)}-12-01`, color: '#10B981', position: '100%' },
      ]),
    ];

    return { feasibility, dv, totalDuration, cost, roi, returnValue, roiTimeline, costBreakdown, milestones };
  }, [target, spacecraft, profile]);

  const canProceed = () => {
    if (step === 0) return !!target;
    if (step === 1) return !!spacecraft;
    return true;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Rocket className="w-8 h-8 text-blue-400" />
          <span className="gradient-text">Mission Planner</span>
        </h1>
        <p className="text-gray-400 text-sm mt-1">Design your own asteroid mission with real orbital mechanics</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <React.Fragment key={s}>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                i === step ? 'bg-purple-600/20 border border-purple-500/40 text-white' :
                i < step ? 'bg-green-600/10 border border-green-500/30 text-green-400' :
                'bg-gray-800/30 border border-gray-700/30 text-gray-500'
              }`}
              onClick={() => i <= step && setStep(i)}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                i < step ? 'bg-green-500 text-black' : i === step ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </span>
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < steps.length - 1 && <ChevronRight className="w-4 h-4 text-gray-600" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        {/* Step 1: Select Target */}
        {step === 0 && (
          <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="data-card mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input className="input-cosmos pl-10 text-sm" placeholder="Search asteroids..." value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAsteroids.map(a => (
                <div
                  key={a.id}
                  className={`data-card cursor-pointer ${target?.id === a.id ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setTarget(a)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{a.name}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full badge-${a.composition === 'M' ? 'metallic' : a.composition === 'C' ? 'carbonaceous' : 'silicaceous'}`}>
                        {a.composition}-type
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold font-mono text-green-400">{a.accessibility.score}</div>
                      <div className="text-[10px] text-gray-500">Access Score</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                    <div><span className="text-gray-500">Value: </span><span className="text-green-400">{formatValue(a.value)}</span></div>
                    <div><span className="text-gray-500">ΔV: </span><span className="font-mono">{a.accessibility.deltaV} km/s</span></div>
                    <div><span className="text-gray-500">Window: </span>{a.accessibility.nextWindow}</div>
                    <div><span className="text-gray-500">Transfer: </span>{a.accessibility.transferTime}y</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Choose Spacecraft */}
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {spacecraftTypes.map(sc => (
                <div
                  key={sc.id}
                  className={`data-card cursor-pointer ${spacecraft?.id === sc.id ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setSpacecraft(sc)}
                >
                  <div className="text-center mb-4">
                    <Rocket className="w-12 h-12 mx-auto mb-2" style={{
                      color: sc.size === 'small' ? '#06B6D4' : sc.size === 'medium' ? '#8B5CF6' : '#FFD700'
                    }} />
                    <h4 className="text-lg font-bold">{sc.name}</h4>
                    <span className="text-xs text-gray-500 capitalize">{sc.size} class</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">Mass</span><span className="font-mono">{(sc.mass / 1000).toFixed(0)}t</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">ΔV Capacity</span><span className="font-mono">{sc.deltavCapacity} km/s</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Base Cost</span><span className="font-mono text-green-400">{formatValue(sc.baseCost)}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Payload</span><span className="font-mono">{sc.payloadCapacity} kg</span></div>
                  </div>
                  <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(75,85,99,0.2)' }}>
                    <div className="text-[10px] text-gray-500 mb-1">Instruments:</div>
                    <div className="flex flex-wrap gap-1">
                      {sc.instruments.map(inst => (
                        <span key={inst} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{inst}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Mission Profile */}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {([
                { id: 'flyby' as const, label: 'Flyby', desc: 'Cheapest option. Fly past and image.', risk: 'Low', science: 'Basic', cost: '0.6x', icon: '🛸' },
                { id: 'orbital' as const, label: 'Orbital Insertion', desc: 'Enter orbit. Detailed mapping & analysis.', risk: 'Medium', science: 'Good', cost: '1.0x', icon: '🌐' },
                { id: 'landing' as const, label: 'Surface Landing', desc: 'Land on surface. In-situ analysis.', risk: 'High', science: 'Excellent', cost: '1.5x', icon: '🚀' },
                { id: 'sample-return' as const, label: 'Sample Return', desc: 'Collect & return samples. Maximum value.', risk: 'Very High', science: 'Maximum', cost: '2.2x', icon: '💎' },
              ]).map(p => (
                <div
                  key={p.id}
                  className={`data-card cursor-pointer text-center ${profile === p.id ? 'ring-2 ring-purple-500' : ''}`}
                  onClick={() => setProfile(p.id)}
                >
                  <div className="text-4xl mb-3">{p.icon}</div>
                  <h4 className="font-bold mb-1">{p.label}</h4>
                  <p className="text-xs text-gray-400 mb-3">{p.desc}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Risk</span><span>{p.risk}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Science</span><span>{p.science}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Cost Multi</span><span className="font-mono">{p.cost}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {step === 3 && missionResult && target && spacecraft && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feasibility */}
              <div className="data-card text-center">
                <h3 className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" /> Mission Feasibility
                </h3>
                <div className="text-5xl font-bold mb-2" style={{
                  color: missionResult.feasibility > 70 ? '#10B981' : missionResult.feasibility > 40 ? '#F59E0B' : '#EF4444'
                }}>
                  {missionResult.feasibility.toFixed(0)}%
                </div>
                <div className="progress-cosmos mt-3">
                  <div className="fill" style={{
                    width: `${missionResult.feasibility}%`,
                    background: missionResult.feasibility > 70 ? '#10B981' : missionResult.feasibility > 40 ? '#F59E0B' : '#EF4444',
                  }} />
                </div>
                <div className="mt-4 space-y-2 text-sm text-left">
                  <div className="flex justify-between"><span className="text-gray-400">Delta-V Required</span>
                    <span className={missionResult.dv <= spacecraft.deltavCapacity ? 'text-green-400' : 'text-red-400'}>{missionResult.dv.toFixed(1)} km/s</span>
                  </div>
                  <div className="flex justify-between"><span className="text-gray-400">ΔV Capacity</span><span className="text-blue-400">{spacecraft.deltavCapacity} km/s</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Duration</span><span className="text-purple-400">{missionResult.totalDuration.toFixed(1)} years</span></div>
                </div>
              </div>

              {/* Cost */}
              <div className="data-card">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-400" /> Cost Breakdown
                </h3>
                <div className="text-3xl font-bold mb-1">{formatValue(missionResult.cost.total)}</div>
                <div className="text-xs text-gray-500 mb-4">Total mission cost</div>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={missionResult.costBreakdown} innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {missionResult.costBreakdown.map((entry, i) => (
                        <Cell key={i} fill={entry.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(75,85,99,0.3)', borderRadius: '8px', fontSize: 11 }}
                      formatter={(val: number) => formatValue(val)} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 text-xs mt-2">
                  {missionResult.costBreakdown.map(item => (
                    <div key={item.name} className="flex justify-between">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: item.color }} />{item.name}</span>
                      <span className="font-mono">{formatValue(item.value)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI */}
              <div className="data-card">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Return on Investment
                </h3>
                {profile === 'sample-return' ? (
                  <>
                    <div className="text-3xl font-bold mb-1" style={{ color: missionResult.roi > 0 ? '#10B981' : '#EF4444' }}>
                      {missionResult.roi > 0 ? '+' : ''}{formatValue(missionResult.roi)}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">Net expected value</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={missionResult.roiTimeline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(75,85,99,0.2)" />
                        <XAxis dataKey="year" tick={{ fill: '#6B7280', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} tickFormatter={(v) => formatValue(v)} />
                        <Tooltip contentStyle={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(75,85,99,0.3)', borderRadius: '8px', fontSize: 11 }}
                          formatter={(val: number) => formatValue(val)} />
                        <Area type="monotone" dataKey="value" stroke="#10B981" fill="rgba(16,185,129,0.15)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-sm mb-2">ROI calculation available for<br /><strong>Sample Return</strong> missions only</div>
                    <button className="btn-ghost text-xs" onClick={() => { setProfile('sample-return'); setStep(2); }}>
                      Switch to Sample Return
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="data-card mt-6">
              <h3 className="text-sm font-semibold mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" /> Mission Timeline
              </h3>
              <div className="relative h-24">
                <div className="absolute left-0 right-0 top-1/2 h-1 rounded-full" style={{ background: 'rgba(75,85,99,0.3)' }} />
                {missionResult.milestones.map((m, i) => (
                  <div key={i} className="absolute top-1/2 -translate-y-1/2" style={{ left: m.position }}>
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full mb-2" style={{ backgroundColor: m.color, boxShadow: `0 0 10px ${m.color}50` }} />
                      <div className="text-xs font-semibold text-center whitespace-nowrap">{m.name}</div>
                      <div className="text-[10px] text-gray-500 text-center">{m.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6 flex-wrap">
              <button className="btn-cosmos flex items-center gap-2 flex-1 justify-center">
                <Download className="w-4 h-4" /> Export Mission Profile
              </button>
              <button className="btn-ghost flex items-center gap-2 flex-1 justify-center">
                <Share2 className="w-4 h-4" /> Share Mission
              </button>
              <button className="btn-ghost flex items-center gap-2" onClick={() => { setStep(0); setTarget(null); setSpacecraft(null); }}>
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between mt-6">
          <button className="btn-ghost flex items-center gap-2" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ opacity: step === 0 ? 0.3 : 1 }}>
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <button className="btn-cosmos flex items-center gap-2" onClick={() => setStep(step + 1)} disabled={!canProceed()} style={{ opacity: canProceed() ? 1 : 0.3 }}>
            {step === 2 ? 'Review Mission' : 'Next Step'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
