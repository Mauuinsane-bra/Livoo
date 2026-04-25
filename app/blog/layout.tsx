import type { Metadata } from 'next'
import BlogSubnav from './BlogSubnav'

export const metadata: Metadata = {
  title: {
    default: 'Blog — Go Livoo',
    template: '%s — Blog Go Livoo',
  },
  description: 'Roteiros, promoções e guias de viagem. Sem papo furado, direto ao ponto.',
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Fontes específicas do blog */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400..900&family=DM+Sans:opsz,wght@9..40,400..800&family=JetBrains+Mono:wght@400;600&display=swap');

        .blog-root {
          --bg:#ffffff;
          --bg-2:#fafaf8;
          --bg-soft:#f5f2ec;
          --ink:#161413;
          --ink-2:#3a3735;
          --muted:#70685f;
          --line:#ececea;
          --line-2:#dbd6cf;
          --orange:#1A56DB;
          --orange-dk:#1445B0;
          --coral:#2B6EE6;
          --sun:#B3D1FF;
          --jade:#06a06b;
          --sky:#2b74ff;
          font-family: 'DM Sans', system-ui, sans-serif;
          background: var(--bg);
          color: var(--ink);
        }
        .blog-root .display {
          font-family: 'Archivo', sans-serif;
          font-variation-settings: "wght" 800;
          letter-spacing: -.03em;
          line-height: .95;
        }
        .blog-root .mono {
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: .02em;
        }
        .blog-root a { color: inherit; text-decoration: none; }
        .blog-wrap { max-width: 1340px; margin: 0 auto; padding: 0 20px; }
        .blog-wrap-narrow { max-width: 760px; margin: 0 auto; padding: 0 20px; }

        /* Subnav */
        .blog-subnav {
          background: var(--bg-2);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 35;
        }
        .blog-subnav .inner {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 20px;
          max-width: 1340px;
          margin: 0 auto;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .blog-subnav .inner::-webkit-scrollbar { display: none; }
        .blog-subnav .brand {
          font-family: 'Archivo', sans-serif;
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -.03em;
          margin-right: 10px;
          white-space: nowrap;
          color: var(--ink);
        }
        .blog-subnav .brand .d { color: var(--orange); }
        .blog-subnav .cats {
          display: flex;
          gap: 6px;
          flex: 1;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .blog-subnav .cats::-webkit-scrollbar { display: none; }
        .blog-subnav .cats a {
          white-space: nowrap;
          padding: 8px 14px;
          border-radius: 999px;
          background: var(--bg);
          font-size: 13px;
          font-weight: 600;
          color: var(--ink);
          display: inline-flex;
          gap: 8px;
          align-items: center;
          border: 1.5px solid transparent;
          transition: border-color .15s;
        }
        .blog-subnav .cats a:hover { border-color: var(--ink); }
        .blog-subnav .cats a.on { background: var(--ink); color: #fff; }
        .blog-subnav .cats a .n {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          opacity: .55;
        }
        .blog-subnav .chip {
          background: var(--bg-soft);
          color: var(--ink);
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 11px;
          margin-left: auto;
          flex: 0 0 auto;
          display: inline-flex;
          gap: 6px;
          align-items: center;
          border: 1px solid var(--line-2);
        }
        .blog-subnav .dot {
          width: 6px; height: 6px;
          border-radius: 999px;
          background: var(--orange);
          animation: blog-pulse 1.6s infinite;
        }
        @keyframes blog-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }

        /* Post cards */
        .blog-post-card {
          display: flex;
          flex-direction: column;
          cursor: pointer;
          background: var(--bg-2);
          border-radius: 16px;
          overflow: hidden;
          transition: transform .15s, box-shadow .15s;
          border: 1.5px solid var(--line);
        }
        .blog-post-card:hover { transform: translateY(-3px); box-shadow: 0 12px 24px -12px rgba(26,20,16,.12); }
        .blog-post-card:hover .pc-title { color: var(--orange); }
      `}</style>

      <div className="blog-root">
        <BlogSubnav />
        {children}
      </div>
    </>
  )
}
