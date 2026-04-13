export type TranslationKey = {
  nav: {
    home: string;
    dashboard: string;
    foods: string;
    history: string;
    settings: string;
    login: string;
    logout: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    heroCta: string;
    heroLogin: string;
    howTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    featuresTitle: string;
    feat1Title: string;
    feat1Desc: string;
    feat2Title: string;
    feat2Desc: string;
    feat3Title: string;
    feat3Desc: string;
    feat4Title: string;
    feat4Desc: string;
    feat5Title: string;
    feat5Desc: string;
    feat6Title: string;
    feat6Desc: string;
    testimonialsTitle: string;
    acknowledgmentTitle: string;
    acknowledgmentText: string;
  };
  login: {
    title: string;
    subtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    email: string;
    password: string;
    nameField: string;
    signIn: string;
    register: string;
    guestLogin: string;
    hasAccount: string;
    noAccount: string;
  };
  dashboard: {
    morning: string;
    afternoon: string;
    evening: string;
    todaySummary: string;
    quickAdd: string;
    searchFood: string;
    recentMeals: string;
    noMeals: string;
    noMealsDesc: string;
    remove: string;
    servings: string;
    symptoms: string;
    noSymptoms: string;
    notes: string;
    notesPlaceholder: string;
    save: string;
    potassium: string;
    phosphorus: string;
    sodium: string;
    protein: string;
    mg: string;
    g: string;
    export: string;
  };
  foods: {
    title: string;
    search: string;
    allCategories: string;
    noResults: string;
    noResultsDesc: string;
    add: string;
    added: string;
  };
  history: {
    title: string;
    daily: string;
    weekly: string;
    biweekly: string;
    monthly: string;
    comparison: string;
    trend: string;
    noData: string;
    noDataDesc: string;
    avgDaily: string;
    trendUp: string;
    trendDown: string;
    trendSame: string;
    comparedTo: string;
    export: string;
  };
  settings: {
    title: string;
    profile: string;
    name: string;
    weight: string;
    weightHelp: string;
    language: string;
    darkMode: string;
    nutrientLimits: string;
    reminders: string;
    addReminder: string;
    reminderTitle: string;
    reminderType: string;
    reminderTime: string;
    medication: string;
    doctor: string;
    gym: string;
    shopping: string;
    personal: string;
    saved: string;
    about: string;
    aboutText: string;
  };
};

