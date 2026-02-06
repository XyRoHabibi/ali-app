"use client";

import { useState } from "react";

const faqData = [
    {
        question: "Apa perbedaan utama antara PT dan CV?",
        answer:
            "PT (Perseroan Terbatas) adalah badan hukum yang memisahkan harta kekayaan pemilik dari perusahaan, sehingga tanggung jawab finansial terbatas hanya pada modal yang disetorkan. Ini cocok untuk usaha skala besar yang berorientasi profit.\n\nCV adalah persekutuan bisnis yang tidak memiliki badan hukum. Tanggung jawabnya tidak terbatas, artinya harta kekayaan pribadi pemilik dapat ikut dipertanggungjawabkan. CV lebih fleksibel dan cocok untuk usaha kecil hingga menengah.",
    },
    {
        question: "Berapa lama waktu yang dibutuhkan untuk mendirikan PT?",
        answer:
            "Dengan layanan dari Akses Legal Indonesia, proses pendirian PT dapat diselesaikan dengan cepat, biasanya hanya dalam waktu 5-7 hari kerja. Waktu ini sudah termasuk pengurusan Akta Notaris, SK Kemenkumham, NPWP, dan NIB.",
    },
    {
        question: "Mengapa saya harus mendaftarkan merek dagang?",
        answer:
            "Mendaftarkan merek dagang sangat penting untuk melindungi identitas bisnis Anda dari penggunaan ilegal oleh pihak lain. Dengan sertifikat merek dagang yang sah dari DJKI, Anda memiliki hak eksklusif untuk menggunakan merek tersebut, dan bisa menuntut jika ada yang menjiplak.",
    },
    {
        question: "Apa perbedaan mendasar antara Yayasan dan PT?",
        answer:
            "Yayasan adalah badan hukum yang didirikan untuk tujuan sosial, kemanusiaan, atau keagamaan, dan tidak memiliki anggota atau pemilik dalam artian profit.\n\nPT (Perseroan Terbatas) adalah badan usaha yang bertujuan mencari profit. Perbedaan utama terletak pada tujuan pendirian dan pengelolaan dana.",
    },
    {
        question: "Apa itu NIB dan mengapa penting?",
        answer:
            "NIB (Nomor Induk Berusaha) adalah identitas pelaku usaha yang diterbitkan oleh sistem OSS. NIB berfungsi sebagai izin usaha, Tanda Daftar Perusahaan (TDP), dan Angka Pengenal Importir (API) sekaligus. Dengan NIB, Anda bisa memulai kegiatan usaha secara resmi dan terintegrasi dengan sistem perizinan lainnya.",
    },
    {
        question: "Apa bedanya NPWP Pribadi dan NPWP Perusahaan?",
        answer:
            "NPWP Pribadi adalah Nomor Pokok Wajib Pajak untuk individu (perorangan) yang digunakan untuk membayar pajak penghasilan pribadi.\n\nNPWP Perusahaan adalah NPWP untuk badan usaha, seperti PT, CV, atau Yayasan. Ini digunakan untuk melaporkan dan membayar pajak yang terkait dengan kegiatan bisnis perusahaan. Kedua NPWP ini wajib dimiliki dan dipisahkan.",
    },
    {
        question:
            "Bagaimana cara saya tahu KBLI (Klasifikasi Baku Lapangan Usaha) yang tepat untuk usaha saya?",
        answer:
            "Anda dapat mencari KBLI di sistem OSS RBA (Online Single Submission Risk Based Approach) atau berkonsultasi langsung dengan tim Akses Legal Indonesia. Kami akan membantu mencocokkan jenis usaha Anda dengan KBLI yang paling sesuai, sehingga legalitas bisnis Anda sah dan terhindar dari masalah di kemudian hari.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="bg-gray-100 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 w-full">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#142A5C] mb-4">
                        <i className="fas fa-question-circle text-[#FF8C00] mr-2"></i>
                        Pertanyaan Yang Sering Diajukan
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto">
                        Temukan jawaban untuk pertanyaan umum seputar Legalitas Usaha
                    </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg border-t-4 border-[#142A5C] overflow-hidden"
                        >
                            <button
                                className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none transition-colors duration-200"
                                onClick={() => toggleFAQ(index)}
                            >
                                <h3 className="text-base sm:text-lg font-semibold text-[#142A5C] pr-4">
                                    {faq.question}
                                </h3>
                                <svg
                                    className={`w-6 h-6 text-[#142A5C] transform transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-96" : "max-h-0"
                                    }`}
                            >
                                <div className="px-6 pb-6 pt-2 border-t border-gray-200">
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
