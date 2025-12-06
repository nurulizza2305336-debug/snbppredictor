import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PlayCircle,
  BookOpen,
  Users,
  FileSpreadsheet,
  Calculator,
  BarChart3,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoId: string;
  category: 'login' | 'input' | 'prediksi' | 'statistik';
  forRoles: string[];
}

const tutorials: Tutorial[] = [
  {
    id: '1',
    title: 'Cara Login ke Sistem SNBP',
    description: 'Panduan lengkap untuk masuk ke sistem sesuai dengan peran Anda (Admin, Guru, atau Siswa)',
    duration: '3:45',
    videoId: 'dQw4w9WgXcQ',
    category: 'login',
    forRoles: ['admin', 'guru', 'siswa'],
  },
  {
    id: '2',
    title: 'Input Data Siswa Baru',
    description: 'Tutorial menambahkan data siswa baru ke dalam sistem sesuai ketentuan PDSS',
    duration: '5:20',
    videoId: 'dQw4w9WgXcQ',
    category: 'input',
    forRoles: ['admin', 'guru'],
  },
  {
    id: '3',
    title: 'Input Nilai Rapor Semester 1-5',
    description: 'Cara memasukkan nilai rapor siswa dari semester 1 hingga semester 5',
    duration: '6:15',
    videoId: 'dQw4w9WgXcQ',
    category: 'input',
    forRoles: ['admin', 'guru'],
  },
  {
    id: '4',
    title: 'Menjalankan Prediksi SNBP',
    description: 'Panduan menjalankan proses prediksi kelulusan untuk siswa',
    duration: '4:30',
    videoId: 'dQw4w9WgXcQ',
    category: 'prediksi',
    forRoles: ['admin', 'guru'],
  },
  {
    id: '5',
    title: 'Memahami Hasil Prediksi',
    description: 'Penjelasan tentang cara membaca dan memahami hasil prediksi kelulusan SNBP',
    duration: '5:00',
    videoId: 'dQw4w9WgXcQ',
    category: 'prediksi',
    forRoles: ['admin', 'guru', 'siswa'],
  },
  {
    id: '6',
    title: 'Menggunakan Dashboard Statistik',
    description: 'Tutorial lengkap untuk menganalisis data menggunakan dashboard statistik',
    duration: '7:45',
    videoId: 'dQw4w9WgXcQ',
    category: 'statistik',
    forRoles: ['admin', 'guru'],
  },
];

const categoryIcons = {
  login: BookOpen,
  input: FileSpreadsheet,
  prediksi: Calculator,
  statistik: BarChart3,
};

const categoryLabels = {
  login: 'Login & Akses',
  input: 'Input Data',
  prediksi: 'Prediksi',
  statistik: 'Statistik',
};

export default function Tutorial() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Video Tutorial</h1>
        <p className="text-muted-foreground">Pelajari cara menggunakan sistem prediksi SNBP</p>
      </div>

      {/* Featured Video */}
      <Card variant="elevated" className="mb-8 overflow-hidden">
        <div className="grid lg:grid-cols-2">
          <div className="aspect-video bg-muted relative">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Tutorial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="p-8 flex flex-col justify-center">
            <Badge variant="secondary" className="w-fit mb-4">
              <PlayCircle className="mr-1 h-3 w-3" />
              Video Unggulan
            </Badge>
            <h2 className="text-2xl font-bold mb-2">Pengenalan Sistem Prediksi SNBP</h2>
            <p className="text-muted-foreground mb-4">
              Video ini memberikan gambaran umum tentang sistem prediksi SNBP, 
              fitur-fitur utama, dan bagaimana sistem ini dapat membantu sekolah 
              dalam mempersiapkan siswa untuk seleksi nasional.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>10:30</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>Untuk semua pengguna</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tutorial Categories */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="all">Semua</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="prediksi">Prediksi</TabsTrigger>
          <TabsTrigger value="statistik">Statistik</TabsTrigger>
        </TabsList>

        {['all', 'login', 'input', 'prediksi', 'statistik'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tutorials
                .filter((t) => tab === 'all' || t.category === tab)
                .map((tutorial) => {
                  const Icon = categoryIcons[tutorial.category];
                  return (
                    <Card key={tutorial.id} variant="interactive" className="overflow-hidden">
                      <div className="aspect-video bg-muted relative group">
                        <img
                          src={`https://img.youtube.com/vi/${tutorial.videoId}/maxresdefault.jpg`}
                          alt={tutorial.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <PlayCircle className="h-8 w-8" />
                          </div>
                        </div>
                        <Badge className="absolute top-3 right-3 bg-foreground/80">
                          <Clock className="mr-1 h-3 w-3" />
                          {tutorial.duration}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-xs text-muted-foreground">
                            {categoryLabels[tutorial.category]}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2">{tutorial.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {tutorial.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-3">
                          {tutorial.forRoles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs capitalize">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Guide */}
      <Card variant="elevated" className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Panduan Cepat
          </CardTitle>
          <CardDescription>
            Langkah-langkah dasar untuk memulai menggunakan sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              { step: 1, title: 'Login', desc: 'Masuk dengan akun yang diberikan admin' },
              { step: 2, title: 'Input Data', desc: 'Guru memasukkan data siswa dan nilai' },
              { step: 3, title: 'Prediksi', desc: 'Jalankan prediksi untuk melihat hasil' },
              { step: 4, title: 'Analisis', desc: 'Lihat statistik dan rekomendasi PTN' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                  {item.step}
                </div>
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
