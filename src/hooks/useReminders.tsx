import { useState, useEffect, useCallback } from 'react';
import type { Reminder } from '@/types';

function loadReminders(): Reminder[] {
  const saved = localStorage.getItem('dt-reminders');
  return saved ? JSON.parse(saved) : [];
}

export function useReminders() {
  const [reminders, setReminders] = useState<Reminder[]>(loadReminders);

  useEffect(() => {
    localStorage.setItem('dt-reminders', JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = useCallback((reminder: Omit<Reminder, 'id'>) => {
    setReminders(prev => [...prev, { ...reminder, id: `r-${Date.now()}` }]);
  }, []);

  const removeReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  }, []);

  return { reminders, addReminder, removeReminder, toggleReminder };
}
