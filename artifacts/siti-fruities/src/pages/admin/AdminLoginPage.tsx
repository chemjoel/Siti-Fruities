import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { authService } from '@/services/auth.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authService.signIn(email, password);
      if (res.success) {
        const isAdmin = await authService.isAdmin();
        if (isAdmin || res.profile?.role === 'admin') {
          setLocation('/admin');
        } else {
          setError('Access denied. This account does not have administrator privileges.');
          await authService.signOut();
        }
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-muted/40 flex items-center justify-center p-4 relative">
      <button
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors bg-white px-4 py-2 rounded-full border border-border shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </button>

      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-serif font-black text-foreground">SITI FRUITIES Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in with your administrator credentials to manage your store.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Admin Email
            </Label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sitifruities.com"
                className="pl-10 rounded-xl bg-white h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 rounded-xl bg-white h-12"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl text-sm shadow-md"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground pt-2">
            Tip: Demo Administrator login: <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">admin@sitifruities.com</code> / <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-foreground">admin123</code>
          </p>
        </form>
      </div>
    </div>
  );
}
