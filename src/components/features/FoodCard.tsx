
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import type { FoodItem } from '@/types';
import { Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FoodCardProps {
  food: FoodItem;
  compact?: boolean;
}

export default function FoodCard({ food, compact = false }: FoodCardProps) {
  const { lang, t } = useLanguage();
  const { addFood } = useTracking();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addFood(food.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3 hover:border-primary/20 transition-colors">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {lang === 'ar' ? food.nameAr : food.nameEn}
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === 'ar' ? food.categoryAr : food.category}
          </p>
        </div>
        <Button
          size="sm"
          variant={added ? 'default' : 'outline'}
          onClick={handleAdd}
          className="gap-1.5"
        >
          {added ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
          {added ? t.foods.added : t.foods.add}
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 transition-all hover:shadow-md">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {lang === 'ar' ? food.nameAr : food.nameEn}
        </h3>
        <p className="text-sm text-muted-foreground">
          {lang === 'ar' ? food.categoryAr : food.category}
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">{t.dashboard.potassium}</p>
          <p className="font-semibold text-nutrient-potassium">{food.potassium} mg</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">{t.dashboard.phosphorus}</p>
          <p className="font-semibold text-nutrient-phosphorus">{food.phosphorus} mg</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">{t.dashboard.sodium}</p>
          <p className="font-semibold text-nutrient-sodium">{food.sodium} mg</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">{t.dashboard.protein}</p>
          <p className="font-semibold text-nutrient-protein">{food.protein} g</p>
        </div>
      </div>

      <div className="mb-4 text-xs text-muted-foreground">
        <span>{lang === 'ar' ? 'حصة:' : 'Serving:'}</span>
        <span className="ms-1 font-medium text-foreground">
          {lang === 'ar' ? food.servingSizeAr : food.servingSize}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            −
          </button>
          <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            +
          </button>
        </div>
        <Button
          size="sm"
          variant={added ? 'default' : 'outline'}
          onClick={handleAdd}
          className="flex-1 gap-1.5"
        >
          {added ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
          {added ? t.foods.added : t.foods.add}
        </Button>
      </div>
    </div>
  );
}
