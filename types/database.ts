// Supabase generated types — fill_ai schema only.
// Proof_ai tables (wp_sites, wp_posts, site_settings, proofreading_sessions, proofreading_issues)
// were removed in Phase 3 structural separation (2026-03-25).

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          membership: 'free' | 'pro' | 'beta'
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          membership?: 'free' | 'pro' | 'beta'
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          membership?: 'free' | 'pro' | 'beta'
          credits?: number
          updated_at?: string
        }
      }
      user_api_keys: {
        Row: {
          id: string
          user_id: string
          provider: 'openai' | 'gemini' | 'claude'
          api_key_encrypted: string
          model: string
          display_key: string
          is_valid: boolean
          last_verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          provider?: 'openai' | 'gemini' | 'claude'
          api_key_encrypted: string
          model?: string
          display_key: string
          is_valid?: boolean
          last_verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          provider?: 'openai' | 'gemini' | 'claude'
          api_key_encrypted?: string
          model?: string
          display_key?: string
          is_valid?: boolean
          last_verified_at?: string | null
          updated_at?: string
        }
      }
      credit_transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          action: string
          reference_id: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          action: string
          reference_id?: string | null
          description?: string | null
          created_at?: string
        }
        Update: {
          amount?: number
          action?: string
          reference_id?: string | null
          description?: string | null
        }
      }
      user_data: {
        Row: {
          id: string
          user_id: string
          category: 'name' | 'name_kana' | 'birthday' | 'age' | 'gender' | 'phone' | 'email' | 'postal_code' | 'address' | 'address_kana' | 'company' | 'department' | 'job_title' | 'id_number' | 'date' | 'amount' | 'custom'
          label: string
          value: string
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category?: 'name' | 'name_kana' | 'birthday' | 'age' | 'gender' | 'phone' | 'email' | 'postal_code' | 'address' | 'address_kana' | 'company' | 'department' | 'job_title' | 'id_number' | 'date' | 'amount' | 'custom'
          label: string
          value: string
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          category?: 'name' | 'name_kana' | 'birthday' | 'age' | 'gender' | 'phone' | 'email' | 'postal_code' | 'address' | 'address_kana' | 'company' | 'department' | 'job_title' | 'id_number' | 'date' | 'amount' | 'custom'
          label?: string
          value?: string
          sort_order?: number
          updated_at?: string
        }
      }
      fill_sessions: {
        Row: {
          id: string
          user_id: string
          pdf_name: string
          pdf_size_bytes: number
          page_count: number
          field_count: number
          status: 'in_progress' | 'completed' | 'failed'
          fields_filled: number
          fields_unmapped: number
          mappings: Json | null
          model_used: string | null
          error_message: string | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          pdf_name: string
          pdf_size_bytes?: number
          page_count?: number
          field_count?: number
          status?: 'in_progress' | 'completed' | 'failed'
          fields_filled?: number
          fields_unmapped?: number
          mappings?: Json | null
          model_used?: string | null
          error_message?: string | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          status?: 'in_progress' | 'completed' | 'failed'
          fields_filled?: number
          fields_unmapped?: number
          mappings?: Json | null
          model_used?: string | null
          error_message?: string | null
          completed_at?: string | null
        }
      }
      contact_submissions: {
        Row: {
          id: string
          name: string
          email: string
          category: string
          message: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          category: string
          message: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          email?: string
          category?: string
          message?: string
        }
      }
      beta_invitations: {
        Row: {
          id: string
          code: string
          email: string | null
          max_uses: number
          used_count: number
          is_active: boolean
          note: string | null
          created_by: string | null
          used_by: string | null
          used_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          email?: string | null
          max_uses?: number
          used_count?: number
          is_active?: boolean
          note?: string | null
          created_by?: string | null
          used_by?: string | null
          used_at?: string | null
          created_at?: string
        }
        Update: {
          email?: string | null
          max_uses?: number
          used_count?: number
          is_active?: boolean
          note?: string | null
          used_by?: string | null
          used_at?: string | null
        }
      }
    }
  }
}
