import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import { useReminders } from '@/hooks/useReminders';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  User, Globe, Moon, Bell, Heart, Plus, Trash2, Scale,
  Pill, Stethoscope, Dumbbell, ShoppingCart, CalendarHeart,
  Info, Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const REMINDER_ICONS: Record<string, typeof Pill> = {
  medication: Pill,
  doctor: Stethoscope,
  gym: Dumbbell,
  shopping: ShoppingCart,
  personal: CalendarHeart,
};

export default function Settings() {
  const { lang, t, setLanguage } = useLanguage();
  const { profile, updateProfile, getLimits } = useTracking();
  const { reminders, addReminder, removeReminder, toggleReminder } = useReminders();
  const { toast } = useToast();

  const [name, setName] = useState(profile.name);
  const [weight, setWeight] = useState(String(profile.weight));
  const [newReminder, setNewReminder] = useState({ titleEn: '', titleAr: '', type: 'medication' as const, time: '09:00', days: [1, 2, 3, 4, 5] });
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const limits = getLimits();

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, weight: Number(weight) || 60 });
      toast({ title: lang === 'ar' ? 'تم الحفظ' : 'Saved', description: t.settings.saved, variant: 'success' });
    } catch (error) {
      toast({ 
        title: lang === 'ar' ? 'خطأ' : 'Error', 
        description: lang === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings',
        variant: 'destructive' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddReminder = () => {
    if (!newReminder.titleEn && !newReminder.titleAr) return;
    addReminder({ ...newReminder, active: true });
    setNewReminder({ titleEn: '', titleAr: '', type: 'medication', time: '09:00', days: [1, 2, 3, 4, 5] });
    setShowAddReminder(false);
  };

  const reminderTypes = [
    { value: 'medication', label: t.settings.medication },
    { value: 'doctor', label: t.settings.doctor },
    { value: 'gym', label: t.settings.gym },
    { value: 'shopping', label: t.settings.shopping },
    { value: 'personal', label: t.settings.personal },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="mb-8 font-display text-2xl font-bold text-foreground sm:text-3xl">
          {t.settings.title}
        </h1>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-7">
            {/* Profile */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <User className="size-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">{t.settings.profile}</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.settings.name}</Label>
                  <Input id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">
                    <span className="flex items-center gap-1.5">
                      <Scale className="size-3.5" />
                      {t.settings.weight}
                    </span>
                  </Label>
                  <Input id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                  <p className="text-xs text-muted-foreground">{t.settings.weightHelp}</p>
                </div>
              </div>
              <Button onClick={handleSaveProfile} className="mt-4" size="sm" disabled={isSaving}>
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : t.dashboard.save}
              </Button>
            </div>

            {/* Language & Theme */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Globe className="size-5 text-primary" />
                    <span className="font-semibold">{t.settings.language}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={lang === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('en')}
                    >
                      English
                    </Button>
                    <Button
                      variant={lang === 'ar' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setLanguage('ar')}
                    >
                      العربية
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Moon className="size-5 text-primary" />
                    <span className="font-semibold">{t.settings.darkMode}</span>
                  </div>
                  <Switch
                    checked={profile.darkMode}
                    onCheckedChange={checked => updateProfile({ darkMode: checked })}
                  />
                </div>
              </div>
            </div>

            {/* Nutrient Limits */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-2.5">
                <Info className="size-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">{t.settings.nutrientLimits}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: t.dashboard.potassium, val: limits.potassium, unit: 'mg', color: 'text-nutrient-potassium' },
                  { label: t.dashboard.phosphorus, val: limits.phosphorus, unit: 'mg', color: 'text-nutrient-phosphorus' },
                  { label: t.dashboard.sodium, val: limits.sodium, unit: 'mg', color: 'text-nutrient-sodium' },
                  { label: t.dashboard.protein, val: limits.protein, unit: 'g', color: 'text-nutrient-protein' },
                ].map(n => (
                  <div key={n.label} className="rounded-xl bg-muted/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">{n.label}</p>
                    <p className={`mt-1 text-xl font-bold tabular-nums ${n.color}`}>
                      {n.val}<span className="text-xs font-normal text-muted-foreground">{n.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Reminders */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="size-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold">{t.settings.reminders}</h2>
                </div>
                <Button size="sm" variant="outline" onClick={() => setShowAddReminder(true)} className="gap-1.5">
                  <Plus className="size-3.5" />
                  {t.settings.addReminder}
                </Button>
              </div>

              {showAddReminder && (
                <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t.settings.reminderTitle} (EN)</Label>
                      <Input
                        value={newReminder.titleEn}
                        onChange={e => setNewReminder(p => ({ ...p, titleEn: e.target.value }))}
                        placeholder="Take medicine"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t.settings.reminderTitle} (AR)</Label>
                      <Input
                        value={newReminder.titleAr}
                        onChange={e => setNewReminder(p => ({ ...p, titleAr: e.target.value }))}
                        placeholder="تناول الدواء"
                        className="h-8 text-sm"
                        dir="rtl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t.settings.reminderType}</Label>
                      <select
                        value={newReminder.type}
                        onChange={e => setNewReminder(p => ({ ...p, type: e.target.value as any }))}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                        title={t.settings.reminderType}
                      >
                        {reminderTypes.map(rt => (
                          <option key={rt.value} value={rt.value}>{rt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">{t.settings.reminderTime}</Label>
                      <Input
                        type="time"
                        value={newReminder.time}
                        onChange={e => setNewReminder(p => ({ ...p, time: e.target.value }))}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={handleAddReminder} className="h-7 text-xs">
                      {t.settings.addReminder}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowAddReminder(false)} className="h-7 text-xs">
                       Cancel
                    </Button>
                  </div>
                </div>
              )}

              {reminders.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="mx-auto mb-3 size-8 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Cancel</p>
                  <p className="mt-1 text-xs text-muted-foreground/70">Cancel</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {reminders.map(r => {
                    const Icon = REMINDER_ICONS[r.type] || Bell;
                    return (
                      <div key={r.id} className="flex items-center gap-3 rounded-xl bg-muted/50 px-4 py-3">
                        <Icon className="size-4 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {lang === 'ar' ? r.titleAr || r.titleEn : r.titleEn || r.titleAr}
                          </p>
                          <p className="text-xs text-muted-foreground">{r.time}</p>
                        </div>
                        <Switch
                          checked={r.active}
                          onCheckedChange={() => toggleReminder(r.id)}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 text-muted-foreground hover:text-destructive"
                          onClick={() => removeReminder(r.id)}
                          aria-label="no data"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* About */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <Heart className="size-5 text-accent" />
                <h2 className="font-display text-lg font-semibold">{t.settings.about}</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {t.settings.aboutText}
              </p>
              <div className="rounded-xl bg-primary/5 p-4">
                <p className="text-sm font-medium text-foreground">{'Credits'}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.landing.acknowledgmentText}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {t.nav.footer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
