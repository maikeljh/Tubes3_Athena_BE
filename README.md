# Tubes3_Athena_BE
Tugas Besar 3 IF2211 Strategi Algoritma Penerapan String Matching dan Regular Expression dalam Pembuatan ChatGPT Sederhana

## Daftar Isi
* [Deskripsi Singkat Program](#deskripsi-singkat-program)
* [Requirements](#requirements)
* [Cara Menjalankan Program](#cara-menjalankan-program)
* [Dibuat Oleh](#dibuat-oleh)

## Deskripsi Singkat Program
Program ini merupakan program yang menggunakan algoritma pencocokan string Knuth-Morris-Pratt (KMP) dan Boyer-Moore(BM), algoritma kemiripan string Levensthein Distance, dan Regex. Program ini juga didukung oleh ORM prisma dan database PostgreSQL.

## Struktur Program
```bash
├─── prisma
│   ├─── migrations
│   │     ├─── 20230422045047_init_database
│   │     │     ├─── migration.sql
│   │     ├─── 20230423173856_message_composite_primary_key
│   │     │     ├─── migration.sql
│   │     ├─── 20230423213034_message_time_stamp_default_now
│   │     │     ├─── migration.sql
│   │     ├─── 20230424074801_remove_historyid_and_messageid_autoincrement
│   │     │     ├─── migration.sql
│   │     ├─── 20230426135934_add_topic_to_history
│   │     │     ├─── migration.sql
│   │     └─── migration_lock.toml
│   ├─── prisma-client.ts
│   └─── schema.prisma
├─── doc
│   └─── Tubes3_13521096.pdf
├─── src
│   ├─── algorithms
│   │     ├─── Classification.ts
│   │     ├─── StringMatching.ts
│   │     └─── StringSimilarity.ts
│   ├─── controllers
│   │     ├─── history-controller.ts
│   │     ├─── message-controller.ts
│   │     ├─── qna-controller.ts
│   │     └─── user-controller.ts
│   ├─── routes
│   │     ├─── history-router.ts
│   │     ├─── message-router.ts
│   │     ├─── qna-router.ts
│   │     └─── user-router.ts
│   ├─── services
│   │     ├─── history-service.ts
│   │     ├─── message-service.ts
│   │     ├─── qna-service.ts
│   │     └─── user-service.ts
│   └─── app.ts
├─── .gitignore
├─── README.md
├─── package-lock.json
├─── package.json
└─── tsconfig.json                          
```

## Requirements
* 

## Cara menjalankan Program

## Dibuat Oleh
* Nama : Noel Christoffel Simbolon
* NIM : 13521096
* Prodi/Jurusan : STEI/Teknik Informatika
* Profile Github : noelsimbolon
* Kelas : K02
##
* Nama: Michael Jonathan Halim
* NIM: 13521124
* Prodi/Jurusan: STEI/Teknik Informatika
* Profile Github : maikeljh
* Kelas : K02
##
* Nama: Raynard Tanadi
* NIM: 13521143
* Prodi/Jurusan: STEI/Teknik Informatika
* Profile Github : Raylouiss
* Kelas : K01
