import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockSiswa, mockNilai, mockPrediksi } from '@/data/mockData';
import { Siswa } from '@/types';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit2,
  Trash2,
  Users,
  Eye,
} from 'lucide-react';

export default function DataSiswa() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [siswaList, setSiswaList] = useState<Siswa[]>(mockSiswa);
  const { toast } = useToast();

  const [newSiswa, setNewSiswa] = useState({
    nama: '',
    nisn: '',
    kelas: '',
    jurusan: 'IPA',
    peringkat_sekolah: 1,
    akreditasi_sekolah: 'A' as 'A' | 'B' | 'C',
  });

  const filteredSiswa = siswaList.filter((siswa) => {
    const matchesSearch = siswa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      siswa.nisn.includes(searchQuery);
    const matchesKelas = filterKelas === 'all' || siswa.kelas === filterKelas;
    return matchesSearch && matchesKelas;
  });

  const uniqueKelas = [...new Set(siswaList.map((s) => s.kelas))];

  const handleAddSiswa = () => {
    const newId = (siswaList.length + 1).toString();
    const siswa: Siswa = {
      id: newId,
      ...newSiswa,
      guru_id: '2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setSiswaList([...siswaList, siswa]);
    setIsDialogOpen(false);
    setNewSiswa({
      nama: '',
      nisn: '',
      kelas: '',
      jurusan: 'IPA',
      peringkat_sekolah: 1,
      akreditasi_sekolah: 'A',
    });
    toast({
      title: 'Berhasil',
      description: 'Data siswa berhasil ditambahkan',
    });
  };

  const handleDelete = (id: string) => {
    setSiswaList(siswaList.filter((s) => s.id !== id));
    toast({
      title: 'Dihapus',
      description: 'Data siswa berhasil dihapus',
    });
  };

  const handleExport = () => {
    toast({
      title: 'Export Data',
      description: 'Data siswa berhasil diexport ke CSV',
    });
  };

  return (
    <DashboardLayout requiredRoles={['admin', 'guru']}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Siswa</h1>
          <p className="text-muted-foreground">Kelola data siswa untuk prediksi SNBP</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Tambah Siswa Baru</DialogTitle>
                <DialogDescription>
                  Masukkan data siswa sesuai ketentuan PDSS
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input
                    id="nama"
                    value={newSiswa.nama}
                    onChange={(e) => setNewSiswa({ ...newSiswa, nama: e.target.value })}
                    placeholder="Masukkan nama lengkap"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nisn">NISN</Label>
                  <Input
                    id="nisn"
                    value={newSiswa.nisn}
                    onChange={(e) => setNewSiswa({ ...newSiswa, nisn: e.target.value })}
                    placeholder="10 digit NISN"
                    maxLength={10}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="kelas">Kelas</Label>
                    <Input
                      id="kelas"
                      value={newSiswa.kelas}
                      onChange={(e) => setNewSiswa({ ...newSiswa, kelas: e.target.value })}
                      placeholder="XII IPA 1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Jurusan</Label>
                    <Select
                      value={newSiswa.jurusan}
                      onValueChange={(value) => setNewSiswa({ ...newSiswa, jurusan: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IPA">IPA</SelectItem>
                        <SelectItem value="IPS">IPS</SelectItem>
                        <SelectItem value="Bahasa">Bahasa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="peringkat">Peringkat</Label>
                    <Input
                      id="peringkat"
                      type="number"
                      min={1}
                      value={newSiswa.peringkat_sekolah}
                      onChange={(e) => setNewSiswa({ ...newSiswa, peringkat_sekolah: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Akreditasi</Label>
                    <Select
                      value={newSiswa.akreditasi_sekolah}
                      onValueChange={(value: 'A' | 'B' | 'C') => setNewSiswa({ ...newSiswa, akreditasi_sekolah: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button onClick={handleAddSiswa}>
                  Simpan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card variant="default" className="mb-6">
        <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NISN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={filterKelas} onValueChange={setFilterKelas}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter Kelas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kelas</SelectItem>
                {uniqueKelas.map((kelas) => (
                  <SelectItem key={kelas} value={kelas}>
                    {kelas}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Daftar Siswa ({filteredSiswa.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>NISN</th>
                  <th>Kelas</th>
                  <th>Jurusan</th>
                  <th>Peringkat</th>
                  <th>Akreditasi</th>
                  <th>Status Prediksi</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredSiswa.map((siswa, index) => {
                  const prediksi = mockPrediksi.find((p) => p.siswa_id === siswa.id);
                  return (
                    <tr key={siswa.id}>
                      <td className="font-medium">{index + 1}</td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                            {siswa.nama.charAt(0)}
                          </div>
                          <span className="font-medium">{siswa.nama}</span>
                        </div>
                      </td>
                      <td className="font-mono text-sm">{siswa.nisn}</td>
                      <td>{siswa.kelas}</td>
                      <td>
                        <Badge variant="secondary">{siswa.jurusan}</Badge>
                      </td>
                      <td className="text-center font-semibold">#{siswa.peringkat_sekolah}</td>
                      <td>
                        <Badge
                          variant={siswa.akreditasi_sekolah === 'A' ? 'default' : siswa.akreditasi_sekolah === 'B' ? 'secondary' : 'outline'}
                        >
                          {siswa.akreditasi_sekolah}
                        </Badge>
                      </td>
                      <td>
                        {prediksi ? (
                          <Badge
                            variant={prediksi.persentase_kelulusan >= 75 ? 'default' : prediksi.persentase_kelulusan >= 50 ? 'secondary' : 'destructive'}
                          >
                            {prediksi.persentase_kelulusan}%
                          </Badge>
                        ) : (
                          <Badge variant="outline">Belum</Badge>
                        )}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(siswa.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
