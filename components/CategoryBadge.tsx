import { Badge } from "@/components/ui/badge";

export function CategoryBadge({ name, color }: { name: string; color?: string | null }) {
  return (
    <Badge className="text-white" style={{ backgroundColor: color ?? "#3b82f6" }}>
      {name}
    </Badge>
  );
}
