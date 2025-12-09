export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          detail: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          detail?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          detail?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      guru: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          mata_pelajaran: string | null
          nip: string | null
          profile_id: string | null
          sekolah_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          mata_pelajaran?: string | null
          nip?: string | null
          profile_id?: string | null
          sekolah_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          mata_pelajaran?: string | null
          nip?: string | null
          profile_id?: string | null
          sekolah_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guru_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guru_sekolah_id_fkey"
            columns: ["sekolah_id"]
            isOneToOne: false
            referencedRelation: "sekolah"
            referencedColumns: ["id"]
          },
        ]
      }
      nilai: {
        Row: {
          catatan: string | null
          created_at: string
          id: string
          nilai_portofolio: number | null
          prestasi: string[] | null
          rata_rata: number | null
          semester_1: number | null
          semester_2: number | null
          semester_3: number | null
          semester_4: number | null
          semester_5: number | null
          siswa_id: string
          updated_at: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          id?: string
          nilai_portofolio?: number | null
          prestasi?: string[] | null
          rata_rata?: number | null
          semester_1?: number | null
          semester_2?: number | null
          semester_3?: number | null
          semester_4?: number | null
          semester_5?: number | null
          siswa_id: string
          updated_at?: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          id?: string
          nilai_portofolio?: number | null
          prestasi?: string[] | null
          rata_rata?: number | null
          semester_1?: number | null
          semester_2?: number | null
          semester_3?: number | null
          semester_4?: number | null
          semester_5?: number | null
          siswa_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nilai_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      prediksi: {
        Row: {
          catatan: string | null
          created_at: string
          created_by: string | null
          id: string
          persentase_kelulusan: number
          prodi_rekomendasi_1: string | null
          prodi_rekomendasi_2: string | null
          ptn_rekomendasi_1: string | null
          ptn_rekomendasi_2: string | null
          siswa_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          catatan?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          persentase_kelulusan: number
          prodi_rekomendasi_1?: string | null
          prodi_rekomendasi_2?: string | null
          ptn_rekomendasi_1?: string | null
          ptn_rekomendasi_2?: string | null
          siswa_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          catatan?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          persentase_kelulusan?: number
          prodi_rekomendasi_1?: string | null
          prodi_rekomendasi_2?: string | null
          ptn_rekomendasi_1?: string | null
          ptn_rekomendasi_2?: string | null
          siswa_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prediksi_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      preprocessing_data: {
        Row: {
          created_at: string
          data_cleaned: Json | null
          data_normalized: Json | null
          data_original: Json | null
          data_transformed: Json | null
          id: string
          is_valid: boolean | null
          preprocessing_log_id: string
          siswa_id: string | null
          validation_errors: string[] | null
        }
        Insert: {
          created_at?: string
          data_cleaned?: Json | null
          data_normalized?: Json | null
          data_original?: Json | null
          data_transformed?: Json | null
          id?: string
          is_valid?: boolean | null
          preprocessing_log_id: string
          siswa_id?: string | null
          validation_errors?: string[] | null
        }
        Update: {
          created_at?: string
          data_cleaned?: Json | null
          data_normalized?: Json | null
          data_original?: Json | null
          data_transformed?: Json | null
          id?: string
          is_valid?: boolean | null
          preprocessing_log_id?: string
          siswa_id?: string | null
          validation_errors?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "preprocessing_data_preprocessing_log_id_fkey"
            columns: ["preprocessing_log_id"]
            isOneToOne: false
            referencedRelation: "preprocessing_log"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "preprocessing_data_siswa_id_fkey"
            columns: ["siswa_id"]
            isOneToOne: false
            referencedRelation: "siswa"
            referencedColumns: ["id"]
          },
        ]
      }
      preprocessing_log: {
        Row: {
          batch_id: string
          completed_at: string | null
          created_at: string
          deskripsi: string | null
          detail_proses: Json | null
          error_message: string | null
          id: string
          jumlah_data_error: number | null
          jumlah_data_input: number | null
          jumlah_data_output: number | null
          nama_tahap: string
          started_at: string | null
          statistik: Json | null
          status: string | null
          tahap: number
        }
        Insert: {
          batch_id: string
          completed_at?: string | null
          created_at?: string
          deskripsi?: string | null
          detail_proses?: Json | null
          error_message?: string | null
          id?: string
          jumlah_data_error?: number | null
          jumlah_data_input?: number | null
          jumlah_data_output?: number | null
          nama_tahap: string
          started_at?: string | null
          statistik?: Json | null
          status?: string | null
          tahap: number
        }
        Update: {
          batch_id?: string
          completed_at?: string | null
          created_at?: string
          deskripsi?: string | null
          detail_proses?: Json | null
          error_message?: string | null
          id?: string
          jumlah_data_error?: number | null
          jumlah_data_input?: number | null
          jumlah_data_output?: number | null
          nama_tahap?: string
          started_at?: string | null
          statistik?: Json | null
          status?: string | null
          tahap?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nama: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nama: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nama?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sekolah: {
        Row: {
          akreditasi: string
          alamat: string | null
          created_at: string
          id: string
          kota: string | null
          kuota_snbp: number | null
          nama: string
          npsn: string
          provinsi: string | null
          updated_at: string
        }
        Insert: {
          akreditasi: string
          alamat?: string | null
          created_at?: string
          id?: string
          kota?: string | null
          kuota_snbp?: number | null
          nama: string
          npsn: string
          provinsi?: string | null
          updated_at?: string
        }
        Update: {
          akreditasi?: string
          alamat?: string | null
          created_at?: string
          id?: string
          kota?: string | null
          kuota_snbp?: number | null
          nama?: string
          npsn?: string
          provinsi?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      siswa: {
        Row: {
          created_at: string
          guru_id: string | null
          id: string
          is_active: boolean | null
          jurusan: string | null
          kelas: string
          nis: string | null
          nisn: string
          peringkat_kelas: number | null
          peringkat_sekolah: number | null
          profile_id: string | null
          sekolah_id: string | null
          tahun_masuk: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          guru_id?: string | null
          id?: string
          is_active?: boolean | null
          jurusan?: string | null
          kelas: string
          nis?: string | null
          nisn: string
          peringkat_kelas?: number | null
          peringkat_sekolah?: number | null
          profile_id?: string | null
          sekolah_id?: string | null
          tahun_masuk?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          guru_id?: string | null
          id?: string
          is_active?: boolean | null
          jurusan?: string | null
          kelas?: string
          nis?: string | null
          nisn?: string
          peringkat_kelas?: number | null
          peringkat_sekolah?: number | null
          profile_id?: string | null
          sekolah_id?: string | null
          tahun_masuk?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "siswa_guru_id_fkey"
            columns: ["guru_id"]
            isOneToOne: false
            referencedRelation: "guru"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "siswa_sekolah_id_fkey"
            columns: ["sekolah_id"]
            isOneToOne: false
            referencedRelation: "sekolah"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "guru" | "siswa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "guru", "siswa"],
    },
  },
} as const
