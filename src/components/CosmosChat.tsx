import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, User, Bot } from 'lucide-react';
import type { ChatMessage, QueryIntent } from '../types';
import { asteroids, exoplanets, meteorites, formatValue } from '../data';

function parseQuery(query: string): QueryIntent {
  const q = query.toLowerCase();
  if (q.match(/easiest|accessible|reach|closest|near/)) return { type: 'accessibility', sort: 'asc', limit: 5 };
  if (q.match(/valuable|expensive|worth|richest|biggest value|most worth/)) return { type: 'value', sort: 'desc', limit: 5 };
  if (q.match(/trend|over time|history|growth|discover/)) return { type: 'temporal', visualize: 'timeseries' };
  if (q.match(/habitable|life|goldilocks|earth-like|earthlike/)) return { type: 'habitability', filter: '>60', page: 'exoplanets' };
  if (q.match(/compare|versus|vs|difference/)) return { type: 'comparison' };
  if (q.match(/how many|count|total|number of/)) return { type: 'count' };
  if (q.match(/surprise|random|fun|interesting|cool/)) return { type: 'surprise' };
  if (q.match(/metal|iron|gold|platinum/)) return { type: 'search', term: 'metallic' };
  if (q.match(/danger|risk|threat|impact|collision/)) return { type: 'search', term: 'risk' };
  return { type: 'general', term: q };
}

