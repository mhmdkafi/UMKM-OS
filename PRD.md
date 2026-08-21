# PRODUCT REQUIREMENTS DOCUMENT
## UMKM Business OS + AI Business Assistant

| | |
|---|---|
| **Target Market** | Kuliner (F&B) UMKM Indonesia |
| **Versi Dokumen** | v1.0 (Comprehensive) |
| **Status Produk** | MVP Definition & Specs |
| **Mata Uang** | Indonesian Rupiah (IDR) |

---

## 1. Product Overview

**Nama Produk:** UMKM Business OS (Operating System) + AI Business Assistant

**Konsep Produk:** Platform manajemen bisnis berbasis web yang dirancang khusus untuk pemilik Usaha Mikro, Kecil, dan Menengah (UMKM) kuliner di Indonesia. Sistem ini tidak diposisikan sekadar sebagai Point of Sales (POS/kasir digital), melainkan sebagai Pusat Kendali Operasional dan Intelijen Bisnis yang membantu pemilik memahami kondisi keuangan sebenarnya, mengelola persediaan secara efisien, serta mengambil keputusan bisnis berbasis data terintegrasi.

**Kategori Produk:** Business Management Platform / Business Intelligence (BI) for SMBs.

**Target Market:** Usaha kuliner skala kecil hingga menengah di Indonesia (Coffee shop, kedai makanan/warung makan modern, restoran skala kecil, toko roti/bakery, dan bisnis makanan berbasis rumahan/cloud kitchen).

**Value Proposition:** "Membantu pemilik UMKM kuliner memahami profitabilitas riil bisnis, mengendalikan stok bahan baku secara presisi, dan memperoleh rekomendasi keputusan taktis berbasis data bisnis internal melalui AI Assistant."

**Visi Produk:** Demokrasi intelijen bisnis bagi UMKM Indonesia — memberikan kapabilitas analisis data sekelas perusahaan besar kepada pemilik bisnis kecil agar dapat bertumbuh secara inklusif dan berkelanjutan.

---

## 2. Problem Statement

Pemilik bisnis kuliner UMKM di Indonesia menghadapi tantangan operasional dan finansial yang kompleks:

### 2.1 Primary Problems

1. **Ketidakjelasan Profitabilitas Riil:** Pemilik mengetahui omzet harian (revenue), namun tidak tahu pasti berapa laba bersih (net profit) karena pencatatan COGS (HPP) dan operasional acak-acakan.
2. **Manajemen Stok & Kebocoran Bahan Baku:** Stok sering habis mendadak atau kadaluarsa. Keputusan pembelanjaan ulang (restock) bergantung pada insting/firasat.
3. **Kesulitan Menentukan Margin & Menu Teruntung:** Pemilik tidak tahu menu mana yang menyumbang profit terbesar (high margin & volume) vs menu yang merugi.
4. **Data Terfragmentasi & Terisolasi:** Pencatatan transaksi, pengeluaran kas, dan persediaan tercatat terpisah di buku tulis, WhatsApp, atau Excel.

### 2.2 Secondary Problems & Alternatives

- **Secondary Problems:** Kesulitan melacak pelanggan setia, riwayat pembelian acak-acakan, serta tidak memiliki waktu untuk mengolah data angka menjadi keputusan.
- **Current Workarounds:** Menggunakan POS kasir gratisan (hanya catat omzet), buku kas manual, spreadsheet Excel rumit yang jarang diperbarui, atau ingatan pribadi.
- **Keterbatasan Solusi Saat Ini:** POS konvensional berfokus pada kecepatan transaksi di kasir (operational checkout), bukan pada kalkulasi HPP dinamis, profitabilitas bersih, atau analisis keputusan.

---

## 3. Goals and Objectives

| Kategori Goal | Deskripsi Objektif |
|---|---|
| **Primary Product Goals** | Menyediakan sistem operasional harian yang mencatat transaksi, otomatis memotong stok, mengkalkulasi COGS/HPP, dan menampilkan dashboard laba-rugi secara real-time. |
| **Business Goals** | Mencapai 500 Active Business Subscriptions dalam 6 bulan pasca-peluncuran dengan tingkat retensi bulanan > 75%. |
| **User Goals** | Memangkas waktu analisis bisnis mingguan dari 5 jam menjadi kurang dari 15 menit, serta menekan angka waste/kebocoran stok hingga 20%. |
| **Technical Goals** | Sistem responsif (< 1.5 detik loading), uptime 99.9%, dengan response time AI Assistant < 3 detik untuk query analitis standar. |

