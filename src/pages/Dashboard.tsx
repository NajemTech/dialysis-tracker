import { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import NutrientBar from '@/components/features/NutrientBar';
import FoodCard from '@/components/features/FoodCard';
import WaterTracker from '@/components/features/WaterTracker';
import MotivationalQuote from '@/components/features/MotivationalQuote';
import ExportButton from '@/components/features/ExportButton';
import { Search, Trash2, UtensilsCrossed, ClipboardList, Stethoscope, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SYMPTOM_TYPES } from '@/constants/config';

export default function Dashboard() {
  const { lang, t } = useLanguage();
  const { profile, foods, todayLog, getTotals, getLimits, removeFood, addSymptom, updateNotes, getAllLogs, loading } = useTracking();
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState(todayLog.notes);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [savingSymptomId, setSavingSymptomId] = useState<string | null>(null);

  const totals = getTotals();
  const limits = getLimits();
  const allLogs = getAllLogs();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.dashboard.morning : hour < 17 ? t.dashboard.afternoon : t.dashboard.evening;

  const filteredFoods = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return foods.filter(
      f => f.nameEn.toLowerCase().includes(q) || f.nameAr.includes(q)
    ).slice(0, 5);
  }, [foods, search]);

  const trackedItems = todayLog.trackedFoods.map(tf => ({
    ...tf,
    food: foods.find(f => f.id === tf.foodId),
  }));

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await updateNotes(notes);
    setIsSavingNotes(false);
  };

  useEffect(() => {
    setNotes(todayLog.notes);
  }, [todayLog.notes]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              {greeting}, {profile.name || 'User'} 👋
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.dashboard.todaySummary}</p>
          </div>
          <ExportButton
            logs={allLogs}
            totals={totals}
            limits={limits}
            userName={profile.name}
            dateRange={{ start: todayLog.date, end: todayLog.date }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <h2 className="mb-5 font-display text-lg font-semibold">{t.dashboard.todaySummary}</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <NutrientBar label={t.dashboard.potassium} current={totals.potassium} limit={limits.potassium} unit={t.dashboard.mg} color="potassium" />
                <NutrientBar label={t.dashboard.phosphorus} current={totals.phosphorus} limit={limits.phosphorus} unit={t.dashboard.mg} color="phosphorus" />
                <NutrientBar label={t.dashboard.sodium} current={totals.sodium} limit={limits.sodium} unit={t.dashboard.mg} color="sodium" />
                <NutrientBar label={t.dashboard.protein} current={totals.protein} limit={limits.protein} unit={t.dashboard.g} color="protein" />
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">{t.dashboard.quickAdd}</h2>
              <div className="relative mb-4">
                <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t.dashboard.searchFood}
                  className="ps-10"
                />
              </div>
              {filteredFoods.length > 0 && (
                <div className="space-y-2">
                  {filteredFoods.map(food => (
                    <FoodCard key={food.id} food={food} compact />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">{t.dashboard.recentMeals}</h2>
              {trackedItems.length === 0 ? (
                <div className="py-10 text-center">
                  <UtensilsCrossed className="mx-auto mb-3 size-10 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-muted-foreground">{t.dashboard.noMeals}</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">{t.dashboard.noMealsDesc}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {trackedItems.map(item => {
                    const potassium = item.potassium ?? ((item.food?.potassium || 0) * item.servings);
                    const phosphorus = item.phosphorus ?? ((item.food?.phosphorus || 0) * item.servings);
                    const sodium = item.sodium ?? ((item.food?.sodium || 0) * item.servings);

                    return (
                      <div key={item.id} className="flex flex-col gap-3 rounded-xl bg-muted/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {lang === 'ar'
                              ? (item.food?.nameAr || item.foodNameAr || item.foodName || 'Unknown')
                              : (item.food?.nameEn || item.foodName || 'Unknown')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.servings} {t.dashboard.servings}
                            {(item.food || item.potassium !== undefined) && (
                              <span className="ms-2 text-muted-foreground/70">
                                • K:{Math.round(potassium)} P:{Math.round(phosphorus)} S:{Math.round(sodium)}
                              </span>
                            )}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-full text-muted-foreground hover:text-destructive sm:size-8 sm:w-auto"
                          onClick={() => removeFood(item.id)}
                          aria-label={t.dashboard.remove}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <MotivationalQuote />
            <WaterTracker />

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <ClipboardList className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-display text-base font-semibold">{t.dashboard.symptoms}</h3>
              </div>
              {todayLog.symptoms.length > 0 && (
                <div className="mb-3 space-y-1.5">
                  {todayLog.symptoms.map(s => {
                    const st = SYMPTOM_TYPES.find(x => x.id === s.type);
                    return (
                      <div key={s.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-xs">
                        <span>{st ? (lang === 'ar' ? st.ar : st.en) : s.type}</span>
                        <span className="font-medium">{'â—'.repeat(s.severity)}</span>
                      </div>
                    );
                  })}
                </div>
              )}
              {todayLog.symptoms.length === 0 && (
                <p className="mb-3 text-xs text-muted-foreground">{t.dashboard.noSymptoms}</p>
              )}
              <div className="grid gap-1.5 sm:flex sm:flex-wrap">
                {SYMPTOM_TYPES.slice(0, 4).map(st => (
                  <Button
                    key={st.id}
                    variant="outline"
                    size="sm"
                    className="h-8 w-full text-xs sm:h-7 sm:w-auto"
                    onClick={async () => {
                      setSavingSymptomId(st.id);
                      await addSymptom(st.id, 1);
                      setSavingSymptomId(null);
                    }}
                    disabled={savingSymptomId !== null}
                  >
                    {savingSymptomId === st.id ? <Loader2 className="size-3.5 animate-spin" /> : (lang === 'ar' ? st.ar : st.en)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Stethoscope className="size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-display text-base font-semibold">{t.dashboard.notes}</h3>
              </div>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder={t.dashboard.notesPlaceholder}
                className="mb-3 min-h-[80px] w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={isSavingNotes} className="w-full">
                {isSavingNotes ? <Loader2 className="size-4 animate-spin" /> : t.dashboard.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