function generateResponse(intent: QueryIntent): string {
  switch (intent.type) {
    case 'accessibility': {
      const sorted = [...asteroids].sort((a, b) => a.accessibility.deltaV - b.accessibility.deltaV).slice(0, 5);
      return `🎯 **Most Accessible Asteroids** (by delta-v)\n\nBased on delta-v requirements, here are the easiest targets to reach:\n\n${sorted.map((a, i) => `${i + 1}. **${a.name}** — ΔV: ${a.accessibility.deltaV} km/s | Score: ${a.accessibility.score}/100 | Value: ${formatValue(a.value)}`).join('\n')}\n\n💡 **${sorted[0].name}** is the most accessible with only ${sorted[0].accessibility.deltaV} km/s delta-v required. Next window: ${sorted[0].accessibility.nextWindow}.\n\nWould you like me to plan a mission to ${sorted[0].name}?`;
    }
    case 'value': {
      const sorted = [...asteroids].sort((a, b) => b.value - a.value).slice(0, 5);
      return `💎 **Most Valuable Asteroids**\n\n${sorted.map((a, i) => `${i + 1}. **${a.name}** — ${formatValue(a.value)} | ${a.compositionLabel} | Mining Feasibility: ${a.miningFeasibility}%`).join('\n')}\n\n🤯 **${sorted[0].name}** alone is worth ${formatValue(sorted[0].value)}! That's more than the GDP of most countries combined.\n\nThe total tracked value across all ${asteroids.length} asteroids: **${formatValue(asteroids.reduce((s, a) => s + a.value, 0))}**`;
    }
    case 'temporal': {
      return `📈 **Discovery Trends**\n\nSpace object discoveries have exploded in recent decades:\n\n• **1990s**: ~500 known asteroids\n• **2000s**: 1,200 → 5,200 (330% growth)\n• **2010s**: 5,200 → 25,000 (380% growth)\n• **2020s**: 25,000 → 34,000+ (projected)\n\n**Key drivers:**\n- Automated survey telescopes (LINEAR, Catalina, Pan-STARRS)\n- Citizen science programs\n- Antarctic meteorite expeditions\n- Space-based observatories\n\n🔭 The rate of discovery is accelerating. We're finding ~2,000 new NEOs per year now.\n\nUse the Time Machine to scrub through years and watch the data grow!`;
    }
    case 'habitability': {
      const habitable = exoplanets.filter(e => e.habitability.score >= 60).sort((a, b) => b.habitability.score - a.habitability.score);
      return `🌍 **Potentially Habitable Exoplanets** (Score ≥ 60)\n\nFound **${habitable.length}** candidates:\n\n${habitable.slice(0, 5).map((e, i) => `${i + 1}. **${e.name}** — Score: ${e.habitability.score}/100 | ${e.distance.toFixed(1)} ly | ${e.starType}-type star${e.habitability.hasWater ? ' | 💧 Water detected' : ''}`).join('\n')}\n\n🌟 **${habitable[0].name}** is our best candidate with a habitability score of ${habitable[0].score}/100.\n\n${habitable[0].habitability.tidallyLocked ? '⚠️ Note: This planet is tidally locked (one side always faces its star).' : '✅ This planet rotates freely like Earth!'}\n\nAtmosphere: ${habitable[0].atmosphere.join(', ')}`;
    }
    case 'count': {
      return `📊 **COSMOLYTICS Database Stats**\n\n• **${asteroids.length}** tracked asteroids\n• **${meteorites.length}** catalogued meteorites\n• **${exoplanets.length}** confirmed exoplanets\n\n**By Asteroid Composition:**\n- M-type (Metallic): ${asteroids.filter(a => a.composition === 'M').length}\n- C-type (Carbonaceous): ${asteroids.filter(a => a.composition === 'C').length}\n- S-type (Silicaceous): ${asteroids.filter(a => a.composition === 'S').length}\n\n**Total Estimated Value:** ${formatValue(asteroids.reduce((s, a) => s + a.value, 0))}\n\nThat's enough to make every person on Earth a trillionaire! 🚀`;
    }
    case 'surprise': {
      const facts = [
        `🤯 **Mind-Blowing Fact:** 16 Psyche contains enough iron to supply Earth's industry for millions of years. NASA's Psyche mission is en route right now!`,
        `🌊 **Water in Space:** The asteroid belt contains more water (in ice form) than all of Earth's oceans combined. This could fuel deep-space missions.`,
        `💫 **Cosmic Rain:** About 48.5 tons of meteoritic material falls to Earth every day! Most of it burns up, but some makes it through.`,
        `🔴 **Red Dwarf Planets:** 75% of all stars are M-type red dwarfs. Most habitable zone planets orbit these tiny, long-lived stars.`,
        `🎵 **Space Music:** If you could hear the electromagnetic emissions from planets, Jupiter would sound like a dramatic symphony, while Saturn whispers.`,
        `💰 **Gold Rush:** Asteroid 2011 UW158 passed Earth in 2015 with an estimated $5.4 trillion in platinum. It was closer to us than the Moon!`,
        `🌍 **Rare Meteorite:** ALH 84001, a Martian meteorite found in Antarctica, once caused a White House press conference about possible alien life!`,
      ];
      return facts[Math.floor(Math.random() * facts.length)];
    }
    case 'search': {
      if (intent.term === 'metallic') {
        const metallic = asteroids.filter(a => a.composition === 'M');
        return `⚙️ **Metallic (M-type) Asteroids**\n\n${metallic.length} metallic asteroids in database:\n\n${metallic.map(a => `• **${a.name}** — ${formatValue(a.value)} | ΔV: ${a.accessibility.deltaV} km/s`).join('\n')}\n\nMetallic asteroids are primarily iron-nickel with platinum group metals. They're the most valuable for mining due to high metal concentrations.\n\n🏭 Processing these in space could revolutionize manufacturing on Earth.`;
      }
      if (intent.term === 'risk') {
        const risky = [...asteroids].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5);
        return `⚠️ **Highest Risk Asteroids**\n\n${risky.map((a, i) => `${i + 1}. **${a.name}** — Risk: ${a.riskScore}/100 | Size: ${a.physical.diameter} km | Next approach: ${a.closeApproaches[0]?.date || 'N/A'}`).join('\n')}\n\nRisk scores factor in size, orbital uncertainty, approach frequency, and potential impact energy.\n\n🛡️ Planetary defense missions like DART (2022) proved we can deflect asteroids. We're safer than ever!`;
      }
      // Default search
      const found = asteroids.find(a => a.name.toLowerCase().includes(intent.term || ''));
      if (found) {
        return `🔎 **${found.name}**\n\n• Type: ${found.compositionLabel}\n• Diameter: ${found.physical.diameter} km\n• Value: ${formatValue(found.value)}\n• Accessibility: ${found.accessibility.score}/100 (ΔV: ${found.accessibility.deltaV} km/s)\n• Mining Feasibility: ${found.miningFeasibility}%\n• Next Window: ${found.accessibility.nextWindow}`;
      }
      return `I searched for "${intent.term}" but didn't find an exact match. Try asking about:\n• Most valuable asteroids\n• Habitable exoplanets\n• Discovery trends\n• Risk assessment\n• Or just say "surprise me"! 🎲`;
    }
    default:
      return `I can help you explore space data! Try asking:\n\n• "Which asteroid is most accessible?"\n• "Show me the most valuable targets"\n• "What are the discovery trends?"\n• "Find habitable exoplanets"\n• "How many objects are tracked?"\n• "Surprise me with a fun fact!"\n\n🚀 I analyze ${asteroids.length} asteroids, ${meteorites.length} meteorites, and ${exoplanets.length} exoplanets.`;
  }
}

