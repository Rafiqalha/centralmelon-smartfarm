# PRD — Central Melon: Sistem Informasi Platform Rantai Pasok Melon Premium

> **Product Requirements Document v1.0**
> Mata Kuliah: Praktikum Database — UAS Genap T.A 2025/2026
> Dosen: Khadijah Fahmi Hayati Holle, M.Kom
> Program Studi: Teknik Informatika — UIN Maulana Malik Ibrahim Malang

---

## Identitas Project

| Field | Detail |
|---|---|
| Nama Project | Central Melon |
| Subtitle | Sistem Informasi Platform Rantai Pasok Melon Premium |
| Kelas | F |
| Anggota 1 | Rafiq Alhariri Andriansyah — 240605110178 |
| Anggota 2 | Toni Abiyu Daffa — 240506110163 |
| Anggota 3 | Muhammad Aditya Dermawan — 240605110172 |
| Stack Teknologi | Laravel 12, MySQL, Blade + Tailwind CSS |
| Jenis Aplikasi | Aplikasi Web |
| Tahun Akademik | 2025/2026 |

---

## 1. Latar Belakang

Sektor pertanian melon premium di Indonesia menghadapi sejumlah tantangan struktural: ketidakstabilan harga, minimnya transparansi rantai pasok, dan keterbatasan akses ke pembeli B2B berkualitas. Perkebunan melon di Kabupaten Blitar, Jawa Timur, khususnya yang menarget segmen supermarket, hotel, dan restoran, membutuhkan sistem informasi terintegrasi untuk mengelola seluruh alur bisnis dari produksi hingga kontrak suplai.

Project UAS ini merupakan **implementasi langsung dari proposal UTS** yang telah disetujui, mewujudkan rancangan database menjadi aplikasi web fungsional berbasis **Laravel 12 + MySQL**. Sistem ini mencakup manajemen produk melon, alur Request for Quotation (RFQ) dari buyer B2B, manajemen kontrak suplai, proyeksi panen, dan monitoring data sensor IoT greenhouse.

---

## 2. Tujuan Project

### 2.1 Tujuan Umum
Mengimplementasikan rancangan database sistem Central Melon (dari proposal UTS) menjadi aplikasi web yang berjalan penuh, terintegrasi antara program Laravel dan database MySQL.

### 2.2 Tujuan Fungsional (sesuai spesifikasi UAS)
- Membangun database relasional dengan ≥3 tabel utama beserta relasi FK
- Mengimplementasikan operasi CRUD pada minimal 2 entitas utama
- Mengintegrasikan program Laravel dengan database MySQL secara nyata
- Mengimplementasikan query relasional (JOIN, pencarian, agregasi)
- Menyediakan validasi input dasar di sisi server (Laravel FormRequest)
- Menyajikan tampilan yang rapi dan dapat didemonstrasikan

---

## 3. Ruang Lingkup

### 3.1 Dalam Scope (UAS)
| No | Fitur | Aktor |
|---|---|---|
| 1 | Auth: Login & Register (Admin & Supplier) | Admin, Supplier |
| 2 | Manajemen Produk (CRUD lengkap) | Admin |
| 3 | Manajemen RFQ — pengajuan & respons (CRUD) | Admin, Supplier |
| 4 | Manajemen Kontrak Suplai (CRUD) | Admin |
| 5 | Proyeksi Panen — input & monitoring (CRUD) | Admin |
| 6 | Data Sensor IoT — input & tampil historis (CR) | Admin |
| 7 | Pesan Kontak dari publik (CR) | Pengunjung, Admin |
| 8 | Dashboard Admin — statistik & agregasi | Admin |
| 9 | Query JOIN: RFQ + User + Product | Admin |
| 10 | Query Pencarian/Filter produk & RFQ | Semua |
| 11 | Query Agregasi: total kontrak, rata-rata panen | Admin |

### 3.2 Di Luar Scope
- Payment gateway / pembayaran online
- Integrasi hardware IoT langsung (Arduino/sensor fisik)
- Logistics tracking pengiriman
- Sistem pelaporan keuangan dan akuntansi

---

## 4. Aktor Sistem

