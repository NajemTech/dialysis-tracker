
export const DEFAULT_LIMITS = {
  potassium: 2000, // mg
  phosphorus: 1000, // mg
  sodium: 2300, // mg
  protein: 60, // g
} as const;

export const PROTEIN_PER_KG = 1.2; // g per kg body weight
export const DEFAULT_WEIGHT = 70; // kg

export const EMERGENCY_NUMBERS = [
  { label: 'Emergency', number: '112', icon: 'ambulance' },
  { label: 'Red Cross', number: '1401', icon: 'cross' },
  { label: 'Police', number: '112', icon: 'shield' },
  { label: 'Fire Dept', number: '175', icon: 'fire' },
] as const;

export const SYMPTOM_TYPES = [
  { id: 'swelling', en: 'Swelling', ar: 'تورم' },
  { id: 'fatigue', en: 'Fatigue', ar: 'إعياء' },
  { id: 'nausea', en: 'Nausea', ar: 'غثيان' },
  { id: 'headache', en: 'Headache', ar: 'صداع' },
  { id: 'itching', en: 'Itching', ar: 'حكة' },
  { id: 'breath', en: 'Shortness of Breath', ar: 'ضيق تنفس' },
  { id: 'cramps', en: 'Muscle Cramps', ar: 'تشنجات عضلية' },
  { id: 'dizziness', en: 'Dizziness', ar: 'دوار' },
] as const;

export const CATEGORIES = [
  'all',
  'grains',
  'protein',
  'fruits',
  'vegetables',
  'fats',
  'dairy',
  'lebanese',
  'beverages',
  'sweeteners',
] as const;

export const MEAL_TYPES = [
  'breakfast',
  'lunch',
  'dinner',
  'snack',
] as const;
