import { useLanguage } from '@/hooks/useLanguage';
import { Phone, Stethoscope, Shield, Flame } from 'lucide-react';
import { EMERGENCY_NUMBERS } from '@/constants/config';

const iconMap = {
  ambulance: Stethoscope,
  cross: Shield,
  shield: Shield,
  fire: Flame,
};

export default function EmergencyNumbers() {
  const { lang } = useLanguage();

  return (
    <section className="border-y border-border bg-destructive/5 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {lang === 'ar' ? 'أرقام الطوارئ' : 'Emergency Numbers'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === 'ar' ? 'لبنان - متاح على مدار الساعة' : 'Lebanon - Available 24/7'}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EMERGENCY_NUMBERS.map((number) => {
            const Icon = iconMap[number.icon as keyof typeof iconMap] || Phone;
            return (
              <a
                key={number.number}
                href={`tel:${number.number}`}
                className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-all hover:border-destructive/30 hover:shadow-md"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                  <Icon className="size-6 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{number.label}</p>
                  <p className="text-lg font-bold text-destructive tabular-nums">{number.number}</p>
                </div>
                <Phone className="size-5 text-muted-foreground group-hover:text-destructive transition-colors rtl:rotate-180" />
              </a>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {lang === 'ar' 
            ? 'هذه الأرقام مخصصة للطوارئ الطبية فقط. في الحالات غير الطارئة، يرجى الاتصال بطبيبك أو مركز الغسيل الكلوي الخاص بك.'
            : 'These numbers are for medical emergencies only. For non-emergency situations, please contact your doctor or dialysis center.'}
        </p>
      </div>
    </section>
  );
}