| Aktor | Deskripsi | Hak Akses |
|---|---|---|
| **Admin** | Pengelola farm Central Melon | Full access ke semua modul |
| **Supplier/Buyer** | Mitra bisnis terdaftar | Lihat katalog, ajukan RFQ, lihat kontrak sendiri |
| **Pengunjung Publik** | Calon mitra belum terdaftar | Lihat katalog, kirim pesan kontak |

---

## 5. Arsitektur Teknologi

```
┌─────────────────────────────────────────────────┐
│                   CLIENT LAYER                   │
│         Browser (Blade + Tailwind CSS)           │
└────────────────────┬────────────────────────────┘
                     │ HTTP Request
┌────────────────────▼────────────────────────────┐
│               APPLICATION LAYER                  │
│              Laravel 12 (PHP 8.3)                │
│  Routes → Middleware → Controller → Model        │
│  FormRequest Validation | Eloquent ORM           │
└────────────────────┬────────────────────────────┘
                     │ PDO / Eloquent
┌────────────────────▼────────────────────────────┐
│                DATABASE LAYER                    │
│                 MySQL 8.x                        │
│   7 Tabel Relasional + Foreign Key Constraints   │
└─────────────────────────────────────────────────┘
```

**Stack Detail:**
- PHP 8.3 + Laravel 12
- MySQL 8.x
- Blade Templating Engine
- Tailwind CSS (via CDN atau Vite)
- Laravel Breeze (Auth scaffolding)
- Eloquent ORM (query builder + relasi)

---

## 6. Skema Database

### 6.1 Daftar Tabel

| No | Nama Tabel | Entitas | Relasi |
|---|---|---|---|
| 1 | `users` | Pengguna sistem | — |
| 2 | `products` | Varietas melon | — |
| 3 | `rfq_requests` | Permintaan penawaran harga | FK → users, products |
| 4 | `contracts` | Kontrak suplai B2B | FK → users, products |
| 5 | `harvest_forecasts` | Proyeksi panen | FK → products |
| 6 | `sensor_readings` | Data IoT greenhouse | Standalone |
| 7 | `contact_messages` | Pesan kontak publik | Standalone |

### 6.2 DDL SQL — Skema Lengkap

