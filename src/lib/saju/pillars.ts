import type { SajuInput, SajuChart, Pillar, ElementCount, MajorFortune } from './types';
import {
  HEAVENLY_STEMS, EARTHLY_BRANCHES,
  STEM_HANJA, BRANCH_HANJA,
  STEM_ELEMENT, BRANCH_ELEMENT,
  STEM_YIN_YANG, BRANCH_YIN_YANG,
  HOUR_TO_BRANCH_INDEX, SOLAR_TERMS_APPROX,
} from './constants';

function makePillar(stemIdx: number, branchIdx: number): Pillar {
  const stem = HEAVENLY_STEMS[stemIdx % 10];
  const branch = EARTHLY_BRANCHES[branchIdx % 12];
  return {
    heavenlyStem: stem,
    earthlyBranch: branch,
    element: STEM_ELEMENT[stem],
    yinYang: STEM_YIN_YANG[stem],
    stemChar: STEM_HANJA[stem],
    branchChar: BRANCH_HANJA[branch],
  };
}

// 율리우스 날짜 계산
function toJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4)
    - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

// 년주 계산 (입춘 기준)
function getYearPillar(year: number, month: number, day: number): Pillar {
  // 입춘: 대략 2월 4일 (더 정확하게는 절기 계산 필요)
  const lichunApprox = SOLAR_TERMS_APPROX[2][0]; // 2월 4일
  let effectiveYear = year;
  if (month === 1 || (month === 2 && day < lichunApprox)) {
    effectiveYear = year - 1;
  }
  // 1864년 = 갑자년 기준
  const diff = effectiveYear - 1864;
  const stemIdx = ((diff % 10) + 10) % 10;
  const branchIdx = ((diff % 12) + 12) % 12;
  return makePillar(stemIdx, branchIdx);
}

// 월주 계산 (절기 기준)
function getMonthPillar(year: number, month: number, day: number, yearStemIdx: number): Pillar {
  // 절입일 이전이면 전달 처리
  const termDay = SOLAR_TERMS_APPROX[month]?.[0] ?? 6;
  let effectiveMonth = month;
  if (day < termDay) {
    effectiveMonth = month - 1 === 0 ? 12 : month - 1;
  }

  // 인월(寅月) = 양력 2월, 월지 기준: 인(2)=0번째 월
  // 월지: 인묘진사오미신유술해자축 (2월~1월)
  // effectiveMonth 1=자월, 2=인월 기준으로 조정
  const monthBranchMap: Record<number, number> = {
    1: 11, 2: 0, 3: 1, 4: 2, 5: 3, 6: 4,
    7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10,
  };
  const branchIdx = (monthBranchMap[effectiveMonth] + 2) % 12; // 인=2

  // 월간 = 년간에 따라 결정 (오자법)
  const monthStemBase: Record<number, number> = {
    0: 2, 1: 4, 2: 6, 3: 8, 4: 0, // 갑기년=병인, 을경=무인, 병신=경인, 정임=임인, 무계=갑인
    5: 2, 6: 4, 7: 6, 8: 8, 9: 0,
  };
  const base = monthStemBase[yearStemIdx];
  const monthsFromYin = monthBranchMap[effectiveMonth]; // 인월부터 오프셋
  const stemIdx = (base + monthsFromYin) % 10;

  return makePillar(stemIdx, branchIdx);
}

// 일주 계산
function getDayPillar(year: number, month: number, day: number): Pillar {
  // 기준: 1900년 1월 1일 = 갑술(甲戌) = 간지 index (0, 10)
  const baseJD = toJulianDay(1900, 1, 1); // 갑술일
  const targetJD = toJulianDay(year, month, day);
  const diff = targetJD - baseJD;
  const stemIdx = ((diff % 10) + 10) % 10;
  const branchIdx = ((diff + 10) % 12 + 12) % 12; // 술=10번째 지지
  return makePillar(stemIdx, (branchIdx + 10) % 12);
}

// 시주 계산
function getHourPillar(hour: number, dayStemIdx: number): Pillar {
  const branchIdx = HOUR_TO_BRANCH_INDEX[hour] ?? 0;
  // 시간 천간: 일간 기준 (갑기일=갑자시)
  const hourStemBase: Record<number, number> = {
    0: 0, 1: 2, 2: 4, 3: 6, 4: 8,
    5: 0, 6: 2, 7: 4, 8: 6, 9: 8,
  };
  const base = hourStemBase[dayStemIdx];
  const stemIdx = (base + branchIdx) % 10;
  return makePillar(stemIdx, branchIdx);
}

// 오행 카운트
function countElements(pillars: (Pillar | null)[]): ElementCount {
  const count: ElementCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  for (const p of pillars) {
    if (!p) continue;
    count[STEM_ELEMENT[p.heavenlyStem]]++;
    count[BRANCH_ELEMENT[p.earthlyBranch]]++;
  }
  return count;
}

// 대운 계산 (절기 기준 간단 버전)
function getMajorFortunes(
  yearPillar: Pillar,
  monthPillar: Pillar,
  gender: 'male' | 'female',
  startAge: number,
): MajorFortune[] {
  const fortunes: MajorFortune[] = [];
  const yearStemIdx = HEAVENLY_STEMS.indexOf(yearPillar.heavenlyStem);
  const isYangYear = yearStemIdx % 2 === 0; // 갑병무경임 = 양년
  const forward = (gender === 'male' && isYangYear) || (gender === 'female' && !isYangYear);

  const monthStemIdx = HEAVENLY_STEMS.indexOf(monthPillar.heavenlyStem);
  const monthBranchIdx = EARTHLY_BRANCHES.indexOf(monthPillar.earthlyBranch);

  for (let i = 0; i < 8; i++) {
    const offset = forward ? i + 1 : -(i + 1);
    const stemIdx = ((monthStemIdx + offset) % 10 + 10) % 10;
    const branchIdx = ((monthBranchIdx + offset) % 12 + 12) % 12;
    fortunes.push({
      startAge: startAge + i * 10,
      endAge: startAge + (i + 1) * 10 - 1,
      pillar: makePillar(stemIdx, branchIdx),
    });
  }
  return fortunes;
}

export function calculateSaju(input: SajuInput): SajuChart {
  const { birthYear, birthMonth, birthDay, birthHour, gender } = input;

  const yearPillar = getYearPillar(birthYear, birthMonth, birthDay);
  const yearStemIdx = HEAVENLY_STEMS.indexOf(yearPillar.heavenlyStem);

  const monthPillar = getMonthPillar(birthYear, birthMonth, birthDay, yearStemIdx);
  const dayPillar = getDayPillar(birthYear, birthMonth, birthDay);
  const dayStemIdx = HEAVENLY_STEMS.indexOf(dayPillar.heavenlyStem);

  const hourPillar = birthHour !== undefined
    ? getHourPillar(birthHour, dayStemIdx)
    : null;

  const elements = countElements([yearPillar, monthPillar, dayPillar, hourPillar]);

  // 대운 시작 나이 간단 계산 (실제로는 절기 날짜 기준)
  const majorFortuneStartAge = Math.floor(Math.random() * 5) + 3; // 3~7세 근사
  const majorFortunes = getMajorFortunes(yearPillar, monthPillar, gender, majorFortuneStartAge);

  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;
  const currentMajorFortune = majorFortunes.find(
    (f) => age >= f.startAge && age <= f.endAge,
  ) ?? null;

  return {
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    elements,
    majorFortunes,
    currentMajorFortune,
  };
}
