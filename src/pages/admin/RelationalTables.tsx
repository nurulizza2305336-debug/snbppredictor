import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { useSiswa, useNilai, usePrediksi, useSekolah, useGuru } from '@/hooks/useSupabaseData';
import { 
  Users, 
  BookOpen, 
  Target, 
  Building2, 
  GraduationCap,
  Search,
  Download,
  RefreshCw,
  Database,
  Link2,
  ArrowRight
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function RelationalTables() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data: siswaData, isLoading: siswaLoading, refetch: refetchSiswa } = useSiswa();
  const { data: nilaiData, isLoading: nilaiLoading, refetch: refetchNilai } = useNilai();
  const { data: prediksiData, isLoading: prediksiLoading, refetch: refetchPrediksi } = usePrediksi();
  const { data: sekolahData, isLoading: sekolahLoading, refetch: refetchSekolah } = useSekolah();
  const { data: guruData, isLoading: guruLoading, refetch: refetchGuru } = useGuru();

  const handleRefreshAll = () => {
    refetchSiswa();
    refetchNilai();
    refetchPrediksi();
    refetchSekolah();
    refetchGuru();
  };

  const tableStats = [
    { name: 'Siswa', count: siswaData?.length || 0, icon: Users, color: 'text-primary' },
    { name: 'Nilai', count: nilaiData?.length || 0, icon: BookOpen, color: 'text-accent' },
    { name: 'Prediksi', count: prediksiData?.length || 0, icon: Target, color: 'text-success' },
    { name: 'Sekolah', count: sekolahData?.length || 0, icon: Building2, color: 'text-warning' },
    { name: 'Guru', count: guruData?.length || 0, icon: GraduationCap, color: 'text-secondary-foreground' },
  ];

  return (
    <DashboardLayout requiredRoles={['admin']}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Tabel Relasional
          </h1>
          <p className="text-muted-foreground">Lihat semua tabel database yang saling berelasi</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefreshAll}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="gradient">
            <Download className="mr-2 h-4 w-4" />
            Export Semua
          </Button>
        </div>
      </div>

      {/* Entity Relationship Diagram */}
      <Card variant="elevated" className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Diagram Relasi Entitas
          </CardTitle>
          <CardDescription>Hubungan antar tabel dalam database</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 p-4">
            {tableStats.map((table, index) => (
              <div key={table.name} className="flex items-center gap-2">
                <div className="flex flex-col items-center rounded-xl border-2 border-border bg-card p-4 min-w-[120px]">
                  <table.icon className={`h-8 w-8 ${table.color} mb-2`} />
                  <span className="font-semibold">{table.name}</span>
                  <Badge variant="secondary" className="mt-1">{table.count} rows</Badge>
                </div>
                {index < tableStats.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p><strong>Relasi:</strong></p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Siswa</strong> → belongs to <strong>Sekolah</strong> (many-to-one)</li>
              <li><strong>Siswa</strong> → has one <strong>Guru</strong> pembimbing (many-to-one)</li>
              <li><strong>Nilai</strong> → belongs to <strong>Siswa</strong> (one-to-one)</li>
              <li><strong>Prediksi</strong> → belongs to <strong>Siswa</strong> (one-to-many)</li>
              <li><strong>Guru</strong> → belongs to <strong>Sekolah</strong> (many-to-one)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card variant="default" className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari di semua tabel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tables Tabs */}
      <Tabs defaultValue="siswa" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="siswa" className="gap-2">
            <Users className="h-4 w-4" />
            Siswa
          </TabsTrigger>
          <TabsTrigger value="nilai" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Nilai
          </TabsTrigger>
          <TabsTrigger value="prediksi" className="gap-2">
            <Target className="h-4 w-4" />
            Prediksi
          </TabsTrigger>
          <TabsTrigger value="sekolah" className="gap-2">
            <Building2 className="h-4 w-4" />
            Sekolah
          </TabsTrigger>
          <TabsTrigger value="guru" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Guru
          </TabsTrigger>
        </TabsList>

        {/* Siswa Table */}
        <TabsContent value="siswa">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Tabel Siswa</CardTitle>
              <CardDescription>Data siswa dengan relasi ke sekolah dan guru</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {siswaLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NISN</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Jurusan</TableHead>
                        <TableHead>Peringkat</TableHead>
                        <TableHead>Sekolah (FK)</TableHead>
                        <TableHead>Guru (FK)</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {siswaData?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Belum ada data siswa
                          </TableCell>
                        </TableRow>
                      ) : (
                        siswaData?.filter(s => 
                          s.nisn.includes(searchQuery) || 
                          s.profiles?.nama?.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((siswa) => (
                          <TableRow key={siswa.id}>
                            <TableCell className="font-mono text-xs">{siswa.id.slice(0, 8)}...</TableCell>
                            <TableCell className="font-mono">{siswa.nisn}</TableCell>
                            <TableCell className="font-medium">{siswa.profiles?.nama || '-'}</TableCell>
                            <TableCell>{siswa.kelas}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{siswa.jurusan || '-'}</Badge>
                            </TableCell>
                            <TableCell className="text-center">#{siswa.peringkat_sekolah || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {siswa.sekolah?.nama || siswa.sekolah_id?.slice(0, 8) || '-'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {siswa.guru?.profiles?.nama || siswa.guru_id?.slice(0, 8) || '-'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={siswa.is_active ? 'default' : 'destructive'}>
                                {siswa.is_active ? 'Aktif' : 'Nonaktif'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nilai Table */}
        <TabsContent value="nilai">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Tabel Nilai</CardTitle>
              <CardDescription>Data nilai semester dengan relasi ke siswa</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {nilaiLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Siswa (FK)</TableHead>
                        <TableHead>Sem 1</TableHead>
                        <TableHead>Sem 2</TableHead>
                        <TableHead>Sem 3</TableHead>
                        <TableHead>Sem 4</TableHead>
                        <TableHead>Sem 5</TableHead>
                        <TableHead>Rata-rata</TableHead>
                        <TableHead>Prestasi</TableHead>
                        <TableHead>Portofolio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {nilaiData?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                            Belum ada data nilai
                          </TableCell>
                        </TableRow>
                      ) : (
                        nilaiData?.map((nilai) => (
                          <TableRow key={nilai.id}>
                            <TableCell className="font-mono text-xs">{nilai.id.slice(0, 8)}...</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {nilai.siswa?.profiles?.nama || nilai.siswa_id.slice(0, 8)}
                              </Badge>
                            </TableCell>
                            <TableCell>{nilai.semester_1?.toFixed(1) || '-'}</TableCell>
                            <TableCell>{nilai.semester_2?.toFixed(1) || '-'}</TableCell>
                            <TableCell>{nilai.semester_3?.toFixed(1) || '-'}</TableCell>
                            <TableCell>{nilai.semester_4?.toFixed(1) || '-'}</TableCell>
                            <TableCell>{nilai.semester_5?.toFixed(1) || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{nilai.rata_rata?.toFixed(2) || '-'}</Badge>
                            </TableCell>
                            <TableCell>{nilai.prestasi?.length || 0} item</TableCell>
                            <TableCell>{nilai.nilai_portofolio?.toFixed(1) || '-'}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prediksi Table */}
        <TabsContent value="prediksi">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Tabel Prediksi</CardTitle>
              <CardDescription>Hasil prediksi SNBP dengan relasi ke siswa</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {prediksiLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Siswa (FK)</TableHead>
                        <TableHead>% Kelulusan</TableHead>
                        <TableHead>PTN 1</TableHead>
                        <TableHead>Prodi 1</TableHead>
                        <TableHead>PTN 2</TableHead>
                        <TableHead>Prodi 2</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dibuat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prediksiData?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            Belum ada data prediksi
                          </TableCell>
                        </TableRow>
                      ) : (
                        prediksiData?.map((prediksi) => (
                          <TableRow key={prediksi.id}>
                            <TableCell className="font-mono text-xs">{prediksi.id.slice(0, 8)}...</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {prediksi.siswa?.profiles?.nama || prediksi.siswa_id.slice(0, 8)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={prediksi.persentase_kelulusan >= 75 ? 'default' : prediksi.persentase_kelulusan >= 50 ? 'secondary' : 'destructive'}
                              >
                                {prediksi.persentase_kelulusan}%
                              </Badge>
                            </TableCell>
                            <TableCell>{prediksi.ptn_rekomendasi_1 || '-'}</TableCell>
                            <TableCell>{prediksi.prodi_rekomendasi_1 || '-'}</TableCell>
                            <TableCell>{prediksi.ptn_rekomendasi_2 || '-'}</TableCell>
                            <TableCell>{prediksi.prodi_rekomendasi_2 || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={
                                prediksi.status === 'published' ? 'default' : 
                                prediksi.status === 'processed' ? 'secondary' : 'outline'
                              }>
                                {prediksi.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(prediksi.created_at).toLocaleDateString('id-ID')}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sekolah Table */}
        <TabsContent value="sekolah">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Tabel Sekolah</CardTitle>
              <CardDescription>Data sekolah dan akreditasi</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {sekolahLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NPSN</TableHead>
                        <TableHead>Nama Sekolah</TableHead>
                        <TableHead>Akreditasi</TableHead>
                        <TableHead>Alamat</TableHead>
                        <TableHead>Kota</TableHead>
                        <TableHead>Provinsi</TableHead>
                        <TableHead>Kuota SNBP</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sekolahData?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            Belum ada data sekolah
                          </TableCell>
                        </TableRow>
                      ) : (
                        sekolahData?.filter(s => 
                          s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.npsn.includes(searchQuery)
                        ).map((sekolah) => (
                          <TableRow key={sekolah.id}>
                            <TableCell className="font-mono text-xs">{sekolah.id.slice(0, 8)}...</TableCell>
                            <TableCell className="font-mono">{sekolah.npsn}</TableCell>
                            <TableCell className="font-medium">{sekolah.nama}</TableCell>
                            <TableCell>
                              <Badge variant={
                                sekolah.akreditasi === 'A' ? 'default' : 
                                sekolah.akreditasi === 'B' ? 'secondary' : 'outline'
                              }>
                                {sekolah.akreditasi}
                              </Badge>
                            </TableCell>
                            <TableCell>{sekolah.alamat || '-'}</TableCell>
                            <TableCell>{sekolah.kota || '-'}</TableCell>
                            <TableCell>{sekolah.provinsi || '-'}</TableCell>
                            <TableCell className="text-center">{sekolah.kuota_snbp}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guru Table */}
        <TabsContent value="guru">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Tabel Guru</CardTitle>
              <CardDescription>Data guru dengan relasi ke sekolah</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {guruLoading ? (
                <div className="p-4 space-y-3">
                  {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>NIP</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Mata Pelajaran</TableHead>
                        <TableHead>Sekolah (FK)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dibuat</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guruData?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Belum ada data guru
                          </TableCell>
                        </TableRow>
                      ) : (
                        guruData?.map((guru) => (
                          <TableRow key={guru.id}>
                            <TableCell className="font-mono text-xs">{guru.id.slice(0, 8)}...</TableCell>
                            <TableCell className="font-mono">{guru.nip || '-'}</TableCell>
                            <TableCell className="font-medium">{guru.profiles?.nama || '-'}</TableCell>
                            <TableCell>{guru.mata_pelajaran || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-mono text-xs">
                                {guru.sekolah?.nama || guru.sekolah_id?.slice(0, 8) || '-'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={guru.is_active ? 'default' : 'destructive'}>
                                {guru.is_active ? 'Aktif' : 'Nonaktif'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(guru.created_at).toLocaleDateString('id-ID')}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
