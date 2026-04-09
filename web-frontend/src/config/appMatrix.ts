export type AppRole = 'guest' | 'farmer' | 'vendor';
export type DomainOwner = 'backend' | 'backend-mvp' | 'web-frontend';
export type FeatureDomain =
  | 'core'
  | 'events'
  | 'mvp'
  | 'marketplace'
  | 'training'
  | 'vendors'
  | 'news'
  | 'legal'
  | 'account';

export interface RouteMatrixItem {
  path: string;
  label: string;
  roles: AppRole[];
  feature: FeatureDomain;
  owner: DomainOwner;
  cta?: boolean;
  highlight?: boolean;
  icon?: string;
}

const allRoles: AppRole[] = ['guest', 'farmer', 'vendor'];

export const routeMatrix: RouteMatrixItem[] = [
  { path: '/', label: 'Home', roles: allRoles, feature: 'core', owner: 'web-frontend', icon: '🏠' },
  { path: '/events', label: 'Events', roles: allRoles, feature: 'events', owner: 'web-frontend', icon: '🚜' },
  { path: '/events/upcoming', label: 'Upcoming Melas', roles: allRoles, feature: 'events', owner: 'web-frontend' },
  { path: '/events/past', label: 'Past Highlights', roles: allRoles, feature: 'events', owner: 'web-frontend' },
  { path: '/events/gallery', label: 'Photo Gallery', roles: allRoles, feature: 'events', owner: 'web-frontend' },
  { path: '/events/register', label: 'Join Mela', roles: ['farmer'], feature: 'events', owner: 'web-frontend', cta: true, highlight: true, icon: '🎪' },
  { path: '/mvp/events', label: 'MVP Events', roles: allRoles, feature: 'mvp', owner: 'backend-mvp', icon: '📅' },
  { path: '/mvp/leads', label: 'Lead Marketplace', roles: ['vendor', 'farmer'], feature: 'mvp', owner: 'backend-mvp', icon: '🤝' },
  { path: '/marketplace', label: 'Marketplace', roles: allRoles, feature: 'marketplace', owner: 'web-frontend', icon: '🛒' },
  { path: '/marketplace/equipment', label: 'Agricultural Equipment', roles: allRoles, feature: 'marketplace', owner: 'web-frontend', icon: '🚜' },
  { path: '/marketplace/livestock', label: 'Livestock & Cattle', roles: allRoles, feature: 'marketplace', owner: 'web-frontend', icon: '🐄' },
  { path: '/marketplace/product', label: 'Agricultural Produce', roles: allRoles, feature: 'marketplace', owner: 'web-frontend', icon: '🌾' },
  { path: '/marketplace/buy', label: 'Buy Seeds & Tools', roles: allRoles, feature: 'marketplace', owner: 'web-frontend', icon: '🛍️' },
  { path: '/marketplace/sell', label: 'Sell Items', roles: ['farmer'], feature: 'marketplace', owner: 'web-frontend', cta: true, highlight: true, icon: '💰' },
  { path: '/marketplace/organic', label: 'Organic Products', roles: allRoles, feature: 'marketplace', owner: 'web-frontend', icon: '🌿' },
  { path: '/training', label: 'Training & Learning', roles: ['guest', 'farmer'], feature: 'training', owner: 'web-frontend', icon: '📚' },
  { path: '/training/workshops', label: 'Workshops', roles: ['guest', 'farmer'], feature: 'training', owner: 'web-frontend' },
  { path: '/training/subsidies', label: 'Subsidy Guidance', roles: ['guest', 'farmer'], feature: 'training', owner: 'web-frontend' },
  { path: '/training/tech', label: 'Agri Tech Updates', roles: ['guest', 'farmer'], feature: 'training', owner: 'web-frontend' },
  { path: '/training/progress', label: 'My Progress', roles: ['farmer'], feature: 'training', owner: 'web-frontend', highlight: true },
  { path: '/training/subsidies/tracking', label: 'Subsidy Tracking', roles: ['farmer'], feature: 'training', owner: 'web-frontend' },
  { path: '/vendors', label: 'Vendors', roles: ['vendor'], feature: 'vendors', owner: 'web-frontend', icon: '🏪' },
  { path: '/vendors/book-stall', label: 'Book Stall / Advertise', roles: ['vendor'], feature: 'vendors', owner: 'backend-mvp', cta: true, highlight: true },
  { path: '/vendors/catalog', label: 'Upload Catalog', roles: ['vendor'], feature: 'vendors', owner: 'backend', icon: '📦' },
  { path: '/vendors/dashboard', label: 'Analytics Dashboard', roles: ['vendor'], feature: 'vendors', owner: 'backend', icon: '📊' },
  { path: '/news', label: 'News & Blogs', roles: allRoles, feature: 'news', owner: 'web-frontend', icon: '📰' },
  { path: '/news/farmer-stories', label: 'Farmer Stories', roles: allRoles, feature: 'news', owner: 'web-frontend' },
  { path: '/news/innovation', label: 'Innovation Hub', roles: allRoles, feature: 'news', owner: 'web-frontend' },
  { path: '/contact', label: 'Contact', roles: allRoles, feature: 'core', owner: 'web-frontend', icon: '📞' },
  { path: '/about', label: 'About Kisan Mela', roles: allRoles, feature: 'core', owner: 'web-frontend' },
  { path: '/privacy', label: 'Privacy Policy', roles: allRoles, feature: 'legal', owner: 'web-frontend' },
  { path: '/terms', label: 'Terms of Use', roles: allRoles, feature: 'legal', owner: 'web-frontend' },
  { path: '/login', label: 'Sign In', roles: allRoles, feature: 'account', owner: 'web-frontend' },
  { path: '/register', label: 'Sign Up', roles: allRoles, feature: 'account', owner: 'web-frontend' }
];

