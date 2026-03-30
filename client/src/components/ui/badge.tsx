import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'destructive' | 'warning' | 'outline' | 'glass'
  size?: 'xs' | 'sm' | 'md'
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'sm', ...props }, ref) => {
    const variants = {
      default: 'bg-surface-active text-foreground-muted',
      primary: 'bg-primary/15 text-primary',
      accent: 'bg-accent/15 text-accent',
      success: 'bg-primary/20 text-primary',
      warning: 'bg-warning/15 text-warning',
      destructive: 'bg-destructive/15 text-destructive',
      outline: 'border border-border text-foreground-muted',
      glass: 'glass-strong text-foreground-subtle',
    }

    const sizes = {
      xs: 'px-1.5 py-0.5 text-[10px]',
      sm: 'px-2.5 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-lg font-semibold transition-colors uppercase tracking-wider",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
