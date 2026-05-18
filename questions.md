# Soal Test Kandidat Programmer

---

## Referensi Tabel: `table_kpi_marketing`

### Bobot KPI Marketing

| id | tasklist | kpi | karyawan | deadline | aktual |
|----|----------|-----|----------|----------|--------|
| 1 | Tasklist 1 | Sales | Budi | 2022-01-10 | 2022-01-09 |
| 2 | Tasklist 2 | Sales | Budi | 2022-01-10 | 2022-01-08 |
| 3 | Tasklist 3 | Report | Budi | 2022-01-10 | 2022-01-07 |
| 4 | Tasklist 4 | Report | Budi | 2022-01-10 | 2022-01-12 |
| 5 | Tasklist 5 | Sales | Adi | 2022-01-10 | 2022-01-09 |
| 6 | Tasklist 6 | Sales | Adi | 2022-01-10 | 2022-01-12 |
| 7 | Tasklist 7 | Report | Adi | 2022-01-10 | 2022-01-07 |
| 8 | Tasklist 8 | Report | Adi | 2022-01-10 | 2022-01-07 |
| 9 | Tasklist 9 | Sales | Rara | 2022-01-10 | 2022-01-12 |
| 10 | Tasklist 10 | Sales | Rara | 2022-01-10 | 2022-01-09 |
| 11 | Tasklist 11 | Report | Rara | 2022-01-10 | 2022-01-12 |
| 12 | Tasklist 12 | Report | Doni | 2022-01-10 | 2022-01-09 |
| 13 | Tasklist 13 | Sales | Doni | 2022-01-10 | 2022-01-12 |

---

## DDL & Data

```sql
CREATE TABLE `table_kpi_marketing` (
  `id` int(11) NOT NULL,
  `tasklist` varchar(100) DEFAULT NULL,
  `kpi` varchar(100) DEFAULT NULL,
  `karyawan` varchar(100) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `aktual` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `table_kpi_marketing` (`id`, `tasklist`, `kpi`, `karyawan`, `deadline`, `aktual`) VALUES
(1,  'Tasklist 1',  'Sales',  'Budi', '2022-01-10', '2022-01-09'),
(2,  'Tasklist 2',  'Sales',  'Budi', '2022-01-10', '2022-01-08'),
(3,  'Tasklist 3',  'Report', 'Budi', '2022-01-10', '2022-01-07'),
(4,  'Tasklist 4',  'Report', 'Budi', '2022-01-10', '2022-01-12'),
(5,  'Tasklist 5',  'Sales',  'Adi',  '2022-01-10', '2022-01-09'),
(6,  'Tasklist 6',  'Sales',  'Adi',  '2022-01-10', '2022-01-12'),
(7,  'Tasklist 7',  'Report', 'Adi',  '2022-01-10', '2022-01-07'),
(8,  'Tasklist 8',  'Report', 'Adi',  '2022-01-10', '2022-01-07'),
(9,  'Tasklist 9',  'Sales',  'Rara', '2022-01-10', '2022-01-12'),
(10, 'Tasklist 10', 'Sales',  'Rara', '2022-01-10', '2022-01-09'),
(11, 'Tasklist 11', 'Report', 'Rara', '2022-01-10', '2022-01-12'),
(12, 'Tasklist 12', 'Report', 'Doni', '2022-01-10', '2022-01-09'),
(13, 'Tasklist 13', 'Sales',  'Doni', '2022-01-10', '2022-01-12');
```

---

## Ketentuan Leadtime

- Jika `aktual > deadline` → **Late**
- Jika `aktual <= deadline` → **Ontime**

---

## Contoh Perhitungan KPI

| Karyawan | KPI | Aktual | Achive | Late | Bobot | Skor KPI |
|----------|-----|--------|--------|------|-------|----------|
| Contoh | Sales | 2 | 100% | -7% | 50% | 63% |
| | Report | 1 | 50% | -5% | 25% | 83% |
| | **Jumlah** | | | **-12%** | **75%** | |

---

## Story / Latar Belakang

- Management **Trusmi Group** ingin mengetahui Key Performance Indicator (KPI) dari tiap karyawan divisi Marketing.
- KPI dari divisi marketing adalah **Sales** dan **Report** dengan bobot masing-masing **50%**, dikurangi jumlah bobot late (jika ada).
- Selain pencapaian KPI, management juga ingin mengetahui **% ketepatan aktual deadline** dari target yang sudah ditentukan berdasarkan `deadline` vs `aktual`.
- Data KPI bisa didapat dari `table_kpi_marketing`.

---

## Output yang Diharapkan (Soal 1)

| Nama | Sales Target | Sales Actual | Sales Pencapaian | Bobot Sales | Late Sales | Total Bobot | Report Target | Report Actual | Report Pencapaian | Actual Bobot | Late Report | Total Bobot | KPI |
|------|-------------|-------------|-----------------|-------------|-----------|-------------|--------------|--------------|------------------|-------------|------------|-------------|-----|
| Budi | 2 | 2 | 100% | 50% | ? | ? | 2 | 2 | 100% | 50% | ? | ? | ? |
| Adi | ... | | | | | | | | | | | | |

---

## Soal

**1.** Buatlah Query (MySQL / PostgreSQL) perhitungan dari `table_kpi_marketing` berdasarkan rule dan story di atas dengan output data seperti pada tabel di atas.

**2.** Buatlah Query (MySQL / PostgreSQL) untuk menghitung jumlah tasklist **ontime** dan **late**, sertakan persentase ontime dan late-nya.

**3.** Buatkan tampilan **dashboard berupa grafik** dari hasil soal nomor 1.

**4.** Buatkan tampilan **dashboard berupa grafik** dari hasil soal nomor 2.

**5.** Dari struktur `table_kpi_marketing`, lakukan proses **normalisasi** jika diperlukan.

---

## Ketentuan Pengerjaan

- Waktu pengerjaan: **240 menit**
- Hasil jawaban dikirimkan berupa:
  - File `.txt` untuk soal nomor 1, 2, dan 5
  - File **image screenshot** dan file **source** untuk soal nomor 3 dan 4
  - Jika pakai JSFiddle, bisa share link
- Pengerjaan bisa menggunakan:
  - [https://jsfiddle.net/](https://jsfiddle.net/)
  - [http://sqlfiddle.com](http://sqlfiddle.com)
  - Atau web server lokal

---

## Kirim Hasil Jawaban Melalui WA / Email

**Mas Anggi**  
WA: 081214926060  
Email: it@trusmi.com