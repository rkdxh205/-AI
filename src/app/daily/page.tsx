'use client';

import { useState } from 'react';
import SajuForm from '@/components/SajuForm';
import type { SajuInput } from '@/lib/saju/types';

export default function DailyPage() {
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');

  const today = new Date();
  const todayStr = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;

  const handleSubmit = async (input: SajuInput) => {
    setLoading(true);
    setError(null);
    setName(input.name || '');
    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReading(data.reading);
    } catch (err) {
      setError(err instanceof Error ? err.message : '운세 분석 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-red-900 hanja mb-2">🌅 오늘의 운세</h1>
        <p className="text-amber-700">{todayStr} 당신의 운세를 확인하세요</p>
      </div>

      {!reading ? (
        <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
          <SajuForm onSubmit={handleSubmit} loading={loading} />
        </div>
      ) : (
        <div className="space-y-4 fade-in">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <h2 className="text-lg font-bold text-red-900 mb-1">
              {name ? `${name}님의 ` : ''}{todayStr} 운세
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mt-3">{reading}</p>
          </div>
          <button
            onClick={() => setReading(null)}
            className="w-full py-3 border-2 border-red-900 text-red-900 rounded-xl font-semibold hover:bg-red-50"
          >
            다시 확인하기
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
