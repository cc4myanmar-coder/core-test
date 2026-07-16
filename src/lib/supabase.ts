import { createClient } from '@supabase/supabase-js';

// Read client-side environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Define standard types for our auth session
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'student';
  full_name: string;
}

// Simulated/Fallback Supabase client for seamless testing in Sandbox
class SimulatedSupabaseAuth {
  private listeners: Array<(event: string, session: any) => void> = [];
  private currentSession: any = null;

  constructor() {
    // Initialize session from localStorage to persist simulated login
    const savedSession = localStorage.getItem('simulated_supabase_session');
    if (savedSession) {
      try {
        this.currentSession = JSON.parse(savedSession);
      } catch (e) {
        this.currentSession = null;
      }
    }
  }

  async signInWithPassword({ email, password }: { email: string; password?: string }) {
    // Basic verification: password should be at least 6 characters for simulation
    if (!email) {
      return { data: { user: null, session: null }, error: { message: 'Email is required' } };
    }
    if (password && password.length < 6) {
      return { data: { user: null, session: null }, error: { message: 'Password must be at least 6 characters long.' } };
    }

    // Determine role based on email or search mock users
    let role: 'admin' | 'student' = 'student';
    let fullName = 'Alex Mercer (Student)';
    let id = 'sim-student-id';

    if (email.toLowerCase().includes('admin') || email.toLowerCase() === 'admin@propfirm.com') {
      role = 'admin';
      fullName = 'Sarah Connor (Head Risk Officer)';
      id = 'sim-admin-id';
    }

    const session = {
      access_token: 'simulated_token_' + Date.now(),
      user: {
        id,
        email,
        user_metadata: {
          role,
          full_name: fullName,
        },
      },
    };

    this.currentSession = session;
    localStorage.setItem('simulated_supabase_session', JSON.stringify(session));
    this.triggerListeners('SIGNED_IN', session);

    return { data: { user: session.user, session }, error: null };
  }

  async signOut() {
    this.currentSession = null;
    localStorage.removeItem('simulated_supabase_session');
    this.triggerListeners('SIGNED_OUT', null);
    return { error: null };
  }

  async updateUser({ password }: { password?: string }) {
    if (!password || password.length < 6) {
      return { data: null, error: { message: 'Password must be at least 6 characters long.' } };
    }

    // Update session password simulation
    if (this.currentSession) {
      this.currentSession.user.updated_at = new Date().toISOString();
      localStorage.setItem('simulated_supabase_session', JSON.stringify(this.currentSession));
    }
    return { data: { user: this.currentSession?.user || null }, error: null };
  }

  async getSession() {
    return { data: { session: this.currentSession }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback);
    // Fire initially
    setTimeout(() => {
      callback('INITIAL_SESSION', this.currentSession);
    }, 50);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter(l => l !== callback);
          },
        },
      },
    };
  }

  private triggerListeners(event: string, session: any) {
    this.listeners.forEach(l => {
      try {
        l(event, session);
      } catch (e) {
        console.error('Error in auth listener:', e);
      }
    });
  }
}

// Export either the real client or a structured mock client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : {
      auth: new SimulatedSupabaseAuth() as any,
    };
