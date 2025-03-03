#!/bin/bash
echo "Clearing Next.js cache..."
rm -rf .next/cache

echo "Restarting Next.js server..."
npm run dev
