// File: ar.js
// Purpose: All user-facing Arabic strings of the app. Components must not hard-code text.
// Screen texts follow the approved Yaqz v2 designs (mobile-app/design/).

const ar = {
  common: {
    appName: 'يقظ', // display name; app.json "name" changes in Phase E

    loading: 'جارٍ التحميل',
    back: 'رجوع',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    passwordHint: '8 أحرف على الأقل، وتحتوي على حرف ورقم',
    retry: 'إعادة المحاولة',
    logout: 'تسجيل الخروج',
  },

  // Inline field errors (UC-01 3a, UC-03 6a)
  errors: {
    required: 'هذا الحقل مطلوب.',
    invalidEmail: 'أدخل بريدًا إلكترونيًا صحيحًا.',
    weakPassword: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل، وتحتوي على حرف ورقم.',
    passwordsMismatch: 'كلمتا المرور غير متطابقتين.',
    roleRequired: 'اختر نوع الحساب.',
  },

  // A1 — Login
  login: {
    title: 'تسجيل الدخول',
    subtitle: 'أدخل بريدك الإلكتروني وكلمة المرور للمتابعة',
    forgotPassword: 'نسيت كلمة المرور؟',
    submit: 'دخول',
    noAccount: 'ليس لديك حساب؟',
    createAccount: 'إنشاء حساب',
  },

  // A2 — Create Account
  register: {
    title: 'إنشاء حساب',
    nameLabel: 'الاسم الكامل',
    namePlaceholder: 'الاسم الكامل',
    roleLabel: 'نوع الحساب',
    rolePatient: 'مريض',
    roleCaregiver: 'مرافق',
    submit: 'إنشاء الحساب',
  },

  // A3 — Verify Email
  verifyEmail: {
    title: 'تحقق من بريدك الإلكتروني',
    body: 'أرسلنا رابط تفعيل إلى بريدك الإلكتروني. فعّل حسابك من الرابط، ثم سجّل الدخول.',
    goToLogin: 'الانتقال لتسجيل الدخول',
  },

  // A4 — Forgot Password
  forgotPassword: {
    title: 'نسيت كلمة المرور',
    subtitle: 'أدخل بريدك الإلكتروني المسجّل، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.',
    submit: 'إرسال الرابط',
  },

  // A5 — Reset Link Sent
  resetSent: {
    title: 'تفقّد بريدك الإلكتروني',
    body: 'إذا كان البريد مسجّلًا لدينا، فستصلك رسالة تحتوي على رابط إعادة التعيين. الرابط صالح لفترة محدودة.',
    backToLogin: 'العودة لتسجيل الدخول',
  },

  // A6 — New Password (+ expired/invalid link state, approved decision 4; no design)
  newPassword: {
    title: 'تعيين كلمة مرور جديدة',
    subtitle: 'اختر كلمة مرور جديدة لحسابك.',
    newLabel: 'كلمة المرور الجديدة',
    confirmLabel: 'تأكيد كلمة المرور',
    submit: 'حفظ كلمة المرور',
    expiredTitle: 'انتهت صلاحية الرابط',
    expiredBody:
      'رابط إعادة تعيين كلمة المرور غير صالح، أو انتهت صلاحيته، أو سبق استخدامه. اطلب رابطًا جديدًا للمتابعة.',
    requestNewLink: 'طلب رابط جديد',
  },

  // Banner messages (approved decision 3; no design). Shown by the auth logic in Phase 3.
  messages: {
    network: 'تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت ثم حاول مرة أخرى.', // UC-01 5a, all actions
    server: 'حدث خطأ غير متوقع. حاول مرة أخرى بعد قليل.',
    rateLimited: 'محاولات كثيرة خلال وقت قصير. انتظر قليلًا ثم حاول مرة أخرى.',
    invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', // UC-02 3a (generic)
    emailNotConfirmed:
      'لم يتم تفعيل حسابك بعد. افتح رابط التفعيل المرسل إلى بريدك الإلكتروني ثم سجّل الدخول.',
    physicianNotAllowed: 'حسابات الأطباء تستخدم لوحة التحكم على الويب، وليس هذا التطبيق.', // UC-02 3b
    passwordUpdated: 'تم تغيير كلمة المرور بنجاح. سجّل الدخول بكلمة المرور الجديدة.', // UC-03 success
    samePassword: 'كلمة المرور الجديدة يجب أن تختلف عن كلمة المرور الحالية.',
  },

  // Signed in, but the profile is missing, unreadable or has an unsupported role
  accountError: {
    title: 'تعذّر تحميل حسابك',
    body: 'لم نتمكن من التحقق من بيانات حسابك. حاول مرة أخرى، أو سجّل الخروج.',
  },

  // B1 / B2 / B4 — Patient Home (FR-05, UC-04). B2/B4 are a simulation in Sprint 1.
  patientHome: {
    eyebrow: 'حساب مريض',
    greeting: 'مرحبًا، {name}',
    greetingNoName: 'مرحبًا',
    wristband: 'السوار',
    wristbandStatus: 'السوار، {status}', // screen-reader label of the wristband card
    statusDisconnected: 'غير متصل',
    statusConnected: 'متصل',
    statusLost: 'انقطع الاتصال',
    monitoringActive: 'المراقبة نشطة',
    connect: 'ربط السوار',
    reconnect: 'إعادة الاتصال',
    lostTitle: 'انقطع الاتصال بالسوار',
    lostBody: 'المراقبة متوقفة حتى تتم إعادة الاتصال.',
    simulateLossHint: 'محاكاة انقطاع الاتصال',
  },

  // B5 / B6 — History and patterns (FR-14, FR-15, UC-09)
  history: {
    title: 'سجل الأحداث',
    tabLog: 'السجل',
    tabPatterns: 'الأنماط',
    chartTitle: 'عدد الأحداث في الأسبوع',
    chartSubtitle: 'آخر 6 أسابيع',
    chartBar: 'أسبوع {week}: {count}', // screen-reader label of one bar
    emptyTitle: 'لا توجد أحداث مسجلة',
    emptyBody: 'ستظهر هنا أحداث «حدث صرع محتمل» بعد اكتشافها.',
    // screen-reader label of one event card (NFR-07 wording)
    itemLabel: 'حدث صرع محتمل، {date}، {time}، المدة {duration}، {status}',
  },

  // Event labels (FR-17, UC-10); keys are the seizure_event.label values in the database
  eventLabels: {
    pending_review: 'بانتظار المراجعة',
    confirmed_seizure: 'نوبة مؤكدة',
    false_alarm: 'إنذار خاطئ',
  },

  // B7 — Event detail (FR-17, UC-10). Always "probable seizure event", never a diagnosis (NFR-07)
  event: {
    title: 'حدث صرع محتمل',
    date: 'التاريخ',
    startTime: 'وقت البدء',
    duration: 'المدة',
    classify: 'صنّف هذا الحدث',
    notFoundTitle: 'الحدث غير موجود',
    notFoundBody: 'ربما تم حذف الحدث أو أن الرابط غير صحيح.',
  },

  // Date / time formatting (src/lib/format.js); Western digits as in the designs
  format: {
    months: [
      'يناير',
      'فبراير',
      'مارس',
      'أبريل',
      'مايو',
      'يونيو',
      'يوليو',
      'أغسطس',
      'سبتمبر',
      'أكتوبر',
      'نوفمبر',
      'ديسمبر',
    ],
    monthsShort: [
      'ينا',
      'فبر',
      'مار',
      'أبر',
      'ماي',
      'يون',
      'يول',
      'أغس',
      'سبت',
      'أكت',
      'نوف',
      'ديس',
    ],
    am: 'ص',
    pm: 'م',
    minutes: 'د',
  },

  // C2 / C3 / C4 — Caregiver alerts (FR-13, UC-08)
  caregiverAlerts: {
    eyebrow: 'حساب مرافق',
    title: 'التنبيهات',
    patient: 'المريض: {name}',
    emptyTitle: 'لا توجد تنبيهات',
    emptyBody: 'ستظهر هنا تنبيهات «حدث صرع محتمل» للمريض المرتبط بك، مع تاريخها ووقتها ومدتها.',
    notLinkedTitle: 'لم يتم ربط مريض بعد',
    notLinkedBody: 'ستظهر هنا تنبيهات المريض بعد ربطه بحسابك.',
    itemTitle: 'حدث صرع محتمل', // NFR-07: never a diagnosis
    // screen-reader label of one alert card
    itemLabel: 'حدث صرع محتمل، {date}، {time}، المدة {duration}',
  },

  // Bottom navigation of the patient screens (B1/B2/B4, B5/B6)
  nav: {
    home: 'الرئيسية',
    history: 'السجل',
  },

  // Labels on screens that show sample data (Sprint 1 data rules)
  sampleData: {
    sample: 'بيانات تجريبية',
    simulation: 'محاكاة',
  },
};

export default ar;
