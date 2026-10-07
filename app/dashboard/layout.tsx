'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/service/firebase/config';
import { Home, Package, ShoppingCart, Truck, Settings, LogOut, Menu, X, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: Home },
  { href: '/dashboard/articles', label: 'Articles', icon: Package },
  { href: '/dashboard/orders', label: 'Commandes', icon: ShoppingCart },
  { href: '/dashboard/delivery', label: 'Livraison', icon: Truck },
  { href: '/dashboard/settings', label: 'Parametres', icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(auth, async (u) => {
        setUser(u);
        if (u) {
          try {
            const token = await u.getIdToken();
            await fetch('/api/auth/session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: token }),
            });
          } catch {
            // Session creation failed
          }
        }
        setAuthLoading(false);
      });
      return () => unsub();
    } catch {
      // Firebase not configured - show login form
      setAuthLoading(false);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);

    const testEmail = process.env.NEXT_PUBLIC_ADMIN_TEST_EMAIL;
    const testPassword = process.env.NEXT_PUBLIC_ADMIN_TEST_PASSWORD;

    if (testEmail && testPassword && email === testEmail && password === testPassword) {
      setUser({ 
        email: testEmail, 
        uid: 'test-admin-uid',
        getIdToken: async () => 'test-token'
      } as unknown as User);
      toast.success('Connecte (Mode Test)');
      setLoginLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Connecte');
    } catch {
      toast.error('Email ou mot de passe incorrect');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await auth.signOut();
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch {
      toast.error('Erreur de deconnexion');
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Connectez-vous pour acceder au tableau de bord</p>
          </div>
          
          {process.env.NEXT_PUBLIC_ADMIN_TEST_EMAIL && (
            <div className="mb-6 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg border border-amber-200 text-center">
              <strong>Mode Test Actif</strong><br />
              Email: <code>{process.env.NEXT_PUBLIC_ADMIN_TEST_EMAIL}</code><br />
              Pass: <code>{process.env.NEXT_PUBLIC_ADMIN_TEST_PASSWORD}</code>
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="admin@store.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="********" required />
            </div>
            <button type="submit" disabled={loginLoading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium">
              {loginLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold">Dashboard</h2>
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}>
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white w-full">
            <LogOut className="w-5 h-5" /> Deconnexion
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button className="md:hidden p-1" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-semibold text-gray-800">
            {navItems.find((i) => pathname === i.href || (i.href !== '/dashboard' && pathname.startsWith(i.href)))?.label || 'Dashboard'}
          </div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
