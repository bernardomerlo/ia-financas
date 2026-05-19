import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("inline-flex rounded-full px-2 py-1 text-xs font-medium", className)}
      {...props}
    >
      {children}
    </span>
  );
}
