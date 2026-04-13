import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import {
  Utensils, BarChart3, Bell, Droplets, Globe2, Heart,
  ArrowRight, ChevronRight, Star, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import EmergencyNumbers from '@/components/features/EmergencyNumbers';
import { testimonials } from '@/constants/mockData';
import heroImg from '@/assets/hero.jpg';

export default function Landing() {
  const { lang, t } = useLanguage();
  const { isLoggedIn } = useTracking();
  const navigate = useNavigate();

  const features = [
    { icon: Utensils, title: t.landing.feat1Title, desc: t.landing.feat1Desc, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { icon: Bell, title: t.landing.feat2Title, desc: t.landing.feat2Desc, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    { icon: BarChart3, title: t.landing.feat3Title, desc: t.landing.feat3Desc, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { icon: Droplets, title: t.landing.feat4Title, desc: t.landing.feat4Desc, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
    { icon: Globe2, title: t.landing.feat5Title, desc: t.landing.feat5Desc, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { icon: Heart, title: t.landing.feat6Title, desc: t.landing.feat6Desc, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
  ];

  const steps = [
    { num: '01', title: t.landing.step1Title, desc: t.landing.step1Desc },
    { num: '02', title: t.landing.step2Title, desc: t.landing.step2Desc },
    { num: '03', title: t.landing.step3Title, desc: t.landing.step3Desc },
    { num: '04', title: t.landing.step4Title, desc: t.landing.step4Desc },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
              <Shield className="size-3.5" />
              {lang === 'ar' ? 'مجاني تماماً' : 'Completely Free'}
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              {t.landing.heroTitle}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t.landing.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              {isLoggedIn ? (
                <Button size="lg" onClick={() => navigate('/dashboard')} className="gap-2 rounded-xl px-8 text-base">
                  {t.nav.dashboard}
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <>
                  <Button size="lg" onClick={() => navigate('/login')} className="gap-2 rounded-xl px-8 text-base">
                    {t.landing.heroCta}
                    <ArrowRight className="size-4" />
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => navigate('/login')} className="rounded-xl px-8 text-base">
                    {t.landing.heroLogin}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-14 text-center font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t.landing.howTitle}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="group relative">
                <span className="font-display text-5xl font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                  {step.num}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="absolute end-0 top-8 hidden size-5 text-muted-foreground/30 lg:block rtl:rotate-180" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-14 text-center font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t.landing.featuresTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/20 hover:shadow-lg"
              >
                <div className={`mb-4 flex size-12 items-center justify-center rounded-xl ${feat.color}`}>
                  <feat.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{feat.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-14 text-center font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t.landing.testimonialsTitle}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map(tm => (
              <div key={tm.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-5 text-sm leading-relaxed text-muted-foreground italic">
                  "{lang === 'ar' ? tm.textAr : tm.textEn}"
                </p>
                <div className="flex items-center gap-3">
                  <img src={tm.avatar} alt="" className="size-10 rounded-full object-cover" />
                  <span className="text-sm font-semibold text-foreground">
                    {lang === 'ar' ? tm.nameAr : tm.nameEn}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Numbers */}
      <EmergencyNumbers />

      {/* Acknowledgment */}
      <section className="border-t border-border bg-primary/5 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <Heart className="size-7 text-primary" />
          </div>
          <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
            {t.landing.acknowledgmentTitle}
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            {t.landing.acknowledgmentText}
          </p>
        </div>
      </section>
    </div>
  );
}
