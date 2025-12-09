import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { AppRole } from '@/lib/supabase-types';

interface User {
  id: string;
  name: string;
  email: string;
  role: AppRole;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, nama: string, role: AppRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async (userId: string): Promise<AppRole | null> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) return null;
    return data.role as AppRole;
  };

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) return null;
    return data;
  };

  const setupUser = async (supabaseUser: SupabaseUser) => {
    const [role, profile] = await Promise.all([
      fetchUserRole(supabaseUser.id),
      fetchUserProfile(supabaseUser.id)
    ]);

    if (role && profile) {
      setUser({
        id: supabaseUser.id,
        name: profile.nama || supabaseUser.email || '',
        email: supabaseUser.email || '',
        role: role,
      });
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid blocking the auth state change
          setTimeout(() => setupUser(session.user), 0);
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setupUser(session.user);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await setupUser(data.user);
        return { success: true };
      }

      return { success: false, error: 'Login gagal' };
    } catch (err) {
      return { success: false, error: 'Terjadi kesalahan saat login' };
    }
  }, []);

  const signup = useCallback(async (
    email: string, 
    password: string, 
    nama: string, 
    role: AppRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nama }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Add role to user_roles table
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ user_id: data.user.id, role });

        if (roleError) {
          console.error('Error adding role:', roleError);
        }

        await setupUser(data.user);
        return { success: true };
      }

      return { success: false, error: 'Registrasi gagal' };
    } catch (err) {
      return { success: false, error: 'Terjadi kesalahan saat registrasi' };
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