### Out of Scope (Apa yang TIDAK Dicoba Diselesaikan pada MVP)

a) *(tidak tercantum di sumber)*
b) Integrasi rantai pasok/e-commerce marketplace
c) Akuntansi standar PSAK kompleks/pajak PPh multi-cabang
d) Sistem payroll pegawai rumit

---

## 4. Target Users & Personas

### Budi (Pemilik / Owner)
- **Profil & Background:** 34 Tahun, Owner Coffee Shop. Mengelola 1-2 gerai kopi. Sibuk, sering di luar lokasi, fokus pada strategi & keuangan.
- **Pain Points & Motivasi:** Tidak tahu profit bersih bulanan, sering tekor stok biji kopi. Ingin bisnis autonomous & profit stabil.
- **Kemampuan Teknis & Workflow:** Menengah (Aktif smartphone, Google Sheets, IG). Cek dashboard pagi/malam, kontrol pembelanjaan, terima laporan harian.

### Siti (Admin / Store Manager)
- **Profil & Background:** 26 Tahun, Manager Operasional. Bertanggung jawab atas persediaan, rekap keuangan harian, dan pembelian bahan baku.
- **Pain Points & Motivasi:** Pusing mencocokkan stok fisik dengan rekap kasir harian. Ingin kerja cepat tanpa selisih stok.
- **Kemampuan Teknis & Workflow:** Menengah-Tinggi (Lancar laptop, POS, spreadsheet). Input stok masuk (Stock In), audit mingguan, catat beban operasional.

### Rian (Kasir / Employee)
- **Profil & Background:** 20 Tahun, Staff Kasir. Melayani pelanggan, menerima pembayaran tunai/QRIS, mencetak struk.
- **Pain Points & Motivasi:** Antrean panjang saat jam sibuk, tombol POS rumit. Ingin selesai shift tanpa selisih uang kasir.
- **Kemampuan Teknis & Workflow:** Dasar (Pengguna Android/iOS). Login, buka shift, pilih menu, terima bayar, cetak struk.

---

## 5. User Stories & Prioritisation

| ID | As a [User] | I want to [Action] | So that [Benefit] | Prioritas |
|---|---|---|---|---|
| US-01 | Kasir | Mencatat transaksi penjualan dengan cepat (Tunai & QRIS) | Pelanggan terlayani cepat dan stok terpotong otomatis. | **MUST HAVE** |
| US-02 | Owner | Melihat total Omzet, COGS, dan Laba Bersih harian di Dashboard | Saya tahu kesehatan keuangan bisnis secara real-time. | **MUST HAVE** |
| US-03 | Admin | Menambahkan resep/BOM (Bill of Materials) pada produk | Pengurangan stok bahan baku akurat per porsi terjual. | **MUST HAVE** |
| US-04 | Admin | Mencatat Stock In dan penyesuaian (Stock Adjustment) | Jumlah stok di sistem sesuai dengan keadaan fisik di gudang. | **MUST HAVE** |
| US-05 | Owner | Mengajukan pertanyaan bahasa alami ke AI Business Assistant | Mendapat analisis instan tanpa perlu olah spreadsheet. | **MUST HAVE** |
| US-06 | Owner | Mencatat pengeluaran operasional (Sewa, Listrik, Gaji) | Perhitungan Net Profit benar-benar mencerminkan kondisi riil. | **MUST HAVE** |
| US-07 | Owner | Mendapatkan notifikasi peringatan stok menipis (Low Stock Alert) | Dapat melakukan purchase order sebelum bahan habis total. | **MUST HAVE** |
| US-08 | Owner | Melihat segmentasi pelanggan berdasarkan frekuensi & total belanja | Dapat memberikan promo khusus untuk pelanggan setia. | SHOULD HAVE |
| US-09 | Admin | Mengirimkan Purchase Order (PO) otomatis ke Supplier via WhatsApp | Proses restocking bahan baku lebih efisien dan terstruktur. | SHOULD HAVE |
| US-10 | Owner | Mendapatkan prediksi tren penjualan berbasis Machine Learning | Dapat menyiapkan stok bahan sesuai proyeksi lonjakan permintaan. | COULD HAVE |

