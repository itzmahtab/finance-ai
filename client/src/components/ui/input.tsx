import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle group-focus-within:text-foreground transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-xl bg-surface border border-border px-4 py-2 text-sm",
              "text-foreground placeholder:text-foreground-subtle",
              "focus-ring transition-all group-hover:border-border-hover",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              error && "border-destructive text-destructive placeholder:text-destructive/50",
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle group-focus-within:text-foreground transition-colors">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
