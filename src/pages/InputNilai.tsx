import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockSiswa, mockNilai } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import {
  FileSpreadsheet,
  Save,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function InputNilai() {
  const [selectedSiswa, setSelectedSiswa] = useState('');
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    semester_1: '',
    semester_2: '',
    semester_3: '',
    semester_4: '',
    semester_5: '',
    prestasi: [] as string[],
    nilai_portofolio: '',
  });

  const [newPrestasi, setNewPrestasi] = useState('');

  const handleSiswaChange = (siswaId: string) => {
    setSelectedSiswa(siswaId);
    const existingNilai = mockNilai.find((n) => n.siswa_id === siswaId);
    if (existingNilai) {
      setFormData({
        semester_1: existingNilai.semester_1.toString(),
        semester_2: existingNilai.semester_2.toString(),
        semester_3: existingNilai.semester_3.toString(),
        semester_4: existingNilai.semester_4.toString(),
        semester_5: existingNilai.semester_5.toString(),
        prestasi: existingNilai.prestasi,
        nilai_portofolio: existingNilai.nilai_portofolio.toString(),
      });
    } else {
      setFormData({
        semester_1: '',
        semester_2: '',
        semester_3: '',
        semester_4: '',
        semester_5: '',
        prestasi: [],
        nilai_portofolio: '',
      });
    }
  };

  const addPrestasi = () => {
    if (newPrestasi.trim()) {
      setFormData({
        ...formData,
        prestasi: [...formData.prestasi, newPrestasi.trim()],
      });
      setNewPrestasi('');
    }
  };

  const removePrestasi = (index: number) => {
    setFormData({
      ...formData,
      prestasi: formData.prestasi.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Nilai Tersimpan',
      description: 'Data nilai siswa berhasil disimpan',
    });
  };

  const selectedSiswaData = mockSiswa.find((s) => s.id === selectedSiswa);

  const calculateAverage = () => {
    const semesters = [
      parseFloat(formData.semester_1) || 0,
      parseFloat(formData.semester_2) || 0,
      parseFloat(formData.semester_3) || 0,
      parseFloat(formData.semester_4) || 0,
      parseFloat(formData.semester_5) || 0,
    ];
    const sum = semesters.reduce((a, b) => a + b, 0);
    const count = semesters.filter((v) => v > 0).length;
    return count > 0 ? (sum / count).toFixed(2) : '0.00';
  };

  return (
    <DashboardLayout requiredRoles={['admin', 'guru']}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Input Nilai Siswa</h1>
        <p className="text-muted-foreground">Masukkan nilai rapor semester 1-5 dan prestasi</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Form Input Nilai
              </CardTitle>
              <CardDescription>
                Pilih siswa dan masukkan nilai sesuai data rapor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pilih Siswa */}
                <div className="space-y-2">
                  <Label>Pilih Siswa</Label>
                  <Select value={selectedSiswa} onValueChange={handleSiswaChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih siswa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSiswa.map((siswa) => (
                        <SelectItem key={siswa.id} value={siswa.id}>
                          {siswa.nama} - {siswa.kelas}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSiswa && (
                  <>
                    {/* Nilai Semester */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Nilai Rapor per Semester</Label>
                      <div className="grid gap-4 sm:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((sem) => (
                          <div key={sem} className="space-y-2">
                            <Label htmlFor={`sem${sem}`} className="text-sm">
                              Semester {sem}
                            </Label>
                            <Input
                              id={`sem${sem}`}
                              type="number"
                              min={0}
                              max={100}
                              step={0.1}
                              value={formData[`semester_${sem}` as keyof typeof formData]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [`semester_${sem}`]: e.target.value,
                                })
                              }
                              placeholder="0-100"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Nilai Portofolio */}
                    <div className="space-y-2">
                      <Label htmlFor="portofolio">Nilai Portofolio</Label>
                      <Input
                        id="portofolio"
                        type="number"
                        min={0}
                        max={100}
                        value={formData.nilai_portofolio}
                        onChange={(e) =>
                          setFormData({ ...formData, nilai_portofolio: e.target.value })
                        }
                        placeholder="Masukkan nilai portofolio"
                      />
                    </div>

                    {/* Prestasi */}
                    <div className="space-y-4">
                      <Label className="text-base font-semibold">Prestasi Akademik/Non-Akademik</Label>
                      <div className="flex gap-2">
                        <Input
                          value={newPrestasi}
                          onChange={(e) => setNewPrestasi(e.target.value)}
                          placeholder="Tambahkan prestasi..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addPrestasi();
                            }
                          }}
                        />
                        <Button type="button" onClick={addPrestasi}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.prestasi.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.prestasi.map((p, index) => (
                            <Badge key={index} variant="secondary" className="py-1.5 pl-3 pr-1">
                              {p}
                              <button
                                type="button"
                                onClick={() => removePrestasi(index)}
                                className="ml-2 rounded-full p-0.5 hover:bg-muted"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button type="submit" variant="gradient" size="lg" className="w-full">
                      <Save className="mr-2 h-5 w-5" />
                      Simpan Nilai
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          {selectedSiswaData && (
            <>
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="text-lg">Data Siswa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-bold">
                      {selectedSiswaData.nama.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedSiswaData.nama}</p>
                      <p className="text-sm text-muted-foreground">NISN: {selectedSiswaData.nisn}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Kelas</span>
                      <span className="font-medium">{selectedSiswaData.kelas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Jurusan</span>
                      <span className="font-medium">{selectedSiswaData.jurusan}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Peringkat</span>
                      <span className="font-medium">#{selectedSiswaData.peringkat_sekolah}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Akreditasi</span>
                      <Badge variant="default">{selectedSiswaData.akreditasi_sekolah}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="stat">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-muted-foreground">Rata-rata Nilai</p>
                    <p className="text-4xl font-bold text-primary">{calculateAverage()}</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {parseFloat(calculateAverage()) >= 85 ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <span className="text-sm text-success">Sangat Baik</span>
                        </>
                      ) : parseFloat(calculateAverage()) >= 75 ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-accent" />
                          <span className="text-sm text-accent">Baik</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-5 w-5 text-warning" />
                          <span className="text-sm text-warning">Perlu Peningkatan</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="default">
                <CardHeader>
                  <CardTitle className="text-lg">Kuota SNBP</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Akreditasi A</span>
                      <Badge variant="default">40%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Akreditasi B</span>
                      <Badge variant="secondary">25%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Akreditasi C</span>
                      <Badge variant="outline">5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
