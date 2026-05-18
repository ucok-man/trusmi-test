WITH cleaned_data AS (
    -- 1. Membersihkan data dan menambahkan kolom target
    SELECT 
        karyawan AS nama,
        kpi AS jenis_kpi,
        2::numeric AS target_task, -- Target per kpi adalah 2, dijadikan numeric agar mudah saat pembagian
        COUNT(aktual) AS jumlah_aktual,
        COUNT(CASE WHEN aktual > deadline THEN 1 END) AS jumlah_late
    FROM table_kpi_marketing
    WHERE kpi IN ('Sales', 'Report')
    GROUP BY karyawan, kpi
),
kpi_kalkulasi AS (
    -- 2. Menghitung metrik berdasarkan agregat, tanpa perlu mengulang rumus
    SELECT
        nama,
        jenis_kpi,
        target_task,
        jumlah_aktual,
        -- Persentase pencapaian
        (jumlah_aktual / target_task) * 100 AS pencapaian_persen,
        -- Bobot didapat (Maksimal 50%)
        (jumlah_aktual / target_task) * 50 AS bobot_didapat,
        -- Penalti Late statis (-7% Sales, -5% Report per tugas telat)
        CASE 
            WHEN jenis_kpi = 'Sales' THEN jumlah_late * 7
            WHEN jenis_kpi = 'Report' THEN jumlah_late * 5
            ELSE 0 
        END AS late_penalti
    FROM cleaned_data
),
kpi_final AS (
    -- 3. Menghitung total bobot akhir, me-reuse data dari CTE sebelumnya
    SELECT *, (bobot_didapat - late_penalti) AS total_bobot
    FROM kpi_kalkulasi
),
-- 4. Memecah data untuk menyederhanakan Pivot
sales AS (SELECT * FROM kpi_final WHERE jenis_kpi = 'Sales'),
report AS (SELECT * FROM kpi_final WHERE jenis_kpi = 'Report'),
karyawan AS (SELECT DISTINCT karyawan AS nama FROM table_kpi_marketing)

-- 5. Hasil Akhir (Menggunakan JOIN agar syntax jauh lebih bersih dan tidak pusing dibaca)
SELECT 
    k.nama AS "Nama",
    
    -- SALES
    COALESCE(s.target_task, 2) AS "Sales Target",
    COALESCE(s.jumlah_aktual, 0) AS "Sales Actual",
    ROUND(COALESCE(s.pencapaian_persen, 0), 0)::text || '%' AS "Sales Pencapaian",
    ROUND(COALESCE(s.bobot_didapat, 0), 0)::text || '%' AS "Bobot Sales",
    '-' || ROUND(COALESCE(s.late_penalti, 0), 0)::text || '%' AS "Late Sales",
    ROUND(COALESCE(s.total_bobot, 0), 0)::text || '%' AS "Total Bobot ",
    
    -- REPORT
    COALESCE(r.target_task, 2) AS "Report Target",
    COALESCE(r.jumlah_aktual, 0) AS "Report Actual",
    ROUND(COALESCE(r.pencapaian_persen, 0), 0)::text || '%' AS "Report Pencapaian",
    ROUND(COALESCE(r.bobot_didapat, 0), 0)::text || '%' AS "Actual Bobot",
    '-' || ROUND(COALESCE(r.late_penalti, 0), 0)::text || '%' AS "Late Report",
    ROUND(COALESCE(r.total_bobot, 0), 0)::text || '%' AS "Total Bobot",
    
    -- FINAL KPI
    ROUND(COALESCE(s.total_bobot, 0) + COALESCE(r.total_bobot, 0), 0)::text || '%' AS "KPI"
    
FROM karyawan k
LEFT JOIN sales s ON k.nama = s.nama
LEFT JOIN report r ON k.nama = r.nama
ORDER BY k.nama;
