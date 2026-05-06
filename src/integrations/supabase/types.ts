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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      mood_logs: {
        Row: {
          id: string
          user_id: string
          mood_value: number
          note: string | null
          logged_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood_value: number
          note?: string | null
          logged_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood_value?: number
          note?: string | null
          logged_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          counselor_id: number
          counselor_name: string
          session_type: 'video' | 'in-person' | 'chat'
          date: string
          time: string
          status: 'upcoming' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          counselor_id: number
          counselor_name: string
          session_type: 'video' | 'in-person' | 'chat'
          date: string
          time: string
          status?: 'upcoming' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          counselor_id?: number
          counselor_name?: string
          session_type?: 'video' | 'in-person' | 'chat'
          date?: string
          time?: string
          status?: 'upcoming' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      event_registrations: {
        Row: {
          id: string
          user_id: string
          event_id: number
          registered_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_id: number
          registered_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_id?: number
          registered_at?: string
        }
      }
      assessment_results: {
        Row: {
          id: string
          user_id: string
          score: number
          level: string
          answers: Json
          taken_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          level: string
          answers: Json
          taken_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          level?: string
          answers?: Json
          taken_at?: string
        }
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          display_name: string
          is_anonymous: boolean
          content: string
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          is_anonymous?: boolean
          content: string
          category?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          is_anonymous?: boolean
          content?: string
          category?: string
          created_at?: string
        }
      }
      community_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          display_name: string
          is_anonymous: boolean
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          display_name: string
          is_anonymous?: boolean
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          display_name?: string
          is_anonymous?: boolean
          content?: string
          created_at?: string
        }
      }
      community_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      resource_bookmarks: {
        Row: {
          id: string
          user_id: string
          resource_id: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          resource_id: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          resource_id?: number
          created_at?: string
        }
      }
      community_shares: {
        Row: {
          id: string
          post_id: string
          user_id: string
          sharer_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          sharer_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          sharer_name?: string | null
          created_at?: string
        }
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
