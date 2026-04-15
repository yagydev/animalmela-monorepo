import { signAccessToken } from '../jwt';

const DEMO_USERS: { login: string; password: string; role: string }[] = [
  { login: 'demo@kisaanmela.com', password: 'demo123', role: 'farmer' },
  { login: 'admin@kisaanmela.com', password: 'admin123', role: 'admin' },
  { login: 'buyer@kisaanmela.com', password: 'buyer123', role: 'buyer' },
  { login: 'seller@kisaanmela.com', password: 'seller123', role: 'seller' },
];

export type DemoOfflineResult = {
  accessToken: string;
  user: Record<string, unknown>;
};

/**
 * When MongoDB is unreachable, still allow fixed demo accounts with a real JWT
 * so clients never store non-JWT strings (breaks jwt-decode / some middleware).
 */
export function tryDemoOfflineLogin(login: string | undefined, password: string | undefined): DemoOfflineResult | null {
  if (!login || !password) return null;
  const normalized = login.trim().toLowerCase();
  const row = DEMO_USERS.find((u) => u.login === normalized && u.password === password);
  if (!row) return null;

  const demoName = `Demo ${row.role.charAt(0).toUpperCase() + row.role.slice(1)}`;
  const demoId = `demo:${row.login}`;
  const accessToken = signAccessToken({
    sub: demoId,
    id: demoId,
    name: demoName,
    email: row.login,
    mobile: '9876543210',
    role: row.role,
    authRole: row.role === 'admin' ? 'ADMIN' : 'USER',
    demo: true,
  });

  return {
    accessToken,
    user: {
      id: demoId,
      _id: demoId,
      email: row.login,
      name: demoName,
      role: row.role,
      authRole: row.role === 'admin' ? 'ADMIN' : 'USER',
      mobile: '9876543210',
      isVerified: true,
      profileComplete: true,
      location: {
        state: 'Punjab',
        district: 'Ludhiana',
        pincode: '141001',
        village: 'Demo Village',
      },
      rating: 4.5,
      totalRatings: 10,
    },
  };
}
