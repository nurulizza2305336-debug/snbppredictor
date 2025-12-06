import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/dashboard/StatCard';
import { mockStats, chartData, mockSiswa, mockPrediksi } from '@/data/mockData';
import {
  Users,
  GraduationCap,
  TrendingUp,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
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

export default function Statistik() {
  const lolosData = [
    { name: 'Lolos (≥75%)', value: mockPrediksi.filter((p) => p.persentase_kelulusan >= 75).length, fill: 'hsl(var(--success))' },
    { name: 'Sedang (50-74%)', value: mockPrediksi.filter((p) => p.persentase_kelulusan >= 50 && p.persentase_kelulusan < 75).length, fill: 'hsl(var(--warning))' },
    { name: 'Rendah (<50%)', value: mockPrediksi.filter((p) => p.persentase_kelulusan < 50).length, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <DashboardLayout requiredRoles={['admin', 'guru']}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Statistik & Dashboard</h1>
        <p className="text-muted-foreground">Analisis data dan metrik keseluruhan sistem SNBP</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Siswa"
          value={mockStats.totalSiswa}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          iconClassName="gradient-primary"
        />
        <StatCard
          title="Rata-rata Nilai"
          value={mockStats.rataRataNilai.toFixed(1)}
          icon={Award}
          trend={{ value: 2.3, isPositive: true }}
          iconClassName="bg-accent"
        />
        <StatCard
          title="Persentase Lolos"
          value={`${mockStats.persentaseLolos}%`}
          icon={TrendingUp}
          trend={{ value: 5.2, isPositive: true }}
          iconClassName="bg-success"
        />
        <StatCard
          title="Total Guru"
          value={mockStats.totalGuru}
          icon={GraduationCap}
          iconClassName="bg-warning"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Rata-rata Nilai per Semester
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.nilaiPerSemester}>
                <defs>
                  <linearGradient id="colorNilai" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area
                  type="monotone"
                  dataKey="nilai"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorNilai)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              Status Prediksi Kelulusan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={lolosData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  {lolosData.map((entry, index) => (
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
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Tren Prediksi per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.trenPrediksi}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bulan" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="lolos" name="Lolos" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tidakLolos" name="Tidak Lolos" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Distribusi Siswa per Jurusan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.distribusiJurusan} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="jurusan" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="siswa" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Akreditasi Distribution */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Distribusi Akreditasi Sekolah Asal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {chartData.distribusiAkreditasi.map((item) => (
              <div key={item.name} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                <div
                  className="h-16 w-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
                  style={{ backgroundColor: item.fill }}
                >
                  {item.name.split(' ')[1]}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                  <p className="text-3xl font-bold">{item.value}%</p>
                  <p className="text-sm text-muted-foreground">dari total siswa</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
