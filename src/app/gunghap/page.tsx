'use client';

import { useState } from 'react';
import SajuForm from '@/components/SajuForm';
import type { SajuInput, GunghapReading } from '@/lib/saju/types';

export default function GunghapPage() {
  const [person1, setPerson1] = useState<SajuInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reading: GunghapReading } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2>(1);

  const handlePerson1 = (input: SajuInput) => {
    setPerson1(input);
    setStep(2);
  };

  const handlePerson2 = async (input: SajuInput) => {
    if (!person1) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/gunghap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ person1, person2: input }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '궁합 분석 실패');
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700';
    if (score >= 60) return 'text-amber-700';
    return 'text-red-700';
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-900 hanja mb-2">💑 궁합 분석</h1>
        <p className="text-amber-700">두 사람의 사주 궁합을 AI가 상세히 분석합니다</p>
      </div>

      {/* 진행 단계 */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
              ${step >= s ? 'bg-red-900 text-amber-100' : 'bg-amber-200 text-amber-700'}`}
            >
              {s}
            </div>
            <span className="text-sm text-amber-800">{s === 1 ? '첫 번째 사람' : '두 번째 사람'}</span>
            {s < 2 && <span className="text-amber-300">→</span>}
          </div>
        ))}
      </div>

      {!result ? (
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
          <h2 className="text-lg font-bold text-red-900 mb-4">
            {step === 1 ? '첫 번째 사람 정보' : '두 번째 사람 정보'}
          </h2>
          <SajuForm onSubmit={step === 1 ? handlePerson1 : handlePerson2} loading={loading} />
        </div>
      ) : (
        <div className="space-y-6 fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 text-center">
            <h2 className="text-xl font-bold text-red-900 mb-4">궁합 점수</h2>
            <div className={`text-7xl font-bold ${scoreColor(result.reading.score)}`}>
              {result.reading.score}
            </div>
            <div className="text-lg text-amber-700 mt-1">/ 100점</div>
            <p className="mt-4 text-gray-700 leading-relaxed">{result.reading.summary}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <h3 className="font-bold text-red-900 mb-3">오행 조화 분석</h3>
            <p className="text-gray-700 leading-relaxed">{result.reading.compatibility}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-bold text-green-800 mb-2">✨ 잘 맞는 점</h4>
              <ul className="space-y-1">
                {result.reading.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-700">• {s}</li>
                ))}
              </ul>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <h4 className="font-bold text-orange-800 mb-2">⚠️ 주의할 점</h4>
              <ul className="space-y-1">
                {result.reading.challenges.map((c, i) => (
                  <li key={i} className="text-sm text-orange-700">• {c}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-bold text-amber-900 mb-2">💌 관계 조언</h4>
            <p className="text-gray-700 leading-relaxed">{result.reading.advice}</p>
          </div>

          <button
            onClick={() => { setResult(null); setStep(1); setPerson1(null); }}
            className="w-full py-3 border-2 border-red-900 text-red-900 rounded-xl font-semibold hover:bg-red-50"
          >
            다시 분석하기
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-50 border border-red-300 rounded-xl p-4 text-red-800">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
