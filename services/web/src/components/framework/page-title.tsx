import { cn } from "../ui/utils";

type Props = {
  title: string;
  description?: string;
  className?: string;
};

export function PageTitle({ title, description, className }: Props) {
  return (
    <div className={cn("space-y-4", className)}>
      <h1 className="font-bold text-3xl">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
