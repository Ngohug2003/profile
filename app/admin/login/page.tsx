'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Mật khẩu quản trị không chính xác.');
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Lỗi kết nối tới máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#fbfbfd] px-4 select-none">
      <div
        style={{ maxWidth: '420px', width: '100%' }}
        className="w-full bg-white border border-[#e0e0e0] rounded-2xl p-8 shadow-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#0066cc]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1d1d1f]">
            Quản Trị Portfolio
          </h1>
          <p className="text-sm text-[#7a7a7a]">
            Nhập mật khẩu quản trị để truy cập trang quản lý dự án
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1d1d1f] uppercase tracking-wider">
              Mật khẩu Admin
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••••••"
              className="w-full px-4 py-3 text-sm bg-white border border-[#e0e0e0] rounded-xl focus:outline-none focus:border-[#0066cc] focus:ring-2 focus:ring-[#0066cc]/10 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0066cc] hover:bg-[#0071e3] text-white text-sm font-medium rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-60"
          >
            <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#f0f0f0] flex items-center justify-center gap-1.5 text-xs text-[#7a7a7a]">
          <ShieldCheck className="w-4 h-4 text-[#0066cc]" />
          <span>Bảo mật phiên bằng HttpOnly Cookie</span>
        </div>
      </div>
    </div>
  );
}
