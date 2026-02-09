// All 77 Services Data
const allServices = [
    { id: 1, name: "PT Perorangan", price: "Rp 999.000", category: "usaha", icon: "person", color: "primary" },
    { id: 2, name: "Upgrade ke PT Umum", price: "Rp 4.500.000", category: "usaha", icon: "upgrade", color: "primary" },
    { id: 3, name: "CV", price: "Rp 1.999.000", category: "usaha", icon: "groups", color: "secondary" },
    { id: 4, name: "RUPS CV (Perubahan)", price: "Rp 1.999.000", category: "usaha", icon: "edit_document", color: "secondary" },
    { id: 5, name: "PT Umum", price: "Rp 3.999.000", category: "usaha", icon: "corporate_fare", color: "primary" },
    { id: 6, name: "CV to PT Umum", price: "Rp 3.999.000", category: "usaha", icon: "swap_horiz", color: "secondary" },
    { id: 7, name: "Bundling PT dan VO", price: "Rp 6.250.000", category: "usaha", icon: "package", color: "primary" },
    { id: 8, name: "RUPS PT (Pengurus/Oper Saham)", price: "Rp 3.499.000", category: "usaha", icon: "swap_horizontal_circle", color: "primary" },
    { id: 9, name: "RUPS PT (KBLI/Kedudukan/Nama PT/Modal)", price: "Rp 4.499.000", category: "usaha", icon: "edit_note", color: "primary" },
    { id: 10, name: "PT PMA (PT Asing)", price: "Rp 8.999.000", category: "usaha", icon: "public", color: "primary" },
    { id: 11, name: "PT PMA + NIB dan PKKPR", price: "Rp 5.000.000", category: "usaha", icon: "add_business", color: "primary" },
    { id: 12, name: "RUPS PT PMA (PT Asing)", price: "Rp 8.999.000", category: "usaha", icon: "language", color: "primary" },
    { id: 13, name: "Koperasi", price: "Rp 7.499.000", category: "usaha", icon: "handshake", color: "green" },
    { id: 14, name: "UD (Usaha Dagang)", price: "Rp 1.999.000", category: "usaha", icon: "store", color: "orange" },
    { id: 15, name: "Yayasan", price: "Rp 3.499.000", category: "usaha", icon: "volunteer_activism", color: "blue" },
    { id: 16, name: "Perubahan Yayasan", price: "Rp 4.000.000", category: "usaha", icon: "edit", color: "blue" },
    { id: 17, name: "Penutupan PT Perorangan", price: "Rp 999.000", category: "usaha", icon: "close", color: "red" },
    { id: 18, name: "Akta Cabang PT", price: "Rp 2.500.000", category: "usaha", icon: "account_tree", color: "primary" },
    { id: 19, name: "Akta Cabang CV", price: "Rp 1.500.000", category: "usaha", icon: "account_tree", color: "secondary" },
    { id: 20, name: "NIB PT PMA", price: "Rp 2.500.000", category: "usaha", icon: "badge", color: "primary" },
    { id: 21, name: "Pengumuman Koran", price: "Rp 800.000", category: "usaha", icon: "newspaper", color: "gray" },
    { id: 22, name: "Merek", price: "Rp 1.899.000", category: "lanjutan", icon: "verified_user", color: "green" },
    { id: 23, name: "Merek (+ Surat Sanggahan)", price: "Rp 2.999.000", category: "lanjutan", icon: "gavel", color: "green" },
    { id: 24, name: "Merek (+ Sanggahan & Refund 100%)", price: "Rp 4.500.000", category: "lanjutan", icon: "verified", color: "green" },
    { id: 25, name: "Merek (+ Sanggahan, Banding & Refund)", price: "Rp 7.500.000", category: "lanjutan", icon: "shield", color: "green" },
    { id: 26, name: "Tambahan Sub Kelas Merek", price: "Rp 1.500.000", category: "lanjutan", icon: "add_circle", color: "green" },
    { id: 27, name: "PIRT", price: "Rp 399.000", category: "lanjutan", icon: "restaurant", color: "orange" },
    { id: 28, name: "Halal - PIRT", price: "Rp 999.000", category: "lanjutan", icon: "verified", color: "red" },
    { id: 29, name: "NIB Badan (Perusahaan)", price: "Rp 500.000", category: "usaha", icon: "business_center", color: "purple" },
    { id: 30, name: "NIB Pribadi", price: "Rp 300.000", category: "usaha", icon: "badge", color: "purple" },
    { id: 31, name: "BPOM", price: "Rp 9.499.000", category: "lanjutan", icon: "health_and_safety", color: "blue" },
    { id: 32, name: "SBU Konstruksi + KTA Asosiasi", price: "Rp 2.999.000", category: "lanjutan", icon: "construction", color: "yellow" },
    { id: 33, name: "E-Catalogue", price: "Rp 2.500.000", category: "lanjutan", icon: "shopping_cart", color: "indigo" },
    { id: 34, name: "Sewa Tenaga S1 Teknik Sipil", price: "Rp 9.000.000", category: "lanjutan", icon: "engineering", color: "gray" },
    { id: 35, name: "Sewa Tenaga SMA", price: "Rp 7.500.000", category: "lanjutan", icon: "school", color: "gray" },
    { id: 36, name: "Biaya Ujian Tenaga Ahli S1", price: "Rp 4.000.000", category: "lanjutan", icon: "quiz", color: "blue" },
    { id: 37, name: "Biaya Ujian Tenaga Terampil SMA", price: "Rp 2.500.000", category: "lanjutan", icon: "assignment", color: "blue" },
    { id: 38, name: "ISO 9001", price: "Rp 12.000.000", category: "lanjutan", icon: "workspace_premium", color: "gold" },
    { id: 39, name: "ISO 14001", price: "Rp 12.000.000", category: "lanjutan", icon: "eco", color: "green" },
    { id: 40, name: "ISO 45001", price: "Rp 12.000.000", category: "lanjutan", icon: "health_and_safety", color: "red" },
    { id: 41, name: "TKDN", price: "Rp 7.500.000", category: "lanjutan", icon: "flag", color: "red" },
    { id: 42, name: "SNI", price: "Rp 15.000.000", category: "lanjutan", icon: "verified", color: "blue" },
    { id: 43, name: "Sertifikat Laik Fungsi (SLF)", price: "Rp 5.000.000", category: "lanjutan", icon: "apartment", color: "gray" },
    { id: 44, name: "PBG (Persetujuan Bangunan Gedung)", price: "Rp 3.500.000", category: "lanjutan", icon: "domain", color: "brown" },
    { id: 45, name: "IPAL", price: "Rp 8.000.000", category: "lanjutan", icon: "water_drop", color: "blue" },
    { id: 46, name: "AMDAL", price: "Rp 25.000.000", category: "lanjutan", icon: "nature", color: "green" },
    { id: 47, name: "UKL-UPL", price: "Rp 7.500.000", category: "lanjutan", icon: "eco", color: "green" },
    { id: 48, name: "SPPL", price: "Rp 2.500.000", category: "lanjutan", icon: "description", color: "green" },
    { id: 49, name: "Izin Lingkungan", price: "Rp 10.000.000", category: "lanjutan", icon: "park", color: "green" },
    { id: 50, name: "Izin Usaha Pertambangan (IUP)", price: "Rp 50.000.000", category: "lanjutan", icon: "landscape", color: "brown" },
    { id: 51, name: "SIUP-MB", price: "Rp 5.000.000", category: "lanjutan", icon: "inventory", color: "orange" },
    { id: 52, name: "API (Angka Pengenal Impor)", price: "Rp 7.500.000", category: "lanjutan", icon: "local_shipping", color: "blue" },
    { id: 53, name: "NPIK (Nomor Pokok Importir Khusus)", price: "Rp 5.000.000", category: "lanjutan", icon: "import_export", color: "indigo" },
    { id: 54, name: "Izin Edar Kosmetik", price: "Rp 5.500.000", category: "lanjutan", icon: "face", color: "pink" },
    { id: 55, name: "Izin Edar Alat Kesehatan", price: "Rp 8.000.000", category: "lanjutan", icon: "medical_services", color: "red" },
    { id: 56, name: "Izin Edar Obat Tradisional", price: "Rp 6.500.000", category: "lanjutan", icon: "medication", color: "green" },
    { id: 57, name: "Izin Edar Suplemen", price: "Rp 5.000.000", category: "lanjutan", icon: "vaccines", color: "blue" },
    { id: 58, name: "IUMK (Izin Usaha Mikro Kecil)", price: "Rp 500.000", category: "usaha", icon: "storefront", color: "orange" },
    { id: 59, name: "TDP (Tanda Daftar Perusahaan)", price: "Rp 1.500.000", category: "usaha", icon: "app_registration", color: "gray" },
    { id: 60, name: "SIUP (Surat Izin Usaha Perdagangan)", price: "Rp 2.000.000", category: "usaha", icon: "receipt_long", color: "blue" },
    { id: 61, name: "Izin Usaha Industri", price: "Rp 3.500.000", category: "lanjutan", icon: "factory", color: "gray" },
    { id: 62, name: "Izin Usaha Jasa Konstruksi", price: "Rp 4.000.000", category: "lanjutan", icon: "construction", color: "yellow" },
    { id: 63, name: "SITU (Surat Izin Tempat Usaha)", price: "Rp 1.500.000", category: "usaha", icon: "location_on", color: "red" },
    { id: 64, name: "HO (Izin Gangguan)", price: "Rp 2.000.000", category: "usaha", icon: "warning", color: "orange" },
    { id: 65, name: "Izin Reklame", price: "Rp 1.000.000", category: "lanjutan", icon: "campaign", color: "purple" },
    { id: 66, name: "Izin Usaha Pariwisata", price: "Rp 5.000.000", category: "lanjutan", icon: "travel_explore", color: "blue" },
    { id: 67, name: "Izin Usaha Perhotelan", price: "Rp 7.500.000", category: "lanjutan", icon: "hotel", color: "gold" },
    { id: 68, name: "Izin Usaha Restoran", price: "Rp 3.000.000", category: "lanjutan", icon: "restaurant_menu", color: "red" },
    { id: 69, name: "Izin Usaha Kafe", price: "Rp 2.500.000", category: "lanjutan", icon: "local_cafe", color: "brown" },
    { id: 70, name: "Izin Usaha Toko Retail", price: "Rp 2.000.000", category: "usaha", icon: "shopping_bag", color: "green" },
    { id: 71, name: "Izin Usaha Apotek", price: "Rp 10.000.000", category: "lanjutan", icon: "local_pharmacy", color: "green" },
    { id: 72, name: "Izin Usaha Klinik", price: "Rp 15.000.000", category: "lanjutan", icon: "local_hospital", color: "red" },
    { id: 73, name: "Izin Usaha Laboratorium", price: "Rp 12.000.000", category: "lanjutan", icon: "science", color: "blue" },
    { id: 74, name: "PKP (Pengukuhan Pengusaha Kena Pajak)", price: "Rp 1.499.000", category: "pajak", icon: "receipt_long", color: "blue" },
    { id: 75, name: "EFIN Pribadi", price: "Rp 150.000", category: "pajak", icon: "fingerprint", color: "indigo" },
    { id: 76, name: "CORETax Pribadi", price: "Rp 350.000", category: "pajak", icon: "account_balance_wallet", color: "indigo" },
    { id: 77, name: "CORETax Badan", price: "Rp 500.000", category: "pajak", icon: "corporate_fare", color: "indigo" },
    { id: 78, name: "Perkumpulan", price: "Rp 4.000.000", category: "usaha", icon: "groups", color: "blue" }
];

