import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = true, padding = 'md', hover = true, children, ...props }, ref) => {
    const paddings = {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <motion.div
        whileHover={hover ? { scale: 1.01, transition: { duration: 0.2 } } : {}}
        ref={ref}
        className={cn(
          "rounded-2xl transition-all border",
          glass ? "glass" : "bg-surface",
          paddings[padding],
          hover && "hover:shadow-card-hover hover:border-border-hover",
          className
        )}
        {...(props as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    )
  }
)
Card.displayName = "Card"

export { Card }
