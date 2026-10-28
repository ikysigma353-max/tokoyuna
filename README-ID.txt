TOKOYUNA — DEMO BACKEND

PENTING:
- Paket ini BELUM mengaktifkan pembayaran otomatis atau mengirim diamond sungguhan.
- Fungsi backend menyimpan pesanan berstatus PENDING saja.
- Jangan mengubah status menjadi PAID hanya karena pelanggan mengirim screenshot transfer.
- Jangan masukkan API key, PIN DANA, OTP, atau token rahasia ke index.html.

Isi paket:
- index.html: situs TokoYuna yang saat ini berfungsi mengirim detail pesanan ke WhatsApp.
- netlify/functions/orders.mjs: endpoint backend untuk menyimpan pesanan dan endpoint daftar pesanan admin.
- netlify.toml + package.json: konfigurasi deploy backend.

Deploy backend:
Netlify Drop untuk file HTML statis tidak cukup untuk menyiapkan fungsi server ini. Deploy seluruh folder proyek lewat repository Git yang dihubungkan ke Netlify atau Netlify CLI agar fungsi dan dependency dipasang.
Setelah deploy, set environment variable TOKOYUNA_ADMIN_TOKEN di Netlify (nilai rahasia acak yang kuat), dengan scope Functions, lalu deploy ulang.
Endpoint:
POST /.netlify/functions/orders — simpan pesanan pending.
GET /.netlify/functions/orders — daftar pesanan, perlu header Authorization: Bearer <TOKOYUNA_ADMIN_TOKEN>.

Untuk live automation tetap perlu:
1. Payment gateway resmi yang akun dan verifikasinya disetujui.
2. Webhook yang memverifikasi pembayaran asli dari server provider (jangan percaya status dari browser).
3. Distributor game resmi/reseller dengan API top-up dan saldo yang mencukupi.
4. Server-side idempotency, logging, validasi Player ID, dan penanganan refund/kegagalan.
