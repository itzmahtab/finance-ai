import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-7xl font-extrabold gradient-text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-2">Page not found</p>
        <p className="text-sm text-foreground-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
