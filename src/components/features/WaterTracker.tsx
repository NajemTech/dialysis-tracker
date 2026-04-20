
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import { Droplets, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WaterTracker() {
  const { lang, t } = useLanguage();
  const { todayLog, addWater } = useTracking();
  const [customAmount, setCustomAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddWater = async (ml: number) => {
    setIsSaving(true);
    await addWater(ml);
    setIsSaving(false);
  };

  const handleCustomAdd = async () => {
    const amount = parseInt(customAmount);
    if (amount && amount > 0) {
      setIsSaving(true);
      await addWater(amount);
      setIsSaving(false);
      setCustomAmount('');
    }
  };

  const quickAddAmounts = [100, 200, 250];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900/30">
          <Droplets className="size-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h3 className="font-display text-base font-semibold">{lang === 'ar' ? 'تتبع المياه' : 'Water Tracker'}</h3>
      </div>

      <div className="mb-4 text-center">
        <p className="text-3xl font-bold text-foreground tabular-nums">
          {todayLog.waterIntake}
        </p>
        <p className="text-xs text-muted-foreground">{lang === 'ar' ? 'ملليتر اليوم' : 'ml today'}</p>
      </div>

      <div className="mb-3 grid gap-2 sm:flex">
        {quickAddAmounts.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            size="sm"
            onClick={() => handleAddWater(amount)}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
            {amount}ml
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder={lang === 'ar' ? 'مقدار' : 'Amount'}
          className="flex h-8 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <Button
          size="sm"
          variant="outline"
          onClick={handleCustomAdd}
          disabled={!customAmount || isSaving}
          className="px-3"
        >
          {isSaving ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        </Button>
      </div>
    </div>
  );
}