export default function CosmosChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "🌌 Welcome to **Cosmos AI**! I can analyze asteroids, meteorites, and exoplanets for you. Try asking me anything about space data!\n\nSome ideas:\n• \"Which asteroid is easiest to reach?\"\n• \"Show me habitable planets\"\n• \"Surprise me!\"",
      timestamp: new Date(),
    },
  ]);
  const [query, setQuery] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, thinking]);

  const handleQuery = useCallback(async () => {
    if (!query.trim()) return;
    const userMsg: ChatMessage = { role: 'user', content: query, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setThinking(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const intent = parseQuery(query);
    const response = generateResponse(intent);

    const botMsg: ChatMessage = { role: 'assistant', content: response, timestamp: new Date() };
    setMessages(prev => [...prev, botMsg]);
    setThinking(false);
  }, [query]);

  const suggestedQueries = [
    "Most valuable?",
    "Easiest to reach?",
    "Trends?",
    "Surprise me!",
  ];

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-50 cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
          border: 'none',
          color: 'white',
        }}
        whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(139,92,246,0.5)' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 z-50 flex flex-col"
            style={{
              width: '380px',
              height: '550px',
              background: 'rgba(10,10,26,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(75,85,99,0.3)',
              borderRadius: '16px',
              boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(75,85,99,0.3)' }}>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-semibold text-sm">Cosmos AI</span>
                <span className="text-[10px] text-gray-500">Powered by NLP</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-gray-300 transition p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`flex-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div
                      className={`inline-block px-3 py-2 rounded-xl text-sm leading-relaxed max-w-[280px] text-left ${msg.role === 'user' ? 'bg-blue-600 text-white' : ''}`}
                      style={msg.role === 'assistant' ? { background: 'rgba(31,41,55,0.8)', color: '#e5e7eb' } : {}}
                    >
                      {msg.content.split('\n').map((line, j) => (
                        <React.Fragment key={j}>
                          {line.split(/(\*\*.*?\*\*)/).map((part, k) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={k}>{part.slice(2, -2)}</strong>;
                            }
                            return <span key={k}>{part}</span>;
                          })}
                          {j < msg.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Thinking indicator */}
              {thinking && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3 py-2 rounded-xl" style={{ background: 'rgba(31,41,55,0.8)' }}>
                    <div className="flex gap-1">
                      {[0, 150, 300].map(delay => (
                        <div key={delay} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${delay}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(75,85,99,0.3)' }}>
              <div className="flex gap-2">
                <input
                  className="input-cosmos flex-1 text-sm"
                  placeholder="Ask anything about space data..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                />
                <button
                  className="btn-cosmos px-3"
                  onClick={handleQuery}
                  disabled={!query.trim()}
                  style={{ opacity: query.trim() ? 1 : 0.5 }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {suggestedQueries.map((sq) => (
                  <button
                    key={sq}
                    className="btn-ghost text-[10px] px-2 py-1"
                    onClick={() => { setQuery(sq); }}
                  >
                    {sq}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
