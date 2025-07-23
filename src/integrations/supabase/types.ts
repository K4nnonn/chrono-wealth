export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      financial_goals: {
        Row: {
          category: string | null
          created_at: string
          current_amount: number | null
          id: string
          name: string
          priority: number | null
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_amount?: number | null
          id?: string
          name: string
          priority?: number | null
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_amount?: number | null
          id?: string
          name?: string
          priority?: number | null
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plaid_data: {
        Row: {
          access_token: string | null
          created_at: string | null
          data: Json | null
          id: string
          item_id: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          item_id?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          item_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_voice_enabled: boolean | null
          created_at: string
          dark_mode: boolean | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          notifications_email: boolean | null
          notifications_push: boolean | null
          onboarding_completed: boolean | null
          preferred_currency: string | null
          risk_profile: string | null
          updated_at: string
        }
        Insert: {
          ai_voice_enabled?: boolean | null
          created_at?: string
          dark_mode?: boolean | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          notifications_email?: boolean | null
          notifications_push?: boolean | null
          onboarding_completed?: boolean | null
          preferred_currency?: string | null
          risk_profile?: string | null
          updated_at?: string
        }
        Update: {
          ai_voice_enabled?: boolean | null
          created_at?: string
          dark_mode?: boolean | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          notifications_email?: boolean | null
          notifications_push?: boolean | null
          onboarding_completed?: boolean | null
          preferred_currency?: string | null
          risk_profile?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      simulations: {
        Row: {
          created_at: string
          id: string
          is_baseline: boolean | null
          name: string
          scenario_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_baseline?: boolean | null
          name: string
          scenario_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_baseline?: boolean | null
          name?: string
          scenario_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_financial_data: {
        Row: {
          annual_salary: number | null
          created_at: string
          emergency_fund_months: number | null
          has_dependents: boolean | null
          has_variable_income: boolean | null
          id: string
          monthly_rent: number | null
          monthly_subscriptions: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          annual_salary?: number | null
          created_at?: string
          emergency_fund_months?: number | null
          has_dependents?: boolean | null
          has_variable_income?: boolean | null
          id?: string
          monthly_rent?: number | null
          monthly_subscriptions?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          annual_salary?: number | null
          created_at?: string
          emergency_fund_months?: number | null
          has_dependents?: boolean | null
          has_variable_income?: boolean | null
          id?: string
          monthly_rent?: number | null
          monthly_subscriptions?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
