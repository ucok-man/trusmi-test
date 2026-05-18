WITH task_status AS (
    SELECT 
        COUNT(id) AS total_task,
        -- Menghitung task Ontime (selesai <= deadline)
        COUNT(id) FILTER (WHERE aktual <= deadline) AS ontime_count,
        -- Menghitung task Late (selesai > deadline)
        COUNT(id) FILTER (WHERE aktual > deadline) AS late_count
    FROM table_kpi_marketing
)
SELECT 
    ontime_count AS "Jumlah Ontime",
    late_count AS "Jumlah Late",
    -- Menghitung persentase Ontime (dibulatkan 1 angka di belakang koma)
    ROUND((ontime_count::numeric / total_task) * 100, 1)::text || '%' AS "Persentase Ontime",
    -- Menghitung persentase Late (dibulatkan 1 angka di belakang koma)
    ROUND((late_count::numeric / total_task) * 100, 1)::text || '%' AS "Persentase Late"
FROM task_status;
