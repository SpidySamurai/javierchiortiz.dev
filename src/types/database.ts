export interface Post {
  id: string;
  slug: string;
  title_en: string;
  title_es: string;
  excerpt_en: string | null;
  excerpt_es: string | null;
  content_en: string | null;
  content_es: string | null;
  category: string;
  read_time: string;
  cover_theme: string | null;
  youtube_id: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface PageView {
  id: string;
  path: string;
  locale: string | null;
  referrer: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Post, 'id' | 'created_at'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'created_at'>;
        Update: never;
      };
      page_views: {
        Row: PageView;
        Insert: Omit<PageView, 'id' | 'created_at'>;
        Update: never;
      };
    };
  };
}
