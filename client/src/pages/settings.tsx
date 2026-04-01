import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Save, Loader2 } from 'lucide-react'
import { useProfile } from '@/hooks/use-profile'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'

export default function SettingsPage() {
  const { profile, isLoading, updateProfile, isUpdating } = useProfile()
  const user = useAuthStore(state => state.user)

  const [formData, setFormData] = useState({
    fullName: '',
    profession: '',
    country: '',
    currency: '',
    monthlySalary: '',
  })
  
  // Populate form when profile query returns data
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        profession: profile.profession || '',
        country: profile.country || 'Bangladesh',
        currency: profile.currency || 'BDT',
        monthlySalary: profile.monthlySalary ? parseFloat(profile.monthlySalary).toString() : '',
      })
    }
  }, [profile])

  const handleSaveProfile = async () => {
    await updateProfile(formData)
  }

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

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
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Email (Read Only)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-xl bg-surface/50 border border-border text-foreground-subtle text-sm cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Profession</label>
            <input
              type="text"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Country</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Currency</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground-muted mb-1.5">Monthly Salary</label>
            <input
              type="number"
              value={formData.monthlySalary}
              onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-foreground text-sm focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleSaveProfile} 
            disabled={isUpdating} 
            className="gap-2 shadow-glow-primary rounded-xl px-6"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
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