```sql
-- ============================================================
-- DATABASE: central_melon
-- DBMS: MySQL 8.x
-- Project: UAS Praktikum Database 2025/2026
-- ============================================================

CREATE DATABASE IF NOT EXISTS central_melon
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE central_melon;

-- ------------------------------------------------------------
-- Tabel 1: users
-- ------------------------------------------------------------
CREATE TABLE users (
    id        CHAR(36)     NOT NULL DEFAULT (UUID()),
    name      VARCHAR(100) NOT NULL,
    email     VARCHAR(150) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    role      ENUM('admin','supplier') NOT NULL DEFAULT 'supplier',
    phone     VARCHAR(20)  NULL,
    company_name VARCHAR(150) NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabel 2: products
-- ------------------------------------------------------------
CREATE TABLE products (
    id                   INT          NOT NULL AUTO_INCREMENT,
    name                 VARCHAR(150) NOT NULL,
    variety_type         VARCHAR(100) NOT NULL,
    grade                ENUM('AA','A','B') NOT NULL,
    price_per_ton        DECIMAL(12,2) NOT NULL,
    avg_brix_min         INT          NOT NULL,
    avg_brix_max         INT          NOT NULL,
    moq_kg               INT          NOT NULL,
    supply_cap_ton_week  DECIMAL(6,2) NOT NULL,
    lead_time_days       INT          NOT NULL,
    status               ENUM('available','limited','out') NOT NULL DEFAULT 'available',
    image_url            TEXT         NULL,
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabel 3: rfq_requests
-- ------------------------------------------------------------
CREATE TABLE rfq_requests (
    id               INT          NOT NULL AUTO_INCREMENT,
    user_id          CHAR(36)     NOT NULL,
    product_id       INT          NOT NULL,
    quantity_ton     DECIMAL(8,2) NOT NULL,
    grade_requested  VARCHAR(10)  NOT NULL,
    notes            TEXT         NULL,
    status           ENUM('pending','quoted','accepted','rejected') NOT NULL DEFAULT 'pending',
    created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    responded_at     TIMESTAMP    NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_rfq_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_rfq_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabel 4: contracts
-- ------------------------------------------------------------
CREATE TABLE contracts (
    id                    INT           NOT NULL AUTO_INCREMENT,
    user_id               CHAR(36)      NOT NULL,
    product_id            INT           NOT NULL,
    volume_ton_month      DECIMAL(8,2)  NOT NULL,
    price_per_ton_locked  DECIMAL(12,2) NOT NULL,
    start_date            DATE          NOT NULL,
    end_date              DATE          NOT NULL,
    packaging             ENUM('standard','custom') NOT NULL DEFAULT 'standard',
    custom_label_info     TEXT          NULL,
    status                ENUM('active','expired','terminated') NOT NULL DEFAULT 'active',
    signed_at             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at            TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_contract_user    FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_contract_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabel 5: harvest_forecasts
-- ------------------------------------------------------------
CREATE TABLE harvest_forecasts (
    id            INT          NOT NULL AUTO_INCREMENT,
    product_id    INT          NOT NULL,
    period_label  VARCHAR(50)  NOT NULL,
    forecast_ton  DECIMAL(8,2) NOT NULL,
    actual_ton    DECIMAL(8,2) NULL,
    accuracy_pct  FLOAT        NULL,
    forecast_date DATE         NOT NULL,
    harvest_date  DATE         NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_forecast_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabel 6: sensor_readings (standalone)
-- ------------------------------------------------------------
CREATE TABLE sensor_readings (
    id                 BIGINT  NOT NULL AUTO_INCREMENT,
    greenhouse_zone    VARCHAR(50) NOT NULL,
    temperature_c      FLOAT   NOT NULL,
    humidity_pct       FLOAT   NOT NULL,
    soil_moisture_pct  FLOAT   NOT NULL,
    light_intensity_lux FLOAT  NOT NULL,
    ec_ms              FLOAT   NOT NULL,
    ph                 FLOAT   NOT NULL,
    recorded_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- Tabel 7: contact_messages (standalone)
-- ------------------------------------------------------------
CREATE TABLE contact_messages (
    id         INT          NOT NULL AUTO_INCREMENT,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL,
    phone      VARCHAR(20)  NULL,
    message    TEXT         NOT NULL,
    status     ENUM('new','read','replied') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE=InnoDB;
```

### 6.3 Relasi Antar Tabel (ERD Crow's Foot)

```
USERS (PK: id UUID)
  │
  ├──< RFQ_REQUESTS (FK: user_id) >── PRODUCTS (PK: id INT)
  │                                         │
  ├──< CONTRACTS    (FK: user_id) >─────────┤
  │                                         │
  │                             ├──< HARVEST_FORECASTS (FK: product_id)
  │
  SENSOR_READINGS    (standalone, no FK)
  CONTACT_MESSAGES   (standalone, no FK)
```

| Relasi | Kardinalitas | Keterangan |
|---|---|---|
| USERS → RFQ_REQUESTS | 1 : N | 1 user bisa ajukan banyak RFQ |
| USERS → CONTRACTS | 1 : N | 1 user bisa punya banyak kontrak |
| PRODUCTS → RFQ_REQUESTS | 1 : N | 1 produk bisa masuk banyak RFQ |
| PRODUCTS → CONTRACTS | 1 : N | 1 produk bisa ada di banyak kontrak |
| PRODUCTS → HARVEST_FORECASTS | 1 : N | 1 produk punya banyak data proyeksi |

---

## 7. Struktur Aplikasi Laravel

### 7.1 Struktur Direktori

