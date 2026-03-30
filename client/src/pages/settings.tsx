import { motion } from 'framer-motion'
import { User, Bell, Shield, Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-[800px] mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-sm text-foreground-muted mt-0.5">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Profile</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Full Name', placeholder: 'John Doe', type: 'text' },
            { label: 'Email', placeholder: 'john@example.com', type: 'email' },
            { label: 'Profession', placeholder: 'Software Engineer', type: 'text' },
            { label: 'Country', placeholder: 'United States', type: 'text' },
            { label: 'Currency', placeholder: 'USD', type: 'text' },
            { label: 'Monthly Salary', placeholder: '8500', type: 'number' },
          ].map((field) => (
            <div key={field.label}>
              <label className="block text-sm font-medium text-foreground-muted mb-1.5">{field.label}</label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm placeholder:text-foreground-subtle focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>
          ))}
        </div>
        <button className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </motion.div>

      {/* Notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Bell className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Budget alerts', desc: 'Get notified when spending exceeds budget limits' },
            { label: 'Goal milestones', desc: 'Celebrate when you reach savings milestones' },
            { label: 'Weekly insights', desc: 'AI-generated financial insights every week' },
            { label: 'Monthly reports', desc: 'Summary email on the 1st of each month' },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-foreground-subtle">{item.desc}</p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-surface-active rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
              </label>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6 border-destructive/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground">Danger Zone</h3>
        </div>
        <p className="text-sm text-foreground-muted mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <button className="px-5 py-2.5 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-colors">
          Delete Account
        </button>
      </motion.div>
    </div>
  )
}
