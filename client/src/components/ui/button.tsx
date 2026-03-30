import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'destructive' | 'outline' | 'ghost' | 'glass' | 'link'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      primary: 'gradient-primary text-white shadow-glow-primary hover:opacity-90',
      accent: 'gradient-accent text-white shadow-glow-accent hover:opacity-90',
      destructive: 'bg-destructive text-white hover:bg-destructive-hover shadow-lg shadow-destructive/20',
      outline: 'border border-border bg-transparent hover:bg-surface-hover text-foreground',
      ghost: 'bg-transparent hover:bg-surface-hover text-foreground-muted hover:text-foreground',
      glass: 'glass hover:bg-surface-hover text-foreground border-border/50',
      link: 'text-primary underline-offset-4 hover:underline bg-transparent h-auto p-0',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-lg',
      md: 'h-10 px-4 py-2 text-sm rounded-xl',
      lg: 'h-12 px-6 text-base rounded-2xl',
      icon: 'h-10 w-10 flex items-center justify-center rounded-xl',
    }

    return (
      <motion.button
        whileTap={{ scale: 0.98 }}
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all focus-ring disabled:opacity-50 disabled:pointer-events-none active:scale-95',
          variants[variant],
          variant !== 'link' && sizes[size],
          className
        )}
        {...(props as HTMLMotionProps<"button">)}
      >
        {isLoading && (
          <span className="mr-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </span>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
