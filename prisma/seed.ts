import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const services = [
    { name: "PT Perorangan", price: 999000 },
    { name: "Upgrade ke PT Umum", price: 2499000 },
    { name: "CV", price: 1999000 },
    { name: "RUPS CV (Perubahan)", price: 1999000 },
    { name: "PT Umum", price: 3999000 },
    { name: "CV to PT Umum", price: 1999000 },
    { name: "Bundling PT dan VO", price: 1999000 },
    { name: "RUPS PT (Pengurus/Oper Saham)", price: 1999000 },
    { name: "RUPS PT (KBLI/Kedudukan/Nama PT/Modal)", price: 1999000 },
    { name: "PT PMA (PT Asing)", price: 8999000 },
    { name: "PT PMA + NIB dan PKKPR", price: 8999000 },
    { name: "RUPS PT PMA (PT Asing)", price: 8999000 },
    { name: "Koperasi", price: 1999000 },
    { name: "UD (Usaha Dagang)", price: 1999000 },
    { name: "Yayasan", price: 3499000 },
    { name: "Perubahan Yayasan", price: 1999000 },
    { name: "Penutupan PT Perorangan", price: 999000 },
    { name: "Akta Cabang PT", price: 1999000 },
    { name: "Akta Cabang CV", price: 1500000 },
    { name: "NIB PT PMA", price: 2500000 },
    { name: "Pengumuman Koran", price: 1999000 },
    { name: "Merek", price: 1899000 },
    { name: "Merek (+ Surat Sanggahan)", price: 2999000 },
    { name: "Merek (+ Sanggahan & Refund 100%)", price: 4500000 },
    { name: "Merek (+ Sanggahan, Banding & Refund)", price: 7500000 },
    { name: "Tambahan Sub Kelas Merek", price: 1500000 },
    { name: "PIRT", price: 399000 },
    { name: "Halal - PIRT", price: 999000 },
    { name: "NIB Badan (Perusahaan)", price: 1999000 },
    { name: "NIB Pribadi", price: 1999000 },
    { name: "BPOM", price: 9499000 },
    { name: "SBU Konstruksi + KTA Asosiasi", price: 2999000 },
    { name: "E-Catalogue", price: 2500000 },
    { name: "Sewa Tenaga S1 Teknik Sipil", price: 9000000 },
    { name: "Sewa Tenaga SMA", price: 7500000 },
    { name: "Biaya Ujian Tenaga Ahli S1", price: 4000000 },
    { name: "Biaya Ujian Tenaga Terampil SMA", price: 2500000 },
    { name: "ISO 9001", price: 12000000 },
    { name: "ISO 14001", price: 12000000 },
    { name: "ISO 45001", price: 12000000 },
    { name: "TKDN", price: 7500000 },
    { name: "SNI", price: 15000000 },
    { name: "Sertifikat Laik Fungsi (SLF)", price: 5000000 },
    { name: "PBG (Persetujuan Bangunan Gedung)", price: 3500000 },
    { name: "IPAL", price: 8000000 },
    { name: "AMDAL", price: 25000000 },
    { name: "UKL-UPL", price: 7500000 },
    { name: "SPPL", price: 2500000 },
    { name: "Izin Lingkungan", price: 10000000 },
    { name: "Izin Usaha Pertambangan (IUP)", price: 50000000 },
    { name: "SIUP-MB", price: 5000000 },
    { name: "API (Angka Pengenal Impor)", price: 7500000 },
    { name: "NPIK (Nomor Pokok Importir Khusus)", price: 5000000 },
    { name: "Izin Edar Kosmetik", price: 5500000 },
    { name: "Izin Edar Alat Kesehatan", price: 8000000 },
    { name: "Izin Edar Obat Tradisional", price: 6500000 },
    { name: "Izin Edar Suplemen", price: 5000000 },
    { name: "IUMK (Izin Usaha Mikro Kecil)", price: 1999000 },
    { name: "TDP (Tanda Daftar Perusahaan)", price: 1999000 },
    { name: "SIUP (Surat Izin Usaha Perdagangan)", price: 1999000 },
    { name: "Izin Usaha Industri", price: 3500000 },
    { name: "Izin Usaha Jasa Konstruksi", price: 4000000 },
    { name: "SITU (Surat Izin Tempat Usaha)", price: 1999000 },
    { name: "HO (Izin Gangguan)", price: 1999000 },
    { name: "Izin Reklame", price: 1000000 },
    { name: "Izin Usaha Pariwisata", price: 5000000 },
    { name: "Izin Usaha Perhotelan", price: 7500000 },
    { name: "Izin Usaha Restoran", price: 3000000 },
    { name: "Izin Usaha Kafe", price: 2500000 },
    { name: "Izin Usaha Toko Retail", price: 1999000 },
    { name: "Izin Usaha Apotek", price: 10000000 },
    { name: "Izin Usaha Klinik", price: 15000000 },
    { name: "Izin Usaha Laboratorium", price: 12000000 },
    { name: "PKP (Pengukuhan Pengusaha Kena Pajak)", price: 1499000 },
    { name: "EFIN Pribadi", price: 150000 },
    { name: "CORETax Pribadi", price: 350000 },
    { name: "CORETax Badan", price: 500000 },
    { name: "Perkumpulan", price: 4000000 },
];

async function main() {
    console.log("🌱 Seeding tabel Service...");

    let created = 0;
    let skipped = 0;

    for (const service of services) {
        const existing = await prisma.service.findFirst({
            where: { name: service.name },
        });

        if (!existing) {
            await prisma.service.create({ data: service });
            created++;
        } else {
            skipped++;
        }
    }

    console.log(`✅ Selesai! ${created} service dibuat, ${skipped} sudah ada.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
