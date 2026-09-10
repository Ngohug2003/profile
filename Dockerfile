# ==============================================================================
# TẦNG 1: DEPS (Cài đặt dependencies siêu tốc)
# ==============================================================================
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Cấu hình CDN tốc độ cao và bỏ qua postinstall script gây nghẽn mạng
RUN npm config set registry https://registry.npmmirror.com && \
    npm ci --ignore-scripts --no-audit --no-fund

# ==============================================================================
# TẦNG 2: BUILDER (Sinh mã Prisma Client & Build Next.js Standalone)
# ==============================================================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Sinh mã Prisma Client cho môi trường Alpine Linux
RUN npx prisma generate

# Build ứng dụng Next.js sang chế độ standalone
RUN npm run build

# ==============================================================================
# TẦNG 3: RUNNER (Môi trường runtime tối giản cho Production)
# ==============================================================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Cài đặt curl phục vụ Docker Healthcheck
RUN apk add --no-cache curl

# Tạo user không đặc quyền (non-root) tăng cường an ninh container
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets từ builder với quyền user nextjs
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Tạo sẵn thư mục lưu ảnh upload và cấp quyền cho user nextjs
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public ./public/uploads

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
