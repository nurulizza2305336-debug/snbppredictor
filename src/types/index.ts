export type UserRole = 'admin' | 'guru' | 'siswa';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Siswa {
  id: string;
  nama: string;
  nisn: string;
  kelas: string;
  jurusan: string;
  peringkat_sekolah: number;
  akreditasi_sekolah: 'A' | 'B' | 'C';
  guru_id: string;
  created_at: string;
  updated_at: string;
}

export interface Nilai {
  id: string;
  siswa_id: string;
  semester_1: number;
  semester_2: number;
  semester_3: number;
  semester_4: number;
  semester_5: number;
  prestasi: string[];
  nilai_portofolio: number;
  created_at: string;
  updated_at: string;
}

export interface Prediksi {
  id: string;
  siswa_id: string;
  ptn_rekomendasi_1: string;
  prodi_rekomendasi_1: string;
  ptn_rekomendasi_2: string;
  prodi_rekomendasi_2: string;
  persentase_kelulusan: number;
  timestamp: string;
}

export interface DashboardStats {
  totalSiswa: number;
  rataRataNilai: number;
  persentaseLolos: number;
  totalGuru: number;
}
