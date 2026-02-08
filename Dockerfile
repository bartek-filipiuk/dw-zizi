FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
RUN npm run build

# Production image with PostgreSQL
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache postgresql postgresql-client supervisor

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Set up PostgreSQL
ENV PGDATA=/var/lib/postgresql/data
ENV DATABASE_URL=postgresql://dw_zizi:dw_zizi_secret@localhost:5432/dw_zizi

RUN mkdir -p /var/lib/postgresql/data /run/postgresql && \
    chown -R postgres:postgres /var/lib/postgresql /run/postgresql

# Initialize PostgreSQL
USER postgres
RUN initdb -D /var/lib/postgresql/data && \
    echo "host all all 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf && \
    echo "listen_addresses='localhost'" >> /var/lib/postgresql/data/postgresql.conf && \
    pg_ctl -D /var/lib/postgresql/data start && \
    psql -c "CREATE USER dw_zizi WITH PASSWORD 'dw_zizi_secret';" && \
    psql -c "CREATE DATABASE dw_zizi OWNER dw_zizi;" && \
    pg_ctl -D /var/lib/postgresql/data stop
USER root

# Copy Next.js standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma files for migrations
COPY --from=builder /app/node_modules/.prisma ./.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

# Copy seed images
COPY --from=builder /app/images ./images

# Create uploads directory
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Supervisord config
COPY <<'EOF' /etc/supervisord.conf
[supervisord]
nodaemon=true
user=root
logfile=/dev/stdout
logfile_maxbytes=0

[program:postgresql]
command=su postgres -c "postgres -D /var/lib/postgresql/data"
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0

[program:nextjs]
command=node server.js
directory=/app
autostart=true
autorestart=true
startsecs=5
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
environment=PORT="3000",HOSTNAME="0.0.0.0",DATABASE_URL="postgresql://dw_zizi:dw_zizi_secret@localhost:5432/dw_zizi",NODE_ENV="production"
EOF

# Startup script: run migrations then start supervisor
COPY <<'STARTUP' /app/start.sh
#!/bin/sh
set -e

# Start PostgreSQL temporarily for migrations
su postgres -c "pg_ctl -D /var/lib/postgresql/data start -w"

# Run Prisma migrations
npx prisma migrate deploy 2>/dev/null || echo "No migrations to run"

# Seed if database is empty
npx prisma db seed 2>/dev/null || echo "Seed skipped or already applied"

# Stop temporary PostgreSQL (supervisor will start it)
su postgres -c "pg_ctl -D /var/lib/postgresql/data stop -w"

# Start supervisor (manages both PostgreSQL and Next.js)
exec supervisord -c /etc/supervisord.conf
STARTUP

RUN chmod +x /app/start.sh

EXPOSE 3000

CMD ["/app/start.sh"]
