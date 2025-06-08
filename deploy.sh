#!/usr/bin/env bash

echo "▶ Installing & building NextJS"
git reset --hard
git checkout master
git pull origin master
npm install --legacy-peer-deps
npm run build  

echo "▶ (Re)starting PM2 process rgt-web"
pm2 delete rgt-web 2>/dev/null || true
pm2 start "node_modules/next/dist/bin/next" \
     --name rgt-web \
     -- start -p 8000 \
     --env production \
     --time

pm2 save
echo "✅ Web running on :8000  |  pm2 logs rgt-web"
