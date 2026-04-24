FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
# install clean deps bypassing cache if needed
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p public
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build
RUN npx esbuild src/mcp-server/index.ts --bundle --platform=node --format=esm --outfile=mcp.mjs
RUN npx esbuild src/generate-cli.ts --bundle --platform=node --format=esm --outfile=generate.mjs

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Install chromium for puppeteer to work inside the container
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Pass Puppeteer path to Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Setup runner permissions
RUN mkdir -p .next public/exports
RUN chown -R nextjs:nodejs .next public/exports

# Copy built artifacts and standalone server
COPY --from=builder --chown=nextjs:nodejs /app/mcp.mjs ./mcp.mjs
COPY --from=builder --chown=nextjs:nodejs /app/generate.mjs ./generate.mjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3001

ENV PORT 3001
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