// Color mapping
const colorClasses = {
    primary: { bg: "bg-primary/10", text: "text-primary", button: "bg-primary", shadow: "shadow-primary/20" },
    secondary: { bg: "bg-[#f3b444]/10", text: "text-[#f3b444]", button: "bg-[#f3b444]", shadow: "shadow-[#f3b444]/20" },
    green: { bg: "bg-green-100", text: "text-green-600", button: "bg-green-600", shadow: "shadow-green-600/20" },
    red: { bg: "bg-red-100", text: "text-red-600", button: "bg-red-600", shadow: "shadow-red-600/20" },
    blue: { bg: "bg-blue-100", text: "text-blue-600", button: "bg-blue-600", shadow: "shadow-blue-600/20" },
    orange: { bg: "bg-orange-100", text: "text-orange-600", button: "bg-orange-600", shadow: "shadow-orange-600/20" },
    purple: { bg: "bg-purple-100", text: "text-purple-600", button: "bg-purple-600", shadow: "shadow-purple-600/20" },
    indigo: { bg: "bg-indigo-100", text: "text-indigo-600", button: "bg-indigo-600", shadow: "shadow-indigo-600/20" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-600", button: "bg-yellow-600", shadow: "shadow-yellow-600/20" },
    gray: { bg: "bg-gray-100", text: "text-gray-600", button: "bg-gray-600", shadow: "shadow-gray-600/20" },
    pink: { bg: "bg-pink-100", text: "text-pink-600", button: "bg-pink-600", shadow: "shadow-pink-600/20" },
    brown: { bg: "bg-amber-100", text: "text-amber-700", button: "bg-amber-700", shadow: "shadow-amber-700/20" },
    gold: { bg: "bg-yellow-50", text: "text-yellow-700", button: "bg-yellow-700", shadow: "shadow-yellow-700/20" }
};

// Render service cards
function renderServiceCards(services) {
    const grid = document.getElementById('service-grid');
    if (!grid) {
        console.error('service-grid element not found!');
        return;
    }

    console.log('Rendering', services.length, 'services...');

    grid.innerHTML = services.map(service => {
        const colors = colorClasses[service.color] || colorClasses.primary;
        // Use specific link if available, otherwise use dynamic detail page
        let href = service.link;
        if (!href) {
            if (service.category === 'usaha') {
                href = `detaillayanan-pendirian.html?id=${service.id}`;
            } else if (service.category === 'pajak') {
                href = `detaillayanan-perpajakan.html?id=${service.id}`;
            } else if (service.category === 'lanjutan') {
                href = `detaillayanan-lanjutan.html?id=${service.id}`;
            } else {
                href = `detaillayanan.html?id=${service.id}`;
            }
        }

        return `
            <div class="service-card group p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] bg-white dark:bg-gray-800/50 border-2 border-gray-100 dark:border-gray-700 hover:border-primary hover:shadow-[0_20px_50px_rgba(42,107,167,0.05)] transition-all duration-500"
                data-category="${service.category}">
                <div class="size-14 md:size-16 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center mb-6 md:mb-8 transition-transform group-hover:rotate-12">
                    <span class="material-symbols-outlined text-3xl md:text-4xl">${service.icon}</span>
                </div>
                <h3 class="text-xl md:text-2xl font-black mb-3 md:mb-4 dark:text-white">${service.name}</h3>
                <p class="text-gray-500 text-sm md:text-base leading-relaxed mb-6 md:mb-8 font-medium italic">
                    "Layanan profesional & terpercaya."</p>
                <div class="pt-6 md:pt-8 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mulai Dari</p>
                        <p class="text-lg md:text-xl font-black ${colors.text}">${service.price}</p>
                    </div>
                    <a href="${href}"
                        class="size-10 md:size-12 rounded-2xl ${colors.button} text-white flex items-center justify-center shadow-lg ${colors.shadow} hover:scale-105 transition-all">
                        <span class="material-symbols-outlined">chevron_right</span>
                    </a>
                </div>
            </div>
        `;
    }).join('');

    console.log('Services rendered successfully!');
}

// Filter functionality
function setupServiceFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    console.log('Found', filterButtons.length, 'filter buttons');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            console.log('Filtering by category:', category);

            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active', 'bg-primary', 'text-white'));
            button.classList.add('active', 'bg-primary', 'text-white');

            // Filter services
            const filteredServices = category === 'all'
                ? allServices
                : allServices.filter(s => s.category === category);

            console.log('Filtered services count:', filteredServices.length);
            renderServiceCards(filteredServices);
        });
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Services.js loaded! Total services:', allServices.length);
    renderServiceCards(allServices);
    setupServiceFilters();
});
