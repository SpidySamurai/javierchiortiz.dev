export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.5';
  };
  public: {
    Tables: {
      contact_messages: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          message: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          message: string;
          name: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          message?: string;
          name?: string;
        };
        Relationships: [];
      };
      page_views: {
        Row: {
          created_at: string;
          id: string;
          locale: string | null;
          path: string;
          referrer: string | null;
          visitor_hash: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          locale?: string | null;
          path: string;
          referrer?: string | null;
          visitor_hash?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          locale?: string | null;
          path?: string;
          referrer?: string | null;
          visitor_hash?: string | null;
        };
        Relationships: [];
      };
      visitor_locations: {
        Row: {
          id: number;
          city: string;
          country: string;
          country_code: string;
          created_at: string;
          latitude: number | null;
          longitude: number | null;
          visitor_hash: string | null;
        };
        Insert: {
          id?: number;
          city: string;
          country: string;
          country_code: string;
          created_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          visitor_hash?: string | null;
        };
        Update: {
          id?: number;
          city?: string;
          country?: string;
          country_code?: string;
          created_at?: string;
          latitude?: number | null;
          longitude?: number | null;
          visitor_hash?: string | null;
        };
        Relationships: [];
      };
      posts: {
        Row: {
          category: string;
          content_en: string | null;
          content_es: string | null;
          cover_image_position_card: string | null;
          cover_image_position_hero: string | null;
          cover_image_url: string | null;
          cover_image_aspect_card: string | null;
          cover_theme: string | null;
          theme_config: {
            bg?: string;
            surface?: string;
            primary?: string;
            onSurface?: string;
          } | null;
          created_at: string;
          excerpt_en: string | null;
          excerpt_es: string | null;
          id: string;
          is_published: boolean;
          published_at: string | null;
          read_time: string;
          slug: string;
          title_en: string;
          title_es: string;
          updated_at: string;
          youtube_id: string | null;
          repo_url: string | null;
        };
        Insert: {
          category?: string;
          content_en?: string | null;
          content_es?: string | null;
          cover_image_position_card?: string | null;
          cover_image_position_hero?: string | null;
          cover_image_url?: string | null;
          cover_image_aspect_card?: string | null;
          cover_theme?: string | null;
          theme_config?: {
            bg?: string;
            surface?: string;
            primary?: string;
            onSurface?: string;
          } | null;
          created_at?: string;
          excerpt_en?: string | null;
          excerpt_es?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          read_time?: string;
          slug: string;
          title_en: string;
          title_es: string;
          updated_at?: string;
          youtube_id?: string | null;
          repo_url?: string | null;
        };
        Update: {
          category?: string;
          content_en?: string | null;
          content_es?: string | null;
          cover_image_position_card?: string | null;
          cover_image_position_hero?: string | null;
          cover_image_url?: string | null;
          cover_image_aspect_card?: string | null;
          cover_theme?: string | null;
          theme_config?: {
            bg?: string;
            surface?: string;
            primary?: string;
            onSurface?: string;
          } | null;
          created_at?: string;
          excerpt_en?: string | null;
          excerpt_es?: string | null;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          read_time?: string;
          slug?: string;
          title_en?: string;
          title_es?: string;
          updated_at?: string;
          youtube_id?: string | null;
          repo_url?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;

// Convenience aliases — keep existing imports working
export type Post = Tables<'posts'>;
export type ContactMessage = Tables<'contact_messages'>;
export type PageView = Tables<'page_views'>;
export type VisitorLocation = Tables<'visitor_locations'>;
