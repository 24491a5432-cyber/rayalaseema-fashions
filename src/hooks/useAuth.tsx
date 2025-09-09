import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: UserData) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<UserData>) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
  deleteAccount: () => Promise<{ error: AuthError | null }>;
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  profile_picture?: string;
  created_at: string;
  updated_at: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_IN' && session?.user) {
        // Create user profile if it doesn't exist
        await createUserProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        const { error } = await supabase
          .from('user_profiles')
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            phone: user.user_metadata?.phone || '',
            address: '',
            city: '',
            state: '',
            country: 'India',
            pincode: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (error) {
          console.error('Error creating user profile:', error);
        }
      }
    } catch (error) {
      console.error('Error in createUserProfile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name || '',
            phone: userData.phone || '',
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        await createUserProfile(data.user);
        toast.success('Account created successfully! Please check your email to verify your account.');
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to create account');
      return { error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('Welcome back!');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to sign in');
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to sign out');
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent! Check your inbox.');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to send reset email');
      return { error: authError };
    }
  };

  const updateProfile = async (updates: Partial<UserData>) => {
    try {
      if (!user) throw new Error('No user logged in');

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to update profile');
      return { error: authError };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success('Password updated successfully');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to update password');
      return { error: authError };
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error('No user logged in');

      // Delete user profile first
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      if (authError) throw authError;

      toast.success('Account deleted successfully');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message || 'Failed to delete account');
      return { error: authError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updatePassword,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};