---

## 6. Product Scope & Phasing

### MVP (Phase 1) — Core Operations & BI
- Quick POS Transaction (Input pesanan, potong stok otomatis, tunai/QRIS statis)
- Product & Recipe Management (BOM dasar, HPP/COGS calculation)
- Inventory Control (Stock in, stock adjustment, threshold alert)
- Operational Expense Management (Pencatatan beban usaha)
- Dashboard Owner (KPI Omzet, COGS, Laba Kotor, Laba Bersih, Menu Terlaris)
- AI Assistant V1 (Text query berbasis data SQL yang terverifikasi, grounding ketat)
- Role-based Access Control (Owner, Admin, Kasir)

### V2 (Phase 2) — CRM & Supply Chain Integration
- Customer Management & Simple Loyalty Program
- Supplier & Purchase Order (PO) Management (Ekspor PDF / WA)
- Multi-payment Gateway Integration (QRIS Dinamis, E-Wallet)
- Advanced AI Assistant (Proactive daily summary digest, usulan resep hemat)

### Future (Phase 3) — Multi-Branch & Predictive Analytics
- Multi-branch & Inter-store Transfer Inventory
- AI Predictive Restocking & Demand Forecasting
- Integrasi Kasir Offline-First PWA dengan Auto-Sync

---

## 7. Functional Requirements

### FR-01: Management Transaksi (Kasir)
- **Purpose:** Mencatat transaksi penjualan harian dan memperbarui persediaan secara instan.
- **User:** Kasir, Admin, Owner.
- **Preconditions:** Kasir terautentikasi, varian produk & harga sudah aktif.
- **Main Flow:** Kasir memilih item menu → Sistem menghitung total harga → Kasir memilih metode pembayaran (Tunai/QRIS) → Kasir memasukkan nominal bayar → Sistem memvalidasi, menyimpan transaksi, memotong stok berdasarkan resep (BOM), dan menampilkan kembalian.
- **Business Rules:** Jika stok produk/bahan baku = 0, transaksi tetap diperbolehkan jika aturan "Allow Negative Stock" diaktifkan oleh Owner, namun diberi peringatan visual.
- **Validation & Error States:** Jumlah bayar tunai < total belanja → Tampilkan pesan "Uang pembayaran kurang".

### FR-02: Manajemen Produk & Resep (BOM)
- **Purpose:** Mengelola katalog produk, menentukan harga jual, serta menghitung COGS/HPP dinamis berdasarkan resep.
- **User:** Admin, Owner.
- **Main Flow:** User membuat produk "Kopi Susu Gula Aren" (Harga: Rp 20.000) → Menambahkan komponen BOM: Biji Kopi (18g), Susu UHT (120ml), Cup 16oz (1 pcs) → Sistem otomatis mengkalkulasi total COGS berdasarkan HPP bahan baku saat ini (misal Rp 7.500) → Sistem menghitung Profit Margin (62.5%).
- **Validation:** Harga jual tidak boleh lebih kecil dari 0. Nama produk harus unik per bisnis.

### FR-03: Inventory & Stock Control
- **Purpose:** Mengendalikan ketersediaan bahan baku dan barang jadi.
- **User:** Admin, Owner.
- **Main Flow:** User membuka menu Inventaris → Memilih "Stock In" → Memilih Bahan Baku "Susu UHT", memasukkan kuantitas (12 Litre), harga beli per unit (Rp 18.000) → Sistem memperbarui Weighted Average Cost (WAC) bahan baku dan menambahkan stok.
- **Alternative Flow (Stock Adjustment):** User melakukan audit stok (opname) → Memasukkan stok fisik riil → Sistem mencatat selisih sebagai pengeluaran/spoilage.

