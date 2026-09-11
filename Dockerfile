# ==============================================================================
# TẦNG 1: DEPS (Cài đặt dependencies siêu tốc)
# ==============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./

# Cấu hình CDN tốc độ cao và cài đặt dependencies
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci --no-audit --no-fund

# ==============================================================================
# TẦNG 2: BUILDER (Build Next.js Standalone với Supabase Cloud)
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Dummy env vars cho static compilation check
ENV NEXT_PUBLIC_SUPABASE_URL="https://placeholder-project.supabase.co"
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-anon-key"
ENV NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Build ứng dụng Next.js sang chế độ standalone
RUN npm run build

# ==============================================================================
# TẦNG 3: RUNNER (Môi trường runtime tối giản cho Production VPS)
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cài đặt wget/curl phục vụ Docker Healthcheck
RUN apk add --no-cache curl wget

# Tạo user không đặc quyền (non-root) tăng cường an ninh container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets từ builder với quyền user nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Cấp quyền thư mục .next cho user nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy các file standalone và static assets đã được tối ưu hóa
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Chuyển sang user non-root
USER nextjs

EXPOSE 3000

# Khởi chạy server Next.js standalone
CMD ["node", "server.js"]
