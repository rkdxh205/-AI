'use client';

import { useState } from 'react';
import type { SajuReading } from '@/lib/saju/types';

interface Props {
  reading: SajuReading;
}

const TABS = [
  { id: 'summary', label: '종합', icon: '☯' },
  { id: 'personality', label: '성격', icon: '🌟' },
  { id: 'career', label: '직업/재물', icon: '💰' },
  { id: 'love', label: '연애/결혼', icon: '❤️' },
  { id: 'health', label: '건강', icon: '🌿' },
  { id: 'relationship', label: '대인관계', icon: '🤝' },
  { id: 'fortune', label: '대운', icon: '🌊' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SajuReadingDisplay({ reading }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('summary');

  const contentMap: Record<TabId, React.ReactNode> = {
    summary: (
      <div className="space-y-4">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reading.summary}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-bold text-green-800 mb-2">✨ 강점</h4>
            <ul className="space-y-1">
              {reading.strengths.map((s, i) => (
                <li key={i} className="text-sm text-green-700 flex gap-2">
                  <span>•</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <h4 className="font-bold text-orange-800 mb-2">⚠️ 주의사항</h4>
            <ul className="space-y-1">
              {reading.challenges.map((c, i) => (
                <li key={i} className="text-sm text-orange-700 flex gap-2">
                  <span>•</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-900 mb-3">🎴 행운 아이템</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: '색상', value: reading.luckyItems.color },
              { label: '방향', value: reading.luckyItems.direction },
              { label: '숫자', value: reading.luckyItems.number },
              { label: '보완 오행', value: reading.luckyItems.element },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-xs text-amber-600">{label}</p>
                <p className="font-bold text-amber-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h4 className="font-bold text-red-900 mb-2">💌 종합 조언</h4>
          <p className="text-sm text-gray-700 leading-relaxed">{reading.advice}</p>
        </div>
      </div>
    ),
    personality: <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reading.personality}</p>,
    career: <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reading.fortune.career}</p>,
    love: <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reading.fortune.love}</p>,
    health: <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reading.fortune.health}</p>,
    relationship: <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reading.fortune.relationship}</p>,
    fortune: <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{reading.majorFortuneReading}</p>,
  };

  return (
    <div>
      <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
        <span>🔮</span> AI 사주 풀이
      </h3>

      {/* 탭 */}
      <div className="flex flex-wrap gap-1 mb-4 border-b border-amber-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-red-900 text-amber-100'
                : 'text-red-800 hover:bg-amber-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div className="fade-in min-h-[200px]">{contentMap[activeTab]}</div>
    </div>
  );
}
