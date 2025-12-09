// Custom types for database
export type AppRole = 'admin' | 'guru' | 'siswa';

export interface Profile {
  id: string;
  user_id: string;
  nama: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Sekolah {
  id: string;
  nama: string;
  npsn: string;
  akreditasi: 'A' | 'B' | 'C';
  alamat: string | null;
  kota: string | null;
  provinsi: string | null;
  kuota_snbp: number;
  created_at: string;
  updated_at: string;
}

export interface Guru {
  id: string;
  user_id: string | null;
  profile_id: string | null;
  nip: string | null;
  sekolah_id: string | null;
  mata_pelajaran: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  sekolah?: Sekolah;
}

export interface SiswaDB {
  id: string;
  user_id: string | null;
  profile_id: string | null;
  nisn: string;
  nis: string | null;
  kelas: string;
  jurusan: string | null;
  sekolah_id: string | null;
  guru_id: string | null;
  peringkat_sekolah: number | null;
  peringkat_kelas: number | null;
  tahun_masuk: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  sekolah?: Sekolah;
  guru?: Guru;
}

export interface NilaiDB {
  id: string;
  siswa_id: string;
  semester_1: number | null;
  semester_2: number | null;
  semester_3: number | null;
  semester_4: number | null;
  semester_5: number | null;
  rata_rata: number | null;
  prestasi: string[] | null;
  nilai_portofolio: number | null;
  catatan: string | null;
  created_at: string;
  updated_at: string;
  siswa?: SiswaDB;
}

export interface PrediksiDB {
  id: string;
  siswa_id: string;
  persentase_kelulusan: number;
  ptn_rekomendasi_1: string | null;
  prodi_rekomendasi_1: string | null;
  ptn_rekomendasi_2: string | null;
  prodi_rekomendasi_2: string | null;
  status: 'pending' | 'processed' | 'published';
  catatan: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  siswa?: SiswaDB;
}

export interface PreprocessingLog {
  id: string;
  batch_id: string;
  tahap: number;
  nama_tahap: string;
  deskripsi: string | null;
  jumlah_data_input: number | null;
  jumlah_data_output: number | null;
  jumlah_data_error: number;
  detail_proses: Record<string, any> | null;
  statistik: Record<string, any> | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface PreprocessingData {
  id: string;
  preprocessing_log_id: string;
  siswa_id: string | null;
  data_original: Record<string, any> | null;
  data_cleaned: Record<string, any> | null;
  data_normalized: Record<string, any> | null;
  data_transformed: Record<string, any> | null;
  is_valid: boolean;
  validation_errors: string[] | null;
  created_at: string;
  preprocessing_log?: PreprocessingLog;
  siswa?: SiswaDB;
}

export interface ActivityLog {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  detail: Record<string, any> | null;
  ip_address: string | null;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}
