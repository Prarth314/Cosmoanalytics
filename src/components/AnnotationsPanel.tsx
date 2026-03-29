import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, ThumbsDown, Lightbulb, AlertTriangle, HelpCircle, X } from 'lucide-react';
import { sampleAnnotations } from '../data';
import type { Annotation } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface AnnotationsPanelProps {
  dataPointId: string;
  onClose: () => void;
}

export default function AnnotationsPanel({ dataPointId, onClose }: AnnotationsPanelProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>(
    sampleAnnotations.filter(a => a.dataPoint === dataPointId)
  );
  const [newAnnotation, setNewAnnotation] = useState('');
  const [annotationType, setAnnotationType] = useState<'insight' | 'question' | 'issue'>('insight');
  const [showReplies, setShowReplies] = useState<Record<number, boolean>>({});
  const [replyText, setReplyText] = useState<Record<number, string>>({});

  const handleAddAnnotation = () => {
    if (!newAnnotation.trim()) return;
    const annotation: Annotation = {
      id: Date.now(),
      dataPoint: dataPointId,
      user: { name: 'You', initials: 'YO', role: 'Explorer' },
      type: annotationType,
      content: newAnnotation,
      upvotes: 0,
      downvotes: 0,
      timestamp: new Date(),
      replies: [],
    };
    setAnnotations(prev => [annotation, ...prev]);
    setNewAnnotation('');
  };

  const handleVote = (id: number, direction: 'up' | 'down') => {
    setAnnotations(prev => prev.map(a => {
      if (a.id !== id) return a;
      return direction === 'up'
        ? { ...a, upvotes: a.upvotes + 1 }
        : { ...a, downvotes: a.downvotes + 1 };
    }));
  };

  const handleAddReply = (annotationId: number) => {
    const text = replyText[annotationId];
    if (!text?.trim()) return;
    setAnnotations(prev => prev.map(a => {
      if (a.id !== annotationId) return a;
      return {
        ...a,
        replies: [...a.replies, {
          id: Date.now(),
          user: { name: 'You', initials: 'YO' },
          content: text,
          timestamp: new Date(),
        }],
      };
    }));
    setReplyText(prev => ({ ...prev, [annotationId]: '' }));
  };

  const typeIcon = { insight: Lightbulb, question: HelpCircle, issue: AlertTriangle };
  const typeColor = { insight: '#10B981', question: '#3B82F6', issue: '#F59E0B' };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed top-16 right-0 bottom-0 z-40 overflow-y-auto"
      style={{
        width: '400px',
        background: 'rgba(10,10,26,0.97)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(75,85,99,0.3)',
      }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 px-5 py-4" style={{
        background: 'rgba(10,10,26,0.95)',
        borderBottom: '1px solid rgba(75,85,99,0.2)',
      }}>
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold">Community Insights</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500">{annotations.length} annotations</p>
      </div>

      <div className="px-5 py-4 space-y-4">
        {/* Add new */}
        <div className="data-card" style={{ padding: '14px' }}>
          <textarea
            className="input-cosmos text-sm resize-none"
            placeholder="Share your insight..."
            value={newAnnotation}
            onChange={(e) => setNewAnnotation(e.target.value)}
            rows={3}
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex gap-1">
              {(['insight', 'question', 'issue'] as const).map(t => {
                const Icon = typeIcon[t];
                return (
                  <button
                    key={t}
                    className={`btn-ghost text-[11px] px-2 py-1 flex items-center gap-1 ${annotationType === t ? 'border-purple-500/50' : ''}`}
                    style={annotationType === t ? { borderColor: typeColor[t], color: typeColor[t] } : {}}
                    onClick={() => setAnnotationType(t)}
                  >
                    <Icon className="w-3 h-3" />
                    {t}
                  </button>
                );
              })}
            </div>
            <button className="btn-cosmos text-xs px-3 py-1.5" onClick={handleAddAnnotation}>
              Post
            </button>
          </div>
        </div>

        {/* Existing annotations */}
        {annotations.map(annotation => {
          const TypeIcon = typeIcon[annotation.type];
          return (
            <div key={annotation.id} className="data-card" style={{ padding: '14px' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)', color: 'white' }}>
                  {annotation.user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold">{annotation.user.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
                      style={{
                        background: `${typeColor[annotation.type]}20`,
                        border: `1px solid ${typeColor[annotation.type]}40`,
                        color: typeColor[annotation.type],
                      }}>
                      <TypeIcon className="w-2.5 h-2.5" />
                      {annotation.type}
                    </span>
                    <span className="text-[10px] text-gray-600">
                      {formatDistanceToNow(annotation.timestamp)} ago
                    </span>
                  </div>
                  {annotation.user.role && (
                    <div className="text-[10px] text-gray-500 mb-2">{annotation.user.role}</div>
                  )}
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{annotation.content}</p>

                  {/* Votes & replies */}
                  <div className="flex items-center gap-3 text-xs">
                    <button className="btn-ghost px-2 py-1 flex items-center gap-1 text-[11px]"
                      onClick={() => handleVote(annotation.id, 'up')}>
                      <ThumbsUp className="w-3 h-3" /> {annotation.upvotes}
                    </button>
                    <button className="btn-ghost px-2 py-1 flex items-center gap-1 text-[11px]"
                      onClick={() => handleVote(annotation.id, 'down')}>
                      <ThumbsDown className="w-3 h-3" /> {annotation.downvotes}
                    </button>
                    <button className="btn-ghost px-2 py-1 flex items-center gap-1 text-[11px]"
                      onClick={() => setShowReplies(p => ({ ...p, [annotation.id]: !p[annotation.id] }))}>
                      <MessageCircle className="w-3 h-3" /> {annotation.replies.length} replies
                    </button>
                  </div>

                  {/* Threaded replies */}
                  <AnimatePresence>
                    {showReplies[annotation.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2 pl-3"
                        style={{ borderLeft: '2px solid rgba(75,85,99,0.3)' }}
                      >
                        {annotation.replies.map(reply => (
                          <div key={reply.id} className="text-sm">
                            <div className="flex items-center gap-2 mb-0.5">
                              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold"
                                style={{ background: 'rgba(139,92,246,0.3)', color: '#c4b5fd' }}>
                                {reply.user.initials}
                              </div>
                              <span className="text-xs font-semibold">{reply.user.name}</span>
                              <span className="text-[10px] text-gray-600">
                                {formatDistanceToNow(reply.timestamp)} ago
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 ml-7">{reply.content}</p>
                          </div>
                        ))}
                        <div className="flex gap-2 mt-2">
                          <input
                            className="input-cosmos text-xs flex-1 py-1.5"
                            placeholder="Reply..."
                            value={replyText[annotation.id] || ''}
                            onChange={(e) => setReplyText(p => ({ ...p, [annotation.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddReply(annotation.id)}
                          />
                          <button className="btn-ghost text-xs px-2 py-1" onClick={() => handleAddReply(annotation.id)}>
                            Reply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}

        {annotations.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No annotations yet. Be the first!</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
