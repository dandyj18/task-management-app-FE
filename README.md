# 🚀 Task Management App

Aplikasi Manajemen Tugas bergaya Kanban premium yang dibangun menggunakan React, TypeScript, dan Vite. Didesain dengan prinsip UI/UX modern, animasi yang mulus, dan fitur lengkap untuk mengelola proyek dengan efisien.

## ✨ Fitur-fitur

- **Papan Kanban Drag & Drop**: Pindahkan tugas antar kolom dan ubah urutan kolom dengan mudah menggunakan `@dnd-kit`.
- **Manajemen Tugas Lengkap**:
  - Modal tugas mendetail dengan Judul, Deskripsi, Prioritas, dan Label.
  - Pemilihan tenggat waktu (Due date) dengan tampilan kalender.
  - Sub-tugas dan daftar periksa (checklist) dengan pelacakan progres.
  - Komentar dan riwayat aktivitas.
- **Lampiran File (Attachments)**: Unggah file, lihat gambar dalam pratinjau layar penuh (lightbox), dan unduh lampiran.
- **Manajemen Ruang Kerja & Proyek**: Beralih antar proyek, undang anggota, dan kelola akses.
- **UI/UX Premium**:
  - Desain cantik dan responsif yang dibangun dengan **Tailwind CSS**.
  - Mikro-animasi, transisi, dan modal yang mulus ditenagai oleh **Framer Motion**.
  - Dialog konfirmasi kustom (tidak menggunakan peringatan bawaan browser).
- **Portabilitas Data**: Ekspor papan Kanban Anda ke format file JSON dan impor kembali kapan saja.
- **Manajemen State Lokal**: State saat ini dikelola sepenuhnya di sisi klien (client-side) menggunakan **Zustand**.

## 🛠️ Teknologi yang Digunakan

- **Framework**: [React 18](https://react.dev/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Utilitas Tanggal**: [date-fns](https://date-fns.org/)

## 🚀 Mulai Menggunakan

Ikuti langkah-langkah berikut untuk menjalankan proyek ini secara lokal.

### 1. Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (disarankan versi 18+) dan `npm`.

### 2. Instalasi

Kloning repositori ini dan instal semua dependensi:

```bash
# Kloning repositori
git clone https://github.com/dandyj18/task-management-app-FE.git

# Masuk ke direktori proyek
cd task-management-app-FE

# Instal dependensi
npm install
```

### 3. Menjalankan Server Development

Mulai server development Vite:

```bash
npm run dev
```

Buka browser Anda dan kunjungi URL yang tertera di terminal (biasanya `http://localhost:5173`).

### 4. Build untuk Production

Untuk melakukan kompilasi aplikasi untuk production:

```bash
npm run build
```

Perintah ini akan menghasilkan aset statis yang sudah dioptimalkan di dalam folder `dist`.

## 📝 Daftar Skrip

- `npm run dev`: Menjalankan server development.
- `npm run build`: Mengompilasi TypeScript dan membuat build aplikasi untuk production.
- `npm run preview`: Melihat pratinjau hasil build production secara lokal.

## 🤝 Kontribusi

Kontribusi selalu diterima! Jangan ragu untuk membuka _issue_ atau mengirimkan _pull request_.

## 📄 Lisensi

Proyek ini dilisensikan di bawah MIT License.
