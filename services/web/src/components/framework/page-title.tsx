type Props = {
  title: string;
  description?: string;
};

export function PageTitle({ title, description }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="font-bold text-3xl">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
