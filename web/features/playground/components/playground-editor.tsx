"use client";

import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Code, Database, Play, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-sql";
import "prismjs/themes/prism-twilight.css";

const DEFAULT_QUERY = `-- ==========================================
-- TRUSMI POSTGRES PLAYGROUND (STRICT ISOLATION)
-- ==========================================
-- Anda secara otomatis berada di dalam skema "sandbox_db".
-- Anda memiliki akses penuh (CREATE, INSERT, DROP) di dalam skema ini.
-- Segala bentuk akses ke skema utama aplikasi ("public") DIBLOKIR.

-- ==================================================
-- 0. PERSIAPAN DATA (DDL & INSERT)
-- (Blok semua teks di bawah ini dan tekan Ctrl + /)
-- ==================================================
-- 
-- CREATE TABLE table_kpi_marketing (
--   id integer NOT NULL PRIMARY KEY,
--   tasklist varchar(100) DEFAULT NULL,
--   kpi varchar(100) DEFAULT NULL,
--   karyawan varchar(100) DEFAULT NULL,
--   deadline date DEFAULT NULL,
--   aktual date DEFAULT NULL
-- );
-- 
-- INSERT INTO table_kpi_marketing
-- (id, tasklist, kpi, karyawan, deadline, aktual)
-- VALUES
-- (1, 'Tasklist 1', 'Sales', 'Budi', '2022-01-10', '2022-01-09'),
-- (2, 'Tasklist 2', 'Sales', 'Budi', '2022-01-10', '2022-01-08'),
-- (3, 'Tasklist 3', 'Report', 'Budi', '2022-01-10', '2022-01-07'),
-- (4, 'Tasklist 4', 'Report', 'Budi', '2022-01-10', '2022-01-12'),
-- (5, 'Tasklist 5', 'Sales', 'Adi', '2022-01-10', '2022-01-09'),
-- (6, 'Tasklist 6', 'Sales', 'Adi', '2022-01-10', '2022-01-12'),
-- (7, 'Tasklist 7', 'Report', 'Adi', '2022-01-10', '2022-01-07'),
-- (8, 'Tasklist 8', 'Report', 'Adi', '2022-01-10', '2022-01-07'),
-- (9, 'Tasklist 9', 'Sales', 'Rara', '2022-01-10', '2022-01-12'),
-- (10, 'Tasklist 10', 'Sales', 'Rara', '2022-01-10', '2022-01-09'),
-- (11, 'Tasklist 11', 'Report', 'Rara', '2022-01-10', '2022-01-12'),
-- (12, 'Tasklist 12', 'Report', 'Doni', '2022-01-10', '2022-01-09'),
-- (13, 'Tasklist 13', 'Sales', 'Doni', '2022-01-10', '2022-01-12');
-- 
-- SELECT * FROM table_kpi_marketing LIMIT 5;

-- ==================================================
-- JAWABAN SOAL 1: Query Pencapaian KPI per Karyawan
-- (Blok semua teks di bawah ini dan tekan Ctrl + /)
-- ==================================================
-- 
-- WITH cleaned_data AS (
--     SELECT 
--         karyawan AS nama,
--         kpi AS jenis_kpi,
--         2::numeric AS target_task,
--         COUNT(aktual) AS jumlah_aktual,
--         COUNT(CASE WHEN aktual > deadline THEN 1 END) AS jumlah_late
--     FROM table_kpi_marketing
--     WHERE kpi IN ('Sales', 'Report')
--     GROUP BY karyawan, kpi
-- ),
-- kpi_kalkulasi AS (
--     SELECT
--         nama,
--         jenis_kpi,
--         target_task,
--         jumlah_aktual,
--         (jumlah_aktual / target_task) * 100 AS pencapaian_persen,
--         (jumlah_aktual / target_task) * 50 AS bobot_didapat,
--         CASE 
--             WHEN jenis_kpi = 'Sales' THEN jumlah_late * 7
--             WHEN jenis_kpi = 'Report' THEN jumlah_late * 5
--             ELSE 0 
--         END AS late_penalti
--     FROM cleaned_data
-- ),
-- kpi_final AS (
--     SELECT *, (bobot_didapat - late_penalti) AS total_bobot
--     FROM kpi_kalkulasi
-- ),
-- sales AS (SELECT * FROM kpi_final WHERE jenis_kpi = 'Sales'),
-- report AS (SELECT * FROM kpi_final WHERE jenis_kpi = 'Report'),
-- karyawan AS (SELECT DISTINCT karyawan AS nama FROM table_kpi_marketing)
-- 
-- SELECT 
--     k.nama,
--     COALESCE(s.target_task, 2)::int AS sales_target,
--     COALESCE(s.jumlah_aktual, 0)::int AS sales_actual,
--     ROUND(COALESCE(s.pencapaian_persen, 0), 0)::text || '%' AS sales_pencapaian,
--     ROUND(COALESCE(s.bobot_didapat, 0), 0)::text || '%' AS bobot_sales,
--     '-' || ROUND(COALESCE(s.late_penalti, 0), 0)::text || '%' AS late_sales,
--     ROUND(COALESCE(s.total_bobot, 0), 0)::text || '%' AS total_bobot_sales,
--     
--     COALESCE(r.target_task, 2)::int AS report_target,
--     COALESCE(r.jumlah_aktual, 0)::int AS report_actual,
--     ROUND(COALESCE(r.pencapaian_persen, 0), 0)::text || '%' AS report_pencapaian,
--     ROUND(COALESCE(r.bobot_didapat, 0), 0)::text || '%' AS actual_bobot_report,
--     '-' || ROUND(COALESCE(r.late_penalti, 0), 0)::text || '%' AS late_report,
--     ROUND(COALESCE(r.total_bobot, 0), 0)::text || '%' AS total_bobot_report,
--     
--     ROUND(COALESCE(s.total_bobot, 0) + COALESCE(r.total_bobot, 0), 0)::text || '%' AS final_kpi
-- FROM karyawan k
-- LEFT JOIN sales s ON k.nama = s.nama
-- LEFT JOIN report r ON k.nama = r.nama
-- ORDER BY k.nama;


-- ==================================================
-- JAWABAN SOAL 2: Query Rasio Leadtime (Ontime/Late)
-- (Blok semua teks di bawah ini dan tekan Ctrl + /)
-- ==================================================
-- 
-- WITH task_status AS (
--     SELECT 
--         COUNT(id) AS total_task,
--         COUNT(id) FILTER (WHERE aktual <= deadline) AS ontime_count,
--         COUNT(id) FILTER (WHERE aktual > deadline) AS late_count
--     FROM table_kpi_marketing
-- )
-- SELECT 
--     ontime_count::int AS jumlah_ontime,
--     late_count::int AS jumlah_late,
--     ROUND((ontime_count::numeric / total_task) * 100, 1)::text || '%' AS persentase_ontime,
--     ROUND((late_count::numeric / total_task) * 100, 1)::text || '%' AS persentase_late,
--     total_task::int AS total_task
-- FROM task_status;
`;

