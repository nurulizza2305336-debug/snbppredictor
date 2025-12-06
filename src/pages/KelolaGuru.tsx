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
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  GraduationCap,
  Mail,
  Phone,
  Users,
} from 'lucide-react';

interface Guru {
  id: string;
  nama: string;
  email: string;
  nip: string;
  mapel: string;
  telepon: string;
  jumlahSiswa: number;
}

const mockGuru: Guru[] = [
  { id: '1', nama: 'Budi Santoso, S.Pd', email: 'budi@sekolah.id', nip: '198501012010011001', mapel: 'Matematika', telepon: '081234567890', jumlahSiswa: 35 },
  { id: '2', nama: 'Siti Aminah, M.Pd', email: 'siti@sekolah.id', nip: '198702032011012002', mapel: 'Fisika', telepon: '081234567891', jumlahSiswa: 42 },
  { id: '3', nama: 'Ahmad Fauzi, S.Pd', email: 'ahmad@sekolah.id', nip: '199003042012011003', mapel: 'Kimia', telepon: '081234567892', jumlahSiswa: 28 },
  { id: '4', nama: 'Dewi Lestari, M.Si', email: 'dewi@sekolah.id', nip: '198808052013012004', mapel: 'Biologi', telepon: '081234567893', jumlahSiswa: 38 },
];

export default function KelolaGuru() {
  const [searchQuery, setSearchQuery] = useState('');
  const [guruList, setGuruList] = useState<Guru[]>(mockGuru);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newGuru, setNewGuru] = useState({
    nama: '',
    email: '',
    nip: '',
    mapel: '',
    telepon: '',
  });

  const filteredGuru = guruList.filter(
    (guru) =>
      guru.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guru.nip.includes(searchQuery) ||
      guru.mapel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddGuru = () => {
    const newId = (guruList.length + 1).toString();
    const guru: Guru = {
      id: newId,
      ...newGuru,
      jumlahSiswa: 0,
    };
    setGuruList([...guruList, guru]);
    setIsDialogOpen(false);
    setNewGuru({ nama: '', email: '', nip: '', mapel: '', telepon: '' });
    toast({
      title: 'Berhasil',
      description: 'Akun guru berhasil ditambahkan',
    });
  };

  const handleDelete = (id: string) => {
    setGuruList(guruList.filter((g) => g.id !== id));
    toast({
      title: 'Dihapus',
      description: 'Akun guru berhasil dihapus',
    });
  };

  return (
    <DashboardLayout requiredRoles={['admin']}>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kelola Guru</h1>
          <p className="text-muted-foreground">Kelola akun dan data guru di sistem</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Guru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Guru Baru</DialogTitle>
              <DialogDescription>
                Buat akun guru baru untuk mengakses sistem
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  value={newGuru.nama}
                  onChange={(e) => setNewGuru({ ...newGuru, nama: e.target.value })}
                  placeholder="Nama lengkap guru"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newGuru.email}
                  onChange={(e) => setNewGuru({ ...newGuru, email: e.target.value })}
                  placeholder="email@sekolah.id"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input
                    id="nip"
                    value={newGuru.nip}
                    onChange={(e) => setNewGuru({ ...newGuru, nip: e.target.value })}
                    placeholder="NIP"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mapel">Mata Pelajaran</Label>
                  <Input
                    id="mapel"
                    value={newGuru.mapel}
                    onChange={(e) => setNewGuru({ ...newGuru, mapel: e.target.value })}
                    placeholder="Matematika"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="telepon">Nomor Telepon</Label>
                <Input
                  id="telepon"
                  value={newGuru.telepon}
                  onChange={(e) => setNewGuru({ ...newGuru, telepon: e.target.value })}
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddGuru}>
                Simpan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card variant="default" className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama, NIP, atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Guru Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredGuru.map((guru) => (
          <Card key={guru.id} variant="interactive">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary text-xl font-bold">
                    {guru.nama.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{guru.nama}</p>
                    <Badge variant="secondary">{guru.mapel}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{guru.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{guru.telepon}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>NIP: {guru.nip}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{guru.jumlahSiswa} siswa dikelola</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDelete(guru.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
