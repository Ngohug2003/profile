import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Supabase Client dùng cho phía Client và Public Operations (Singleton cho Browser & Server)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  }
);

// Supabase Client dùng riêng cho Server Side (với Service Role Key nếu cần bypass RLS)
// Chỉ khởi tạo trên Server (Node.js runtime), không tạo instance trong browser để tránh trùng GoTrueClient
export const supabaseAdmin = typeof window === 'undefined'
  ? createClient(
      supabaseUrl || 'https://placeholder-project.supabase.co',
      supabaseServiceKey || 'placeholder-service-key',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      }
    )
  : supabase;

export interface ProjectRow {
  id: string;
  name: string;
  category: string | null;
  description: string;
  techStack: string[];
  features: string[];
  imageUrl: string;
  domain: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactRow {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  status: 'NEW' | 'CONTACTED' | 'COMPLETED' | string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Lấy danh sách tất cả projects từ Supabase
 */
export async function fetchProjects(): Promise<ProjectRow[]> {
  if (!isSupabaseConfigured) {
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.warn('Lỗi khi truy vấn projects từ Supabase:', error.message);
      return [];
    }
    return (data as ProjectRow[]) || [];
  } catch (err) {
    console.warn('Exception khi gọi Supabase fetchProjects:', err);
    return [];
  }
}

/**
 * Gửi thông tin form liên hệ vào bảng contacts
 */
export async function submitContactLead(contact: {
  fullName: string;
  phone: string;
  email?: string | null;
  service?: string;
  message?: string | null;
}): Promise<{ success: boolean; data?: ContactRow; error?: string }> {
  if (!isSupabaseConfigured) {
    // Nếu chưa cấu hình Supabase trong môi trường dev cục bộ
    return {
      success: true,
      data: {
        id: `demo-${Date.now()}`,
        fullName: contact.fullName,
        phone: contact.phone,
        email: contact.email || null,
        service: contact.service || 'Tư vấn landing page',
        message: contact.message || null,
        status: 'NEW',
      },
    };
  }

  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          fullName: contact.fullName.trim(),
          phone: contact.phone.trim(),
          email: contact.email ? contact.email.trim() : null,
          service: contact.service || 'Tư vấn landing page',
          message: contact.message ? contact.message.trim() : null,
          status: 'NEW',
        },
      ])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, data: data as ContactRow };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