export function PlaygroundEditor() {
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ fields: string[], data: any[], rowCount: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    // Cari elemen textarea di dalam Editor
    const textarea = document.querySelector('.npm__react-simple-code-editor__textarea') as HTMLTextAreaElement;
    
    // Jika ada teks yang di-highlight, jalankan HANYA teks tersebut
    let queryToRun = query;
    if (textarea && textarea.selectionStart !== textarea.selectionEnd) {
      queryToRun = query.substring(textarea.selectionStart, textarea.selectionEnd);
    }

    if (!queryToRun.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/playground/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryToRun }),
      });
      const json = await res.json();
      
      if (!res.ok) throw new Error(json.error || "Gagal mengeksekusi query.");
      setResult(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleComment = (textarea: HTMLTextAreaElement) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = query;

    let lineStart = text.lastIndexOf('\n', start - 1) + 1;
    // Jika end persis di awal baris baru, jangan ikutkan baris kosong tersebut
    const adjustedEnd = (end > start && text[end - 1] === '\n') ? end - 1 : end;
    let lineEnd = text.indexOf('\n', adjustedEnd);
    if (lineEnd === -1) lineEnd = text.length;

    const selectedLines = text.substring(lineStart, lineEnd);
    const lines = selectedLines.split('\n');

    const allCommented = lines.every(line => line.trim() === '' || line.trim().startsWith('--'));
    
    const newLines = lines.map(line => {
      if (allCommented) {
        return line.replace(/^(\s*)--\s?/, '$1');
      } else {
        return '-- ' + line;
      }
    });

    const replacement = newLines.join('\n');
    const newQuery = text.substring(0, lineStart) + replacement + text.substring(lineEnd);
    
    setQuery(newQuery);
    
    setTimeout(() => {
      textarea.setSelectionRange(lineStart, lineStart + replacement.length);
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === "/" || e.code === "Slash")) {
      e.preventDefault();
      toggleComment(e.target as HTMLTextAreaElement);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] min-h-[600px] rounded-xl border border-white/10 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3 shrink-0">
        <div className="text-sm font-medium text-white flex items-center gap-2">
          <Code className="text-primary w-5 h-5" /> SQL Editor
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground hidden sm:flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10">/</kbd> Comment</span>
            <span className="w-px h-3 bg-white/10"></span>
            <span><kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/10">Enter</kbd> Run</span>
          </div>
          <Button onClick={handleRun} disabled={loading} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
            {loading ? "Running..." : <><Play weight="fill" className="mr-2" /> Run Query</>}
          </Button>
        </div>
      </div>

      <ResizablePanelGroup orientation="vertical" className="flex-1">
        {/* Editor Area */}
        <ResizablePanel defaultSize={55} minSize={20}>
          <div className="relative h-full w-full overflow-auto bg-[#0d1117] font-mono text-sm">
            <Editor
              value={query}
              onValueChange={code => setQuery(code)}
              highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
              padding={16}
              style={{
                fontFamily: 'inherit',
                fontSize: 14,
                minHeight: '100%',
                fontVariantLigatures: 'none',
              }}
              textareaClassName="focus:outline-none"
              className="min-h-full"
              onKeyDown={handleKeyDown}
            />
            <div className="absolute bottom-2 right-4 flex items-center space-x-2 text-xs text-muted-foreground opacity-50 pointer-events-none">
              <Database /> <span>PostgreSQL 15</span>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-white/10" />

        {/* Results Area */}
        <ResizablePanel defaultSize={45} minSize={20}>
          <div className="h-full w-full bg-[#0f1115] overflow-auto p-4">
            {error ? (
              <div className="flex items-start space-x-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
                <WarningCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="font-mono text-sm break-all">{error}</div>
              </div>
            ) : result ? (
              <div className="space-y-3">
                <div className="flex items-center text-xs text-emerald-400">
                  <Database weight="fill" className="mr-1.5" /> Query OK. Returned {result.rowCount} rows.
                </div>
                {result.data.length > 0 ? (
                  <div className="rounded-md border border-white/10 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-white/5 text-muted-foreground font-semibold border-b border-white/10">
                        <tr>
                          {result.fields.map((field) => (
                            <th key={field} className="px-4 py-2 whitespace-nowrap">{field}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.data.map((row, i) => (
                          <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            {result.fields.map((field) => (
                              <td key={field} className="px-4 py-2 font-mono text-white whitespace-nowrap">
                                {row[field] !== null ? String(row[field]) : <span className="text-muted-foreground italic">null</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm italic">No data returned.</div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Tekan "Run Query" atau Ctrl+Enter untuk mengeksekusi SQL
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
