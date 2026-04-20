
import { useLanguage } from '@/hooks/useLanguage';
import { Activity, Heart } from 'lucide-react';

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="size-4 text-primary-foreground" />
            </div>
            <span className="font-display text-base font-semibold text-foreground">
              {lang === 'ar' ? 'متعقب التغذية' : 'Dialysis Tracker'}
            </span>
          </div>

          {/* Copyright */}
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {lang === 'ar' ? 'متعقب التغذية للغسيل الكلوي' : 'Dialysis Nutrition Tracker'}. {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
          </p>

          {/* Disclaimer */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Heart className="size-3.5 text-primary" />
            <span>
              {lang === 'ar' 
                ? 'هذا التطبيق للأغراض الإعلامية فقط. استشر دائماً مع فريق الرعاية الصحية الخاص بك.'
                : 'This app is for informational purposes only. Always consult with your healthcare team.'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
