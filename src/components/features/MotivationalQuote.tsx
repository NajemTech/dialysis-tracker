
import { useLanguage } from '@/hooks/useLanguage';

const quotesEn = [
  "Every healthy choice is a step toward a better tomorrow.",
  "Small changes lead to big results in your health journey.",
  "Your health is your wealth. Invest wisely.",
  "Taking care of your body is the best investment you can make.",
  "Each day is a new opportunity to make healthy choices.",
];

const quotesAr = [
  "كل اختيار صحي هو خطوة نحو غد أفضل.",
  "التغييرات الصغيرة تؤدي إلى نتائج كبيرة في رحلتك الصحية.",
  "صحتك هي ثروتك. استثمر بحكمة.",
  "الاعتناء بجسدك هو أفضل استثمار يمكنك القيام به.",
  "كل يوم هو فرصة جديدة لاتخاذ خيارات صحية.",
];

export default function MotivationalQuote() {
  const { lang } = useLanguage();
  const quotes = lang === 'ar' ? quotesAr : quotesEn;
  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
      <p className="text-sm font-medium leading-relaxed text-foreground italic">
        "{quote}"
      </p>
    </div>
  );
}
