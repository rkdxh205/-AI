import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '사주명리 AI - 당신의 사주를 AI가 풀어드립니다',
  description: '전통 만세력과 AI가 결합된 정확하고 상세한 사주 풀이 서비스. 사주팔자, 궁합, 오늘의 운세를 무료로 확인하세요.',
  keywords: '사주, 사주팔자, 사주풀이, 궁합, 오늘의운세, AI사주, 만세력',
  openGraph: {
    title: '사주명리 AI - 무료 사주 풀이',
    description: '전통 만세력 + AI로 당신의 사주를 상세히 분석해드립니다.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-amber-50">
        <header className="bg-red-900 text-amber-100 py-3 px-6 flex items-center justify-between shadow-md">
          <a href="/" className="text-xl font-bold hanja tracking-wider">☯ 사주명리 AI</a>
          <nav className="flex gap-6 text-sm">
            <a href="/" className="hover:text-amber-300 transition-colors">사주</a>
            <a href="/gunghap" className="hover:text-amber-300 transition-colors">궁합</a>
            <a href="/daily" className="hover:text-amber-300 transition-colors">오늘의 운세</a>
          </nav>
        </header>
        <main>{children}</main>
        <footer className="mt-16 py-8 text-center text-sm text-amber-800 border-t border-amber-200 bg-amber-100">
          <p>사주명리 AI는 전통 만세력 알고리즘과 AI를 결합한 서비스입니다.</p>
          <p className="mt-1 text-amber-600">사주 풀이는 참고용이며, 중요한 결정은 전문가와 상담하세요.</p>
        </footer>
      </body>
    </html>
  );
}
