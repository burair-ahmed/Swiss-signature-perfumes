'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ShieldAlert, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from '../AdminPage.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      router.push('/admin');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.adminPage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(20, 23, 31, 0.9)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
        
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Return to Store
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid rgba(212, 175, 55, 0.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--gold)' }}>
            <Lock size={26} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#fff' }}>
            Admin Portal
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Authorized personnel access for Swiss Signature
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(235, 87, 87, 0.12)', border: '1px solid rgba(235, 87, 87, 0.3)', padding: '0.85rem 1rem', borderRadius: '8px', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label className="input-label" htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="admin-panel@swiss-signature.com"
                required
              />

            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                style={{ paddingLeft: '2.75rem', width: '100%' }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Sign In to Admin Portal'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>
            🔒 Public registration is disabled. Contact super admin for access credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
