import { useState } from 'react';

const FAQS = [
  {
    q: 'How does PDFmate guarantee document security and privacy?',
    a: 'Every file uploaded is transmitted across SSL encrypted pipes and processed directly in an isolated server memory sandbox. Documents are systematically purged and permanently destroyed 60 minutes after processing. We never store, inspect, or share your private data.',
  },
  {
    q: 'Is this service truly 100% free and open source?',
    a: 'Yes. Our core platform is engineered using free, open-source technology (pdf-lib, Node.js, Express, Sharp, React). Core operations like merging, splitting, compressing, rotating, watermarking, and protecting PDFs are free with no watermarks.',
  },
  {
    q: 'What is the maximum upload limit per file?',
    a: 'Free tier users can process files up to 10 MB each, with up to 20 files per merge session. The Pro tier unlocks 100 MB per file, unlimited batches, and upcoming AI processing.',
  },
  {
    q: 'Can I use PDFmate on my mobile smartphone or tablet?',
    a: 'Yes! The entire application is built to be 100% responsive across smartphones, tablets, laptops, and ultra-wide desktop monitors without installing any apps.',
  },
  {
    q: 'Do I need to sign up or create an account to use the tools?',
    a: 'No account is required. You can immediately drag and drop files and download the output. Creating a free account gives you a dashboard with file history, tracking metrics, and batch convenience.',
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-16 bg-[#07090E] border-t border-[#161C28]">
      <div className="section-container max-w-4xl">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#121622] border border-[#232B3D] text-zinc-300 text-xs font-bold mb-2 shadow-sm">
            <i className="bi bi-question-circle text-amber-400"></i> Help & Guidance
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            Transparent answers regarding privacy, limits, and processing.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`bg-[#0D111C] border rounded-2xl transition-all shadow-md ${
                  isOpen ? 'border-zinc-500 bg-[#121726]' : 'border-[#1E2638] hover:border-zinc-600'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-white gap-4"
                >
                  <span>{item.q}</span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-transform flex-shrink-0 ${
                      isOpen ? 'bg-amber-400 text-black font-bold rotate-180 shadow-xs' : 'bg-[#1A2130] text-zinc-400'
                    }`}
                  >
                    <i className="bi bi-chevron-down"></i>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-[#1E2638] pt-3 animate-fade-in">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
