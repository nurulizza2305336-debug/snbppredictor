import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Mail, Lock, Eye, EyeOff, ArrowRight, Users, Shield, BookOpen } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = await login(email, password);
    
    if (success) {
      toast({
        title: 'Login Berhasil',
        description: 'Selamat datang di Sistem Prediksi SNBP',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Login Gagal',
        description: 'Email atau password salah',
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  const demoAccounts = [
    { role: 'Admin', email: 'admin@snbp.id', password: 'admin123', icon: Shield },
    { role: 'Guru', email: 'guru@snbp.id', password: 'guru123', icon: BookOpen },
    { role: 'Siswa', email: 'siswa@snbp.id', password: 'siswa123', icon: Users },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-sidebar-foreground">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sidebar-foreground/10 backdrop-blur-sm">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sistem Prediksi SNBP</h1>
              <p className="text-sidebar-foreground/70">Seleksi Nasional Berdasarkan Prestasi</p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-4xl font-bold leading-tight">
              Prediksi Masa Depan<br />
              Akademik Siswa
            </h2>
            <p className="text-lg text-sidebar-foreground/80 max-w-md">
              Platform berbasis web untuk memprediksi kelulusan SNBP dan memberikan rekomendasi PTN terbaik berdasarkan data akademik siswa.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="rounded-xl bg-sidebar-foreground/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">1000+</p>
              <p className="text-sm text-sidebar-foreground/70">Siswa Terdaftar</p>
            </div>
            <div className="rounded-xl bg-sidebar-foreground/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-sidebar-foreground/70">Akurasi Prediksi</p>
            </div>
            <div className="rounded-xl bg-sidebar-foreground/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">50+</p>
              <p className="text-sm text-sidebar-foreground/70">PTN Partner</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full flex-col justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
              <GraduationCap className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sistem Prediksi SNBP</h1>
            </div>
          </div>

          <Card variant="elevated" className="border-0 shadow-2xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl font-bold">Masuk</CardTitle>
              <CardDescription>
                Masukkan kredensial Anda untuk mengakses sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@sekolah.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Akun Demo</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  {demoAccounts.map((account) => (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => {
                        setEmail(account.email);
                        setPassword(account.password);
                      }}
                      className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 text-left text-sm transition-colors hover:bg-muted"
                    >
                      <account.icon className="h-4 w-4 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{account.role}</p>
                        <p className="text-xs text-muted-foreground">{account.email}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Sistem ini dikelola oleh sekolah. Hubungi admin untuk mendapatkan akses.
          </p>
        </div>
      </div>
    </div>
  );
}
