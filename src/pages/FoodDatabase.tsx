import { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useTracking } from '@/hooks/useTracking';
import FoodCard from '@/components/features/FoodCard';
import { Search, Apple } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function FoodDatabase() {
  const { lang, t } = useLanguage();
  const { foods } = useTracking();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(foods.map(f => f.category));
    return Array.from(cats);
  }, [foods]);

  const filtered = useMemo(() => {
    let items = foods;
    if (activeCategory !== 'all') {
      items = items.filter(f => f.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        f => f.nameEn.toLowerCase().includes(q) || f.nameAr.includes(q)
      );
    }
    return items;
  }, [foods, search, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            {t.foods.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {foods.length} {lang === 'ar' ? 'عنصر غذائي' : 'food items'}
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t.foods.search}
              className="ps-10"
            />
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
          <Button
            variant={activeCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory('all')}
            className="shrink-0 rounded-full"
          >
            {t.foods.allCategories}
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="shrink-0 rounded-full"
            >
              {lang === 'ar'
                ? foods.find(f => f.category === cat)?.categoryAr || cat
                : cat}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Apple className="mx-auto mb-4 size-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-muted-foreground">{t.foods.noResults}</p>
            <p className="mt-1 text-sm text-muted-foreground/70">{t.foods.noResultsDesc}</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(food => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
