export type HeavenlyStem = '갑' | '을' | '병' | '정' | '무' | '기' | '경' | '신' | '임' | '계';
export type EarthlyBranch = '자' | '축' | '인' | '묘' | '진' | '사' | '오' | '미' | '신' | '유' | '술' | '해';
export type Element = '목' | '화' | '토' | '금' | '수';
export type YinYang = '양' | '음';

export interface Pillar {
  heavenlyStem: HeavenlyStem;
  earthlyBranch: EarthlyBranch;
  element: Element;
  yinYang: YinYang;
  stemChar: string; // 한자
  branchChar: string; // 한자
}

export interface ElementCount {
  목: number;
  화: number;
  토: number;
  금: number;
  수: number;
}

export interface MajorFortune {
  startAge: number;
  endAge: number;
  pillar: Pillar;
}

export interface SajuChart {
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar | null;
  elements: ElementCount;
  majorFortunes: MajorFortune[];
  currentMajorFortune: MajorFortune | null;
}

export interface SajuInput {
  name?: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number; // 0-23, undefined = 모름
  isLunar?: boolean;
}

export interface FortuneSection {
  career: string;
  love: string;
  health: string;
  relationship: string;
}

export interface LuckyItems {
  color: string;
  direction: string;
  number: string;
  element: string;
}

export interface SajuReading {
  summary: string;
  personality: string;
  fortune: FortuneSection;
  strengths: string[];
  challenges: string[];
  luckyItems: LuckyItems;
  majorFortuneReading: string;
  advice: string;
}

export interface GunghapReading {
  score: number; // 0-100
  summary: string;
  compatibility: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}
