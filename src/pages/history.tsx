import { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import ExportButton from '@/components/features/ExportButton';
import { Calendar, TrendingUp, TrendingDown, Minus, BarChart3, Loader2 } from 'lucide-react';

type Period = 'daily' | 'weekly' | 'biweekly' | 'monthly';

function getDaysBack(period: Period): number {
  switch (period) {
    case 'daily': return 1;
    case 'weekly': return 7;
    case 'biweekly': return 14;
    case 'monthly': return 30;
  }
}

function formatDate(dateStr: string, lang: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === 'ar' ? 'ar-LB' : 'en-US', { month: 'short', day: 'numeric' });
}

export default function History() {
  const { lang, t } = useLanguage();
  const { getAllLogs, getTotals, getLimits, profile, loading } = useTracking();
  const [period, setPeriod] = useState<Period>('weekly');

  const logs = getAllLogs();
  const limits = getLimits();
  const daysBack = getDaysBack(period);
  const totals = getTotals();

  const chartData = useMemo(() => {
    const today = new Date();
    const data: { date: string; label: string; potassium: number; phosphorus: number; sodium: number; protein: number }[] = [];

    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      const totals = log ? getTotals(log) : { potassium: 0, phosphorus: 0, sodium: 0, protein: 0 };

      data.push({
        date: dateStr,
        label: formatDate(dateStr, lang),
        ...totals,
      });
    }
    return data;
  }, [logs, daysBack, lang, getTotals]);

  const hasData = chartData.some(d => d.potassium > 0 || d.phosphorus > 0 || d.sodium > 0 || d.protein > 0);

  const currentAvg = useMemo(() => {
    const half = Math.floor(chartData.length / 2);
    const recent = chartData.slice(half);
    const older = chartData.slice(0, half);

    const avg = (arr: typeof chartData, key: 'potassium' | 'phosphorus' | 'sodium' | 'protein') =>
      arr.length ? arr.reduce((s, d) => s + d[key], 0) / arr.length : 0;

    return {
      potassium: { current: avg(recent, 'potassium'), previous: avg(older, 'potassium') },
      phosphorus: { current: avg(recent, 'phosphorus'), previous: avg(older, 'phosphorus') },
      sodium: { current: avg(recent, 'sodium'), previous: avg(older, 'sodium') },
      protein: { current: avg(recent, 'protein'), previous: avg(older, 'protein') },
    };
  }, [chartData]);

  const getTrend = (current: number, previous: number) => {
    if (Math.abs(current - previous) < 5) return 'same';
    return current > previous ? 'up' : 'down';
  };

  const periods: { key: Period; label: string }[] = [
    { key: 'daily', label: t.history.daily },
    { key: 'weekly', label: t.history.weekly },
    { key: 'biweekly', label: t.history.biweekly },
    { key: 'monthly', label: t.history.monthly },
  ];

  const nutrients = [
    { key: 'potassium' as const, label: t.dashboard.potassium, color: '#7c3aed', limit: limits.potassium, unit: 'mg' },
    { key: 'phosphorus' as const, label: t.dashboard.phosphorus, color: '#3b82f6', limit: limits.phosphorus, unit: 'mg' },
    { key: 'sodium' as const, label: t.dashboard.sodium, color: '#f59e0b', limit: limits.sodium, unit: 'mg' },
    { key: 'protein' as const, label: t.dashboard.protein, color: '#ef4444', limit: limits.protein, unit: 'g' },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t.history.title}
          </h1>
          <ExportButton
            logs={logs}
            totals={totals}
            limits={limits}
            userName={profile.name}
            dateRange={{
              start: new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              end: new Date().toISOString().split('T')[0],
            }}
          />
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {periods.map(p => (
            <Button
              key={p.key}
              variant={period === p.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.key)}
              className="rounded-full"
            >
              {p.label}
            </Button>
          ))}
        </div>

        {!hasData ? (
          <div className="py-20 text-center">
            <BarChart3 className="mx-auto mb-4 size-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">{t.history.noData}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t.history.noDataDesc}</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Chart */}
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-8">
              <h2 className="mb-5 font-display text-lg font-semibold">{t.history.comparison}</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        background: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '12px',
                        fontSize: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="potassium" name={t.dashboard.potassium} fill="#7c3aed" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="phosphorus" name={t.dashboard.phosphorus} fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sodium" name={t.dashboard.sodium} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="protein" name={t.dashboard.protein} fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trends */}
            <div className="space-y-4 lg:col-span-4">
              <h2 className="font-display text-lg font-semibold">{t.history.trend}</h2>
              {nutrients.map(n => {
                const data = currentAvg[n.key];
                const trend = getTrend(data.current, data.previous);
                return (
                  <div key={n.key} className="rounded-2xl border border-border bg-card p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-semibold" style={{ color: n.color }}>
                        {n.label}
                      </span>
                      {trend === 'up' && <TrendingUp className="size-4 text-destructive" />}
                      {trend === 'down' && <TrendingDown className="size-4 text-emerald-600" />}
                      {trend === 'same' && <Minus className="size-4 text-muted-foreground" />}
                    </div>
                    <p className="text-lg font-bold tabular-nums text-foreground">
                      {Math.round(data.current)} {n.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.history.avgDaily} •{' '}
                      {trend === 'up' ? t.history.trendUp : trend === 'down' ? t.history.trendDown : t.history.trendSame}{' '}
                      {t.history.comparedTo}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Calendar Preview */}
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-12">
              <div className="mb-4 flex items-center gap-2.5">
                <Calendar className="size-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">
                  {lang === 'ar' ? 'نظرة تقويمية' : 'Calendar Overview'}
                </h2>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {chartData.map(day => {
                  const hasAny = day.potassium > 0 || day.sodium > 0;
                  const overLimit =
                    day.potassium > limits.potassium ||
                    day.phosphorus > limits.phosphorus ||
                    day.sodium > limits.sodium ||
                    day.protein > limits.protein;
                  return (
                    <div
                      key={day.date}
                      className={`rounded-xl border p-2 text-center text-xs transition-colors ${
                        overLimit
                          ? 'border-destructive/30 bg-destructive/5'
                          : hasAny
                          ? 'border-primary/30 bg-primary/5'
                          : 'border-border bg-muted/30'
                      }`}
                    >
                      <p className="font-medium text-foreground">{day.label}</p>
                      {hasAny && (
                        <div className="mt-1 flex justify-center gap-0.5">
                          <span className="size-1.5 rounded-full bg-nutrient-potassium" />
                          <span className="size-1.5 rounded-full bg-nutrient-phosphorus" />
                          <span className="size-1.5 rounded-full bg-nutrient-sodium" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
