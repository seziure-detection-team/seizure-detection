// File: ar.js
// Purpose: All user-facing Arabic strings of the app. Components must not hard-code text.
// Screen texts are copied from the approved Google Stitch designs (A1–A6).

const ar = {
  common: {
    appName: 'رصد',
    loading: 'جارٍ التحميل',
    back: 'رجوع',
    showPassword: 'إظهار كلمة المرور',
    hidePassword: 'إخفاء كلمة المرور',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'name@example.com',
    passwordLabel: 'كلمة المرور',
    passwordPlaceholder: '••••••••',
    passwordHint: '8 أحرف على الأقل، وتحتوي على حرف ورقم',
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
  },
};

export default ar;
