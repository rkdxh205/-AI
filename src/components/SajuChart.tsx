'use client';

import type { SajuChart as SajuChartType } from '@/lib/saju/types';
import { ELEMENT_COLORS, ELEMENT_EMOJI, BRANCH_ANIMAL } from '@/lib/saju/constants';

interface Props {
  chart: SajuChartType;
}

const ELEMENT_LABELS = ['목', '화', '토', '금', '수'] as const;

export default function SajuChartDisplay({ chart }: Props) {
  const { yearPillar, monthPillar, dayPillar, hourPillar, elements } = chart;
  const pillars = [
    { label: '시주', pillar: hourPillar, note: '시간의 기운' },
    { label: '일주', pillar: dayPillar, note: '나 자신' },
    { label: '월주', pillar: monthPillar, note: '부모/형제' },
    { label: '년주', pillar: yearPillar, note: '조상/사회' },
  ];

  const totalElements = Object.values(elements).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* 사주 원국 */}
      <div>
        <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
          <span>☰</span> 사주원국 (四柱原局)
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {pillars.map(({ label, pillar, note }) => (
            <div
              key={label}
              className="flex flex-col items-center bg-white border-2 border-amber-200 rounded-xl p-3 shadow-sm"
            >
              <span className="text-xs text-amber-600 mb-1">{label}</span>
              {pillar ? (
                <>
                  <span className="text-3xl hanja font-bold text-red-900">{pillar.stemChar}</span>
                  <span className="text-3xl hanja font-bold text-gray-700">{pillar.branchChar}</span>
                  <span className="text-xs text-gray-500 mt-1">{pillar.heavenlyStem}{pillar.earthlyBranch}</span>
                  <span className="text-xs mt-1" style={{ color: ELEMENT_COLORS[pillar.element] }}>
                    {ELEMENT_EMOJI[pillar.element]} {pillar.element} {pillar.yinYang}
                  </span>
                  {label === '일주' && (
                    <span className="text-xs bg-red-100 text-red-800 rounded px-1 mt-1">나 자신</span>
                  )}
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <span className="text-2xl text-gray-300">?</span>
                  <span className="text-xs text-gray-400 mt-2 block">미입력</span>
                </div>
              )}
              <span className="text-xs text-gray-400 mt-1">{note}</span>
            </div>
          ))}
        </div>

        {/* 지지 동물 */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {pillars.map(({ label, pillar }) => (
            <div key={label} className="text-center text-xs text-amber-700">
              {pillar ? BRANCH_ANIMAL[pillar.earthlyBranch] : '-'}
            </div>
          ))}
        </div>
      </div>

      {/* 오행 분포 */}
      <div>
        <h3 className="text-lg font-bold text-red-900 mb-3 flex items-center gap-2">
          <span>⚖</span> 오행 분포 (五行分布)
        </h3>
        <div className="space-y-2">
          {ELEMENT_LABELS.map((el) => {
            const count = elements[el] || 0;
            const pct = totalElements > 0 ? Math.round((count / totalElements) * 100) : 0;
            return (
              <div key={el} className="flex items-center gap-3">
                <span className="w-8 text-sm font-bold" style={{ color: ELEMENT_COLORS[el] }}>
                  {ELEMENT_EMOJI[el]} {el}
                </span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: ELEMENT_COLORS[el],
                      minWidth: count > 0 ? '1.5rem' : '0',
                    }}
                  />
                </div>
                <span className="w-12 text-sm text-right text-gray-600">
                  {count}개 ({pct}%)
                </span>
              </div>
            );
          })}
        </div>
        {totalElements > 0 && (
          <p className="text-xs text-amber-700 mt-2">
            * 오행이 고르게 분포될수록 균형 잡힌 사주입니다.
          </p>
        )}
      </div>

      {/* 현재 대운 */}
      {chart.currentMajorFortune && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-red-900 mb-2">현재 대운 (大運)</h3>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl hanja font-bold text-red-800">
                {chart.currentMajorFortune.pillar.stemChar}{chart.currentMajorFortune.pillar.branchChar}
              </div>
              <div className="text-xs text-gray-600">
                {chart.currentMajorFortune.pillar.heavenlyStem}{chart.currentMajorFortune.pillar.earthlyBranch}
              </div>
            </div>
            <div className="text-sm text-gray-700">
              <p className="font-semibold">
                {chart.currentMajorFortune.startAge}세 ~ {chart.currentMajorFortune.endAge}세
              </p>
              <p className="text-xs text-amber-700 mt-1">
                오행: {chart.currentMajorFortune.pillar.element} {chart.currentMajorFortune.pillar.yinYang}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
