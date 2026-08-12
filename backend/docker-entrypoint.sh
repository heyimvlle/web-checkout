#!/bin/sh
set -e

echo "⏳ Waiting for MySQL..."
until node -e "
const net = require('net');
const socket = net.connect({ host: 'mysql', port: 3306 }, () => {
  socket.end();
  process.exit(0);
});
socket.on('error', () => process.exit(1));
" 2>/dev/null; do
  sleep 2
done
echo "✅ MySQL is accepting connections"

echo "📦 Syncing schema with prisma db push..."
i=0
until npx prisma db push --skip-generate; do
  i=$((i + 1))
  if [ "$i" -ge 15 ]; then
    echo "❌ Schema sync failed after retries"
    exit 1
  fi
  echo "MySQL not ready for Prisma yet, retrying ($i/15)..."
  sleep 3
done

echo "🌱 Seeding database (skipped if already populated)..."
npx tsx prisma/seed.ts

echo "🚀 Starting API..."
exec "$@"