export const headerMatrix = [
  {
    path: '/events',
    children: ['/events/upcoming', '/events/past', '/events/gallery', '/events/register', '/mvp/events']
  },
  {
    path: '/marketplace',
    children: [
      '/marketplace',
      '/marketplace/equipment',
      '/marketplace/livestock',
      '/marketplace/product',
      '/marketplace/buy',
      '/marketplace/sell',
      '/marketplace/organic',
      '/mvp/leads'
    ]
  },
  {
    path: '/training',
    children: [
      '/training/workshops',
      '/training/subsidies',
      '/training/tech',
      '/training/progress',
      '/training/subsidies/tracking'
    ]
  },
  {
    path: '/vendors',
    children: ['/vendors/book-stall', '/vendors/catalog', '/vendors/dashboard']
  },
  {
    path: '/news',
    children: ['/news/farmer-stories', '/news/innovation']
  },
  { path: '/contact' }
] as const;

export const footerMatrix = {
  marketplace: [
    '/marketplace/buy',
    '/marketplace/sell',
    '/marketplace/organic',
    '/marketplace/livestock',
    '/marketplace/equipment'
  ],
  events: ['/events/upcoming', '/events/past', '/events/gallery', '/vendors/book-stall', '/events/register'],
  learning: ['/training/workshops', '/training/subsidies', '/training/tech', '/news/farmer-stories', '/news/innovation'],
  company: ['/about', '/contact', '/news', '/about', '/contact'],
  legal: ['/privacy', '/terms', '/privacy', '/terms', '/contact']
} as const;

const routeMap = new Map(routeMatrix.map((item) => [item.path, item]));

export function getRoute(path: string): RouteMatrixItem {
  const route = routeMap.get(path);
  if (!route) {
    throw new Error(`Unknown route in canonical matrix: ${path}`);
  }
  return route;
}

export function isRouteVisibleForRole(path: string, role: AppRole): boolean {
  return getRoute(path).roles.includes(role);
}

export function assertKnownRoutes(paths: string[], context: string): void {
  const unknown = paths.filter((path) => !routeMap.has(path));
  if (unknown.length > 0) {
    throw new Error(`[${context}] Unknown route(s): ${unknown.join(', ')}`);
  }
}
