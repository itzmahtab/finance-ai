import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Banknote,
  TrendingUp,
  Shield,
  Bot,
  ArrowRight,
  ChevronRight,
  Wallet,
  BarChart3,
  Target,
  Bell,
  Sparkles,
  Check,
} from 'lucide-react'

const features = [
  {
    icon: Wallet,
    title: 'Smart Budgeting',
    desc: 'AI-powered 50/30/20 budget breakdowns tailored to your income and lifestyle.',
    color: 'text-primary',
    bg: 'bg-primary-muted',
  },
  {
    icon: BarChart3,
    title: 'Investment Tracking',
    desc: 'Monitor your portfolio across stocks, ETFs, crypto and more in one dashboard.',
    color: 'text-accent',
    bg: 'bg-accent-muted',
  },
  {
    icon: Target,
    title: 'Financial Goals',
    desc: 'Set savings targets with visual progress tracking and AI-suggested timelines.',
    color: 'text-warning',
    bg: 'bg-warning-muted',
  },
  {
    icon: Bot,
    title: 'AI Advisor',
    desc: 'Chat with an AI financial advisor that understands your complete financial picture.',
    color: 'text-purple',
    bg: 'bg-purple/10',
  },
  {
    icon: Bell,
    title: 'Smart Alerts',
    desc: 'Get notified when you exceed budgets, reach milestones, or need to take action.',
    color: 'text-destructive',
    bg: 'bg-destructive-muted',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    desc: 'Your data is encrypted and never shared. JWT auth with secure httpOnly cookies.',
    color: 'text-chart-1',
    bg: 'bg-chart-1/10',
  },
]

const plans = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Perfect for getting started',
    features: ['Up to 50 transactions/mo', 'Basic budgeting', '3 financial goals', 'AI chat (limited)'],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    desc: 'For serious money managers',
    features: ['Unlimited transactions', 'Advanced analytics', 'Unlimited goals', 'Full AI advisor', 'CSV import/export', 'Priority support'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29',
    desc: 'For families & teams',
    features: ['Everything in Pro', 'Multi-user support', 'Shared budgets', 'Custom categories', 'API access', 'Dedicated support'],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text-primary">FinanceAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-foreground-muted">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl gradient-primary hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glow effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-muted text-primary text-xs font-semibold mb-6 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Finance Management
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              Take Control of Your{' '}
              <span className="gradient-text-primary">Financial Future</span>
            </h1>

            <p className="text-lg sm:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered budgeting, investment tracking, and personalized financial advice — all in one beautiful dashboard. Start building wealth today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-primary text-white font-semibold text-base hover:opacity-90 transition-all shadow-glow-primary hover:shadow-[0_0_30px_hsl(142_71%_45%_/_0.25)]"
              >
                Start Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-border text-foreground-muted font-medium text-base hover:bg-surface-hover hover:text-foreground transition-all"
              >
                Learn More
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-8 mt-16 text-center"
          >
            {[
              { label: 'Active Users', value: '12K+' },
              { label: 'Money Tracked', value: '$48M+' },
              { label: 'AI Insights', value: '200K+' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold gradient-text-primary">{stat.value}</p>
                <p className="text-xs text-foreground-subtle mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Everything You Need to{' '}
              <span className="gradient-text-accent">Build Wealth</span>
            </h2>
            <p className="text-foreground-muted max-w-xl mx-auto">
              Powerful tools designed to give you complete visibility and control over your finances.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-foreground-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Simple, Transparent{' '}
              <span className="gradient-text-primary">Pricing</span>
            </h2>
            <p className="text-foreground-muted">Start for free. Upgrade when you need more.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-6 flex flex-col relative ${plan.popular ? 'border-primary/40 shadow-glow-primary' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full gradient-primary text-white text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                <p className="text-foreground-muted text-sm mt-1">{plan.desc}</p>
                <div className="my-5">
                  <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-foreground-subtle text-sm">/mo</span>
                </div>
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground-muted">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'gradient-primary text-white hover:opacity-90'
                      : 'bg-surface-hover text-foreground hover:bg-surface-active'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 pointer-events-none" />
          <div className="relative">
            <TrendingUp className="w-12 h-12 text-primary mx-auto mb-5" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Ready to Build Your Financial Future?
            </h2>
            <p className="text-foreground-muted max-w-lg mx-auto mb-8">
              Join thousands of users who are already saving smarter, investing better, and reaching their financial goals faster.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl gradient-primary text-white font-semibold hover:opacity-90 transition-all shadow-glow-primary"
            >
              Get Started — It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-foreground-subtle">
          <div className="flex items-center gap-2">
            <Banknote className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground-muted">FinanceAI</span>
          </div>
          <span>© {new Date().getFullYear()} FinanceAI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  )
}
