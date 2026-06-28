'use client';

import { useState } from 'react';
import SajuForm from '@/components/SajuForm';
import SajuChartDisplay from '@/components/SajuChart';
import SajuReadingDisplay from '@/components/SajuReading';
import PDFButton from '@/components/PDFButton';
import type { SajuInput, SajuChart, SajuReading } from '@/lib/saju/types';

interface SajuResult {
  chart: SajuChart;
  reading: SajuReading;
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SajuResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<SajuInput | null>(null);

  const handleSubmit = async (input: SajuInput) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setLastInput(input);

    try {
      const res = await fetch('/api/saju', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '사주 분석에 실패했습니다.');
      setResult(data);
      setTimeout(() => {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* 히어로 */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-900 hanja mb-3">사주명리 AI</h1>
        <p className="text-amber-700 text-lg">전통 만세력 + AI로 당신의 사주를 상세히 풀어드립니다</p>
        <div className="flex justify-center gap-6 mt-4 text-sm text-amber-600">
          <span>✔ 만세력 기반 정확한 계산</span>
          <span>✔ AI 상세 풀이</span>
          <span>✔ PDF 저장</span>
        </div>
      </div>

      {/* 입력 폼 */}
      <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-8">
        <h2 className="text-xl font-bold text-red-900 mb-5 flex items-center gap-2">
          <span>📝</span> 사주 정보 입력
        </h2>
        <SajuForm onSubmit={handleSubmit} loading={loading} />
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 mb-6 text-red-800">
          ⚠️ {error}
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div id="result-section" className="space-y-6 fade-in">
          {lastInput?.name && (
            <h2 className="text-2xl font-bold text-red-900 text-center">
              {lastInput.name}님의 사주 분석 결과
            </h2>
          )}

          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <SajuChartDisplay chart={result.chart} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6" id="saju-result">
            <SajuReadingDisplay reading={result.reading} />
          </div>

          <div className="flex justify-center gap-4">
            <PDFButton targetId="saju-result" filename={`사주풀이_${lastInput?.name || '결과'}`} />
            <button
              onClick={() => {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => alert('링크가 복사되었습니다!'));
              }}
              className="px-6 py-2 border-2 border-red-900 text-red-900 rounded-xl font-semibold
                         hover:bg-red-50 transition-colors"
            >
              🔗 링크 공유
            </button>
          </div>
        </div>
      )}

      {/* 서비스 소개 */}
      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            { icon: '🔮', title: '정확한 사주 계산', desc: '전통 만세력 알고리즘으로 사주팔자를 정확히 계산합니다.' },
            { icon: '🤖', title: 'AI 상세 풀이', desc: 'Claude AI가 성격, 직업운, 연애운, 건강 등을 상세히 분석합니다.' },
            { icon: '💑', title: '궁합 & 운세', desc: '두 사람의 궁합 분석과 오늘의 운세도 확인하세요.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <h3 className="font-bold text-red-900 mb-1">{title}</h3>
              <p className="text-sm text-amber-800">{desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
