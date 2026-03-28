// Supabase generated types mock
// Replace with `npx supabase gen types` output after running migration

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
      wp_sites: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string
          site_type: 'wordpress' | 'blog_auto_ai'
          wp_username: string
          wp_app_password_encrypted: string
          auth_type: 'app_password' | 'jwt'
          jwt_token: string | null
          api_key: string | null
          last_synced_at: string | null
          post_count: number
          is_active: boolean
          repair_backup: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url: string
          site_type?: 'wordpress' | 'blog_auto_ai'
          wp_username: string
          wp_app_password_encrypted: string
          auth_type?: 'app_password' | 'jwt'
          jwt_token?: string | null
          api_key?: string | null
          last_synced_at?: string | null
          post_count?: number
          is_active?: boolean
          repair_backup?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          url?: string
          site_type?: 'wordpress' | 'blog_auto_ai'
          wp_username?: string
          wp_app_password_encrypted?: string
          auth_type?: 'app_password' | 'jwt'
          jwt_token?: string | null
          api_key?: string | null
          last_synced_at?: string | null
          post_count?: number
          is_active?: boolean
          repair_backup?: Json | null
          updated_at?: string
        }
      }
      wp_posts: {
        Row: {
          id: string
          site_id: string
          wp_post_id: number
          title: string
          content: string
          content_text: string
          status: string
          post_date: string | null
          post_modified: string | null
          wp_url: string | null
          categories: string[]
          last_fetched_at: string
          created_at: string
        }
        Insert: {
          id?: string
          site_id: string
          wp_post_id: number
          title: string
          content: string
          content_text: string
          status?: string
          post_date?: string | null
          post_modified?: string | null
          wp_url?: string | null
          categories?: string[]
          last_fetched_at?: string
          created_at?: string
        }
        Update: {
          title?: string
          content?: string
          content_text?: string
          status?: string
          post_date?: string | null
          post_modified?: string | null
          wp_url?: string | null
          categories?: string[]
          last_fetched_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          user_id: string
          site_name: string
          target_keywords: string[]
          categories: Json
          tone_setting: 'desu_masu' | 'da_dearu'
          strictness: 'normal' | 'strict' | 'ultra'
          custom_rules: Json
          ai_phrases: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          site_name: string
          target_keywords?: string[]
          categories?: Json
          tone_setting?: 'desu_masu' | 'da_dearu'
          strictness?: 'normal' | 'strict' | 'ultra'
          custom_rules?: Json
          ai_phrases?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          site_name?: string
          target_keywords?: string[]
          categories?: Json
          tone_setting?: 'desu_masu' | 'da_dearu'
          strictness?: 'normal' | 'strict' | 'ultra'
          custom_rules?: Json
          ai_phrases?: string[]
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
      proofreading_sessions: {
        Row: {
          id: string
          user_id: string
          post_id: string | null
          pasted_title: string | null
          pasted_content: string | null
          axes: string[]
          strictness: 'normal' | 'strict' | 'ultra'
          total_score: number | null
          readability_score: number | null
          ai_tone_score: number | null
          tone_score: number | null
          seo_score: number | null
          fact_score: number | null
          structure_score: number | null
          issue_count: number
          fixed_count: number
          input_tokens: number
          output_tokens: number
          model_used: string
          status: 'in_progress' | 'completed' | 'failed'
          review_status: 'pending' | 'approved' | 'rejected' | 'applied'
          partial_results: Json | null
          proofread_result: Json | null
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          post_id?: string | null
          pasted_title?: string | null
          pasted_content?: string | null
          axes?: string[]
          strictness?: 'normal' | 'strict' | 'ultra'
          total_score?: number | null
          readability_score?: number | null
          ai_tone_score?: number | null
          tone_score?: number | null
          seo_score?: number | null
          fact_score?: number | null
          structure_score?: number | null
          issue_count?: number
          fixed_count?: number
          input_tokens?: number
          output_tokens?: number
          model_used?: string
          status?: 'in_progress' | 'completed' | 'failed'
          review_status?: 'pending' | 'approved' | 'rejected' | 'applied'
          partial_results?: Json | null
          proofread_result?: Json | null
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          axes?: string[]
          strictness?: 'normal' | 'strict' | 'ultra'
          total_score?: number | null
          readability_score?: number | null
          ai_tone_score?: number | null
          tone_score?: number | null
          seo_score?: number | null
          fact_score?: number | null
          structure_score?: number | null
          issue_count?: number
          fixed_count?: number
          input_tokens?: number
          output_tokens?: number
          model_used?: string
          status?: 'in_progress' | 'completed' | 'failed'
          review_status?: 'pending' | 'approved' | 'rejected' | 'applied'
          partial_results?: Json | null
          proofread_result?: Json | null
          completed_at?: string | null
        }
      }
      proofreading_issues: {
        Row: {
          id: string
          session_id: string
          axis: 'readability' | 'ai_tone' | 'tone' | 'seo' | 'fact' | 'structure'
          issue_type: string
          severity: 'info' | 'warning' | 'error'
          line_number: number | null
          char_start: number | null
          char_end: number | null
          original_text: string
          suggested_text: string | null
          reason: string
          status: 'pending' | 'accepted' | 'rejected' | 'auto_fixed'
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          axis: 'readability' | 'ai_tone' | 'tone' | 'seo' | 'fact' | 'structure'
          issue_type: string
          severity?: 'info' | 'warning' | 'error'
          line_number?: number | null
          char_start?: number | null
          char_end?: number | null
          original_text: string
          suggested_text?: string | null
          reason: string
          status?: 'pending' | 'accepted' | 'rejected' | 'auto_fixed'
          created_at?: string
        }
        Update: {
          severity?: 'info' | 'warning' | 'error'
          suggested_text?: string | null
          status?: 'pending' | 'accepted' | 'rejected' | 'auto_fixed'
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
    }
  }
}