```
central-melon/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/              ← LoginController, RegisterController
│   │   │   ├── ProductController.php
│   │   │   ├── RfqController.php
│   │   │   ├── ContractController.php
│   │   │   ├── HarvestForecastController.php
│   │   │   ├── SensorReadingController.php
│   │   │   ├── ContactMessageController.php
│   │   │   └── DashboardController.php
│   │   ├── Requests/
│   │   │   ├── StoreProductRequest.php
│   │   │   ├── StoreRfqRequest.php
│   │   │   ├── StoreContractRequest.php
│   │   │   └── StoreContactMessageRequest.php
│   │   └── Middleware/
│   │       └── AdminOnly.php
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── RfqRequest.php
│       ├── Contract.php
│       ├── HarvestForecast.php
│       ├── SensorReading.php
│       └── ContactMessage.php
├── database/
│   ├── migrations/
│   │   ├── 2025_01_01_000001_create_users_table.php
│   │   ├── 2025_01_01_000002_create_products_table.php
│   │   ├── 2025_01_01_000003_create_rfq_requests_table.php
│   │   ├── 2025_01_01_000004_create_contracts_table.php
│   │   ├── 2025_01_01_000005_create_harvest_forecasts_table.php
│   │   ├── 2025_01_01_000006_create_sensor_readings_table.php
│   │   └── 2025_01_01_000007_create_contact_messages_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── UserSeeder.php
│       ├── ProductSeeder.php
│       ├── RfqSeeder.php
│       └── SensorSeeder.php
├── resources/views/
│   ├── layouts/
│   │   ├── app.blade.php          ← Layout utama (Tailwind)
│   │   └── guest.blade.php        ← Layout publik
│   ├── auth/
│   │   ├── login.blade.php
│   │   └── register.blade.php
│   ├── dashboard/
│   │   └── index.blade.php        ← Statistik & agregasi
│   ├── products/
│   │   ├── index.blade.php        ← List + search + filter
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── show.blade.php
│   ├── rfq/
│   │   ├── index.blade.php        ← JOIN users + products
│   │   ├── create.blade.php
│   │   ├── edit.blade.php
│   │   └── show.blade.php
│   ├── contracts/
│   │   ├── index.blade.php
│   │   ├── create.blade.php
│   │   └── edit.blade.php
│   ├── harvest/
│   │   ├── index.blade.php
│   │   ├── create.blade.php
│   │   └── edit.blade.php
│   ├── sensors/
│   │   ├── index.blade.php
│   │   └── create.blade.php
│   └── contact/
│       ├── index.blade.php
│       └── create.blade.php
└── routes/
    └── web.php
```

### 7.2 Routing (routes/web.php)

```php
// Public routes
Route::get('/', [ProductController::class, 'publicIndex'])->name('home');
Route::get('/contact', [ContactMessageController::class, 'create'])->name('contact.create');
Route::post('/contact', [ContactMessageController::class, 'store'])->name('contact.store');

// Auth routes (Laravel Breeze)
Route::middleware('guest')->group(function () {
    Route::get('/login',    [AuthController::class, 'loginForm'])->name('login');
    Route::post('/login',   [AuthController::class, 'login']);
    Route::get('/register', [AuthController::class, 'registerForm'])->name('register');
    Route::post('/register',[AuthController::class, 'register']);
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

// Authenticated routes
Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products (Admin only: CUD | Supplier: R)
    Route::resource('products', ProductController::class);

    // RFQ (Supplier: create | Admin: update status)
    Route::resource('rfq', RfqController::class);
    Route::patch('/rfq/{rfq}/respond', [RfqController::class, 'respond'])->name('rfq.respond');

    // Contracts (Admin only)
    Route::middleware('admin')->group(function () {
        Route::resource('contracts', ContractController::class);
        Route::resource('harvest',   HarvestForecastController::class);
        Route::resource('sensors',   SensorReadingController::class)->only(['index','create','store']);
        Route::resource('contact',   ContactMessageController::class)->only(['index','show','update']);
    });
});
```

---

## 8. Fitur & Spesifikasi Fungsional

### 8.1 Modul Auth

| Sub-fitur | Detail |
|---|---|
| Register | Nama, email, password, role (supplier/admin), phone, company name |
| Login | Email + password, redirect berdasarkan role |
| Middleware | `AdminOnly` untuk halaman admin, `auth` untuk halaman terautentikasi |
| Validasi | Email unik, password min 8 karakter, field wajib tidak kosong |

### 8.2 Modul Products (CRUD #1 — Entitas Utama)

| Operasi | Method | URL | Query |
|---|---|---|---|
| Create | POST | `/products` | `INSERT INTO products ...` |
| Read (list) | GET | `/products` | `SELECT * FROM products WHERE name LIKE ?` |
| Read (detail) | GET | `/products/{id}` | `SELECT ... WHERE id = ?` |
| Update | PUT | `/products/{id}` | `UPDATE products SET ... WHERE id = ?` |
| Delete | DELETE | `/products/{id}` | `DELETE FROM products WHERE id = ?` |

