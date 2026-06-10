import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata = { title: 'Syarat & Ketentuan' };

const SECTIONS = [
  { title: '1. Penerimaan Syarat', content: 'Dengan menggunakan TradeSignal Pro, kamu menyetujui syarat dan ketentuan ini. Jika kamu tidak menyetujui, harap hentikan penggunaan layanan kami.' },
  { title: '2. Deskripsi Layanan', content: 'TradeSignal Pro menyediakan sinyal trading otomatis berbasis analisis teknikal untuk saham Indonesia, saham asing, dan cryptocurrency. Layanan ini bersifat informatif dan tidak merupakan saran investasi resmi.' },
  { title: '3. Akun Pengguna', content: 'Kamu bertanggung jawab menjaga kerahasiaan kata sandi akun. Kami tidak bertanggung jawab atas kerugian akibat penggunaan akun yang tidak sah. Segera hubungi kami jika terjadi akses tidak sah.' },
  { title: '4. Langganan dan Pembayaran', content: 'Layanan premium tersedia dengan biaya langganan bulanan. Pembayaran tidak dapat dikembalikan setelah periode langganan dimulai. Kami berhak mengubah harga dengan pemberitahuan 30 hari sebelumnya.' },
  { title: '5. Penggunaan yang Dilarang', content: 'Dilarang menggunakan layanan untuk tujuan ilegal, menyebarkan sinyal kami kepada pihak lain tanpa izin, melakukan reverse engineering sistem kami, atau tindakan yang dapat merusak layanan.' },
  { title: '6. Batasan Tanggung Jawab', content: 'TradeSignal Pro tidak bertanggung jawab atas kerugian finansial yang timbul dari penggunaan sinyal kami. Semua keputusan investasi sepenuhnya menjadi tanggung jawab pengguna.' },
  { title: '7. Penghentian Layanan', content: 'Kami berhak menghentikan atau menangguhkan akun yang melanggar syarat ini tanpa pemberitahuan sebelumnya.' },
  { title: '8. Hukum yang Berlaku', content: 'Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia. Sengketa akan diselesaikan melalui musyawarah atau pengadilan yang berwenang di Indonesia.' },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Syarat & Ketentuan</h1>
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
