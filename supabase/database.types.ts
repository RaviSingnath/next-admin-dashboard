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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address_line_1: string | null
          address_line_2: string | null
          city: string
          country: string
          country_code: string | null
          created_at: string
          created_by: string
          formatted_address: string | null
          id: string
          label: string | null
          latitude: number | null
          longitude: number | null
          place_id: string | null
          postal_code: string
          state_province: string
          updated_at: string
        }
        Insert: {
          address_line_1?: string | null
          address_line_2?: string | null
          city: string
          country: string
          country_code?: string | null
          created_at?: string
          created_by: string
          formatted_address?: string | null
          id?: string
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          place_id?: string | null
          postal_code: string
          state_province: string
          updated_at?: string
        }
        Update: {
          address_line_1?: string | null
          address_line_2?: string | null
          city?: string
          country?: string
          country_code?: string | null
          created_at?: string
          created_by?: string
          formatted_address?: string | null
          id?: string
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          place_id?: string | null
          postal_code?: string
          state_province?: string
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action_type: string
          actor_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
        }
        Insert: {
          action_type: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
        }
        Update: {
          action_type?: string
          actor_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
        }
        Relationships: []
      }
      billing_transactions: {
        Row: {
          amount: number
          amount_minor: number
          application_fee_amount_minor: number | null
          college_id: string
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          invoice_number: string | null
          invoice_pdf_url: string | null
          metadata: Json
          paid_at: string | null
          parent_transaction_id: string | null
          refunded_at: string | null
          source_type: string
          status: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id: string | null
          stripe_checkout_session_id: string | null
          stripe_connected_account_id: string | null
          stripe_customer_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_refund_id: string | null
          stripe_subscription_id: string | null
          stripe_transfer_id: string | null
          student_id: string | null
          transaction_action: string
          updated_at: string
        }
        Insert: {
          amount: number
          amount_minor: number
          application_fee_amount_minor?: number | null
          college_id: string
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          invoice_number?: string | null
          invoice_pdf_url?: string | null
          metadata?: Json
          paid_at?: string | null
          parent_transaction_id?: string | null
          refunded_at?: string | null
          source_type: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id?: string | null
          stripe_checkout_session_id?: string | null
          stripe_connected_account_id?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_subscription_id?: string | null
          stripe_transfer_id?: string | null
          student_id?: string | null
          transaction_action: string
          updated_at?: string
        }
        Update: {
          amount?: number
          amount_minor?: number
          application_fee_amount_minor?: number | null
          college_id?: string
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          invoice_number?: string | null
          invoice_pdf_url?: string | null
          metadata?: Json
          paid_at?: string | null
          parent_transaction_id?: string | null
          refunded_at?: string | null
          source_type?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id?: string | null
          stripe_checkout_session_id?: string | null
          stripe_connected_account_id?: string | null
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_subscription_id?: string | null
          stripe_transfer_id?: string | null
          student_id?: string | null
          transaction_action?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_transactions_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "billing_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_transactions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      college_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          cancel_reason: string | null
          canceled_at: string | null
          college_id: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json
          plan_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          cancel_reason?: string | null
          canceled_at?: string | null
          college_id: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          plan_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          cancel_reason?: string | null
          canceled_at?: string | null
          college_id?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json
          plan_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "college_subscriptions_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          address_id: string | null
          billing_email: string | null
          billing_name: string | null
          city: string | null
          college_name: string
          country: string | null
          created_at: string | null
          created_by: string
          deleted_at: string | null
          id: string
          logo_url: string | null
          official_email: string
          phone: string | null
          postal_code: string | null
          state: string | null
          status: string | null
          stripe_connected_account_id: string | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          address_id?: string | null
          billing_email?: string | null
          billing_name?: string | null
          city?: string | null
          college_name: string
          country?: string | null
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          official_email: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          stripe_connected_account_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address_id?: string | null
          billing_email?: string | null
          billing_name?: string | null
          city?: string | null
          college_name?: string
          country?: string | null
          created_at?: string | null
          created_by?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          official_email?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          status?: string | null
          stripe_connected_account_id?: string | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "colleges_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          college_id: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          department_name: string
          id: string
          updated_at: string | null
        }
        Insert: {
          college_id: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          department_name: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          college_id?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          department_name?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structures: {
        Row: {
          college_id: string
          course: string | null
          created_at: string | null
          created_by: string | null
          department_id: string | null
          due_dates: Json | null
          id: string
          total_fee: number
          updated_at: string | null
          year: string | null
        }
        Insert: {
          college_id: string
          course?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          due_dates?: Json | null
          id?: string
          total_fee: number
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          college_id?: string
          course?: string | null
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          due_dates?: Json | null
          id?: string
          total_fee?: number
          updated_at?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fee_structures_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_structures_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          college_id: string | null
          created_at: string
          created_user_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          department_id: string | null
          email: string
          expires_at: string
          full_name: string | null
          id: string
          invited_by: string
          revoked_at: string | null
          revoked_by: string | null
          revoked_reason: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["invitation_status"]
          token: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          college_id?: string | null
          created_at?: string
          created_user_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          department_id?: string | null
          email: string
          expires_at: string
          full_name?: string | null
          id?: string
          invited_by?: string
          revoked_at?: string | null
          revoked_by?: string | null
          revoked_reason?: string | null
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          college_id?: string | null
          created_at?: string
          created_user_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          department_id?: string | null
          email?: string
          expires_at?: string
          full_name?: string | null
          id?: string
          invited_by?: string
          revoked_at?: string | null
          revoked_by?: string | null
          revoked_reason?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["invitation_status"]
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invitations_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_revoked_by_fkey"
            columns: ["revoked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_gateway_settings: {
        Row: {
          created_at: string
          default_currency: string
          id: string
          is_active: boolean
          mode: string
          provider: string
          stripe_account_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_currency?: string
          id?: string
          is_active?: boolean
          mode?: string
          provider?: string
          stripe_account_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_currency?: string
          id?: string
          is_active?: boolean
          mode?: string
          provider?: string
          stripe_account_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          college_id: string
          created_at: string | null
          currency: string | null
          id: string
          paid_at: string | null
          payment_type: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          student_id: string
        }
        Insert: {
          amount: number
          college_id: string
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          payment_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          student_id: string
        }
        Update: {
          amount?: number
          college_id?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          payment_type?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_id: string | null
          avatar: string | null
          college_id: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
        }
        Insert: {
          address_id?: string | null
          avatar?: string | null
          college_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Update: {
          address_id?: string | null
          avatar?: string | null
          college_id?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          api_version: string | null
          attempt_count: number
          created_at: string
          event_type: string
          expires_at: string | null
          id: string
          livemode: boolean
          locked_by: string | null
          payload: Json
          processed: boolean
          processed_at: string | null
          processing_completed_at: string | null
          processing_error: string | null
          processing_started_at: string | null
          stripe_event_id: string
          updated_at: string
        }
        Insert: {
          api_version?: string | null
          attempt_count?: number
          created_at?: string
          event_type: string
          expires_at?: string | null
          id?: string
          livemode?: boolean
          locked_by?: string | null
          payload: Json
          processed?: boolean
          processed_at?: string | null
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          stripe_event_id: string
          updated_at?: string
        }
        Update: {
          api_version?: string | null
          attempt_count?: number
          created_at?: string
          event_type?: string
          expires_at?: string | null
          id?: string
          livemode?: boolean
          locked_by?: string | null
          payload?: Json
          processed?: boolean
          processed_at?: string | null
          processing_completed_at?: string | null
          processing_error?: string | null
          processing_started_at?: string | null
          stripe_event_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          admission_number: string | null
          college_id: string
          course: string | null
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          department_id: string | null
          fee_structure_id: string | null
          id: string
          profile_id: string
          supervisor_id: string | null
          updated_at: string | null
          year: string | null
        }
        Insert: {
          admission_number?: string | null
          college_id: string
          course?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          fee_structure_id?: string | null
          id?: string
          profile_id: string
          supervisor_id?: string | null
          updated_at?: string | null
          year?: string | null
        }
        Update: {
          admission_number?: string | null
          college_id?: string
          course?: string | null
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          department_id?: string | null
          fee_structure_id?: string | null
          id?: string
          profile_id?: string
          supervisor_id?: string | null
          updated_at?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean
          amount: number
          amount_minor: number
          created_at: string
          currency: string
          display_order: number
          id: string
          interval: string
          metadata: Json
          name: string
          stripe_price_created_at: string | null
          stripe_price_id: string
          stripe_product_created_at: string | null
          stripe_product_id: string | null
          synced_at: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          amount: number
          amount_minor: number
          created_at?: string
          currency?: string
          display_order?: number
          id?: string
          interval?: string
          metadata?: Json
          name: string
          stripe_price_created_at?: string | null
          stripe_price_id: string
          stripe_product_created_at?: string | null
          stripe_product_id?: string | null
          synced_at?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          amount?: number
          amount_minor?: number
          created_at?: string
          currency?: string
          display_order?: number
          id?: string
          interval?: string
          metadata?: Json
          name?: string
          stripe_price_created_at?: string | null
          stripe_price_id?: string
          stripe_product_created_at?: string | null
          stripe_product_id?: string | null
          synced_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_profile: { Args: { p_user_id: string }; Returns: undefined }
      current_college_id: { Args: never; Returns: string }
      current_department_id: { Args: never; Returns: string }
      current_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      hard_delete_profile: { Args: { p_user_id: string }; Returns: undefined }
      is_super_admin: { Args: never; Returns: boolean }
      restore_profile: { Args: { p_user_id: string }; Returns: undefined }
      soft_delete_profile: { Args: { p_user_id: string }; Returns: undefined }
      suspend_profile: { Args: { p_user_id: string }; Returns: undefined }
    }
    Enums: {
      invitation_status:
        | "pending"
        | "accepted"
        | "expired"
        | "cancelled"
        | "onboarding"
        | "revoked"
      payment_status:
        | "pending"
        | "paid"
        | "failed"
        | "refunded"
        | "processing"
        | "succeeded"
        | "partially_refunded"
        | "disputed"
      user_role: "super_admin" | "college_admin" | "supervisor" | "student"
      user_status: "active" | "inactive" | "suspended" | "deleted"
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
      invitation_status: [
        "pending",
        "accepted",
        "expired",
        "cancelled",
        "onboarding",
        "revoked",
      ],
      payment_status: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "processing",
        "succeeded",
        "partially_refunded",
        "disputed",
      ],
      user_role: ["super_admin", "college_admin", "supervisor", "student"],
      user_status: ["active", "inactive", "suspended", "deleted"],
    },
  },
} as const
