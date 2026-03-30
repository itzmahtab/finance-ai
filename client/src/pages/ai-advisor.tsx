import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, User, Sparkles, Lightbulb, PieChart, Target, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAI } from '@/hooks/use-ai'

const suggestions = [
  { icon: Lightbulb, label: 'How can I save more BDT this month?' },
  { icon: PieChart, label: 'Analyze my 50/30/20 spending' },
  { icon: Target, label: 'Suggest a savings plan for a goal' },
  { icon: TrendingUp, label: 'Where should I invest my extra savings?' },
]

export default function AIAdvisorPage() {
  const { messages, sendMessage, isTyping } = useAI()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(scrollToBottom, [messages, isTyping])

  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || isTyping) return

    setInput('')
    try {
      await sendMessage(msg)
    } catch (err) {
      // Error handled by hook
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="max-w-[1000px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-border/50 mb-4 px-2">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Financial Expert</h2>
          <p className="text-xs text-foreground-muted flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--color-primary-rgb),0.5)]" />
            Gemini 2.0 — Live Context Enabled
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar px-2">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i === messages.length - 1 ? 0.05 : 0 }}
            className={cn('flex gap-4 group', msg.role === 'user' && 'flex-row-reverse')}
          >
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm',
                msg.role === 'assistant' ? 'bg-surface border border-border' : 'gradient-primary text-white'
              )}
            >
              {msg.role === 'assistant' ? (
                <Bot className="w-5 h-5 text-accent" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm',
                msg.role === 'assistant'
                  ? 'glass-strong text-foreground border border-white/5'
                  : 'bg-primary text-white shadow-lg shadow-primary/20'
              )}
            >
              <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-accent" />
            </div>
            <div className="glass-strong rounded-2xl px-5 py-4 border border-white/5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-accent/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !isTyping && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => handleSend(s.label)}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl glass-strong border border-white/5 text-sm text-foreground-muted hover:text-foreground hover:border-accent/30 hover:bg-surface-hover/50 transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                <s.icon className="w-4 h-4 text-accent" />
              </div>
              <span className="font-medium tracking-tight">{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="pt-4 border-t border-border/50">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-focus-within:opacity-30 transition-opacity rounded-3xl" />
          <div className="relative flex items-center gap-2 glass-strong rounded-2xl px-5 py-3 border border-white/5 group-focus-within:border-primary/50 transition-all">
            <Sparkles className="w-5 h-5 text-accent shrink-0 animate-pulse" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to your advisor..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none py-1 selection:bg-primary/30"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="p-2.5 rounded-xl gradient-primary text-white hover:opacity-90 hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        <p className="text-[10px] text-center text-foreground-subtle mt-3 font-medium uppercase tracking-widest">
           AI can make mistakes. Consider consulting a real professional for major decisions.
        </p>
      </div>
    </div>
  )
}
