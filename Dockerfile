# Stage 1: Giai đoạn build
FROM oven/bun:alpine AS builder


# Ghi version vào label
ARG APP_VERSION=latest
LABEL version=$APP_VERSION

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép file package.json và bun.lockb
COPY package.json bun.lockb ./

# Cài đặt tất cả dependencies (bao gồm cả devDependencies)
RUN bun install

# Sao chép mã nguồn vào container
COPY . .

# Build mã nguồn
RUN bun run build

# Dọn dẹp node_modules để giảm kích thước
RUN find ./node_modules -type f -name "*.md" -delete \
  && find ./node_modules -type f -name "*.ts" -delete \
  && find ./node_modules -type f -name "*.map" -delete
RUN find . -type f -name ".DS_Store" -delete

# Stage 2: Giai đoạn production
FROM oven/bun:alpine

# Thiết lập thư mục làm việc
WORKDIR /usr/src/app

# Sao chép các file cần thiết từ giai đoạn build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json

# Expose port 3999
EXPOSE 3999

# Chạy ứng dụng
CMD ["bun", "start"]
