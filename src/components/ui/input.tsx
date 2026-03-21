import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "soft-input h-10 w-full min-w-0 rounded-md px-4 py-2 text-base transition-all outline-none placeholder:text-on-surface-variant/50 disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
