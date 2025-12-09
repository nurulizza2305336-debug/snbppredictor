import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SiswaDB, NilaiDB, PrediksiDB, Sekolah, Guru, PreprocessingLog, PreprocessingData, ActivityLog } from '@/lib/supabase-types';

// Fetch all siswa with relations
export function useSiswa() {
  return useQuery({
    queryKey: ['siswa'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('siswa')
        .select(`
          *,
          profiles:profile_id(*),
          sekolah:sekolah_id(*),
          guru:guru_id(*, profiles:profile_id(*))
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as SiswaDB[];
    }
  });
}

// Fetch all nilai with siswa relation
export function useNilai() {
  return useQuery({
    queryKey: ['nilai'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nilai')
        .select(`
          *,
          siswa:siswa_id(*, profiles:profile_id(*))
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as NilaiDB[];
    }
  });
}

// Fetch all prediksi with siswa relation
export function usePrediksi() {
  return useQuery({
    queryKey: ['prediksi'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prediksi')
        .select(`
          *,
          siswa:siswa_id(*, profiles:profile_id(*))
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PrediksiDB[];
    }
  });
}

// Fetch all sekolah
export function useSekolah() {
  return useQuery({
    queryKey: ['sekolah'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sekolah')
        .select('*')
        .order('nama');
      
      if (error) throw error;
      return data as Sekolah[];
    }
  });
}

// Fetch all guru with relations
export function useGuru() {
  return useQuery({
    queryKey: ['guru'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guru')
        .select(`
          *,
          profiles:profile_id(*),
          sekolah:sekolah_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Guru[];
    }
  });
}

// Fetch preprocessing logs
export function usePreprocessingLogs() {
  return useQuery({
    queryKey: ['preprocessing_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('preprocessing_log')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PreprocessingLog[];
    }
  });
}

// Fetch preprocessing data for a specific log
export function usePreprocessingData(logId?: string) {
  return useQuery({
    queryKey: ['preprocessing_data', logId],
    queryFn: async () => {
      if (!logId) return [];
      
      const { data, error } = await supabase
        .from('preprocessing_data')
        .select(`
          *,
          preprocessing_log:preprocessing_log_id(*),
          siswa:siswa_id(*, profiles:profile_id(*))
        `)
        .eq('preprocessing_log_id', logId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PreprocessingData[];
    },
    enabled: !!logId
  });
}

// Fetch activity logs
export function useActivityLogs() {
  return useQuery({
    queryKey: ['activity_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as ActivityLog[];
    }
  });
}

// Get dashboard statistics
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      const [siswaResult, nilaiResult, prediksiResult, sekolahResult, guruResult] = await Promise.all([
        supabase.from('siswa').select('id, is_active', { count: 'exact' }),
        supabase.from('nilai').select('id, rata_rata'),
        supabase.from('prediksi').select('id, persentase_kelulusan, status'),
        supabase.from('sekolah').select('id, akreditasi'),
        supabase.from('guru').select('id, is_active', { count: 'exact' })
      ]);

      const totalSiswa = siswaResult.count || 0;
      const totalGuru = guruResult.count || 0;
      
      const nilaiData = nilaiResult.data || [];
      const avgNilai = nilaiData.length > 0 
        ? nilaiData.reduce((sum, n) => sum + (n.rata_rata || 0), 0) / nilaiData.length 
        : 0;

      const prediksiData = prediksiResult.data || [];
      const lolosCount = prediksiData.filter(p => p.persentase_kelulusan >= 75).length;
      const persentaseLolos = prediksiData.length > 0 
        ? (lolosCount / prediksiData.length) * 100 
        : 0;

      const sekolahData = sekolahResult.data || [];
      const akreditasiA = sekolahData.filter(s => s.akreditasi === 'A').length;
      const akreditasiB = sekolahData.filter(s => s.akreditasi === 'B').length;
      const akreditasiC = sekolahData.filter(s => s.akreditasi === 'C').length;

      return {
        totalSiswa,
        totalGuru,
        rataRataNilai: avgNilai,
        persentaseLolos: Math.round(persentaseLolos),
        totalPrediksi: prediksiData.length,
        distribusiAkreditasi: {
          A: akreditasiA,
          B: akreditasiB,
          C: akreditasiC
        }
      };
    }
  });
}

// Mutations
export function useCreateSiswa() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (siswa: { nisn: string; kelas: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('siswa')
        .insert([siswa])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    }
  });
}

export function useUpdateSiswa() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...siswa }: Partial<SiswaDB> & { id: string }) => {
      const { data, error } = await supabase
        .from('siswa')
        .update(siswa)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
    }
  });
}

export function useDeleteSiswa() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('siswa')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['siswa'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
    }
  });
}

export function useCreatePreprocessingLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (log: { batch_id: string; tahap: number; nama_tahap: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from('preprocessing_log')
        .insert([log])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preprocessing_logs'] });
    }
  });
}

export function useCreatePreprocessingData() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { preprocessing_log_id: string; [key: string]: any }[]) => {
      const { data: result, error } = await supabase
        .from('preprocessing_data')
        .insert(data)
        .select();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preprocessing_data'] });
    }
  });
}
