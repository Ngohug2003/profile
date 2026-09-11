/**
 * Gửi thông báo khách hàng mới vào Telegram Bot
 * Hỗ trợ định dạng HTML, kèm link Zalo và số điện thoại gọi ngay 1 chạm
 */
export async function sendTelegramNotification(lead: {
  fullName: string;
  phone: string;
  email?: string | null;
  service?: string;
  message?: string | null;
}): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN hoặc TELEGRAM_CHAT_ID chưa được cấu hình trong .env');
    return false;
  }

  // Làm sạch số điện thoại cho link zalo (bỏ khoảng trắng, dấu chấm, chuẩn hóa 0xxx)
  let cleanPhone = (lead.phone || '').replace(/\D/g, '');
  if (cleanPhone.startsWith('84')) {
    cleanPhone = '0' + cleanPhone.slice(2);
  }

  // Định dạng thời gian Việt Nam
  const now = new Date();
  const timeStr = now.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const text = `🔔 <b>CÓ KHÁCH HÀNG MỚI ĐĂNG KÝ TƯ VẤN!</b>
━━━━━━━━━━━━━━━━━━━━━
👤 <b>Khách hàng:</b> ${escapeHtml(lead.fullName)}
📞 <b>Số điện thoại:</b> <code>${escapeHtml(lead.phone)}</code>
📧 <b>Email:</b> ${lead.email ? escapeHtml(lead.email) : '<i>Chưa cung cấp</i>'}
💼 <b>Dịch vụ quan tâm:</b> ${escapeHtml(lead.service || 'Tư vấn landing page')}
💬 <b>Lời nhắn:</b> ${lead.message ? escapeHtml(lead.message) : '<i>Không có</i>'}
⏰ <b>Thời gian:</b> ${timeStr}
━━━━━━━━━━━━━━━━━━━━━
👉 <b>Chat Zalo ngay:</b> https://zalo.me/${cleanPhone}
📞 <b>Gọi điện ngay:</b> tel:${cleanPhone}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: false,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('[Telegram API Error]:', err);
      return false;
    }
    return true;
  } catch (error) {
    console.error('[Telegram Network Error]:', error);
    return false;
  }
}

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
