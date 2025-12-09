-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'guru', 'siswa');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    nama TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create sekolah table (school information)
CREATE TABLE public.sekolah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nama TEXT NOT NULL,
    npsn TEXT UNIQUE NOT NULL,
    akreditasi TEXT NOT NULL CHECK (akreditasi IN ('A', 'B', 'C')),
    alamat TEXT,
    kota TEXT,
    provinsi TEXT,
    kuota_snbp INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sekolah
ALTER TABLE public.sekolah ENABLE ROW LEVEL SECURITY;

-- Create guru table
CREATE TABLE public.guru (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    nip TEXT UNIQUE,
    sekolah_id UUID REFERENCES public.sekolah(id) ON DELETE SET NULL,
    mata_pelajaran TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on guru
ALTER TABLE public.guru ENABLE ROW LEVEL SECURITY;

-- Create siswa table
CREATE TABLE public.siswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    nisn TEXT UNIQUE NOT NULL,
    nis TEXT,
    kelas TEXT NOT NULL,
    jurusan TEXT,
    sekolah_id UUID REFERENCES public.sekolah(id) ON DELETE SET NULL,
    guru_id UUID REFERENCES public.guru(id) ON DELETE SET NULL,
    peringkat_sekolah INTEGER,
    peringkat_kelas INTEGER,
    tahun_masuk INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on siswa
ALTER TABLE public.siswa ENABLE ROW LEVEL SECURITY;

-- Create nilai table (grades per semester)
CREATE TABLE public.nilai (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES public.siswa(id) ON DELETE CASCADE NOT NULL,
    semester_1 DECIMAL(4,2),
    semester_2 DECIMAL(4,2),
    semester_3 DECIMAL(4,2),
    semester_4 DECIMAL(4,2),
    semester_5 DECIMAL(4,2),
    rata_rata DECIMAL(4,2),
    prestasi TEXT[],
    nilai_portofolio DECIMAL(4,2),
    catatan TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on nilai
ALTER TABLE public.nilai ENABLE ROW LEVEL SECURITY;

-- Create prediksi table
CREATE TABLE public.prediksi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    siswa_id UUID REFERENCES public.siswa(id) ON DELETE CASCADE NOT NULL,
    persentase_kelulusan DECIMAL(5,2) NOT NULL,
    ptn_rekomendasi_1 TEXT,
    prodi_rekomendasi_1 TEXT,
    ptn_rekomendasi_2 TEXT,
    prodi_rekomendasi_2 TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'published')),
    catatan TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on prediksi
ALTER TABLE public.prediksi ENABLE ROW LEVEL SECURITY;

-- Create preprocessing_log table for tracking data processing steps
CREATE TABLE public.preprocessing_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL,
    tahap INTEGER NOT NULL,
    nama_tahap TEXT NOT NULL,
    deskripsi TEXT,
    jumlah_data_input INTEGER,
    jumlah_data_output INTEGER,
    jumlah_data_error INTEGER DEFAULT 0,
    detail_proses JSONB,
    statistik JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'error')),
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on preprocessing_log
ALTER TABLE public.preprocessing_log ENABLE ROW LEVEL SECURITY;

-- Create preprocessing_data table for storing processed data per stage
CREATE TABLE public.preprocessing_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preprocessing_log_id UUID REFERENCES public.preprocessing_log(id) ON DELETE CASCADE NOT NULL,
    siswa_id UUID REFERENCES public.siswa(id) ON DELETE CASCADE,
    data_original JSONB,
    data_cleaned JSONB,
    data_normalized JSONB,
    data_transformed JSONB,
    is_valid BOOLEAN DEFAULT true,
    validation_errors TEXT[],
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on preprocessing_data
ALTER TABLE public.preprocessing_data ENABLE ROW LEVEL SECURITY;

-- Create activity_log table
CREATE TABLE public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    detail JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on activity_log
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sekolah
CREATE POLICY "Anyone authenticated can view schools"
ON public.sekolah FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage schools"
ON public.sekolah FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for guru
CREATE POLICY "Authenticated users can view guru"
ON public.guru FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Guru can update their own data"
ON public.guru FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all guru"
ON public.guru FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for siswa
CREATE POLICY "Siswa can view their own data"
ON public.siswa FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Guru can view their students"
ON public.siswa FOR SELECT
USING (public.has_role(auth.uid(), 'guru'));

CREATE POLICY "Guru can manage their students"
ON public.siswa FOR ALL
USING (
    public.has_role(auth.uid(), 'guru') AND
    guru_id IN (SELECT id FROM public.guru WHERE user_id = auth.uid())
);

CREATE POLICY "Admins can manage all siswa"
ON public.siswa FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for nilai
CREATE POLICY "Siswa can view their own grades"
ON public.nilai FOR SELECT
USING (
    siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid())
);

CREATE POLICY "Guru can manage grades"
ON public.nilai FOR ALL
USING (public.has_role(auth.uid(), 'guru'));

CREATE POLICY "Admins can manage all grades"
ON public.nilai FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for prediksi
CREATE POLICY "Siswa can view their own predictions"
ON public.prediksi FOR SELECT
USING (
    siswa_id IN (SELECT id FROM public.siswa WHERE user_id = auth.uid()) AND
    status = 'published'
);

CREATE POLICY "Guru can manage predictions"
ON public.prediksi FOR ALL
USING (public.has_role(auth.uid(), 'guru'));

CREATE POLICY "Admins can manage all predictions"
ON public.prediksi FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for preprocessing_log
CREATE POLICY "Admins and Guru can view preprocessing logs"
ON public.preprocessing_log FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'guru')
);

CREATE POLICY "Admins can manage preprocessing logs"
ON public.preprocessing_log FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for preprocessing_data
CREATE POLICY "Admins and Guru can view preprocessing data"
ON public.preprocessing_data FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'guru')
);

CREATE POLICY "Admins can manage preprocessing data"
ON public.preprocessing_data FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for activity_log
CREATE POLICY "Users can view their own activity"
ON public.activity_log FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity"
ON public.activity_log FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can insert activity"
ON public.activity_log FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sekolah_updated_at
BEFORE UPDATE ON public.sekolah
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guru_updated_at
BEFORE UPDATE ON public.guru
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_siswa_updated_at
BEFORE UPDATE ON public.siswa
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nilai_updated_at
BEFORE UPDATE ON public.nilai
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prediksi_updated_at
BEFORE UPDATE ON public.prediksi
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate rata-rata nilai
CREATE OR REPLACE FUNCTION public.calculate_rata_rata()
RETURNS TRIGGER AS $$
BEGIN
    NEW.rata_rata = (
        COALESCE(NEW.semester_1, 0) + 
        COALESCE(NEW.semester_2, 0) + 
        COALESCE(NEW.semester_3, 0) + 
        COALESCE(NEW.semester_4, 0) + 
        COALESCE(NEW.semester_5, 0)
    ) / NULLIF(
        (CASE WHEN NEW.semester_1 IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.semester_2 IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.semester_3 IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.semester_4 IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN NEW.semester_5 IS NOT NULL THEN 1 ELSE 0 END)
    , 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER calculate_nilai_rata_rata
BEFORE INSERT OR UPDATE ON public.nilai
FOR EACH ROW EXECUTE FUNCTION public.calculate_rata_rata();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, nama, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nama', NEW.email), NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();