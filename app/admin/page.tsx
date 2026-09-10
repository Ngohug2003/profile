'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FolderKanban,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon
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

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

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

  useEffect(() => {
    loadProjects();
  }, []);

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

      setStatusMessage({ type: 'success', text: 'Đã thêm dự án mới thành công!' });
      await loadProjects();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Đã xảy ra lỗi khi tạo dự án.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string, projectName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa dự án "${projectName}"?`)) return;

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
    } catch (err: any) {
      alert(err.message || 'Lỗi thao tác.');
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#fbfbfd] text-[#1d1d1f] p-4 sm:p-8 select-none">
      <div style={{ maxWidth: '1200px', width: '100%' }} className="w-full max-w-[1200px] mx-auto space-y-8">
        
        {/* Top bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#e0e0e0] rounded-2xl p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-[#7a7a7a] hover:text-[#0066cc] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Xem Trang Chủ</span>
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f] flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-[#0066cc]" />
              <span>Quản Trị Danh Sách Dự Án</span>
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Đăng Xuất</span>
          </button>
        </header>

        {/* Status notification */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Create Project */}
          <section className="lg:col-span-5 bg-white border border-[#e0e0e0] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-[#f0f0f0] pb-4">
              <h2 className="text-lg font-bold text-[#1d1d1f] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0066cc]" />
                <span>Thêm Dự Án Mới</span>
              </h2>
              <p className="text-xs text-[#7a7a7a] mt-1">
                Dữ liệu sẽ được lưu vào PostgreSQL và hiển thị trên Portfolio
              </p>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">
                  Tên Dự Án (Project Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: SHOPZONE, VELOCE CHRONO..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">
                  Phân Loại (Category)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc]"
                >
                  <option value="Landing Page">Landing Page</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="Web Doanh Nghiệp">Web Doanh Nghiệp</option>
                  <option value="SaaS Platform">SaaS Platform</option>
                  <option value="Mobile App">Mobile App</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">
                  Mô Tả Ngắn (Description) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mô tả tóm tắt mục đích, giải pháp và giá trị của dự án mang lại..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">
                  Tech Stack (Ngăn cách bởi dấu phẩy) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Next.js, Tailwind CSS, PostgreSQL, Docker"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">
                  Điểm Nổi Bật (Features - cách nhau bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  placeholder="Tải dưới 1.5s, Responsive 100%, Chuẩn SEO onpage"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">
                  Link Demo / Domain (Tùy chọn)
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1d1d1f]">
                  Ảnh Bìa / Mockup (Cover Image) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-[#e0e0e0] rounded-xl p-4 text-center hover:border-[#0066cc] transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <Upload className="w-6 h-6 text-[#7a7a7a]" />
                    <span className="text-xs text-[#7a7a7a]">
                      {file ? file.name : 'Nhấn để chọn file ảnh (PNG, JPG, WEBP < 5MB)'}
                    </span>
                  </label>
                </div>

                {imagePreview && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#e0e0e0] bg-[#f5f5f7] mt-2">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-[#0066cc] hover:bg-[#0071e3] text-white text-sm font-medium rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Đang Tải Lên & Lưu...' : 'Lưu Dự Án'}</span>
              </button>
            </form>
          </section>

          {/* List of projects */}
          <section className="lg:col-span-7 bg-white border border-[#e0e0e0] rounded-2xl p-6 shadow-sm space-y-6">
            <div className="border-b border-[#f0f0f0] pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#1d1d1f]">
                  Danh Sách Dự Án Trong Database ({projects.length})
                </h2>
                <p className="text-xs text-[#7a7a7a] mt-0.5">
                  Các dự án đang được hiển thị trên trang chủ công khai
                </p>
              </div>
            </div>

            {loadingProjects ? (
              <div className="py-12 text-center text-sm text-[#7a7a7a]">
                Đang nạp danh sách dự án...
              </div>
            ) : projects.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ImageIcon className="w-10 h-10 text-[#d0d0d0] mx-auto" />
                <p className="text-sm text-[#7a7a7a]">
                  Chưa có dự án nào trong Database. Hãy dùng form bên trái để thêm dự án đầu tiên!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[#e0e0e0] rounded-xl hover:border-[#0066cc] transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#f5f5f7] shrink-0 border border-[#e0e0e0]">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1d1d1f]">{p.name}</span>
                          {p.category && (
                            <span className="text-[10px] font-bold text-[#0066cc] bg-[#f5f5f7] border border-[#e0e0e0] px-2 py-0.5 rounded-full">
                              {p.category}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7a7a7a] line-clamp-1 max-w-[400px]">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {p.techStack.map((tech, idx) => (
                            <span key={idx} className="text-[10px] text-[#7a7a7a]">
                              #{tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {p.domain && (
                        <a
                          href={p.domain}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-[#7a7a7a] hover:text-[#0066cc] hover:bg-[#f5f5f7] rounded-lg transition-colors"
                          title="Xem Demo"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteProject(p.id, p.name)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Xóa dự án"
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

      </div>
    </div>
  );
}