**Fitur tambahan:**
- Filter by grade (AA/A/B)
- Filter by status (available/limited/out)
- Search by name
- Menampilkan jumlah RFQ per produk (query COUNT + JOIN)

**Validasi (StoreProductRequest):**
```php
'name'                => 'required|string|max:150',
'variety_type'        => 'required|string|max:100',
'grade'               => 'required|in:AA,A,B',
'price_per_ton'       => 'required|numeric|min:0',
'avg_brix_min'        => 'required|integer|min:0',
'avg_brix_max'        => 'required|integer|gte:avg_brix_min',
'moq_kg'              => 'required|integer|min:1',
'supply_cap_ton_week' => 'required|numeric|min:0',
'lead_time_days'      => 'required|integer|min:1',
'status'              => 'required|in:available,limited,out',
```

### 8.3 Modul RFQ (CRUD #2 — Entitas Utama + JOIN)

| Operasi | Method | URL | Query |
|---|---|---|---|
| Create (supplier) | POST | `/rfq` | `INSERT INTO rfq_requests ...` |
| Read (list) | GET | `/rfq` | JOIN query (lihat 8.3.1) |
| Update status | PATCH | `/rfq/{id}/respond` | `UPDATE rfq_requests SET status=? WHERE id=?` |
| Delete | DELETE | `/rfq/{id}` | `DELETE FROM rfq_requests WHERE id=?` |

**8.3.1 Query JOIN Utama (memenuhi syarat UAS):**
```sql
SELECT
    rfq_requests.id,
    rfq_requests.quantity_ton,
    rfq_requests.grade_requested,
    rfq_requests.status,
    rfq_requests.created_at,
    users.name        AS buyer_name,
    users.company_name AS buyer_company,
    products.name     AS product_name,
    products.grade    AS product_grade
FROM rfq_requests
JOIN users    ON rfq_requests.user_id    = users.id
JOIN products ON rfq_requests.product_id = products.id
WHERE rfq_requests.status LIKE ?    -- filter/pencarian
ORDER BY rfq_requests.created_at DESC;
```

**Validasi (StoreRfqRequest):**
```php
'product_id'     => 'required|exists:products,id',
'quantity_ton'   => 'required|numeric|min:0.1',
'grade_requested'=> 'required|in:AA,A,B',
'notes'          => 'nullable|string|max:1000',
```

### 8.4 Modul Contracts (CRUD #3)

| Operasi | Detail |
|---|---|
| Create | Admin membuat kontrak setelah RFQ accepted |
| Read | List kontrak + JOIN nama buyer + nama produk |
| Update | Ubah status (active/expired/terminated) |
| Delete | Hapus kontrak |

**Query JOIN Kontrak:**
```sql
SELECT contracts.*, users.name AS buyer_name,
       users.company_name, products.name AS product_name
FROM contracts
JOIN users    ON contracts.user_id    = users.id
JOIN products ON contracts.product_id = products.id
ORDER BY contracts.signed_at DESC;
```

### 8.5 Modul Harvest Forecasts (CRUD #4)

| Operasi | Detail |
|---|---|
| Create | Admin input proyeksi panen per varietas per periode |
| Read | List forecast + nama produk (JOIN products) |
| Update | Isi `actual_ton` setelah panen, hitung `accuracy_pct` otomatis |
| Delete | Hapus data proyeksi |

**Query Agregasi (memenuhi syarat UAS):**
```sql
-- Total proyeksi panen per produk
SELECT products.name, SUM(harvest_forecasts.forecast_ton) AS total_forecast,
       AVG(harvest_forecasts.accuracy_pct) AS avg_accuracy
FROM harvest_forecasts
JOIN products ON harvest_forecasts.product_id = products.id
GROUP BY products.id, products.name
ORDER BY total_forecast DESC;
```

**Auto-hitung accuracy_pct di Controller:**
```php
if ($request->actual_ton && $forecast->forecast_ton > 0) {
    $accuracy = (1 - abs($request->actual_ton - $forecast->forecast_ton)
                 / $forecast->forecast_ton) * 100;
    $data['accuracy_pct'] = max(0, round($accuracy, 2));
}
```

