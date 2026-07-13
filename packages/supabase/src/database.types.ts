export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      accessories: {
        Row: {
          category: string | null;
          content: Json;
          created_at: string;
          description: string | null;
          featured: boolean;
          id: string;
          image_url: string | null;
          in_stock: boolean;
          name: string;
          price: number | null;
          slug: string;
          sort_order: number;
          status: Database["public"]["Enums"]["publish_status"];
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          content?: Json;
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id: string;
          image_url?: string | null;
          in_stock?: boolean;
          name: string;
          price?: number | null;
          slug: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          content?: Json;
          created_at?: string;
          description?: string | null;
          featured?: boolean;
          id?: string;
          image_url?: string | null;
          in_stock?: boolean;
          name?: string;
          price?: number | null;
          slug?: string;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: string;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      banners: {
        Row: {
          alt_text: string | null;
          created_at: string;
          desktop_image_url: string | null;
          ends_at: string | null;
          href: string | null;
          id: string;
          mobile_image_url: string | null;
          placement: Database["public"]["Enums"]["banner_placement"];
          sort_order: number;
          starts_at: string | null;
          status: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          desktop_image_url?: string | null;
          ends_at?: string | null;
          href?: string | null;
          id?: string;
          mobile_image_url?: string | null;
          placement: Database["public"]["Enums"]["banner_placement"];
          sort_order?: number;
          starts_at?: string | null;
          status?: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          desktop_image_url?: string | null;
          ends_at?: string | null;
          href?: string | null;
          id?: string;
          mobile_image_url?: string | null;
          placement?: Database["public"]["Enums"]["banner_placement"];
          sort_order?: number;
          starts_at?: string | null;
          status?: Database["public"]["Enums"]["publish_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cms_pages: {
        Row: {
          content: Json;
          seo: Json;
          slug: string;
          status: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          content?: Json;
          seo?: Json;
          slug: string;
          status?: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          content?: Json;
          seo?: Json;
          slug?: string;
          status?: Database["public"]["Enums"]["publish_status"];
          title?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      job_postings: {
        Row: {
          benefits: string | null;
          created_at: string;
          deadline: string | null;
          department: string | null;
          description: string | null;
          employment_type: string | null;
          id: string;
          location: string | null;
          quantity: number;
          requirements: string | null;
          salary_range: string | null;
          slug: string | null;
          sort_order: number;
          status: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          benefits?: string | null;
          created_at?: string;
          deadline?: string | null;
          department?: string | null;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          location?: string | null;
          quantity?: number;
          requirements?: string | null;
          salary_range?: string | null;
          slug?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          benefits?: string | null;
          created_at?: string;
          deadline?: string | null;
          department?: string | null;
          description?: string | null;
          employment_type?: string | null;
          id?: string;
          location?: string | null;
          quantity?: number;
          requirements?: string | null;
          salary_range?: string | null;
          slug?: string | null;
          sort_order?: number;
          status?: Database["public"]["Enums"]["publish_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      job_applications: {
        Row: {
          cover_letter: string | null;
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          job_id: string | null;
          metadata: Json;
          phone: string;
          status: Database["public"]["Enums"]["job_application_status"];
          updated_at: string;
        };
        Insert: {
          cover_letter?: string | null;
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          job_id?: string | null;
          metadata?: Json;
          phone: string;
          status?: Database["public"]["Enums"]["job_application_status"];
          updated_at?: string;
        };
        Update: {
          cover_letter?: string | null;
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          job_id?: string | null;
          metadata?: Json;
          phone?: string;
          status?: Database["public"]["Enums"]["job_application_status"];
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string;
          id: string;
          message: string | null;
          metadata: Json;
          phone: string;
          source: string | null;
          status: Database["public"]["Enums"]["lead_status"];
          updated_at: string;
          vehicle_interest: string | null;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name: string;
          id?: string;
          message?: string | null;
          metadata?: Json;
          phone: string;
          source?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          vehicle_interest?: string | null;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string;
          id?: string;
          message?: string | null;
          metadata?: Json;
          phone?: string;
          source?: string | null;
          status?: Database["public"]["Enums"]["lead_status"];
          updated_at?: string;
          vehicle_interest?: string | null;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          created_at: string;
          filename: string;
          folder: string | null;
          id: string;
          mime_type: string | null;
          size_bytes: number | null;
          uploaded_by: string | null;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          created_at?: string;
          filename: string;
          folder?: string | null;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          created_at?: string;
          filename?: string;
          folder?: string | null;
          id?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          uploaded_by?: string | null;
          url?: string;
        };
        Relationships: [];
      };
      news_articles: {
        Row: {
          author_id: string | null;
          author_name: string | null;
          body: string | null;
          body_format: string;
          category: string | null;
          cover_image_url: string | null;
          created_at: string;
          excerpt: string | null;
          id: string;
          is_featured: boolean;
          published_at: string | null;
          related_products: Json;
          seo: Json;
          slug: string;
          status: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          author_name?: string | null;
          body?: string | null;
          body_format?: string;
          category?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_featured?: boolean;
          published_at?: string | null;
          related_products?: Json;
          seo?: Json;
          slug: string;
          status?: Database["public"]["Enums"]["publish_status"];
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          author_name?: string | null;
          body?: string | null;
          body_format?: string;
          category?: string | null;
          cover_image_url?: string | null;
          created_at?: string;
          excerpt?: string | null;
          id?: string;
          is_featured?: boolean;
          published_at?: string | null;
          related_products?: Json;
          seo?: Json;
          slug?: string;
          status?: Database["public"]["Enums"]["publish_status"];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          id?: string;
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Update: {
          id?: string;
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      sync_logs: {
        Row: {
          details: Json;
          finished_at: string | null;
          id: string;
          module: string;
          started_at: string;
          status: string;
        };
        Insert: {
          details?: Json;
          finished_at?: string | null;
          id?: string;
          module: string;
          started_at?: string;
          status: string;
        };
        Update: {
          details?: Json;
          finished_at?: string | null;
          id?: string;
          module?: string;
          started_at?: string;
          status?: string;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          category: string | null;
          colors: Json;
          content: Json;
          created_at: string;
          featured: boolean;
          gallery: Json;
          hero_image_url: string | null;
          id: string;
          name: string;
          overview: string | null;
          seo: Json;
          slug: string;
          sort_order: number;
          spec_table: Json;
          starting_price: number | null;
          status: Database["public"]["Enums"]["publish_status"];
          slogan: string | null;
          tagline: string | null;
          type: Database["public"]["Enums"]["vehicle_type"];
          updated_at: string;
          variants: Json;
        };
        Insert: {
          category?: string | null;
          colors?: Json;
          content?: Json;
          created_at?: string;
          featured?: boolean;
          gallery?: Json;
          hero_image_url?: string | null;
          id: string;
          name: string;
          overview?: string | null;
          seo?: Json;
          slug: string;
          sort_order?: number;
          spec_table?: Json;
          starting_price?: number | null;
          status?: Database["public"]["Enums"]["publish_status"];
          slogan?: string | null;
          tagline?: string | null;
          type: Database["public"]["Enums"]["vehicle_type"];
          updated_at?: string;
          variants?: Json;
        };
        Update: {
          category?: string | null;
          colors?: Json;
          content?: Json;
          created_at?: string;
          featured?: boolean;
          gallery?: Json;
          hero_image_url?: string | null;
          id?: string;
          name?: string;
          overview?: string | null;
          seo?: Json;
          slug?: string;
          sort_order?: number;
          spec_table?: Json;
          starting_price?: number | null;
          status?: Database["public"]["Enums"]["publish_status"];
          slogan?: string | null;
          tagline?: string | null;
          type?: Database["public"]["Enums"]["vehicle_type"];
          updated_at?: string;
          variants?: Json;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      banner_placement:
        | "home"
        | "cars"
        | "scooters"
        | "accessories"
        | "after_sales"
        | "charging"
        | "energy";
      lead_status: "new" | "in_progress" | "converted" | "closed";
      job_application_status: "new" | "reviewing" | "interviewed" | "hired" | "rejected";
      publish_status: "draft" | "published" | "archived" | "scheduled";
      vehicle_type: "car" | "scooter";
    };
    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
