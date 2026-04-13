
interface NutrientBarProps {
  label: string;
  current: number;
  limit: number;
  unit: string;
  color: 'potassium' | 'phosphorus' | 'sodium' | 'protein';
}

const colorClasses = {
  potassium: 'bg-nutrient-potassium',
  phosphorus: 'bg-nutrient-phosphorus',
  sodium: 'bg-nutrient-sodium',
  protein: 'bg-nutrient-protein',
};

const warningThreshold = 0.9;
const dangerThreshold = 1.0;

export default function NutrientBar({ label, current, limit, unit, color }: NutrientBarProps) {
  const percentage = Math.min((current / limit) * 100, 100);
  const isWarning = current >= limit * warningThreshold;
  const isDanger = current >= limit * dangerThreshold;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-sm font-semibold tabular-nums ${isDanger ? 'text-destructive' : isWarning ? 'text-amber-600' : 'text-foreground'}`}>
            {Math.round(current)}
          </span>
          <span className="text-xs text-muted-foreground">/ {limit} {unit}</span>
        </div>
      </div>

      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]} ${
            isDanger ? 'bg-destructive' : isWarning ? 'bg-amber-600' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isDanger && (
        <p className="text-xs font-medium text-destructive">
          {label} exceeded safe limit
        </p>
      )}
      {isWarning && !isDanger && (
        <p className="text-xs font-medium text-amber-600">
          Approaching {label} limit
        </p>
      )}
    </div>
  );
}
