'use client';

import { useState } from 'react';
import type { SajuInput } from '@/lib/saju/types';

const HOURS = [
  { value: 23, label: '자시 (子時) 23:00~01:00' },
  { value: 1, label: '축시 (丑時) 01:00~03:00' },
  { value: 3, label: '인시 (寅時) 03:00~05:00' },
  { value: 5, label: '묘시 (卯時) 05:00~07:00' },
  { value: 7, label: '진시 (辰時) 07:00~09:00' },
  { value: 9, label: '사시 (巳時) 09:00~11:00' },
  { value: 11, label: '오시 (午時) 11:00~13:00' },
  { value: 13, label: '미시 (未時) 13:00~15:00' },
  { value: 15, label: '신시 (申時) 15:00~17:00' },
  { value: 17, label: '유시 (酉時) 17:00~19:00' },
  { value: 19, label: '술시 (戌時) 19:00~21:00' },
  { value: 21, label: '해시 (亥時) 21:00~23:00' },
];

interface Props {
  onSubmit: (input: SajuInput) => void;
  loading: boolean;
}

export default function SajuForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<{
    name: string;
    gender: 'male' | 'female';
    birthYear: string;
    birthMonth: string;
    birthDay: string;
    birthHour: string;
    isLunar: boolean;
  }>({
    name: '',
    gender: 'male',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthHour: '',
    isLunar: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.birthYear || !form.birthMonth || !form.birthDay) return;
    onSubmit({
      name: form.name || undefined,
      gender: form.gender,
      birthYear: parseInt(form.birthYear),
      birthMonth: parseInt(form.birthMonth),
      birthDay: parseInt(form.birthDay),
      birthHour: form.birthHour ? parseInt(form.birthHour) : undefined,
      isLunar: form.isLunar,
    });
  };

  const labelCls = 'block text-sm font-semibold text-red-900 mb-1';
  const inputCls =
    'w-full border border-amber-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-red-700 text-gray-800';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>이름 (선택)</label>
          <input
            type="text"
            placeholder="홍길동"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>성별 *</label>
          <div className="flex gap-3 mt-2">
            {(['male', 'female'] as const).map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={() => setForm({ ...form, gender: g })}
                  className="accent-red-800"
                />
                <span className="text-sm text-gray-700">{g === 'male' ? '남성' : '여성'}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className={labelCls}>생년월일 *</label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isLunar}
              onChange={(e) => setForm({ ...form, isLunar: e.target.checked })}
              className="accent-red-800"
            />
            음력
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="년도 (예: 1990)"
            value={form.birthYear}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
              setForm({ ...form, birthYear: val });
            }}
            maxLength={4}
            required
            className={inputCls}
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="월 (1-12)"
            value={form.birthMonth}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 2);
              setForm({ ...form, birthMonth: val });
            }}
            maxLength={2}
            required
            className={inputCls}
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="일 (1-31)"
            value={form.birthDay}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 2);
              setForm({ ...form, birthDay: val });
            }}
            maxLength={2}
            required
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>태어난 시간 (선택)</label>
        <select
          value={form.birthHour}
          onChange={(e) => setForm({ ...form, birthHour: e.target.value })}
          className={inputCls}
        >
          <option value="">시간을 모릅니다</option>
          {HOURS.map((h) => (
            <option key={h.value} value={h.value}>
              {h.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-amber-700 mt-1">시간을 알면 더 정확한 사주 분석이 가능합니다.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-red-900 text-amber-100 rounded-xl font-bold text-lg
                   hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-md hover:shadow-lg"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="40 20" />
            </svg>
            AI가 사주를 분석중입니다...
          </span>
        ) : (
          '✨ 사주 보기'
        )}
      </button>
    </form>
  );
}
