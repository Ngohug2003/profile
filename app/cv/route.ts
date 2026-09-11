import { NextResponse } from 'next/server';

// Đường dẫn file gốc lưu trên Supabase Storage Cloud
const SUPABASE_CV_URL =
  'https://dhgwheicwjcfvqlejgeb.supabase.co/storage/v1/object/public/project-covers/Ngo%20Viet%20Hung%20-%20Full%20stack.pdf';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isDownload = searchParams.get('download') === '1' || searchParams.get('download') === 'true';

    // Fetch stream từ Supabase Storage
    const response = await fetch(SUPABASE_CV_URL);
    if (!response.ok) {
      return new NextResponse('Không tìm thấy file CV trên hệ thống.', { status: 404 });
    }

    const pdfBuffer = await response.arrayBuffer();
    const filename = 'Full Stack Dev - Ngo Viet Hung.pdf';
    const dispositionType = isDownload ? 'attachment' : 'inline';

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${dispositionType}; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        // Cache tại Edge/CDN trong 24h để tăng tốc tối đa, không phải tải lại từ Supabase mỗi lần
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Lỗi khi truyền stream file CV:', error);
    return new NextResponse('Lỗi máy chủ khi tải file CV.', { status: 500 });
  }
}
