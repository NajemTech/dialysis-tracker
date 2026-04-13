
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DailyLog, NutrientTotals, NutrientLimits } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonProps {
  logs: DailyLog[];
  totals: NutrientTotals;
  limits: NutrientLimits;
  userName?: string;
  dateRange?: { start: string; end: string };
}

export default function ExportButton({ logs, totals, limits, userName, dateRange }: ExportButtonProps) {
  const { lang, t } = useLanguage();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Import jsPDF dynamically
      const { default: jsPDF } = await import('jspdf');

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = margin;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text(
        lang === 'ar' ? 'ملخص التغذية' : 'Nutrition Summary',
        pageWidth / 2,
        yPosition,
        { align: 'center' }
      );
      yPosition += 15;

      // Patient Info
      doc.setFontSize(12);
      if (userName) {
        doc.text(
          `${lang === 'ar' ? 'المريض:' : 'Patient:'} ${userName}`,
          margin,
          yPosition
        );
        yPosition += 8;
      }

      // Date Range
      if (dateRange) {
        const formatDate = (date: string) => {
          const d = new Date(date);
          return d.toLocaleDateString(lang === 'ar' ? 'ar-LB' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        };
        doc.text(
          `${lang === 'ar' ? 'الفترة:' : 'Period:'} ${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`,
          margin,
          yPosition
        );
        yPosition += 15;
      }

      // Nutrient Totals
      doc.setFontSize(14);
      doc.text(
        lang === 'ar' ? 'إجمالي العناصر الغذائية' : 'Nutrient Totals',
        margin,
        yPosition
      );
      yPosition += 10;

      doc.setFontSize(11);
      const nutrients = [
        { label: t.dashboard.potassium, current: totals.potassium, limit: limits.potassium, unit: 'mg' },
        { label: t.dashboard.phosphorus, current: totals.phosphorus, limit: limits.phosphorus, unit: 'mg' },
        { label: t.dashboard.sodium, current: totals.sodium, limit: limits.sodium, unit: 'mg' },
        { label: t.dashboard.protein, current: totals.protein, limit: limits.protein, unit: 'g' },
      ];

      nutrients.forEach((nutrient) => {
        const percentage = ((nutrient.current / nutrient.limit) * 100).toFixed(0);
        const status = nutrient.current > nutrient.limit
          ? (lang === 'ar' ? 'تجاوز الحد الآمن' : 'Exceeded safe limit')
          : (lang === 'ar' ? 'ضمن الحد المستهدف' : 'Within target range');

        doc.text(
          `${nutrient.label}: ${Math.round(nutrient.current)}${nutrient.unit} / ${nutrient.limit}${nutrient.unit} (${percentage}%)`,
          margin,
          yPosition
        );
        yPosition += 6;

        doc.setTextColor(
          nutrient.current > nutrient.limit ? 220 : 0,
          nutrient.current > nutrient.limit ? 38 : 128,
          nutrient.current > nutrient.limit ? 38 : 0
        );
        doc.text(`  ${status}`, margin + 10, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
      });

      // Food Logs
      if (logs.length > 0) {
        yPosition += 5;
        doc.setFontSize(14);
        doc.text(
          lang === 'ar' ? 'سجل الأطعمة' : 'Food Log',
          margin,
          yPosition
        );
        yPosition += 10;

        doc.setFontSize(10);
        logs.forEach((log) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = margin;
          }

          const date = new Date(log.date).toLocaleDateString(
            lang === 'ar' ? 'ar-LB' : 'en-US',
            { month: 'short', day: 'numeric' }
          );

          doc.setFontSize(10);
          doc.text(`${date}:`, margin, yPosition);
          yPosition += 6;

          log.trackedFoods.forEach((food) => {
            if (yPosition > 270) {
              doc.addPage();
              yPosition = margin;
            }
            doc.text(
              `  • ${food.foodId} (${food.servings} ${lang === 'ar' ? 'حصص' : 'servings'})`,
              margin,
              yPosition
            );
            yPosition += 5;
          });
          yPosition += 5;
        });
      }

      // Summary
      yPosition += 5;
      doc.setFontSize(12);
      const hasExceeded = nutrients.some(n => n.current > n.limit);
      const summaryText = hasExceeded
        ? (lang === 'ar' ? 'تنبيه: بعض العناصر الغذائية تجاوزت الحدود الآمنة' : 'Warning: Some nutrients exceeded safe limits')
        : (lang === 'ar' ? 'جميع العناصر الغذائية ضمن الحدود المستهدفة' : 'All nutrients within target range');

      doc.setTextColor(hasExceeded ? 220 : 0, hasExceeded ? 38 : 128, hasExceeded ? 38 : 0);
      doc.text(summaryText, margin, yPosition);

      // Save
      const fileName = `nutrition-summary-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: lang === 'ar' ? 'تم التصدير' : 'Exported',
        description: lang === 'ar' ? 'تم تصدير الملخص بنجاح' : 'Summary exported successfully',
        variant: 'success',
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: lang === 'ar' ? 'خطأ' : 'Error',
        description: lang === 'ar' ? 'فشل تصدير الملخص' : 'Failed to export summary',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isExporting}
      className="gap-2"
    >
      {isExporting ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <Download className="size-4" />
      )}
      {t.dashboard.export}
    </Button>
  );
}
