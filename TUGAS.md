# Tugas dan Laporan

## Tugas

Berdasarkan implementasi project database yang telah dibuat, lengkapi dokumentasi sistem dengan komponen berikut:

### 1. Diagram Class
Buatlah **Class Diagram (UML)** yang merepresentasikan struktur kode program.

Diagram harus mencakup:

- Nama class
- Atribut (field)
- Method (fungsi)
- Relasi antar class
  - Association
  - Aggregation
  - Composition
  - Inheritance (jika ada)

---

### 2. Pseudocode Method
Buatlah **pseudocode** untuk setiap method yang terdapat pada diagram class.

Pseudocode harus menjelaskan:

- Input
- Proses
- Output
- Alur logika program

Contoh:

```text
METHOD tambahData()

INPUT data pengguna

VALIDASI data

IF data valid THEN
    SIMPAN ke database
    TAMPILKAN "Data berhasil disimpan"
ELSE
    TAMPILKAN pesan error
END IF

END METHOD
```

---

### 3. Query SQL Laporan
Buatlah query SQL untuk setiap laporan yang teridentifikasi pada sistem.

Contoh laporan yang dapat dibuat:

- Laporan seluruh data
- Laporan berdasarkan filter tertentu
- Laporan hasil pencarian
- Laporan agregasi (COUNT, SUM, AVG)
- Laporan relasional menggunakan JOIN

Contoh:

```sql
SELECT p.nama_pelanggan,
       t.tanggal_transaksi,
       t.total_bayar
FROM transaksi t
JOIN pelanggan p
    ON t.id_pelanggan = p.id_pelanggan
ORDER BY t.tanggal_transaksi DESC;
```

---

## Output yang Dikumpulkan

1. Diagram Class (UML)
2. Pseudocode seluruh method
3. Query SQL untuk seluruh laporan yang tersedia pada sistem

## Tujuan

Dokumentasi ini bertujuan untuk:

- Merepresentasikan struktur program secara visual.
- Menjelaskan logika setiap fungsi dalam sistem.
- Menunjukkan implementasi query database yang digunakan untuk menghasilkan laporan.
- Membantu proses evaluasi dan pengembangan sistem di masa mendatang.