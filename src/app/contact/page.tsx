'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, MessageCircle, Send, Clock } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open mailto as fallback
    window.location.href = `mailto:sinyalsaham93@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Dari: ${form.name} (${form.email})\n\n${form.message}`)}`;
    setSent(true);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#060B18] pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-white mb-2">Hubungi Kami</h1>
            <p className="text-[#8BA8C2]">Ada pertanyaan? Kami siap membantu kamu.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: 'sinyalsaham93@gmail.com', href: 'mailto:sinyalsaham93@gmail.com', color: 'text-[#00D4FF]' },
                { icon: MessageCircle, label: 'Telegram', value: '@tradesignalpro', href: 'https://t.me/tradesignalpro', color: 'text-[#7B2FFF]' },
                { icon: Clock, label: 'Response Time', value: '1-2 hari kerja', href: null, color: 'text-[#00E676]' },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="p-5 rounded-2xl glass border border-white/8">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0`}>
                      <Icon size={16} className={color} />
                    </div>
                    <div>
                      <p className="text-[#4A6080] text-xs mb-0.5">{label}</p>
                      {href ? (
                        <a href={href} className={`text-sm font-semibold ${color} hover:underline`}>{value}</a>
                      ) : (
                        <p className="text-white text-sm font-semibold">{value}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="p-6 rounded-2xl glass border border-white/8">
                {sent ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#00E676]/20 flex items-center justify-center mx-auto mb-4">
                      <Send size={24} className="text-[#00E676]" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Pesan Terkirim!</h3>
                    <p className="text-[#8BA8C2] text-sm">Kami akan merespons dalam 1-2 hari kerja.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#8BA8C2] text-xs font-semibold mb-1.5 uppercase tracking-wider">Nama</label>
                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                          placeholder="Nama kamu" />
                      </div>
                      <div>
                        <label className="block text-[#8BA8C2] text-xs font-semibold mb-1.5 uppercase tracking-wider">Email</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                          placeholder="email@kamu.com" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#8BA8C2] text-xs font-semibold mb-1.5 uppercase tracking-wider">Subjek</label>
                      <input type="text" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} required
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#00D4FF]/50 transition-all"
                        placeholder="Topik pertanyaan" />
                    </div>
                    <div>
                      <label className="block text-[#8BA8C2] text-xs font-semibold mb-1.5 uppercase tracking-wider">Pesan</label>
                      <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-[#4A6080] focus:outline-none focus:border-[#00D4FF]/50 transition-all resize-none"
                        placeholder="Tulis pesanmu di sini..." />
                    </div>
                    <button type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00D4FF] to-[#7B2FFF] text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                      <Send size={14} /> Kirim Pesan
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
