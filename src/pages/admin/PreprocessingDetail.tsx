import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { usePreprocessingLogs, usePreprocessingData, useSiswa, useNilai } from '@/hooks/useSupabaseData';
import { 
  Database,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  RefreshCw,
  FileText,
  BarChart3,
  Layers,
  Filter,
  Shuffle,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ArrowDown
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const PREPROCESSING_STAGES = [
  {
    tahap: 1,
    nama: 'Data Collection',
    icon: Database,
    description: 'Mengumpulkan data dari berbagai sumber (siswa, nilai, sekolah)',
    color: 'bg-blue-500'
  },
  {
    tahap: 2,
    nama: 'Data Cleaning',
    icon: Filter,
    description: 'Menghapus data duplikat, null values, dan outliers',
    color: 'bg-yellow-500'
  },
  {
    tahap: 3,
    nama: 'Data Transformation',
    icon: Shuffle,
    description: 'Mengubah format data dan encoding kategorikal',
    color: 'bg-purple-500'
  },
  {
    tahap: 4,
    nama: 'Normalization',
    icon: TrendingUp,
    description: 'Min-Max scaling dan standardisasi nilai',
    color: 'bg-green-500'
  },
  {
    tahap: 5,
    nama: 'Feature Engineering',
    icon: Layers,
    description: 'Membuat fitur baru dari data yang ada',
    color: 'bg-orange-500'
  },
  {
    tahap: 6,
    nama: 'Validation',
    icon: CheckCircle2,
    description: 'Validasi data akhir sebelum prediksi',
    color: 'bg-teal-500'
  }
];

export default function PreprocessingDetail() {
  const [selectedLogId, setSelectedLogId] = useState<string | undefined>();
  const [activeStage, setActiveStage] = useState(1);
  
  const { data: preprocessingLogs, isLoading: logsLoading } = usePreprocessingLogs();
  const { data: preprocessingData, isLoading: dataLoading } = usePreprocessingData(selectedLogId);
  const { data: siswaData } = useSiswa();
  const { data: nilaiData } = useNilai();

  // Calculate statistics from actual data
  const calculateStats = () => {
    if (!nilaiData || nilaiData.length === 0) {
      return {
        mean: 0,
        max: 0,
        min: 0,
        std: 0,
        validCount: 0,
        invalidCount: 0,
        totalCount: 0
      };
    }

    const values = nilaiData
      .map(n => n.rata_rata)
      .filter((v): v is number => v !== null);

    if (values.length === 0) {
      return {
        mean: 0,
        max: 0,
        min: 0,
        std: 0,
        validCount: 0,
        invalidCount: nilaiData.length,
        totalCount: nilaiData.length
      };
    }

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);
    const std = Math.sqrt(values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / values.length);

    return {
      mean,
      max,
      min,
      std,
      validCount: values.length,
      invalidCount: nilaiData.length - values.length,
      totalCount: nilaiData.length
    };
  };

  const stats = calculateStats();

  // Generate histogram data
  const generateHistogramData = () => {
    if (!nilaiData) return [];
    
    const ranges = [
      { range: '< 70', min: 0, max: 70 },
      { range: '70-75', min: 70, max: 75 },
      { range: '75-80', min: 75, max: 80 },
      { range: '80-85', min: 80, max: 85 },
      { range: '85-90', min: 85, max: 90 },
      { range: '90-95', min: 90, max: 95 },
      { range: '95-100', min: 95, max: 101 }
    ];

    return ranges.map(r => ({
      range: r.range,
      count: nilaiData.filter(n => {
        const avg = n.rata_rata;
        return avg !== null && avg >= r.min && avg < r.max;
      }).length
    }));
  };

  // Generate scatter data
  const generateScatterData = () => {
    if (!nilaiData || !siswaData) return [];
    
    return nilaiData.map(nilai => {
      const siswa = siswaData.find(s => s.id === nilai.siswa_id);
      return {
        x: nilai.rata_rata || 0,
        y: siswa?.peringkat_sekolah || 0,
        z: (nilai.prestasi?.length || 0) * 100 + 200,
        nama: siswa?.profiles?.nama || 'Unknown'
      };
    }).filter(d => d.x > 0 && d.y > 0);
  };

  // Generate normalization comparison data
  const generateNormalizationData = () => {
    if (!nilaiData) return [];
    
    return nilaiData.slice(0, 10).map((nilai, index) => {
      const raw = nilai.rata_rata || 0;
      const normalized = stats.max > stats.min 
        ? ((raw - stats.min) / (stats.max - stats.min)) * 100 
        : 0;
      const standardized = stats.std > 0 
        ? ((raw - stats.mean) / stats.std) * 20 + 50 
        : 50;
      
      return {
        name: `Data ${index + 1}`,
        raw: raw,
        normalized: normalized,
        standardized: standardized
      };
    });
  };

  // Data quality pie chart
  const dataQualityPie = [
    { name: 'Valid', value: stats.validCount, fill: 'hsl(var(--success))' },
    { name: 'Missing/Invalid', value: stats.invalidCount, fill: 'hsl(var(--destructive))' }
  ];

  const histogramData = generateHistogramData();
  const scatterData = generateScatterData();
  const normalizationData = generateNormalizationData();

  return (
    <DashboardLayout requiredRoles={['admin']}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Preprocessing Detail
          </h1>
          <p className="text-muted-foreground">Lihat detail proses preprocessing data per tahap</p>
        </div>
        <Button variant="gradient">
          <Play className="mr-2 h-4 w-4" />
          Jalankan Preprocessing Baru
        </Button>
      </div>

      {/* Pipeline Overview */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle>Pipeline Preprocessing</CardTitle>
          <CardDescription>Alur proses pengolahan data dari awal hingga siap prediksi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Desktop View */}
            <div className="hidden md:flex items-center justify-between">
              {PREPROCESSING_STAGES.map((stage, index) => (
                <div key={stage.tahap} className="flex items-center">
                  <button
                    onClick={() => setActiveStage(stage.tahap)}
                    className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                      activeStage === stage.tahap 
                        ? 'bg-primary/10 ring-2 ring-primary' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl ${stage.color} flex items-center justify-center mb-2`}>
                      <stage.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-center max-w-[100px]">{stage.nama}</span>
                    <Badge variant="outline" className="mt-1 text-xs">Tahap {stage.tahap}</Badge>
                  </button>
                  {index < PREPROCESSING_STAGES.length - 1 && (
                    <ArrowRight className="h-5 w-5 text-muted-foreground mx-2" />
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile View */}
            <div className="md:hidden space-y-3">
              {PREPROCESSING_STAGES.map((stage, index) => (
                <div key={stage.tahap}>
                  <button
                    onClick={() => setActiveStage(stage.tahap)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      activeStage === stage.tahap 
                        ? 'bg-primary/10 ring-2 ring-primary' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg ${stage.color} flex items-center justify-center`}>
                      <stage.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="font-medium">{stage.nama}</span>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>
                    <Badge variant="outline">Tahap {stage.tahap}</Badge>
                  </button>
                  {index < PREPROCESSING_STAGES.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stage Detail */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const stage = PREPROCESSING_STAGES.find(s => s.tahap === activeStage);
                const Icon = stage?.icon || Database;
                return <Icon className="h-5 w-5 text-primary" />;
              })()}
              {PREPROCESSING_STAGES.find(s => s.tahap === activeStage)?.nama}
            </CardTitle>
            <CardDescription>
              {PREPROCESSING_STAGES.find(s => s.tahap === activeStage)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeStage === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Total Siswa</p>
                    <p className="text-2xl font-bold">{siswaData?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Total Nilai</p>
                    <p className="text-2xl font-bold">{nilaiData?.length || 0}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Data Lengkap</p>
                    <p className="text-2xl font-bold">{stats.validCount}</p>
                  </div>
                </div>
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">Sumber Data</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Tabel siswa: profil dan data demografis</li>
                    <li>• Tabel nilai: nilai semester 1-5 dan prestasi</li>
                    <li>• Tabel sekolah: akreditasi dan kuota SNBP</li>
                  </ul>
                </div>
              </div>
            )}

            {activeStage === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Data Valid</span>
                    </div>
                    <p className="text-2xl font-bold text-success">{stats.validCount}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm font-medium">Data Bermasalah</span>
                    </div>
                    <p className="text-2xl font-bold text-destructive">{stats.invalidCount}</p>
                  </div>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataQualityPie}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {dataQualityPie.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeStage === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Transformasi yang Dilakukan</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">One-Hot Encoding: Akreditasi</span>
                      <Badge variant="default">Selesai</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Label Encoding: Jurusan</span>
                      <Badge variant="default">Selesai</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">Date Parsing: Timestamp</span>
                      <Badge variant="default">Selesai</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStage === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Mean</p>
                    <p className="text-lg font-bold">{stats.mean.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Max</p>
                    <p className="text-lg font-bold">{stats.max.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Min</p>
                    <p className="text-lg font-bold">{stats.min.toFixed(2)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-xs text-muted-foreground">Std Dev</p>
                    <p className="text-lg font-bold">{stats.std.toFixed(2)}</p>
                  </div>
                </div>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={normalizationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="raw" stroke="hsl(var(--primary))" name="Raw" strokeWidth={2} />
                      <Line type="monotone" dataKey="normalized" stroke="hsl(var(--accent))" name="Normalized" strokeWidth={2} />
                      <Line type="monotone" dataKey="standardized" stroke="hsl(var(--success))" name="Standardized" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeStage === 5 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Fitur yang Dibuat</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">rata_rata_nilai</span>
                      <span className="text-xs text-muted-foreground">AVG(semester_1..5)</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">skor_prestasi</span>
                      <span className="text-xs text-muted-foreground">COUNT(prestasi) * weight</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">kuota_ratio</span>
                      <span className="text-xs text-muted-foreground">peringkat / kuota_snbp</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <span className="text-sm">trend_nilai</span>
                      <span className="text-xs text-muted-foreground">Linear regression slope</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStage === 6 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    <span className="font-medium">Validasi Selesai</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Semua data telah divalidasi dan siap untuk proses prediksi
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Data Siap Prediksi</p>
                    <p className="text-2xl font-bold text-success">{stats.validCount}</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <p className="text-sm text-muted-foreground">Tingkat Kelengkapan</p>
                    <p className="text-2xl font-bold">
                      {stats.totalCount > 0 ? ((stats.validCount / stats.totalCount) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Summary */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Statistik Ringkasan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{Math.round((activeStage / 6) * 100)}%</span>
              </div>
              <Progress value={(activeStage / 6) * 100} className="h-2" />
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Data Input</span>
                <span className="font-medium">{stats.totalCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data Valid</span>
                <span className="font-medium text-success">{stats.validCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Data Error</span>
                <span className="font-medium text-destructive">{stats.invalidCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rata-rata Nilai</span>
                <span className="font-medium">{stats.mean.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualizations */}
      <Tabs defaultValue="histogram" className="space-y-6">
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="histogram">Histogram</TabsTrigger>
          <TabsTrigger value="scatter">Scatter Plot</TabsTrigger>
          <TabsTrigger value="data">Data Tabel</TabsTrigger>
        </TabsList>

        <TabsContent value="histogram">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Distribusi Nilai Rata-rata</CardTitle>
              <CardDescription>Histogram frekuensi nilai siswa setelah preprocessing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={histogramData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Jumlah Siswa" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scatter">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Scatter Plot: Nilai vs Peringkat</CardTitle>
              <CardDescription>Ukuran titik menunjukkan jumlah prestasi siswa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name="Nilai Rata-rata" 
                      stroke="hsl(var(--muted-foreground))" 
                      domain={[70, 100]}
                      label={{ value: 'Nilai Rata-rata', position: 'bottom', offset: -5 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name="Peringkat" 
                      stroke="hsl(var(--muted-foreground))" 
                      reversed
                      label={{ value: 'Peringkat', angle: -90, position: 'left' }}
                    />
                    <ZAxis type="number" dataKey="z" range={[100, 500]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value, name) => {
                        if (name === 'x') return [value, 'Nilai'];
                        if (name === 'y') return [value, 'Peringkat'];
                        return [value, name];
                      }}
                    />
                    <Scatter data={scatterData} fill="hsl(var(--accent))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Data Setelah Preprocessing</CardTitle>
              <CardDescription>Tampilan data yang sudah dinormalisasi dan ditransformasi</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No</TableHead>
                      <TableHead>Nama Siswa</TableHead>
                      <TableHead>Nilai Raw</TableHead>
                      <TableHead>Nilai Normalized</TableHead>
                      <TableHead>Peringkat</TableHead>
                      <TableHead>Skor Prestasi</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nilaiData?.slice(0, 20).map((nilai, index) => {
                      const siswa = siswaData?.find(s => s.id === nilai.siswa_id);
                      const rawValue = nilai.rata_rata || 0;
                      const normalized = stats.max > stats.min 
                        ? ((rawValue - stats.min) / (stats.max - stats.min)) * 100 
                        : 0;
                      
                      return (
                        <TableRow key={nilai.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">
                            {siswa?.profiles?.nama || 'Unknown'}
                          </TableCell>
                          <TableCell>{rawValue.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{normalized.toFixed(2)}%</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            #{siswa?.peringkat_sekolah || '-'}
                          </TableCell>
                          <TableCell className="text-center">
                            {nilai.prestasi?.length || 0}
                          </TableCell>
                          <TableCell>
                            <Badge variant={rawValue > 0 ? 'default' : 'destructive'}>
                              {rawValue > 0 ? (
                                <><CheckCircle2 className="mr-1 h-3 w-3" /> Valid</>
                              ) : (
                                <><XCircle className="mr-1 h-3 w-3" /> Invalid</>
                              )}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {(!nilaiData || nilaiData.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          Belum ada data nilai untuk diproses
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