### FR-04: Operational Expense Management
- **Purpose:** Mencatat biaya operasional non-bahan baku untuk perhitungan Net Profit.
- **User:** Admin, Owner.
- **Main Flow:** User memasukkan pengeluaran (Contoh: "Sewa Tempat", Rp 3.000.000, Kategori: Fixed Cost, Periode: Bulanan) → Data tersimpan dan langsung mengurangi Gross Profit pada laporan periode bersangkutan.

---

## 8. User Flows

### 8.1 Transaction & Auto Stock Deduction Flow

```
[Kasir Login] → [Pilih Produk & Varian] → [Sistem Cek Stok Resep/BOM] →
[Konfirmasi Pembayaran (Tunai/QRIS)] → [Simpan Transaction & TransactionItem] →
[Trigger Auto-Deduct Inventory Movement] → [Update Financial Snapshot Realtime] →
[Struk Dicetak/Selesai]
```

### 8.2 AI Query & Context Retrieval Flow

```
[Owner Input Pertanyaan Chat] → [Guardrail / Intent Classifier] →
[Jika Valid: SQL Generator Query Data Terkait (Revenue, Expense, Stock)] →
[Eksekusi Query DB Terisolasi] → [Pass Context & Data ke LLM Engine] →
[LLM Sintesis Rekomendasi Terstruktur] → [Tampilkan Jawaban + Card Data Faktual]
```

---

## 9. Business Rules & Financial Formulas

| Metrik Finansial | Formula Eksplisit | Penjelasan untuk MVP |
|---|---|---|
| **Revenue (Omzet)** | Revenue = ∑ (Qty Terjual × Harga Jual Net) | Total akumulasi penjualan bersih setelah dipotong diskon transaksi. |
| **COGS / HPP (BOM Based)** | COGS = ∑ (Qty Bahan Baku Terpakai × WAC Bahan) | Menghitung HPP berdasarkan Weighted Average Cost (WAC) bahan baku terpakai. |
| **Gross Profit (Laba Kotor)** | Gross Profit = Revenue − Total COGS | Selisih antara pendapatan penjualan dengan harga pokok penjualan. |
| **Net Profit (Laba Bersih)** | Net Profit = Gross Profit − Total Operational Expenses | Laba riil bisnis setelah dikurangi seluruh beban operasional (gaji, sewa, listrik). |
| **Gross Profit Margin (%)** | Margin = (Gross Profit / Revenue) × 100% | Persentase efisiensi produksi/penjualan produk. |
| **Average Order Value (AOV)** | AOV = Total Revenue / Total Jumlah Transaksi | Rata-rata nilai pengeluaran pelanggan per transaksi. |
| **Weighted Average Cost (WAC)** | WAC = (Nilai Stok Lama + Nilai Beli Baru) / Total Qty Stok | Metode valuasi inventaris saat terjadi Stock In bahan baku dengan harga berbeda. |

---

## 10. AI Business Assistant Requirements

### 10.1 Arsitektur Integritas Data & Anti-Halusinasi

Fitur AI Assistant dirancang dengan arsitektur RAG (Retrieval-Augmented Generation) berbasis Structured Data (Text-to-SQL / Context-Injection). **AI TIDAK diperbolehkan mengarang angka bisnis.**

**Aturan Ketat Guardrails AI:**
1. **Fakta vs Rekomendasi:** Jawaban AI wajib memisahkan antara Fakta Data DB (misal: "Omzet Anda minggu ini Rp 4.500.000"), Metrik Kalkulasi (misal: "Profit margin turun 4%"), dan Saran / Rekomendasi.
2. **Handling Data Kurang:** Jika data transaksi baru berjalan < 3 hari, AI wajib menjawab: "Data transaksi belum cukup untuk melakukan analisis tren mingguan. Silahkan kumpulkan transaksi minimal 7 hari."
3. **Data Privacy:** Engine AI tidak pernah melatih model publik menggunakan data transaksi pengguna. Query dikirim secara terisolasi per `business_id`.

### 10.2 Contoh Pertanyaan & Format Respon AI

