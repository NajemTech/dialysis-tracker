import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import { signIn, signUp } from '@/lib/supabase';
import { Activity, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const { t, lang } = useLanguage();
  const { login, updateProfile } = useTracking();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isRegister) {
        const { data: user, error } = await signUp(email, password, name);
        if (error) throw error;
        if (user) {
          updateProfile({ name });
          toast({
            title: lang === 'ar' ? 'تم التسجيل بنجاح' : 'Account created successfully',
            description: lang === 'ar' ? 'تم إنشاء حسابك. يمكنك الآن تسجيل الدخول.' : 'Your account has been created. You can now sign in.',
            variant: 'success',
          });
        }
      } else {
        const { data: user, error } = await signIn(email, password);
        if (error) throw error;
        if (user) {
          login();
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      toast({
        title: lang === 'ar' ? 'خطأ' : 'Error',
        description: error.message || (lang === 'ar' ? 'حدث خطأ ما. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = () => {
    updateProfile({ name: lang === 'ar' ? 'زائر' : 'Guest' });
    login();
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary">
            <Activity className="size-7 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {isRegister ? t.login.registerTitle : t.login.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isRegister ? t.login.registerSubtitle : t.login.subtitle}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="name">{t.login.nameField}</Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="ps-10"
                  placeholder={lang === 'ar' ? 'أدخل اسمك' : 'Enter your name'}
                />
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{t.login.email}</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="ps-10"
                placeholder={lang === 'ar' ? 'البريد الإلكتروني' : 'email@example.com'}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t.login.password}</Label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="ps-10"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl" size="lg" disabled={isLoading}>
            {isLoading ? <Loader2 className="size-4 animate-spin" /> : (isRegister ? t.login.register : t.login.signIn)}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                {lang === 'ar' ? 'أو' : 'or'}
              </span>
            </div>
          </div>
          <Button type="button" variant="outline" onClick={handleGuest} className="w-full rounded-xl" size="lg">
            {t.login.guestLogin}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isRegister ? t.login.hasAccount : t.login.noAccount}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-semibold text-primary hover:underline"
          >
            {isRegister ? t.login.signIn : t.login.register}
          </button>
        </p>
      </div>
    </div>
  );
}
