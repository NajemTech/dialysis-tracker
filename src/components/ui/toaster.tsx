
import { useToast } from '@/hooks/use-toast';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 rtl:right-auto rtl:left-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-lg animate-in slide-in-from-right-5 rtl:slide-in-from-left-5"
        >
          {toast.variant === 'success' && <CheckCircle className="size-5 text-emerald-600" />}
          {toast.variant === 'destructive' && <AlertCircle className="size-5 text-destructive" />}
          {toast.variant === 'info' && <Info className="size-5 text-blue-600" />}

          <div className="flex-1">
            {toast.title && <p className="font-semibold text-sm">{toast.title}</p>}
            {toast.description && <p className="text-xs text-muted-foreground">{toast.description}</p>}
          </div>

          <button
            onClick={() => dismiss(toast.id)}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
}