| Pertanyaan User (Bahasa Indonesia) | Mekanisme Retrieval Data | Format Output AI |
|---|---|---|
| "Produk apa yang paling menguntungkan bulan ini?" | Query DB: Group by product, sum(gross_profit) filter month=current. | [FAKTA DATA] Produk paling menguntungkan bulan ini adalah Kopi Susu Aren dengan total Laba Kotor Rp 3.450.000 (180 porsi terjual). [REKOMENDASI] Pertahankan ketersediaan stok Biji Kopi Robusta dan pertimbangkan membuat paket bundling dengan pastry. |
| "Kenapa profit saya turun minggu ini?" | Query DB: Compare revenue, COGS, & expenses (Current Week vs Last Week). | [ANALISIS] Profit Anda turun 12% dibanding minggu lalu karena pengeluaran operasional naik Rp 850.000 (pembelian gas & perbaikan AC), meskipun omzet stabil. |

---

## 11. Dashboard Requirements

Dashboard dirancang khusus untuk Pemilik Bisnis (Owner) agar dapat melihat kesehatan bisnis dalam 5 detik pertama:

**Primary KPIs (Kartu Atas):**
1. Total Omzet (Revenue): Dengan indikator persentase perbandingan periode sebelumnya.
2. Laba Bersih (Net Profit): Menampilkan nominal riil setelah dikurangi beban operasional.
3. Margin Laba Kotor (%): Menunjukkan efisiensi COGS.
4. Jumlah Transaksi & AOV: Total Struk & Rata-rata belanja per Struk.

**Visual Charts:**
- Sales & Profit Trend (Line Chart): Grafik perbandingan Omzet vs Laba Bersih harian/bulanan.
- Top 5 Best-Selling Products (Bar Chart): Produk terlaris berdasarkan kontribusi profit (bukan cuma kuantitas).

**Alerts Section:** Widget merah/kuning untuk "Low Stock Alert" (Bahan baku hampir habis) dan "Margin Reduction Warning".

---

## 12. UX / UI Requirements

- **Simpulan Layout:** Desain bersih, kontras tinggi, dioptimalkan untuk perangkat Tablet dan Desktop (serta tampilan Mobile PWA untuk Owner).
- **Sistem Navigasi:** Sidebar kiri sederhana (Dashboard, Kasir/POS, Produk & Resep, Stok/Gudang, Pengeluaran, Laporan, AI Assistant).
- **Kecepatan Entry Kasir:** Layar POS dioptimalkan untuk sentuhan jari (large touch targets), minimalisasi klik untuk menyelesaikan transaksi.
- **Empty States:** Jika data produk atau transaksi masih kosong, tampilkan panduan visual bertahap (Onboarding Wizard: "Tambahkan Bahan Baku" → "Buat Resep" → "Mulai Jual").

---

## 13. Roles and Permissions

| Modul / Fitur | Owner | Admin / Manager | Kasir / Employee |
|---|---|---|---|
| Lihat Dashboard & Net Profit | YES | NO | NO |
| Pencatatan POS Transaksi | YES | YES | YES |
| Kelola Produk, Resep & HPP | YES | YES | NO |
| Stock In / Out / Adjustment | YES | YES | NO |
| Input Operational Expense | YES | YES | NO |
| Akses AI Business Assistant | YES | NO | NO |

---

## 14. Data Model (Relational Schema)

Entitas utama dirancang dengan relasi terisolasi berdasarkan `business_id` untuk multi-tenancy aman:

- `businesses` (id, name, address, phone, created_at)
- `users` (id, business_id, name, email, password_hash, role [OWNER|ADMIN|CASHIER])
- `categories` (id, business_id, name)
- `ingredients` (id, business_id, name, unit [gram|ml|pcs], current_stock, min_stock_alert, cost_per_unit_wac)
- `products` (id, business_id, category_id, name, selling_price, is_active)
- `product_recipes` (id, product_id, ingredient_id, quantity_required)
- `transactions` (id, business_id, user_id, invoice_number, total_amount, payment_method, status, created_at)
- `transaction_items` (id, transaction_id, product_id, quantity, unit_price, unit_cogs, subtotal_price, subtotal_cogs)
- `inventory_movements` (id, business_id, ingredient_id, type [IN|OUT|ADJUST|SALE], qty, cost_per_unit, reference_id, notes, created_at)
- `operational_expenses` (id, business_id, name, amount, category, expense_date, notes)
- `ai_conversations` (id, business_id, user_id, title, created_at)
- `ai_messages` (id, conversation_id, sender [USER|AI], content, data_payload_json, created_at)

