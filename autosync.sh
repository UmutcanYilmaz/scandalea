#!/bin/bash
echo "🔄 Jules Protocol: Auto-Sync Initiated..."

# 1. Çakışmaları önlemek için yerel değişiklikleri sakla
git stash

# 2. Uzak sunucudan en güncel hali çek (Rebase ile)
git pull --rebase origin main

# 3. Saklanan değişiklikleri geri getir
git stash pop || true

# 4. Tüm yeni dosyaları sahneye al
git add .

# 5. Kaydet (Otomatik mesaj ile)
git commit -m "🚀 Antigravity Update: Automated Task Completion"

# 6. Gönder
git push origin main

echo "✅ Jules Protocol: Sync Complete. Code is live."
