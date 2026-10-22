// Handles no business can take (design 7.7, ALL-002 2.4). Handles have 3 to 30
// characters, so shorter words (sw, ws) are refused by the pattern already.

// Our own words: pages and paths the app, the landing site and the shop pages use.
const OURS = [
  'about', 'account', 'admin', 'api', 'app', 'assets', 'auth', 'billing', 'blog', 'dashboard', 'docs', 'help',
  'home', 'login', 'logout', 'mail', 'new', 'owner', 'pricing', 'privacy', 'root', 'settings', 'setup', 'shop',
  'signup', 'static', 'status', 'store', 'support', 'system', 'team', 'terms', 'test', 'webhooks', 'www',
];

// Paths we will need later, on our site or in a shop page address.
const LATER = [
  'menu', 'order', 'orders', 'pay', 'payment', 'payments', 'checkout', 'cart', 'receipt', 'invoice', 'track',
  'delivery', 'book', 'booking', 'bookings', 'reviews', 'invite', 'invites', 'join', 'careers', 'jobs', 'features',
  'faq', 'contact', 'legal', 'cookies', 'security', 'abuse', 'report', 'press', 'partners', 'search', 'explore',
  'manifest', 'sitemap', 'robots', 'favicon', 'well-known', 'cdn', 'media', 'images', 'files', 'uploads',
  'download', 'oauth', 'sso', 'signin', 'sign-in', 'sign-up', 'register', 'password', 'reset', 'verify',
  'verified', 'official', 'staff', 'chat', 'inbox', 'approvals', 'customers', 'sales', 'stock', 'marketing',
  'studio', 'website', 'telegram', 'whatsapp', 'facebook', 'instagram', 'tiktok', 'google', 'apple',
];

// Known chains and brands in Egypt, so nobody opens a shop page in their name.
// Only names that are a brand first: a café may well be called "Panda" or "Metro".
// Anything else is handled by report and reclaim (gateway/doors/app/README.md).
const BRANDS = [
  'starbucks', 'costa', 'costa-coffee', 'cilantro', 'beanos', 'dunkin', 'tim-hortons', 'caribou', 'cinnabon',
  'krispy-kreme', 'mcdonalds', 'kfc', 'hardees', 'burger-king', 'pizza-hut', 'dominos', 'papa-johns', 'subway',
  'buffalo-burger', 'cook-door', 'mo-men', 'el-tahrir', 'abou-tarek', 'zooba', 'koueider', 'el-abd', 'tbs',
  'carrefour', 'seoudi', 'spinneys', 'metro-market', 'kheir-zaman', 'hyperone', 'gourmet-egypt', 'fathalla',
  'kazyon', 'awlad-ragab', 'zahran', 'talabat', 'elmenus', 'otlob', 'breadfast', 'instashop', 'mrsool', 'jumia',
  'amazon', 'uber', 'careem', 'swvl', 'indrive', 'fawry', 'instapay', 'valu', 'paymob', 'vodafone',
  'vodafone-cash', 'etisalat', 'banque-misr',
];

// Our own brand name goes here once the team picks it.
export const RESERVED = new Set([...OURS, ...LATER, ...BRANDS]);
