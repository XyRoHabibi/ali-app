import Link from "next/link";
import Image from "next/image";

const serviceLinks = [
    { href: "/layanan-pt", label: "PT Perorangan" },
    { href: "/layanan-cv", label: "Pendirian CV" },
    { href: "/layanan-haki", label: "Daftar Merek" },
    { href: "/layanan-pt-biasa", label: "PT Umum" },
];

const companyLinks = [
    { href: "/tentang", label: "Tentang Kami" },
    { href: "/blog", label: "Blog & Artikel" },
    { href: "/faq", label: "Pusat Bantuan" },
    { href: "/karir", label: "Karir" },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-16">
            <div className="max-w-[1200px] mx-auto px-6 grid md:grid-cols-4 gap-12">
                {/* Brand & Social */}
                <div className="space-y-1">
                    <Image
                        src="/images/logo-color.png"
                        alt="ALI Logo Footer"
                        width={160}
                        height={40}
                        className="h-25 w-auto object-contain"
                    />
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        Partner legalitas bisnis terpercaya di Indonesia. Membantu UMKM naik
                        kelas dengan proses yang mudah, cepat, dan transparan.
                    </p>

                    {/* Social Icons */}
                    <div className="flex gap-4 pt-6">
                        <Link
                            href="https://www.instagram.com/akseslegal.id?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-[#2a6ba7] hover:bg-[#2a6ba7] hover:text-white transition-all"
                        >
                            <i className="fa-brands fa-instagram"></i>
                        </Link>
                        <Link
                            href="https://www.facebook.com/akseslegal.id/"
                            className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-[#2a6ba7] hover:bg-[#2a6ba7] hover:text-white transition-all"
                        >
                            <i className="fa-brands fa-facebook"></i>
                        </Link>
                        <Link
                            href="https://www.tiktok.com/@akseslegal.id?is_from_webapp=1&sender_device=pc"
                            className="size-10 rounded-full bg-gray-100 flex items-center justify-center text-[#2a6ba7] hover:bg-[#2a6ba7] hover:text-white transition-all"
                        >
                            <i className="fa-brands fa-tiktok"></i>
                        </Link>
                    </div>
                </div>

                {/* Layanan */}
                <div>
                    <h4 className="font-black mb-6 text-gray-900">Layanan</h4>
                    <ul className="space-y-3 text-sm font-bold text-gray-500">
                        {serviceLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="hover:text-[#2a6ba7] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Perusahaan */}
                <div>
                    <h4 className="font-black mb-6 text-gray-900">Perusahaan</h4>
                    <ul className="space-y-3 text-sm font-bold text-gray-500">
                        {companyLinks.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="hover:text-[#2a6ba7] transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact & Download */}
                <div className="flex flex-col h-full">
                    <h4 className="font-black mb-6 text-gray-900">Hubungi Kami</h4>
                    <ul className="space-y-4 text-sm font-bold text-gray-500 mb-8">
                        <li className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-[#2a6ba7] text-lg shrink-0">
                                location_on
                            </span>
                            <span className="leading-tight">
                                Jl. A. P. Pettarani No.9, Sinrijala, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan, Indonesia
                            </span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#2a6ba7] text-lg shrink-0">
                                call
                            </span>
                            +62 853-3333-8818
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#2a6ba7] text-lg shrink-0">
                                mail
                            </span>
                            info.akseslegal.id@gmail.com
                        </li>
                    </ul>

                    {/* Store Buttons */}
                    <div className="mt-auto pt-6 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
                            Download Aplikasi
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Google Play */}
                            <Link
                                href="https://play.google.com/store/apps/details?id=com.wasdlabs.ali&hl=in&pli=1"
                                target="_blank"
                                className="flex-1 inline-flex items-center justify-center gap-3 bg-black text-white px-3 py-2.5 rounded-xl hover:opacity-80 transition-all shadow-md group"
                            >
                                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.17,10.87C21.17,11.25 21.17,12.75 20.17,13.13L17.89,14.5L15.39,12L17.89,9.5L20.17,10.87M16.81,8.88L14.54,11.15L6.05,2.66L16.81,8.88Z" />
                                </svg>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] uppercase font-bold opacity-80 leading-none mb-0.5">
                                        Get it on
                                    </span>
                                    <span className="text-xs font-black leading-none">
                                        Google Play
                                    </span>
                                </div>
                            </Link>
                            {/* App Store */}
                            <Link
                                href="#"
                                target="_blank"
                                className="flex-1 inline-flex items-center justify-center gap-3 bg-black text-white px-3 py-2.5 rounded-xl hover:opacity-80 transition-all shadow-md group"
                            >
                                <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                                    <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.37 12.36,4.26 13,3.5Z" />
                                </svg>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] uppercase font-bold opacity-80 leading-none mb-0.5">
                                        Download on
                                    </span>
                                    <span className="text-xs font-black leading-none">
                                        App Store
                                    </span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-[1200px] mx-auto px-6 mt-16 pt-8 border-t border-gray-100 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                &copy; 2025 PT Akses Legal Indonesia. All Rights Reserved.
            </div>
        </footer>
    );
}