---

## 15. System Architecture

Menggunakan arsitektur **Modular Monolith** untuk meminimalkan kompleksitas operasional infrastruktur pada fase MVP:

- **Frontend App:** Next.js (React / Tailwind CSS) — SSR/SSG untuk dashboard super cepat dan responsive PWA.
- **Backend Core:** Laravel REST API / Node.js Express — Menangani kalkulasi finansial, transaksi POS, dan manajemen stok secara transaksional (Database ACID compliance).
- **Database:** PostgreSQL — Penyimpanan relational terstruktur dengan ACID safety untuk transaksi keuangan.
- **AI Engine Service:** Service Python Microservice (FastAPI + LangChain/LlamaIndex) terpisah yang berkomunikasi via REST/gRPC ke Core Backend untuk mengeksekusi Text-to-SQL dan penyusunan konteks RAG.
- **Queue & Worker:** Redis + Horizon — Menangani pemrosesan async background jobs seperti rekapitulasi data malam hari dan pengiriman notifikasi.

---

## 16. Recommended Technology Stack

| Komponen Tech | Teknologi Terpilih | Alasan Pemilihan & Justifikasi Biz/Tech |
|---|---|---|
| Framework Web | Next.js + Tailwind CSS | Performa tinggi, komponen UI kaya, sangat responsif untuk pengguna mobile/tablet. |
| Backend API | Laravel (PHP 8.3) / Node.js | Kecepatan development ekosistem bisnis, ORM (Eloquent) sangat tangguh untuk transaksi DB, built-in auth & security. |
| Database Utama | PostgreSQL 16 | Handal dalam menangani query analitis komplek, aggregasi data keuangan, dan kompatibilitas JSONB. |
| AI Pipeline | Python 3.11 + FastAPI + OpenAI / Claude API | Ekosistem AI terbaik untuk manipulasi data, Text-to-SQL parsing, dan fleksibilitas integrasi LLM. |
| Cache & Queue | Redis | Cache query dashboard yang sering diakses dan antrean background job rekap HPP. |

---

## 17. Key API Requirements (MVP Endpoints)

### 17.1 `POST /api/v1/transactions`

**Purpose:** Menyimpan transaksi baru kasir dan memotong stok otomatis.

```
// Request Header: Authorization: Bearer <token>

// Request Body:
{
  "payment_method": "QRIS",
  "items": [
    { "product_id": "prod_101", "quantity": 2, "unit_price": 20000 },
    { "product_id": "prod_102", "quantity": 1, "unit_price": 15000 }
  ]
}

// Response (201 Created):
{
  "status": "success",
  "data": {
    "transaction_id": "trx_88921",
    "invoice_number": "INV-20260821-001",
    "total_amount": 55000,
    "total_cogs": 21000,
    "gross_profit": 34000,
    "timestamp": "2026-08-21T20:10:00Z"
  }
}
```

### 17.2 `POST /api/v1/ai/query`

**Purpose:** Mengirimkan pertanyaan bisnis dari Owner ke AI Assistant.

```
// Request Body:
{
  "question": "Berapa laba bersih saya dalam 7 hari terakhir?"
}

// Response (200 OK):
{
  "status": "success",
  "data": {
    "answer": "Laba bersih Anda selama 7 hari terakhir (14-20 Ags) adalah Rp 2.450.000.",
    "metrics": {
      "revenue": 8500000,
      "cogs": 3800000,
      "operational_expense": 2250000,
      "net_profit": 2450000
    },
    "recommendation": "Margin laba Anda sehat di angka 28.8%. Pengeluaran terbesar ada pada listrik dan es batu."
  }
}
```

---

## 18. Analytics Requirements

