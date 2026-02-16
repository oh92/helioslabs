type StepIndicatorProps =
  | {
      variant: 'timeline';
      number: string;
      title: string;
      status: 'complete' | 'active' | 'planned';
      description: string;
      isLast?: boolean;
    }
  | {
      variant: 'numbered';
      number: string;
      title: string;
      items: string[];
    };

export function StepIndicator(props: StepIndicatorProps) {
  if (props.variant === 'numbered') {
    return (
      <div className="flex gap-6">
        <span className="font-data text-sm text-muted-foreground shrink-0 w-6">{props.number}</span>
        <div className="flex-1">
          <h3 className="font-semibold mb-2">{props.title}</h3>
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-1">
            {props.items.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-green-600 mt-1.5">&bull;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const { number, title, status, description, isLast = false } = props;

  return (
    <div className="relative flex gap-6 pb-8">
      {!isLast && (
        <div className="absolute left-[11px] top-8 bottom-0 w-px bg-border" />
      )}
      <div className="relative z-10 flex-shrink-0">
        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs
          ${status === 'complete' ? 'border-foreground bg-foreground text-background' : ''}
          ${status === 'active' ? 'border-green-600 bg-green-600 text-white' : ''}
          ${status === 'planned' ? 'border-border bg-background text-muted-foreground' : ''}
        `}>
          {status === 'complete' && '✓'}
          {status === 'active' && <span className="h-2 w-2 rounded-full bg-white pulse-dot" />}
          {status === 'planned' && number}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-xs text-muted-foreground">{number}</span>
          <h3 className="font-semibold">{title}</h3>
          {status === 'active' && (
            <span className="text-xs text-green-600">Active</span>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
