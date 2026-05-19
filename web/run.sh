#!/bin/bash

# Pindah ke direktori tempat script ini berada (folder web)
cd "$(dirname "$0")"

show_menu() {
    echo "==========================================="
    echo "       TRUSMI WEB DOCKER MANAGER           "
    echo "==========================================="
    echo "1) Up (Jalankan dan build di background)"
    echo "2) Down (Matikan dan hapus container)"
    echo "3) Restart (Restart aplikasi)"
    echo "4) Logs (Lihat log aplikasi realtime)"
    echo "5) Cleanup (Matikan & hapus data/volume database)"
    echo "6) Exit"
    echo "==========================================="
    read -p "Pilih opsi (1-6): " option
    echo ""
}

execute_option() {
    case $option in
        1)
            echo "Memulai aplikasi & database container..."
            docker compose up -d --build
            
            echo "Menunggu database siap (5 detik)..."
            sleep 5

            echo "Meng-generate Prisma Client..."
            bunx prisma generate
            
            echo "Menjalankan migrasi database (db push)..."
            bunx prisma db push
            
            echo "Menjalankan Seeding database..."
            bunx prisma db seed
            
            echo "Aplikasi berjalan di background!"
            echo "Buka http://localhost:3000 di browser Anda."
            ;;
        2)
            echo "Mematikan aplikasi..."
            docker compose down
            echo "Aplikasi berhasil dihentikan."
            ;;
        3)
            echo "Merestart aplikasi..."
            docker compose down
            docker compose up -d --build
            echo "Aplikasi berhasil direstart!"
            ;;
        4)
            echo "Menampilkan log... (Tekan Ctrl+C untuk keluar)"
            docker compose logs -f web
            ;;
        5)
            echo "Membersihkan aplikasi (termasuk menghapus database/volume)..."
            docker compose down -v
            echo "Aplikasi dan semua data database berhasil dihapus bersih!"
            ;;
        6)
            echo "Keluar dari manager."
            exit 0
            ;;
        *)
            echo "Pilihan tidak valid, silakan coba lagi."
            ;;
    esac
}

# Infinite loop agar menu terus muncul sampai user menekan exit
while true; do
    show_menu
    execute_option
    echo ""
done
