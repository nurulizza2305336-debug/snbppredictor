import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockSiswa, mockNilai } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  BarChart3,
  Play,
  RefreshCw,
} from 'lucide-react';
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
} from 'recharts';

export default function Preprocessing() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate preprocessing statistics
  const dataStatistics = mockNilai.map((nilai, index) => {
    const siswa = mockSiswa.find((s) => s.id === nilai.siswa_id);
    const avgNilai = (nilai.semester_1 + nilai.semester_2 + nilai.semester_3 + nilai.semester_4 + nilai.semester_5) / 5;
    return {
      nama: siswa?.nama || 'Unknown',
      nilaiRaw: avgNilai,
      nilaiNormalized: ((avgNilai - 70) / 30) * 100, // Min-max normalization assuming 70-100 range
      peringkat: siswa?.peringkat_sekolah || 0,
      prestasi: nilai.prestasi.length,
    };
  });

  const distributionData = [
    { range: '70-75', count: mockNilai.filter((n) => ((n.semester_1 + n.semester_2 + n.semester_3 + n.semester_4 + n.semester_5) / 5) < 75).length },
    { range: '75-80', count: mockNilai.filter((n) => { const avg = (n.semester_1 + n.semester_2 + n.semester_3 + n.semester_4 + n.semester_5) / 5; return avg >= 75 && avg < 80; }).length },
    { range: '80-85', count: mockNilai.filter((n) => { const avg = (n.semester_1 + n.semester_2 + n.semester_3 + n.semester_4 + n.semester_5) / 5; return avg >= 80 && avg < 85; }).length },
    { range: '85-90', count: mockNilai.filter((n) => { const avg = (n.semester_1 + n.semester_2 + n.semester_3 + n.semester_4 + n.semester_5) / 5; return avg >= 85 && avg < 90; }).length },
    { range: '90-95', count: mockNilai.filter((n) => { const avg = (n.semester_1 + n.semester_2 + n.semester_3 + n.semester_4 + n.semester_5) / 5; return avg >= 90 && avg < 95; }).length },
    { range: '95-100', count: mockNilai.filter((n) => ((n.semester_1 + n.semester_2 + n.semester_3 + n.semester_4 + n.semester_5) / 5) >= 95).length },
  ];

  const scatterData = dataStatistics.map((d) => ({
    x: d.nilaiRaw,
    y: d.peringkat,
    z: d.prestasi * 100 + 200,
    name: d.nama,
  }));

  const handleRunPreprocessing = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    toast({
      title: 'Preprocessing Selesai',
      description: 'Data telah dinormalisasi dan siap untuk prediksi',
    });
  };

  const preprocessingSteps = [
    { step: 'Data Cleaning', description: 'Menghapus data duplikat dan nilai kosong', status: 'complete' },
    { step: 'Normalisasi Nilai', description: 'Min-Max scaling untuk nilai rapor (0-1)', status: 'complete' },
    { step: 'Encoding Kategori', description: 'One-hot encoding untuk akreditasi dan jurusan', status: 'complete' },
    { step: 'Feature Engineering', description: 'Menghitung rata-rata nilai dan skor prestasi', status: 'complete' },
    { step: 'Outlier Detection', description: 'Identifikasi data anomali menggunakan IQR', status: 'pending' },
  ];

  return (
    <DashboardLayout requiredRoles={['admin', 'guru']}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Preprocessing Data</h1>
          <p className="text-muted-foreground">Proses cleaning, normalisasi, dan transformasi data</p>
        </div>
        <Button
          variant="gradient"
          size="lg"
          onClick={handleRunPreprocessing}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              Jalankan Preprocessing
            </>
          )}
        </Button>
      </div>

      {/* Steps */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Langkah Preprocessing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {preprocessingSteps.map((item, index) => (
              <div key={item.step} className="flex-1 relative">
                <div className={`p-4 rounded-xl border-2 ${item.status === 'complete' ? 'border-success bg-success/5' : 'border-muted bg-muted/20'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {item.status === 'complete' ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="font-semibold">{item.step}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                {index < preprocessingSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="visualization" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="visualization">Visualisasi</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="statistics">Statistik</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Distribusi Nilai Rata-rata</CardTitle>
                <CardDescription>Histogram frekuensi nilai siswa</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={distributionData}>
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
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Scatter Plot: Nilai vs Peringkat</CardTitle>
                <CardDescription>Ukuran titik menunjukkan jumlah prestasi</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" dataKey="x" name="Nilai" stroke="hsl(var(--muted-foreground))" domain={[70, 100]} />
                    <YAxis type="number" dataKey="y" name="Peringkat" stroke="hsl(var(--muted-foreground))" reversed />
                    <ZAxis type="number" dataKey="z" range={[100, 500]} />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Scatter data={scatterData} fill="hsl(var(--accent))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Setelah Preprocessing
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nama Siswa</th>
                      <th>Nilai Raw</th>
                      <th>Nilai Normalized</th>
                      <th>Peringkat</th>
                      <th>Jumlah Prestasi</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataStatistics.map((data, index) => (
                      <tr key={index}>
                        <td className="font-medium">{data.nama}</td>
                        <td>{data.nilaiRaw.toFixed(2)}</td>
                        <td>
                          <Badge variant="secondary">{data.nilaiNormalized.toFixed(2)}%</Badge>
                        </td>
                        <td className="text-center">#{data.peringkat}</td>
                        <td className="text-center">{data.prestasi}</td>
                        <td>
                          <Badge variant="default">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Valid
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid gap-6 md:grid-cols-3">
            <Card variant="stat">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mean Nilai</p>
                    <p className="text-2xl font-bold">
                      {(dataStatistics.reduce((a, b) => a + b.nilaiRaw, 0) / dataStatistics.length).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="stat">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <BarChart3 className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Max Nilai</p>
                    <p className="text-2xl font-bold">
                      {Math.max(...dataStatistics.map((d) => d.nilaiRaw)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card variant="stat">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                    <BarChart3 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Min Nilai</p>
                    <p className="text-2xl font-bold">
                      {Math.min(...dataStatistics.map((d) => d.nilaiRaw)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
