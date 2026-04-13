import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

export default function NotFound() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="font-display text-6xl font-bold text-muted-foreground/30">404</h1>
        </div>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          {lang === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className="mb-8 text-muted-foreground">
          {lang === 'ar' 
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.' 
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>
        <Button onClick={() => navigate('/')} className="gap-2">
          <Home className="size-4" />
          {lang === 'ar' ? 'العودة للرئيسية' : 'Return Home'}
        </Button>
      </div>
    </div>
  );
}