Sistem analitis berjalan menggunakan agregasi query PostgreSQL dengan date-filtering fleksibel (Today, Yesterday, Last 7 Days, This Month, Custom Range). Jika terdapat rentang data yang kosong (misal bisnis tutup pada hari Selasa), sistem secara otomatis mengembalikan nilai 0 untuk omzet/profit pada grafik tanpa merusak visualisasi skala waktu.

---

## 19. Notifications and Alerts

| Tipe Alert | Kondisi Pemicu (Trigger Condition) | Saluran Notifikasi |
|---|---|---|
| Low Stock Alert | `current_stock ≤ min_stock_alert` pada bahan baku. | Banner Dashboard & In-App Toast Alert. |
| Margin Erosion Alert | HPP bahan baku naik hingga menekan Profit Margin produk di bawah 30%. | Notifikasi Dashboard Owner. |
| Daily Summary Digest | Pukul 22.00 malam setiap hari setelah jam operasional toko tutup. | Pesan Ringkasan WhatsApp / App Notification. |

---

## 20. Security & Privacy Requirements

- **Multi-Tenancy Isolation:** Setiap query SQL wajib menyertakan klausa `WHERE business_id = X` secara ketat di tingkat ORM/Middleware untuk mencegah kebocoran data antar UMKM.
- **Autentikasi & Otorisasi:** JSON Web Token (JWT) dengan masa kadaluarsa terstruktur, disertai RBAC (Role-Based Access Control) middleware.
- **Keamanan AI:** Prompt Injections Guardrail dipasang sebelum input query diproses oleh LLM. Data bisnis sensitif disanitasi sebelum dikirim ke endpoint AI.

---

## 21. Non-Functional Requirements

- **Performance:** Respon pencatatan transaksi POS < 500ms. Rendering dashboard utama < 1.2 detik.
- **Availability:** System Uptime SLA 99.9% (di-host pada cloud provider terpercaya dengan auto-restart).
- **Maintainability & Clean Code:** Dokumentasi Swagger/OpenAPI untuk seluruh REST API, serta unit testing coverage > 80% pada kalkulasi finansial/HPP.

---

## 22. Edge Cases & Handling

| Skenario Edge Case | Penanganan Sistem (System Handling) |
|---|---|
| Stok Bahan Baku 0 namun transaksi tetap dilakukan Kasir. | Sistem mencatat stok menjadi minus (Negative Stock) jika konfigurasi mengizinkan, dan memberikan tanda peringatan merah pada laporan audit stok. |
| Harga Beli Bahan Baku berubah drastis saat Stock In. | Sistem menggunakan formula Weighted Average Cost (WAC) baru, dan otomatis memperbarui kalkulasi COGS untuk transaksi yang terjadi *setelah* waktu input tersebut. |
| Produk dihapus padahal memiliki riwayat transaksi. | Soft Delete (`is_active = false`). Data transaksi historis tetap menyimpan `unit_price` dan `unit_cogs` snapshot sehingga laporan laba lalu tidak berubah. |
| Owner bertanya ke AI tentang data yang belum pernah di-input (misal: "Siapa pegawai terbaik?"). | AI merespon secara sopan: "Maaf, data kinerja/kehadiran pegawai belum dicatat dalam sistem. Anda dapat memanfaatkan fitur transaksi untuk melihat total input per kasir." |

---

## 23. Success Metrics

- **Daily Active Businesses (DAB):** Jumlah UMKM yang mencatat minimal 1 transaksi per hari.
- **Inventory Accuracy Rate:** Persentase kesesuaian antara stok di sistem dan fisik saat opname (> 90%).
- **AI Feature Engagement:** Persentase Pemilik Bisnis yang mengajukan minimal 3 pertanyaan AI per minggu.
- **Feature Adoption Rate:** Penggunaan fitur resep (BOM) & pencatatan beban operasional oleh pengguna.

---

## 24. MVP Acceptance Criteria

**Kriteria Penerimaan (Testable Gherkin Statements):**

**AC-01 (Kalkulasi Gross Profit):**
```
Given Produk "Es Kopi" memiliki harga jual Rp 18.000 dan resep dengan COGS Rp 6.000.
When Kasir menyelesaikan transaksi 10 porsi "Es Kopi".
Then Sistem mencatat Revenue Rp 180.000, COGS Rp 60.000, dan Gross Profit Rp 120.000
     pada dashboard.
```

