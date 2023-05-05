# Tubes3_Athena_BE
Tugas Besar 3 IF2211 Strategi Algoritma Penerapan String Matching dan Regular Expression dalam Pembuatan ChatGPT Sederhana

## Daftar Isi
* [Deskripsi Singkat Program](#deskripsi-singkat-program)
* [Requirements](#requirements)
* [Cara Menjalankan Program](#cara-menjalankan-program)
* [Dokumentasi API](#dokumentasi-api)
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
* Prisma CLI
* Express.js
* Node.js
* Typescript Compiler
* PostgreSQL

## Cara menjalankan Program
1. Lakukan git clone
    > 
        git clone https://github.com/maikeljh/Tubes3_Athena_BE.git
2. Jalankan npm i pada directory root project
    > 
        npm i
3. Buatlah file .env yang berisi link database local
    > 
        DATABASE_URL = {link_database}
4. Jalankan prisma migrate reset untuk menginisiasi database
    > 
        prisma migrate reset
5. Jalankan npm run dev untuk memulai server
    > 
        npm run dev

## Dokumentasi API
Link dokumentasi API : https://documenter.getpostman.com/view/17084544/2s93eVXtc9

## Gambar Relational Model Database
![Athena](https://user-images.githubusercontent.com/87570374/236466994-173c25eb-13c3-41a3-80c8-d561a3bdff6b.png)


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
