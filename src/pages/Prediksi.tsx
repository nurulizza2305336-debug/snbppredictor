import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { mockSiswa, mockNilai, mockPrediksi, ptnList, prodiList } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  Calculator,
  Play,
  TrendingUp,
  GraduationCap,
  Award,
  Target,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';

export default function Prediksi() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRunPrediction = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setProgress(i);
    }
    
    setIsProcessing(false);
    toast({
      title: 'Prediksi Selesai',
      description: 'Hasil prediksi telah diperbarui untuk semua siswa',
    });
  };

  const getPredictionStatus = (percentage: number) => {
    if (percentage >= 80) return { label: 'Sangat Tinggi', color: 'bg-success', textColor: 'text-success' };
    if (percentage >= 60) return { label: 'Tinggi', color: 'bg-accent', textColor: 'text-accent' };
    if (percentage >= 40) return { label: 'Sedang', color: 'bg-warning', textColor: 'text-warning' };
    return { label: 'Rendah', color: 'bg-destructive', textColor: 'text-destructive' };
  };

  // For siswa role, show their own prediction
  if (user?.role === 'siswa') {
    const currentPrediksi = mockPrediksi[0];
    const currentSiswa = mockSiswa[0];
    const currentNilai = mockNilai[0];
    const status = getPredictionStatus(currentPrediksi.persentase_kelulusan);
    const avgNilai = (currentNilai.semester_1 + currentNilai.semester_2 + currentNilai.semester_3 + currentNilai.semester_4 + currentNilai.semester_5) / 5;

    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hasil Prediksi SNBP</h1>
          <p className="text-muted-foreground">Prediksi kelulusan dan rekomendasi PTN berdasarkan data Anda</p>
        </div>

        {/* Main Prediction Card */}
        <Card variant="elevated" className="mb-8 overflow-hidden">
          <div className="gradient-hero p-8 text-primary-foreground">
            <div className="flex flex-col items-center text-center">
              <p className="text-primary-foreground/70 mb-2">Persentase Kelulusan SNBP</p>
              <div className="relative mb-4">
                <svg className="h-48 w-48 -rotate-90 transform">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    className="text-primary-foreground/20"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray={`${currentPrediksi.persentase_kelulusan * 5.53} 553`}
                    className="text-primary-foreground"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-bold">{currentPrediksi.persentase_kelulusan}%</span>
                </div>
              </div>
              <Badge className="bg-primary-foreground/20 text-primary-foreground text-lg px-4 py-1">
                {status.label}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Recommendations */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card variant="interactive">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Rekomendasi PTN 1</p>
                  <p className="text-xl font-bold">{currentPrediksi.ptn_rekomendasi_1}</p>
                  <Badge variant="secondary" className="mt-2">
                    {currentPrediksi.prodi_rekomendasi_1}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="interactive">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Rekomendasi PTN 2</p>
                  <p className="text-xl font-bold">{currentPrediksi.ptn_rekomendasi_2}</p>
                  <Badge variant="secondary" className="mt-2">
                    {currentPrediksi.prodi_rekomendasi_2}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Factors */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Faktor Penilaian
            </CardTitle>
            <CardDescription>
              Komponen yang mempengaruhi hasil prediksi Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Rata-rata Nilai Rapor</span>
                  <span className="font-bold">{avgNilai.toFixed(1)}</span>
                </div>
                <Progress value={avgNilai} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Peringkat Sekolah</span>
                  <span className="font-bold">#{currentSiswa.peringkat_sekolah}</span>
                </div>
                <Progress value={100 - (currentSiswa.peringkat_sekolah * 5)} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Nilai Portofolio</span>
                  <span className="font-bold">{currentNilai.nilai_portofolio}</span>
                </div>
                <Progress value={currentNilai.nilai_portofolio} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Prestasi</span>
                  <span className="font-bold">{currentNilai.prestasi.length} prestasi</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentNilai.prestasi.map((p, i) => (
                    <Badge key={i} variant="outline" className="py-1">
                      <Award className="mr-1 h-3 w-3" />
                      {p}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  // For admin/guru roles
  return (
    <DashboardLayout requiredRoles={['admin', 'guru']}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prediksi SNBP</h1>
          <p className="text-muted-foreground">Jalankan dan kelola prediksi kelulusan siswa</p>
        </div>
        <Button
          variant="gradient"
          size="lg"
          onClick={handleRunPrediction}
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
              Jalankan Prediksi
            </>
          )}
        </Button>
      </div>

      {/* Progress */}
      {isProcessing && (
        <Card variant="default" className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memproses prediksi...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card variant="stat" className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Prediksi</p>
              <p className="text-2xl font-bold">{mockPrediksi.length}</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lolos (≥75%)</p>
              <p className="text-2xl font-bold">{mockPrediksi.filter((p) => p.persentase_kelulusan >= 75).length}</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sedang (50-74%)</p>
              <p className="text-2xl font-bold">{mockPrediksi.filter((p) => p.persentase_kelulusan >= 50 && p.persentase_kelulusan < 75).length}</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
              <Target className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Perlu Perhatian</p>
              <p className="text-2xl font-bold">{mockPrediksi.filter((p) => p.persentase_kelulusan < 50).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Results Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Hasil Prediksi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Siswa</th>
                  <th>Kelas</th>
                  <th>PTN Rekomendasi 1</th>
                  <th>PTN Rekomendasi 2</th>
                  <th>Persentase</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockPrediksi.map((prediksi, index) => {
                  const siswa = mockSiswa.find((s) => s.id === prediksi.siswa_id);
                  const status = getPredictionStatus(prediksi.persentase_kelulusan);
                  return (
                    <tr key={prediksi.id}>
                      <td className="font-medium">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            {siswa?.nama.charAt(0)}
                          </div>
                          <span className="font-medium">{siswa?.nama}</span>
                        </div>
                      </td>
                      <td>{siswa?.kelas}</td>
                      <td>
                        <div>
                          <p className="font-medium">{prediksi.ptn_rekomendasi_1}</p>
                          <p className="text-xs text-muted-foreground">{prediksi.prodi_rekomendasi_1}</p>
                        </div>
                      </td>
                      <td>
                        <div>
                          <p className="font-medium">{prediksi.ptn_rekomendasi_2}</p>
                          <p className="text-xs text-muted-foreground">{prediksi.prodi_rekomendasi_2}</p>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-24">
                            <Progress value={prediksi.persentase_kelulusan} className="h-2" />
                          </div>
                          <span className="font-bold">{prediksi.persentase_kelulusan}%</span>
                        </div>
                      </td>
                      <td>
                        <Badge className={`${status.color} text-white`}>
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
