import type { HeavenlyStem, EarthlyBranch, Element, YinYang } from './types';

export const HEAVENLY_STEMS: HeavenlyStem[] = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
export const EARTHLY_BRANCHES: EarthlyBranch[] = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

export const STEM_HANJA: Record<HeavenlyStem, string> = {
  갑: '甲', 을: '乙', 병: '丙', 정: '丁', 무: '戊',
  기: '己', 경: '庚', 신: '辛', 임: '壬', 계: '癸',
};

export const BRANCH_HANJA: Record<EarthlyBranch, string> = {
  자: '子', 축: '丑', 인: '寅', 묘: '卯', 진: '辰',
  사: '巳', 오: '午', 미: '未', 신: '申', 유: '酉',
  술: '戌', 해: '亥',
};

export const BRANCH_ANIMAL: Record<EarthlyBranch, string> = {
  자: '쥐', 축: '소', 인: '호랑이', 묘: '토끼', 진: '용',
  사: '뱀', 오: '말', 미: '양', 신: '원숭이', 유: '닭',
  술: '개', 해: '돼지',
};

export const STEM_ELEMENT: Record<HeavenlyStem, Element> = {
  갑: '목', 을: '목', 병: '화', 정: '화', 무: '토',
  기: '토', 경: '금', 신: '금', 임: '수', 계: '수',
};

export const BRANCH_ELEMENT: Record<EarthlyBranch, Element> = {
  자: '수', 축: '토', 인: '목', 묘: '목', 진: '토',
  사: '화', 오: '화', 미: '토', 신: '금', 유: '금',
  술: '토', 해: '수',
};

export const STEM_YIN_YANG: Record<HeavenlyStem, YinYang> = {
  갑: '양', 을: '음', 병: '양', 정: '음', 무: '양',
  기: '음', 경: '양', 신: '음', 임: '양', 계: '음',
};

export const BRANCH_YIN_YANG: Record<EarthlyBranch, YinYang> = {
  자: '양', 축: '음', 인: '양', 묘: '음', 진: '양',
  사: '음', 오: '양', 미: '음', 신: '양', 유: '음',
  술: '양', 해: '음',
};

// 시지 매핑 (시간 → 지지 인덱스)
// 23:00-01:00 자시, 01:00-03:00 축시, ...
export const HOUR_TO_BRANCH_INDEX: Record<number, number> = {
  23: 0, 0: 0,   // 자
  1: 1, 2: 1,    // 축
  3: 2, 4: 2,    // 인
  5: 3, 6: 3,    // 묘
  7: 4, 8: 4,    // 진
  9: 5, 10: 5,   // 사
  11: 6, 12: 6,  // 오
  13: 7, 14: 7,  // 미
  15: 8, 16: 8,  // 신
  17: 9, 18: 9,  // 유
  19: 10, 20: 10, // 술
  21: 11, 22: 11, // 해
};

// 24절기 (양력 기준 월별 절기 날짜 - 근사값, 실제 계산은 더 정밀)
// [절기일, 중기일] 형태
export const SOLAR_TERMS_APPROX: Record<number, [number, number]> = {
  1: [6, 20],   // 소한, 대한
  2: [4, 19],   // 입춘, 우수
  3: [6, 21],   // 경칩, 춘분
  4: [5, 20],   // 청명, 곡우
  5: [6, 21],   // 입하, 소만
  6: [6, 21],   // 망종, 하지
  7: [7, 23],   // 소서, 대서
  8: [7, 23],   // 입추, 처서
  9: [8, 23],   // 백로, 추분
  10: [8, 23],  // 한로, 상강
  11: [7, 22],  // 입동, 소설
  12: [7, 22],  // 대설, 동지
};

export const ELEMENT_COLORS: Record<Element, string> = {
  목: '#22c55e',
  화: '#ef4444',
  토: '#f59e0b',
  금: '#a3a3a3',
  수: '#3b82f6',
};

export const ELEMENT_EMOJI: Record<Element, string> = {
  목: '🌳',
  화: '🔥',
  토: '🏔️',
  금: '⚡',
  수: '💧',
};