export const translations: Record<'en' | 'ar', TranslationKey> = {
  en: {
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      foods: 'Food Database',
      history: 'History',
      settings: 'Settings',
      login: 'Login',
      logout: 'Logout',
    },
    landing: {
      heroTitle: 'Take Control of Your Dialysis Diet',
      heroSubtitle: 'Track your nutrients and stay within safe limits with our easy-to-use nutrition tracker designed specifically for dialysis patients.',
      heroCta: 'Start Tracking',
      heroLogin: 'Login',
      howTitle: 'How It Works',
      step1Title: 'Search Foods',
      step1Desc: 'Browse our extensive database of foods with accurate nutrient information.',
      step2Title: 'Log Meals',
      step2Desc: 'Quickly add foods to your daily log with serving sizes.',
      step3Title: 'Track Progress',
      step3Desc: 'Monitor your nutrient intake against daily limits.',
      step4Title: 'Stay Healthy',
      step4Desc: 'Get alerts and insights to maintain optimal health.',
      featuresTitle: 'Features',
      feat1Title: 'Comprehensive Food Database',
      feat1Desc: 'Access detailed nutritional information for hundreds of foods.',
      feat2Title: 'Smart Reminders',
      feat2Desc: 'Set personalized reminders for medications and meals.',
      feat3Title: 'Detailed Analytics',
      feat3Desc: 'View trends and patterns in your nutrient intake over time.',
      feat4Title: 'Water Tracking',
      feat4Desc: 'Monitor your daily fluid intake to stay within limits.',
      feat5Title: 'Bilingual Support',
      feat5Desc: 'Full support for English and Arabic languages.',
      feat6Title: 'Export Reports',
      feat6Desc: 'Generate PDF reports to share with your healthcare team.',
      testimonialsTitle: 'Patient Stories',
      acknowledgmentTitle: 'Acknowledgment',
      acknowledgmentText: 'This application is designed to support dialysis patients in managing their nutrition. Always consult with your healthcare team for personalized dietary advice.',
    },
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue tracking your nutrition',
      registerTitle: 'Create Account',
      registerSubtitle: 'Join us to start your nutrition journey',
      email: 'Email',
      password: 'Password',
      nameField: 'Full Name',
      signIn: 'Sign In',
      register: 'Create Account',
      guestLogin: 'Continue as Guest',
      hasAccount: 'Already have an account?',
      noAccount: 'Don\'t have an account?',
    },
    dashboard: {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      todaySummary: 'Today\'s Summary',
      quickAdd: 'Quick Add',
      searchFood: 'Search foods...',
      recentMeals: 'Recent Meals',
      noMeals: 'No meals logged today',
      noMealsDesc: 'Start by adding foods from the database',
      remove: 'Remove',
      servings: 'servings',
      symptoms: 'Symptoms',
      noSymptoms: 'No symptoms recorded',
      notes: 'Notes',
      notesPlaceholder: 'Add any notes for today...',
      save: 'Save',
      potassium: 'Potassium',
      phosphorus: 'Phosphorus',
      sodium: 'Sodium',
      protein: 'Protein',
      mg: 'mg',
      g: 'g',
      export: 'Export Summary',
    },
    foods: {
      title: 'Food Database',
      search: 'Search foods...',
      allCategories: 'All',
      noResults: 'No foods found',
      noResultsDesc: 'Try adjusting your search or category filter',
      add: 'Add to Log',
      added: 'Added!',
    },
    history: {
      title: 'History & Analytics',
      daily: 'Daily',
      weekly: 'Weekly',
      biweekly: '2 Weeks',
      monthly: 'Monthly',
      comparison: 'Nutrient Comparison',
      trend: 'Trend Analysis',
      noData: 'No data available',
      noDataDesc: 'Start logging foods to see your nutrition history',
      avgDaily: 'avg daily',
      trendUp: 'increased',
      trendDown: 'decreased',
      trendSame: 'stable',
      comparedTo: 'compared to previous period',
      export: 'Export Summary',
    },
    settings: {
      title: 'Settings',
      profile: 'Profile',
      name: 'Name',
      weight: 'Weight (kg)',
      weightHelp: 'Used to calculate protein requirements',
      language: 'Language',
      darkMode: 'Dark Mode',
      nutrientLimits: 'Daily Nutrient Limits',
      reminders: 'Reminders',
      addReminder: 'Add Reminder',
      reminderTitle: 'Title',
      reminderType: 'Type',
      reminderTime: 'Time',
      medication: 'Medication',
      doctor: 'Doctor',
      gym: 'Gym',
      shopping: 'Shopping',
      personal: 'Personal',
      saved: 'Settings saved successfully',
      about: 'About',
      aboutText: 'Dialysis Nutrition Tracker v1.0 - Helping dialysis patients manage their nutrition.',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      dashboard: 'لوحة التحكم',
      foods: 'قاعدة الأطعمة',
      history: 'السجل',
      settings: 'الإعدادات',
      login: 'تسجيل الدخول',
      logout: 'تسجيل الخروج',
    },
    landing: {
      heroTitle: 'تحكم في نظامك الغذائي للغسيل الكلوي',
      heroSubtitle: 'تتبع العناصر الغذائية والبقاء ضمن الحدود الآمنة مع تطبيق التتبع الغذائي السهل الاستخدام المصمم خصيصاً لمرضى الغسيل الكلوي.',
      heroCta: 'ابدأ التتبع',
      heroLogin: 'تسجيل الدخول',
      howTitle: 'كيف يعمل',
      step1Title: 'البحث عن الأطعمة',
      step1Desc: 'تصفح قاعدة البيانات الشاملة للأطعمة مع معلومات دقيقة عن العناصر الغذائية.',
      step2Title: 'تسجيل الوجبات',
      step2Desc: 'أضف الأطعمة بسرعة إلى سجلك اليومي مع أحجام الحصص.',
      step3Title: 'تتبع التقدم',
      step3Desc: 'راقب تناولك للعناصر الغذائية مقارنة بالحدود اليومية.',
      step4Title: 'ابقَ بصحة جيدة',
      step4Desc: 'احصل على تنبيهات ورؤى للحفاظ على الصحة المثلى.',
      featuresTitle: 'المميزات',
      feat1Title: 'قاعدة بيانات شاملة للأطعمة',
      feat1Desc: 'الوصول إلى معلومات غذائية تفصيلية لمئات الأطعمة.',
      feat2Title: 'تذكيرات ذكية',
      feat2Desc: 'قم بتعيين تذكيرات شخصية للأدوية والوجبات.',
      feat3Title: 'تحليلات مفصلة',
      feat3Desc: 'عرض الاتجاهات والأنماط في تناولك للعناصر الغذائية بمرور الوقت.',
      feat4Title: 'تتبع المياه',
      feat4Desc: 'راقب تناولك اليومي للسوائل للبقاء ضمن الحدود.',
      feat5Title: 'دعم ثنائي اللغة',
      feat5Desc: 'دعم كامل للغتين الإنجليزية والعربية.',
      feat6Title: 'تصدير التقارير',
      feat6Desc: 'إنشاء تقارير PDF لمشاركتها مع فريق الرعاية الصحية.',
      testimonialsTitle: 'قصص المرضى',
      acknowledgmentTitle: 'شكر وتقدير',
      acknowledgmentText: 'هذا التطبيق مصمم لدعم مرضى الغسيل الكلوي في إدارة تغذيتهم. استشر دائماً مع فريق الرعاية الصحية للحصول على نصائح غذائية مخصصة.',
    },
    login: {
      title: 'مرحباً بعودتك',
      subtitle: 'سجل الدخول لمتابعة تتبع تغذيتك',
      registerTitle: 'إنشاء حساب',
      registerSubtitle: 'انضم إلينا لبدء رحلتك الغذائية',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      nameField: 'الاسم الكامل',
      signIn: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      guestLogin: 'متابعة كزائر',
      hasAccount: 'لديك حساب بالفعل؟',
      noAccount: 'ليس لديك حساب؟',
    },
    dashboard: {
      morning: 'صباح الخير',
      afternoon: 'مساء الخير',
      evening: 'مساء الخير',
      todaySummary: 'ملخص اليوم',
      quickAdd: 'إضافة سريعة',
      searchFood: 'البحث عن الأطعمة...',
      recentMeals: 'الوجبات الأخيرة',
      noMeals: 'لم يتم تسجيل أي وجبات اليوم',
      noMealsDesc: 'ابدأ بإضافة أطعمة من قاعدة البيانات',
      remove: 'إزالة',
      servings: 'حصص',
      symptoms: 'الأعراض',
      noSymptoms: 'لم يتم تسجيل أي أعراض',
      notes: 'ملاحظات',
      notesPlaceholder: 'أضف أي ملاحظات لليوم...',
      save: 'حفظ',
      potassium: 'البوتاسيوم',
      phosphorus: 'الفوسفور',
      sodium: 'الصوديوم',
      protein: 'البروتين',
      mg: 'ملغ',
      g: 'غ',
      export: 'تصدير الملخص',
    },
    foods: {
      title: 'قاعدة الأطعمة',
      search: 'البحث عن الأطعمة...',
      allCategories: 'الكل',
      noResults: 'لم يتم العثور على أطعمة',
      noResultsDesc: 'حاول تعديل البحث أو فلتر الفئة',
      add: 'إضافة للسجل',
      added: 'تمت الإضافة!',
    },
    history: {
      title: 'السجل والتحليلات',
      daily: 'يومي',
      weekly: 'أسبوعي',
      biweekly: 'أسبوعين',
      monthly: 'شهري',
      comparison: 'مقارنة العناصر الغذائية',
      trend: 'تحليل الاتجاهات',
      noData: 'لا توجد بيانات متاحة',
      noDataDesc: 'ابدأ تسجيل الأطعمة لرؤية سجل التغذية الخاص بك',
      avgDaily: 'متوسط يومي',
      trendUp: 'زيادة',
      trendDown: 'انخفاض',
      trendSame: 'مستقر',
      comparedTo: 'مقارنة بالفترة السابقة',
      export: 'تصدير الملخص',
    },
    settings: {
      title: 'الإعدادات',
      profile: 'الملف الشخصي',
      name: 'الاسم',
      weight: 'الوزن (كغ)',
      weightHelp: 'يستخدم لحساب متطلبات البروتين',
      language: 'اللغة',
      darkMode: 'الوضع الداكن',
      nutrientLimits: 'الحدود اليومية للعناصر الغذائية',
      reminders: 'التذكيرات',
      addReminder: 'إضافة تذكير',
      reminderTitle: 'العنوان',
      reminderType: 'النوع',
      reminderTime: 'الوقت',
      medication: 'دواء',
      doctor: 'طبيب',
      gym: 'رياضة',
      shopping: 'تسوق',
      personal: 'شخصي',
      saved: 'تم حفظ الإعدادات بنجاح',
      about: 'حول',
      aboutText: 'متعقب التغذية للغسيل الكلوي الإصدار 1.0 - مساعدة مرضى الغسيل الكلوي في إدارة تغذيتهم.',
    },
  },
};