### 8.6 Modul Sensor Readings (CR — IoT Historis)

- Input data sensor manual (simulasi IoT) per zona greenhouse
- Tampil tabel historis dengan filter by `greenhouse_zone`
- Query filter + ORDER BY `recorded_at DESC`

### 8.7 Modul Contact Messages (CR — Publik)

- Form publik: name, email, phone, message (tanpa login)
- Admin dapat melihat list pesan + update status (new/read/replied)

### 8.8 Dashboard Admin (Agregasi & Statistik)

Memenuhi syarat **query agregasi** dari soal UAS:

```sql
-- Statistik utama
SELECT
  (SELECT COUNT(*) FROM products WHERE status='available') AS total_available_products,
  (SELECT COUNT(*) FROM rfq_requests WHERE status='pending') AS pending_rfq,
  (SELECT COUNT(*) FROM contracts WHERE status='active') AS active_contracts,
  (SELECT COUNT(*) FROM contact_messages WHERE status='new') AS new_messages;

-- Total volume kontrak per produk
SELECT products.name, SUM(contracts.volume_ton_month) AS total_volume,
       COUNT(contracts.id) AS contract_count
FROM contracts
JOIN products ON contracts.product_id = products.id
GROUP BY products.id
ORDER BY total_volume DESC;

-- Rata-rata sensor readings hari ini
SELECT greenhouse_zone,
       AVG(temperature_c) AS avg_temp,
       AVG(humidity_pct) AS avg_humidity,
       AVG(ph) AS avg_ph
FROM sensor_readings
WHERE DATE(recorded_at) = CURDATE()
GROUP BY greenhouse_zone;
```

---

## 9. Eloquent Model & Relasi

### User.php
```php
class User extends Authenticatable {
    protected $keyType = 'string';
    public $incrementing = false;

    public function rfqRequests() { return $this->hasMany(RfqRequest::class); }
    public function contracts()   { return $this->hasMany(Contract::class); }
}
```

### Product.php
```php
class Product extends Model {
    public function rfqRequests()      { return $this->hasMany(RfqRequest::class); }
    public function contracts()        { return $this->hasMany(Contract::class); }
    public function harvestForecasts() { return $this->hasMany(HarvestForecast::class); }
}
```

### RfqRequest.php
```php
class RfqRequest extends Model {
    public function user()    { return $this->belongsTo(User::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
```

### Contract.php
```php
class Contract extends Model {
    public function user()    { return $this->belongsTo(User::class); }
    public function product() { return $this->belongsTo(Product::class); }
}
```

### HarvestForecast.php
```php
class HarvestForecast extends Model {
    public function product() { return $this->belongsTo(Product::class); }
}
```

---

## 10. Data Awal (Seeder)

### users
| id | name | email | role | company |
|---|---|---|---|---|
| uuid-001 | Admin Central Melon | admin@centralmelon.com | admin | Central Melon |
| uuid-002 | Budi Santoso | budi@segarjaya.co.id | supplier | PT Segar Jaya |
| uuid-003 | Siti Rahma | procurement@bumihot.com | supplier | Hotel Bumi Surabaya |

### products
| id | name | grade | price_per_ton | status |
|---|---|---|---|---|
| 1 | Golden Apollo Premium | AA | 13.500.000 | available |
| 2 | Inthanon Royal Net | A | 15.000.000 | limited |
| 3 | Sweet Net Classic | A | 10.000.000 | available |
| 4 | Honey Globe B-Grade | B | 7.500.000 | available |

### rfq_requests (contoh)
| id | user | product | quantity | status |
|---|---|---|---|---|
| 1 | uuid-002 | 1 | 5.00 ton | quoted |
| 2 | uuid-003 | 2 | 2.50 ton | accepted |
| 3 | uuid-002 | 3 | 10.00 ton | pending |

---

## 11. Validasi yang Diimplementasikan

| Modul | Field | Aturan Validasi |
|---|---|---|
| Products | name | required, max:150 |
| Products | price_per_ton | required, numeric, min:0 |
| Products | avg_brix_max | required, gte:avg_brix_min |
| Products | grade | required, in:AA,A,B |
| RFQ | product_id | required, exists:products,id |
| RFQ | quantity_ton | required, numeric, min:0.1 |
| Contracts | end_date | required, after:start_date |
| Contracts | user_id | required, exists:users,id |
| Contact | email | required, email |
| Contact | message | required, min:10 |
| Auth | email | required, email, unique:users (register) |
| Auth | password | required, min:8, confirmed |

