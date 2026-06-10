import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Kebijakan Privasi' };

const SECTIONS = [
  { title: '1. Informasi yang Kami Kumpulkan', content: 'Kami mengumpulkan informasi yang kamu berikan saat mendaftar, termasuk nama, alamat email, dan preferensi trading. Kami juga mengumpulkan data penggunaan seperti halaman yang dikunjungi dan fitur yang digunakan untuk meningkatkan layanan kami.' },
  { title: '2. Penggunaan Informasi', content: 'Informasi yang dikumpulkan digunakan untuk menyediakan dan meningkatkan layanan TradeSignal Pro, mengirimkan notifikasi sinyal trading, komunikasi terkait akun, dan analisis untuk pengembangan produk.' },
  { title: '3. Keamanan Data', content: 'Kami menggunakan enkripsi SSL/TLS untuk melindungi data yang ditransmisikan. Password disimpan dalam bentuk hash menggunakan bcrypt. Data disimpan di server Supabase PostgreSQL dengan akses terbatas.' },
  { title: '4. Berbagi Data', content: 'Kami tidak menjual, menyewakan, atau membagikan informasi pribadi kamu kepada pihak ketiga tanpa persetujuan, kecuali diwajibkan oleh hukum atau untuk keperluan layanan seperti payment gateway.' },
  { title: '5. Cookie', content: 'Kami menggunakan cookie untuk menjaga sesi login dan preferensi pengguna. Kamu dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur mungkin tidak berfungsi dengan baik.' },
  { title: '6. Hak Pengguna', content: 'Kamu berhak mengakses, memperbarui, atau menghapus data pribadi kamu kapan saja. Hubungi kami di sinyalsaham93@gmail.com untuk permintaan terkait data.' },
  { title: '7. Perubahan Kebijakan', content: 'Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform.' },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Kebijakan Privasi</h1>
            <p className="text-[#4A6080] text-sm">Terakhir diperbarui: Juni 2025</p>
          </div>
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title} className="p-6 rounded-2xl glass border border-white/8">
                <h2 className="text-white font-semibold text-base mb-3">{s.title}</h2>
                <p className="text-[#8BA8C2] leading-relaxed text-sm">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
