import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats, useSiswa, useNilai, usePrediksi, useSekolah, useGuru, useActivityLogs } from '@/hooks/useSupabaseData';
import { mockStats, mockSiswa, mockPrediksi, mockNilai, chartData } from '@/data/mockData';
import {
  Users,
  GraduationCap,
  TrendingUp,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  Database,
  Activity,
  Building2,
  Target,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: siswaData, isLoading: siswaLoading } = useSiswa();
  const { data: nilaiData } = useNilai();
  const { data: prediksiData } = usePrediksi();
  const { data: sekolahData } = useSekolah();
  const { data: guruData } = useGuru();
  const { data: activityLogs } = useActivityLogs();

  // Calculate chart data from real data
  const nilaiPerSemester = nilaiData && nilaiData.length > 0 ? [
    { semester: 'Sem 1', nilai: nilaiData.reduce((sum, n) => sum + (n.semester_1 || 0), 0) / nilaiData.length },
    { semester: 'Sem 2', nilai: nilaiData.reduce((sum, n) => sum + (n.semester_2 || 0), 0) / nilaiData.length },
    { semester: 'Sem 3', nilai: nilaiData.reduce((sum, n) => sum + (n.semester_3 || 0), 0) / nilaiData.length },
    { semester: 'Sem 4', nilai: nilaiData.reduce((sum, n) => sum + (n.semester_4 || 0), 0) / nilaiData.length },
    { semester: 'Sem 5', nilai: nilaiData.reduce((sum, n) => sum + (n.semester_5 || 0), 0) / nilaiData.length },
  ] : chartData.nilaiPerSemester;

  const distribusiAkreditasi = sekolahData && sekolahData.length > 0 ? [
    { name: 'Akreditasi A', value: sekolahData.filter(s => s.akreditasi === 'A').length, fill: 'hsl(var(--primary))' },
    { name: 'Akreditasi B', value: sekolahData.filter(s => s.akreditasi === 'B').length, fill: 'hsl(var(--accent))' },
    { name: 'Akreditasi C', value: sekolahData.filter(s => s.akreditasi === 'C').length, fill: 'hsl(var(--muted-foreground))' },
  ] : chartData.distribusiAkreditasi;

  const statusPrediksi = prediksiData && prediksiData.length > 0 ? [
    { name: 'Published', value: prediksiData.filter(p => p.status === 'published').length, fill: 'hsl(var(--success))' },
    { name: 'Processed', value: prediksiData.filter(p => p.status === 'processed').length, fill: 'hsl(var(--accent))' },
    { name: 'Pending', value: prediksiData.filter(p => p.status === 'pending').length, fill: 'hsl(var(--muted-foreground))' },
  ] : [];

  const displayStats = stats || { 
    totalSiswa: mockStats.totalSiswa, 
    totalGuru: mockStats.totalGuru, 
    rataRataNilai: mockStats.rataRataNilai, 
    persentaseLolos: mockStats.persentaseLolos,
    totalPrediksi: mockPrediksi.length
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Kelola dan pantau sistem prediksi SNBP</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {statsLoading ? (
          [...Array(5)].map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatCard
              title="Total Siswa"
              value={displayStats.totalSiswa}
              icon={Users}
              trend={{ value: 12, isPositive: true }}
              iconClassName="gradient-primary"
            />
            <StatCard
              title="Total Guru"
              value={displayStats.totalGuru}
              icon={GraduationCap}
              iconClassName="bg-warning"
            />
            <StatCard
              title="Total Sekolah"
              value={sekolahData?.length || 0}
              icon={Building2}
              iconClassName="bg-accent"
            />
            <StatCard
              title="Total Prediksi"
              value={displayStats.totalPrediksi}
              icon={Target}
              iconClassName="bg-secondary"
            />
            <StatCard
              title="Prediksi Lolos"
              value={`${displayStats.persentaseLolos}%`}
              icon={TrendingUp}
              trend={{ value: 5.2, isPositive: true }}
              iconClassName="bg-success"
            />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Aksi Cepat Admin
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <Button variant="default" className="justify-start h-auto py-4" size="lg" asChild>
            <Link to="/admin/tables">
              <Database className="mr-3 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Tabel Relasional</p>
                <p className="text-xs opacity-70">Lihat semua tabel database</p>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" size="lg" asChild>
            <Link to="/admin/preprocessing">
              <Calculator className="mr-3 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Preprocessing Detail</p>
                <p className="text-xs opacity-70">Lihat proses per tahap</p>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" size="lg" asChild>
            <Link to="/siswa">
              <Users className="mr-3 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Kelola Siswa</p>
                <p className="text-xs opacity-70">Tambah/edit data siswa</p>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="justify-start h-auto py-4" size="lg" asChild>
            <Link to="/guru">
              <GraduationCap className="mr-3 h-5 w-5" />
              <div className="text-left">
                <p className="font-medium">Kelola Guru</p>
                <p className="text-xs opacity-70">Kelola akun guru</p>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Rata-rata Nilai per Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nilaiPerSemester}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="nilai" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Distribusi Akreditasi Sekolah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distribusiAkreditasi}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distribusiAkreditasi.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Status Prediksi Chart */}
      {statusPrediksi.length > 0 && (
        <Card variant="elevated" className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Status Prediksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={statusPrediksi}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusPrediksi.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card variant="elevated">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Data Siswa Terbaru</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/tables">
              Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {siswaLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
            </div>
          ) : siswaData && siswaData.length > 0 ? (
            <div className="space-y-4">
              {siswaData.slice(0, 5).map((siswa) => {
                const prediksi = prediksiData?.find((p) => p.siswa_id === siswa.id);
                return (
                  <div key={siswa.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        {siswa.profiles?.nama?.charAt(0) || siswa.nisn.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{siswa.profiles?.nama || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{siswa.kelas} • NISN: {siswa.nisn}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {prediksi && (
                        <Badge
                          variant={prediksi.persentase_kelulusan >= 75 ? 'default' : prediksi.persentase_kelulusan >= 50 ? 'secondary' : 'destructive'}
                          className="mb-1"
                        >
                          {prediksi.persentase_kelulusan}% Lolos
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground">Peringkat: #{siswa.peringkat_sekolah || '-'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Belum ada data siswa</p>
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link to="/siswa">Tambah Siswa</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function GuruDashboard() {
  const siswaList = mockSiswa.slice(0, 4);
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Guru</h1>
        <p className="text-muted-foreground">Kelola data siswa dan nilai</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard
          title="Siswa Dikelola"
          value={mockSiswa.length}
          icon={Users}
          iconClassName="gradient-primary"
        />
        <StatCard
          title="Nilai Diinput"
          value={mockNilai.length}
          icon={BookOpen}
          iconClassName="bg-accent"
        />
        <StatCard
          title="Prediksi Selesai"
          value={mockPrediksi.length}
          icon={Calculator}
          iconClassName="bg-success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button variant="default" className="justify-start" size="lg" asChild>
              <Link to="/siswa">
                <Users className="mr-3 h-5 w-5" />
                Input Data Siswa Baru
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" size="lg" asChild>
              <Link to="/nilai">
                <BookOpen className="mr-3 h-5 w-5" />
                Input Nilai Rapor
              </Link>
            </Button>
            <Button variant="outline" className="justify-start" size="lg" asChild>
              <Link to="/prediksi">
                <Calculator className="mr-3 h-5 w-5" />
                Jalankan Prediksi
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Siswa Perlu Perhatian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {siswaList.map((siswa) => {
                const prediksi = mockPrediksi.find((p) => p.siswa_id === siswa.id);
                const status = prediksi 
                  ? prediksi.persentase_kelulusan >= 75 
                    ? 'success' 
                    : prediksi.persentase_kelulusan >= 50 
                    ? 'warning' 
                    : 'danger'
                  : 'pending';
                
                const StatusIcon = status === 'success' ? CheckCircle2 
                  : status === 'warning' ? AlertCircle 
                  : status === 'danger' ? AlertCircle 
                  : Clock;
                
                return (
                  <div key={siswa.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${
                        status === 'success' ? 'text-success' 
                        : status === 'warning' ? 'text-warning' 
                        : status === 'danger' ? 'text-destructive'
                        : 'text-muted-foreground'
                      }`} />
                      <div>
                        <p className="font-medium">{siswa.nama}</p>
                        <p className="text-xs text-muted-foreground">{siswa.kelas}</p>
                      </div>
                    </div>
                    <Badge variant={status === 'success' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}>
                      {prediksi ? `${prediksi.persentase_kelulusan}%` : 'Belum'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function SiswaDashboard() {
  const currentSiswa = mockSiswa[0];
  const currentNilai = mockNilai[0];
  const currentPrediksi = mockPrediksi[0];

  const nilaiData = [
    { semester: 'Sem 1', nilai: currentNilai.semester_1 },
    { semester: 'Sem 2', nilai: currentNilai.semester_2 },
    { semester: 'Sem 3', nilai: currentNilai.semester_3 },
    { semester: 'Sem 4', nilai: currentNilai.semester_4 },
    { semester: 'Sem 5', nilai: currentNilai.semester_5 },
  ];

  const avgNilai = (currentNilai.semester_1 + currentNilai.semester_2 + currentNilai.semester_3 + currentNilai.semester_4 + currentNilai.semester_5) / 5;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Selamat Datang, {currentSiswa.nama}</h1>
        <p className="text-muted-foreground">{currentSiswa.kelas} • NISN: {currentSiswa.nisn}</p>
      </div>

      {/* Prediction Card */}
      <Card variant="elevated" className="mb-8 overflow-hidden">
        <div className="gradient-hero p-8 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-primary-foreground/70 mb-2">Prediksi Kelulusan SNBP</p>
              <p className="text-6xl font-bold">{currentPrediksi.persentase_kelulusan}%</p>
              <p className="text-primary-foreground/70 mt-2">
                Berdasarkan data akademik dan prestasi Anda
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-primary-foreground/10 backdrop-blur-sm p-4">
                <p className="text-sm text-primary-foreground/70">Rekomendasi PTN 1</p>
                <p className="font-bold">{currentPrediksi.ptn_rekomendasi_1}</p>
                <p className="text-sm">{currentPrediksi.prodi_rekomendasi_1}</p>
              </div>
              <div className="rounded-xl bg-primary-foreground/10 backdrop-blur-sm p-4">
                <p className="text-sm text-primary-foreground/70">Rekomendasi PTN 2</p>
                <p className="font-bold">{currentPrediksi.ptn_rekomendasi_2}</p>
                <p className="text-sm">{currentPrediksi.prodi_rekomendasi_2}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard
          title="Rata-rata Nilai"
          value={avgNilai.toFixed(1)}
          icon={BookOpen}
          iconClassName="gradient-primary"
        />
        <StatCard
          title="Peringkat Sekolah"
          value={`#${currentSiswa.peringkat_sekolah}`}
          icon={TrendingUp}
          iconClassName="bg-accent"
        />
        <StatCard
          title="Akreditasi Sekolah"
          value={currentSiswa.akreditasi_sekolah}
          icon={GraduationCap}
          iconClassName="bg-success"
        />
      </div>

      {/* Nilai Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Perkembangan Nilai</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={nilaiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="semester" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[70, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="nilai"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Prestasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentNilai.prestasi.length > 0 ? (
                currentNilai.prestasi.map((prestasi, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span>{prestasi}</span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Belum ada prestasi tercatat</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-6 md:grid-cols-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {user?.role === 'admin' && <AdminDashboard />}
      {user?.role === 'guru' && <GuruDashboard />}
      {user?.role === 'siswa' && <SiswaDashboard />}
    </DashboardLayout>
  );
}