---

## 12. Komponen Pengumpulan UAS

Sesuai ketentuan soal UAS, project dikumpulkan dalam bentuk link Google Drive berisi:

| No | Komponen | Deskripsi | Status |
|---|---|---|---|
| 1 | Source Code | Seluruh direktori Laravel project | Wajib |
| 2 | File Database | `central_melon.sql` (dump lengkap + data awal) | Wajib |
| 3 | Laporan UAS PDF | Sesuai sistematika F di soal UAS | Wajib |
| 4 | Video Demo | ≤5 menit, tampilkan CRUD + query + koneksi DB | Wajib |
| 5 | README.md | Cara menjalankan project (setup env, migrate, seed) | Wajib |

### README.md (template)
```markdown
# Central Melon — Setup Guide

## Requirements
- PHP 8.3+, Composer, MySQL 8.x, Node.js 20+

## Installation
1. `git clone / extract project`
2. `cp .env.example .env` → isi DB_DATABASE=central_melon, DB_USERNAME, DB_PASSWORD
3. `composer install`
4. `php artisan key:generate`
5. `php artisan migrate`
6. `php artisan db:seed`
7. `npm install && npm run build`
8. `php artisan serve`
9. Buka http://localhost:8000

## Default Login
- Admin: admin@centralmelon.com / password123
- Supplier: budi@segarjaya.co.id / password123
```

---

## 13. Pemetaan Penilaian UAS

| Aspek Penilaian (Soal UAS) | Bobot | Dipenuhi Oleh |
|---|---|---|
| Kesesuaian implementasi dengan proposal UTS | 10% | 7 tabel sesuai proposal UTS, fitur sama |
| Kualitas rancangan dan implementasi database | 20% | FK constraints, normalisasi, indeks |
| Keberhasilan koneksi program dengan database | 15% | Eloquent ORM + env config + migration |
| Implementasi fitur CRUD | 20% | CRUD pada Products, RFQ, Contracts, Forecasts |
| Query relasional dan logika program | 10% | JOIN 3 tabel, filter/search, agregasi COUNT/SUM/AVG |
| Fungsionalitas aplikasi keseluruhan | 10% | Semua alur berjalan: RFQ → Kontrak → Dashboard |
| Laporan dan dokumentasi | 10% | Laporan sesuai sistematika F soal UAS |
| Presentasi/demo dan penguasaan project | 5% | Setiap anggota menguasai query & alur sistem |
| **Total** | **100%** | |

---

## 14. Rencana Implementasi

| Fase | Task | Prioritas |
|---|---|---|
| 1 | Setup Laravel 12, install Breeze, konfigurasi .env MySQL | KRITIKAL |
| 2 | Buat semua migrations + `php artisan migrate` | KRITIKAL |
| 3 | Buat Seeders (users + products + rfq sample) | KRITIKAL |
| 4 | Buat Models + relasi Eloquent | KRITIKAL |
| 5 | CRUD Products (Controller + Request + Views) | KRITIKAL |
| 6 | CRUD RFQ dengan query JOIN | KRITIKAL |
| 7 | CRUD Contracts | TINGGI |
| 8 | CRUD Harvest Forecasts + auto-accuracy | TINGGI |
| 9 | Dashboard + query agregasi | TINGGI |
| 10 | Sensor Readings + Contact Messages | SEDANG |
| 11 | Middleware AdminOnly + role-based access | SEDANG |
| 12 | Styling Tailwind CSS (rapi, fungsional) | SEDANG |
| 13 | Export SQL dump + tulis laporan UAS | KRITIKAL |
| 14 | Rekam video demo | KRITIKAL |

---

*PRD ini menjadi acuan tunggal pengerjaan UAS Praktikum Database 2025/2026.*
*Disusun oleh: Rafiq Alhariri Andriansyah, Toni Abiyu Daffa, Muhammad Aditya Dermawan*
*UIN Maulana Malik Ibrahim Malang — Teknik Informatika Kelas F*