**AC-02 (Grounding AI Assistant):**
```
Given Bisnis A belum mencatatkan data Pengeluaran Operasional.
When Owner bertanya "Berapa Net Profit saya bulan ini?"
Then AI menampilkan nilai Gross Profit dan secara jelas menyebutkan bahwa Net Profit
     belum sempurna karena data pengeluaran operasional belum dimasukkan.
```

---

## 25. Development Roadmap

| Fase / Phase | Fokus Modul & Deliverables | Estimasi Waktu |
|---|---|---|
| Phase 1: Foundation | Database Schema design, Multi-tenancy Setup, Auth, Product & Recipe Management. | Week 1 - Week 3 |
| Phase 2: Core Operations | POS Interface, Transaction engine, Auto-Deduct Inventory, Stock Adjustments. | Week 4 - Week 6 |
| Phase 3: Financials & Dashboard | Operational Expense module, Financial Engine (Revenue, COGS, Net Profit), Owner Dashboard. | Week 7 - Week 8 |
| Phase 4: AI Assistant Integration | Text-to-SQL Pipeline, Context RAG Engine, AI Chat UI, Guardrail & Privacy Testing. | Week 9 - Week 11 |
| Phase 5: Testing & Deployment | UAT dengan 5 Pilot UMKM Kuliner, Bug fixing, Performance tuning, Cloud deployment. | Week 12 |

---

## 26. Risks and Mitigation

| Potensi Risiko | Tingkat Dampak | Strategi Mitigasi |
|---|---|---|
| Kasir malas/lupa menginput transaksi tunai secara real-time. | Tinggi | Desain UX POS super cepat (< 3 ketukan), sediakan fitur "Quick Add Unregistered Product". |
| BOM/Resep terlalu rumit diisi oleh pemilik UMKM. | Sedang | Sediakan Preset Template Resep bawaan (misal: "Template Standar Coffee Shop"). |
| AI memberikan saran bisnis yang tidak realistis (Hallucination). | Tinggi | Batasi AI hanya membaca data agregat SQL terverifikasi; larang generasi opini bebas tanpa basis data. |

---

## 27. Open Decisions & Trade-Offs

1. **Offline POS Mode:** Apakah MVP harus langsung mendukung Full Offline-First PWA? *(Keputusan MVP: Online-first dengan local storage caching sederhana untuk mencegah over-engineering di awal.)*
2. **Integrasi Hardware Printer Struk:** Mendukung Bluetooth Thermal Printer Android via Web Bluetooth API vs cetak browser standar. *(Keputusan MVP: Web Bluetooth API standar untuk thermal printer 58mm/80mm.)*

### Ringkasan Fitur MVP vs Postponed (MVP Summary)

| Wajib Dibangun Pertama (MVP) | Ditunda ke Versi Berikutnya (Postponed / V2 / Future) |
|---|---|
| POS / Pencatatan Kasir: Input pesanan, metode bayar (Tunai & QRIS Statis), potong stok otomatis. | Multi-branch / Banyak Cabang (Ditunda V2) |
| Manajemen Produk & Resep (BOM): Penentuan HPP/COGS berbasis komponen bahan baku. | Purchase Order (PO) & Supplier WhatsApp Bot (Ditunda V2) |
| Kontrol Stok & Bahan Baku: Stock In, Stock Adjustment, Low Stock Alerting. | Program CRM & Points Loyalty Pelanggan (Ditunda V2) |
| Biaya Operasional: Pencatatan beban non-bahan baku (Sewa, Gaji, Listrik). | Dynamic QRIS Payment Gateway API (Ditunda V2) |
| Dashboard Laba-Rugi Owner: Visualisasi Omzet, HPP, Gross Profit, Net Profit, Menu Terlaris. | Predictive Demand Forecasting AI / Machine Learning (Ditunda Future) |
| AI Business Assistant V1: Tanya-jawab berbasis data SQL lokal (Fakta & Rekomendasi terpisah secara rinci). | Integrasi Pembayaran Gaji / Payroll Karyawan Kompleks (Ditunda Future) |