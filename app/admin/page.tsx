'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';
import {
  FolderKanban,
  Trash2,
  ExternalLink,
  LogOut,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Database,
  Layers,
  X,
  Sparkles,
  Users,
  Phone,
  Mail,
  Clock,
  CheckCheck,
  Copy,
  Check,
} from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  category: string | null;
  description: string;
  techStack: string[];
  features: string[];
  imageUrl: string;
  domain: string | null;
  createdAt: string;
}

interface ContactItem {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  service: string;
  message: string | null;
  status: 'NEW' | 'CONTACTED' | 'COMPLETED' | string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'contacts'>('projects');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Contacts state
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [contactFilter, setContactFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'COMPLETED'>('ALL');
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Landing Page');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [domain, setDomain] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const router = useRouter();

  const loadProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      console.error('Không thể nạp danh sách dự án');
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadContacts = async () => {
    try {
      setLoadingContacts(true);
      const res = await fetch('/api/contacts');
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      }
    } catch {
      console.error('Không thể nạp danh sách liên hệ');
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    loadProjects();
    loadContacts();
  }, []);

  const handleUpdateContactStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (res.ok) {
        await loadContacts();
        setStatusMessage({ type: 'success', text: 'Đã cập nhật trạng thái liên hệ!' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Lỗi khi cập nhật trạng thái.' });
    }
  };

  const handleDeleteContact = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc muốn xóa yêu cầu tư vấn của "${name}"?`)) return;
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
      if (res.status === 401) {
        router.replace('/admin/login');
        return;
      }
      if (res.ok) {
        await loadContacts();
        setStatusMessage({ type: 'success', text: 'Đã xóa yêu cầu tư vấn thành công!' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Lỗi khi xóa yêu cầu tư vấn.' });
    }
  };

  const handleCopyPhone = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    setTimeout(() => setCopiedPhoneId(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleRemovePreview = () => {
    setFile(null);
    setImagePreview(null);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert('Vui lòng chọn file ảnh bìa cho dự án.');
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      // 1. Tải ảnh lên /api/upload
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!uploadRes.ok) {
        const uploadErr = await uploadRes.json();
        throw new Error(uploadErr.error || 'Upload ảnh thất bại.');
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // 2. Tạo bản ghi project qua /api/projects
      const stackArray = techStackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const featuresArray = featuresInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const projectRes = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          description,
          techStack: stackArray,
          features: featuresArray,
          imageUrl,
          domain: domain || null,
        }),
      });

      if (projectRes.status === 401) {
        router.push('/admin/login');
        return;
      }

      if (!projectRes.ok) {
        const prjErr = await projectRes.json();
        throw new Error(prjErr.error || 'Lỗi khi lưu dự án.');
      }

      // Reset form sau khi thành công
      setName('');
      setCategory('Landing Page');
      setDescription('');
      setTechStackInput('');
      setFeaturesInput('');
      setDomain('');
      setFile(null);
      setImagePreview(null);

      setStatusMessage({ type: 'success', text: 'Đã thêm dự án mới thành công vào Database!' });
      await loadProjects();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi khi tạo dự án.';
      setStatusMessage({ type: 'error', text: message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, projectName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa dự án "${projectName}" khỏi Portfolio?`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      if (!res.ok) {
        throw new Error('Không thể xóa dự án.');
      }
      await loadProjects();
      setStatusMessage({ type: 'success', text: `Đã xóa thành công dự án "${projectName}".` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi thao tác xóa.';
      setStatusMessage({ type: 'error', text: message });
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 p-4 sm:p-8 select-none">
      <div className="w-full max-w-[1240px] mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200/90 rounded-3xl p-6 shadow-sm">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Xem Trang Chủ</span>
              </Link>
              <span className="text-zinc-300">/</span>
              <span className="text-xs font-semibold text-blue-600">Admin Console</span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950 font-display flex items-center gap-2.5">
              <FolderKanban className="w-6 h-6 text-blue-600" />
              <span>Quản Trị Danh Sách Dự Án</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors cursor-pointer border border-rose-200 btn-press"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Đăng Xuất</span>
            </button>
          </div>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Tổng số dự án</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950 font-display">{projects.length}</div>
            <p className="text-[11px] text-zinc-400">Hiển thị trực tiếp trên Portfolio</p>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">Khách hàng liên hệ (Leads)</span>
              <Users className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold text-zinc-950 font-display">{contacts.length}</div>
              {contacts.filter((c) => c.status === 'NEW').length > 0 && (
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                  {contacts.filter((c) => c.status === 'NEW').length} mới
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-400">Yêu cầu từ form & modal tư vấn</p>
          </div>

          <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-2xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500">PostgreSQL DB</span>
              <Database className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Đang kết nối bình thường</span>
            </div>
            <p className="text-[11px] text-zinc-400">Port 5432 / Prisma ORM</p>
          </div>
        </div>

        {/* Status notification banner */}
        {statusMessage && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm font-medium flex items-center justify-between border animate-in fade-in duration-200 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button 
              onClick={() => setStatusMessage(null)}
              className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-zinc-100 rounded-2xl w-fit border border-zinc-200/80">
          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Quản Lý Dự Án</span>
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 text-[10px] text-zinc-600 font-mono">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'contacts'
                ? 'bg-white text-zinc-950 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Khách Hàng Liên Hệ (Leads)</span>
            {contacts.filter((c) => c.status === 'NEW').length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-pulse">
                {contacts.filter((c) => c.status === 'NEW').length} mới
              </span>
            )}
            <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 text-[10px] text-zinc-600 font-mono">
              {contacts.length}
            </span>
          </button>
        </div>

        {/* TAB 1: Quản lý Dự án */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-200">
            
            {/* Form Create Project (Spans 5 columns) */}
            <section className="lg:col-span-5 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="border-b border-zinc-100 pb-4">
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Thêm dữ liệu</span>
                </div>
                <h2 className="text-lg font-bold text-zinc-950 font-display flex items-center gap-2">
                  <span>Thêm Dự Án Mới</span>
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Dữ liệu sẽ được lưu tự động vào PostgreSQL và hiển thị ngay trên trang chủ
                </p>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Tên Dự Án (Project Name) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: SHOPZONE AUDIO, VELOCE..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Phân Loại (Category)
                  </label>
                  <CustomSelect
                    value={category}
                    onChange={(val) => setCategory(val)}
                    options={[
                      { value: "Landing Page", label: "Landing Page" },
                      { value: "Website Bán Hàng", label: "Website Bán Hàng (E-Commerce)" },
                      { value: "Web Doanh Nghiệp", label: "Web Doanh Nghiệp (Corporate)" },
                      { value: "SaaS Platform", label: "SaaS Platform" },
                      { value: "Mobile App", label: "Mobile App" },
                    ]}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Mô Tả Ngắn (Description) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Giới thiệu mục tiêu, giải pháp và kết quả đạt được..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Công Nghệ (Tech Stack) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Phân tách bằng dấu phẩy: Next.js 16, Tailwind CSS, PostgreSQL..."
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Điểm Nổi Bật (Features)
                  </label>
                  <input
                    type="text"
                    placeholder="Phân tách bằng dấu phẩy: Tối ưu tải trang 0.8s, Chuẩn SEO Onpage..."
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Link Demo / Production (Domain)
                  </label>
                  <input
                    type="url"
                    placeholder="https://client-domain.com (Không bắt buộc)"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-zinc-50/50 border border-zinc-200 rounded-xl focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10"
                  />
                </div>

                {/* File Upload Box */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-800 block">
                    Ảnh Bìa Dự Án <span className="text-rose-500">*</span>
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative rounded-2xl overflow-hidden border border-zinc-200 aspect-[16/10] bg-zinc-100 group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={handleRemovePreview}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-zinc-950/70 text-white hover:bg-zinc-950 transition-colors cursor-pointer"
                        title="Đổi ảnh khác"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-zinc-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-zinc-50/50">
                      <div className="p-3 rounded-full bg-white shadow-2xs text-zinc-500">
                        <Upload className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-center space-y-0.5">
                        <span className="text-xs font-semibold text-zinc-800">Chọn file ảnh từ máy tính</span>
                        <p className="text-[11px] text-zinc-400">PNG, JPG, WEBP tối đa 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 py-3 px-4 bg-zinc-950 hover:bg-zinc-800 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 btn-press flex items-center justify-center gap-2 shadow-xs"
                >
                  {submitting ? (
                    <span>Đang lưu dự án...</span>
                  ) : (
                    <>
                      <span>Lưu Dự Án Vào Database</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            </section>

            {/* List Existing Projects (Spans 7 columns) */}
            <section className="lg:col-span-7 bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-zinc-950 font-display">
                    Dự Án Đang Hoạt Động
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Tổng cộng {projects.length} dự án được lưu trữ trong Database
                  </p>
                </div>
              </div>

              {loadingProjects ? (
                <div className="py-12 text-center text-xs text-zinc-400">
                  Đang tải danh sách dự án từ PostgreSQL...
                </div>
              ) : projects.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-zinc-700">Chưa có dự án nào trong Database</p>
                    <p className="text-xs text-zinc-400">Hãy sử dụng biểu mẫu bên cạnh để tạo dự án đầu tiên</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {projects.map((p) => (
                    <div key={p.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200/60">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-zinc-950 font-display truncate">
                              {p.name}
                            </span>
                            {p.category && (
                              <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                                {p.category}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-zinc-500 line-clamp-1 max-w-[360px]">
                            {p.description}
                          </p>
                          
                          <div className="flex flex-wrap gap-1">
                            {p.techStack.map((tech, idx) => (
                              <span key={idx} className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-1.5 py-0.2 rounded">
                                #{tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {p.domain && (
                          <a
                            href={p.domain}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-zinc-500 hover:text-blue-600 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                            title="Xem Demo trực tiếp"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDeleteProject(p.id, p.name)}
                          className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Xóa dự án khỏi Database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}

        {/* TAB 2: Quản lý Khách Hàng Liên Hệ (Leads) */}
        {activeTab === 'contacts' && (
          <section className="bg-white border border-zinc-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
            
            {/* Header + Filter Pills */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  <Users className="w-3.5 h-3.5" />
                  <span>Dữ liệu khách hàng</span>
                </div>
                <h2 className="text-xl font-bold text-zinc-950 font-display">
                  Danh Sách Yêu Cầu Tư Vấn (Leads)
                </h2>
                <p className="text-xs text-zinc-500">
                  Tự động lưu từ form liên hệ trang chủ và modal popup tư vấn 1:1
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-1.5 bg-zinc-100 p-1.5 rounded-2xl border border-zinc-200/80 w-fit">
                {(
                  [
                    { key: 'ALL', label: 'Tất cả', count: contacts.length },
                    { key: 'NEW', label: 'Chưa liên hệ', count: contacts.filter((c) => c.status === 'NEW').length },
                    { key: 'CONTACTED', label: 'Đã liên hệ', count: contacts.filter((c) => c.status === 'CONTACTED').length },
                    { key: 'COMPLETED', label: 'Hoàn thành', count: contacts.filter((c) => c.status === 'COMPLETED').length },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setContactFilter(f.key)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      contactFilter === f.key
                        ? 'bg-white text-zinc-950 shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-white/50'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-zinc-100 text-[10px] text-zinc-500 font-mono">
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content List */}
            {loadingContacts ? (
              <div className="py-16 text-center text-xs text-zinc-400">
                Đang nạp danh sách yêu cầu tư vấn từ Database...
              </div>
            ) : contacts.filter((c) => contactFilter === 'ALL' || c.status === contactFilter).length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                  <Users className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-700">Chưa có yêu cầu tư vấn nào</p>
                  <p className="text-xs text-zinc-400">
                    Khi khách hàng điền form liên hệ trên trang chủ, thông tin sẽ lập tức xuất hiện tại đây
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contacts
                  .filter((c) => contactFilter === 'ALL' || c.status === contactFilter)
                  .map((c) => {
                    const isNew = c.status === 'NEW';
                    const isContacted = c.status === 'CONTACTED';
                    const isCompleted = c.status === 'COMPLETED';

                    return (
                      <div
                        key={c.id}
                        className={`p-5 rounded-2xl border transition-all space-y-4 ${
                          isNew
                            ? 'bg-rose-50/30 border-rose-200/90 shadow-2xs'
                            : isContacted
                            ? 'bg-blue-50/20 border-blue-200/80 shadow-2xs'
                            : 'bg-white border-zinc-200/90 shadow-2xs'
                        }`}
                      >
                        {/* Header card: Name + Status Badge + Date */}
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-zinc-950 font-display">
                                {c.fullName}
                              </h3>
                              {isNew && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                                  Chưa liên hệ
                                </span>
                              )}
                              {isContacted && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                                  Đã liên hệ
                                </span>
                              )}
                              {isCompleted && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  Hoàn thành
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              {new Date(c.createdAt).toLocaleString('vi-VN')}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteContact(c.id, c.fullName)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Xóa yêu cầu này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Direct Contact info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60">
                            <a
                              href={`tel:${c.phone}`}
                              className="flex items-center gap-1.5 font-semibold text-blue-600 hover:underline"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span>{c.phone}</span>
                            </a>
                            <button
                              onClick={() => handleCopyPhone(c.phone, c.id)}
                              className="p-1 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                              title="Sao chép số điện thoại"
                            >
                              {copiedPhoneId === c.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {c.email ? (
                            <div className="flex items-center p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 overflow-hidden">
                              <a
                                href={`mailto:${c.email}`}
                                className="flex items-center gap-1.5 font-medium text-zinc-700 hover:text-blue-600 truncate"
                                title={c.email}
                              >
                                <Mail className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                                <span className="truncate">{c.email}</span>
                              </a>
                            </div>
                          ) : (
                            <div className="flex items-center p-2.5 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-400 italic">
                              <Mail className="w-3.5 h-3.5 shrink-0 text-zinc-300 mr-1.5" />
                              <span>Không có email</span>
                            </div>
                          )}
                        </div>

                        {/* Service badge */}
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-zinc-500">Dịch vụ quan tâm:</span>
                          <span className="text-[11px] font-semibold text-zinc-800 bg-zinc-100 px-2.5 py-0.5 rounded-md border border-zinc-200/60">
                            {c.service}
                          </span>
                        </div>

                        {/* Message content */}
                        {c.message ? (
                          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200/60 text-xs text-zinc-700 leading-relaxed whitespace-pre-wrap">
                            {c.message}
                          </div>
                        ) : (
                          <div className="text-xs text-zinc-400 italic">
                            Khách hàng không để lại ghi chú thêm.
                          </div>
                        )}

                        {/* Actions bar */}
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {isNew && (
                              <button
                                onClick={() => handleUpdateContactStatus(c.id, 'CONTACTED')}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer btn-press flex items-center gap-1.5"
                              >
                                <CheckCheck className="w-3.5 h-3.5" />
                                <span>Đánh dấu đã liên hệ</span>
                              </button>
                            )}

                            {isContacted && (
                              <button
                                onClick={() => handleUpdateContactStatus(c.id, 'COMPLETED')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer btn-press flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Đánh dấu hoàn thành</span>
                              </button>
                            )}

                            {isCompleted && (
                              <button
                                onClick={() => handleUpdateContactStatus(c.id, 'NEW')}
                                className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium transition-colors cursor-pointer"
                              >
                                Chuyển lại về Mới
                              </button>
                            )}
                          </div>

                          <span className="text-[10px] text-zinc-400 font-mono">ID: {c.id.slice(0, 8)}...</span>
                        </div>

                      </div>
                    );
                  })}
              </div>
            )}

          </section>
        )}

      </div>
    </div>
  );
}
