# [Design] 사주 AI 에이전트 서비스

## Context Anchor

| 항목 | 내용 |
|------|------|
| **WHY** | 전통 만세력 + Claude AI로 누구나 정확한 사주 분석 |
| **WHO** | 한국어 사용자, 사주 관심 대중 |
| **SCOPE** | Next.js 14 + Vercel + Claude API + 만세력 TS |

---

## 1. 아키텍처 개요

```
사용자 브라우저
  └── Next.js (Vercel)
        ├── app/page.tsx              # 메인 입력 폼
        ├── app/result/page.tsx       # 사주 결과 페이지
        ├── app/gunghap/page.tsx      # 궁합 페이지
        ├── app/daily/page.tsx        # 오늘의 운세
        └── app/api/
              ├── saju/route.ts       # 사주 계산 + Claude 풀이
              ├── gunghap/route.ts    # 궁합 분석
              └── daily/route.ts      # 오늘의 운세
  
lib/
  ├── saju/
  │   ├── calendar.ts     # 만세력 알고리즘 (24절기, 음양력 변환)
  │   ├── pillars.ts      # 사주팔자 계산 (년월일시주)
  │   ├── elements.ts     # 오행/십신 분석
  │   └── types.ts        # 타입 정의
  └── claude.ts           # Claude API 클라이언트
```

---

## 2. 데이터 모델

### 2.1 입력 타입

```typescript
interface SajuInput {
  name?: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour?: number;      // 0-23, undefined = 모름
  isLunar: boolean;        // 음력 여부
  isDst?: boolean;         // 일광절약시간
}
```

### 2.2 사주팔자 타입

```typescript
interface Pillar {
  heavenlyStem: HeavenlyStem;    // 천간 (갑을병정무기경신임계)
  earthlyBranch: EarthlyBranch;  // 지지 (자축인묘진사오미신유술해)
  element: Element;              // 오행
  yinYang: 'yin' | 'yang';
}

interface SajuChart {
  yearPillar: Pillar;   // 년주
  monthPillar: Pillar;  // 월주
  dayPillar: Pillar;    // 일주 (일간 = 나 자신)
  hourPillar?: Pillar;  // 시주
  elements: ElementCount;        // 오행 분포
  tenGods: TenGodsChart;         // 십신
  majorFortune: MajorFortune[];  // 대운
}
```

### 2.3 Claude API 응답 구조

```typescript
interface SajuReading {
  summary: string;          // 전체 요약 (200자)
  personality: string;      // 성격/기질 분석
  fortune: {
    career: string;         // 직업/재물운
    love: string;           // 연애/결혼운
    health: string;         // 건강운
    relationship: string;   // 대인관계운
  };
  strengths: string[];      // 강점
  challenges: string[];     // 약점/주의사항
  luckyItems: {             // 행운 아이템
    color: string;
    direction: string;
    number: string;
  };
  majorFortune: string;     // 대운 해설
}
```

---

## 3. API 설계

### POST /api/saju
```json
// Request
{
  "name": "홍길동",
  "gender": "male",
  "birthYear": 1990,
  "birthMonth": 3,
  "birthDay": 15,
  "birthHour": 14,
  "isLunar": false
}

// Response
{
  "chart": { ...SajuChart },
  "reading": { ...SajuReading }
}
```

### POST /api/gunghap
```json
// Request
{ "person1": SajuInput, "person2": SajuInput }
// Response
{ "chart1": SajuChart, "chart2": SajuChart, "reading": GunghapReading }
```

### GET /api/daily?year=&month=&day=&sajuChart=
```json
// Response
{ "dayPillar": Pillar, "reading": string }
```

---

## 4. UI 구성

### 4.1 메인 폼 (/)
- 탭: 사주 | 궁합 | 오늘의 운세
- 입력 필드: 이름(선택), 성별, 생년월일(양력/음력 토글), 시간(12지시 선택)
- CTA: "사주 보기" 버튼

### 4.2 결과 페이지 (/result)
- 사주팔자 원국표 (4x2 그리드, 한자+한글)
- 오행 분포 바 차트
- AI 풀이 섹션 (탭: 성격 | 직업/재물 | 연애 | 건강 | 대운)
- 행운 아이템 카드
- PDF 다운로드 / 링크 공유 버튼

### 4.3 색상 테마
- 기본: 딥 버건디 + 골드 (전통 느낌)
- 다크모드 지원
- 한자 폰트: Noto Serif KR

---

## 5. 만세력 알고리즘 핵심 로직

### 5.1 년주 계산
- 기준: 입춘 (양력 2월 4일 전후)
- 입춘 이전 출생 → 전년도 간지 사용

### 5.2 월주 계산
- 24절기 기준 (절입시각 포함)
- 인월(寅月)부터 시작 (음력 1월 = 인월)

### 5.3 일주 계산
- 기준일: 1900년 1월 1일 = 갑술일 (甲戌)
- 율리우스 날짜 차이로 60갑자 계산

### 5.4 시주 계산
- 23:00-01:00 = 자시(子時)
- 01:00-03:00 = 축시(丑時) ... 

---

## 6. Claude 프롬프트 전략

```
시스템: "당신은 40년 경력의 한국 사주 전문가입니다. 
전통 만세력에 기반한 정확한 사주 풀이를 제공합니다."

사용자 프롬프트:
"다음 사주를 상세히 분석해주세요:
- 년주: {천간}{지지} ({오행}{음양})
- 월주: {천간}{지지} ({오행}{음양})
- 일주: {천간}{지지} ({오행}{음양}) ← 일간이 나 자신
- 시주: {천간}{지지} ({오행}{음양}) 또는 미상

오행 분포: 목({n}) 화({n}) 토({n}) 금({n}) 수({n})
십신: {일간 기준 십신 관계}
성별: {남/녀}

분석 항목:
1. 성격과 기질 (일간 중심)
2. 직업운과 재물운
3. 연애/결혼운
4. 건강운
5. 대인관계
6. 현재 대운 ({대운천간지지}, {대운 시작나이}세~{종료나이}세)
7. 행운의 색상, 방향, 숫자
8. 종합 조언

각 항목을 구체적이고 따뜻하게 300자 이상 풀어주세요."
```

---

## 7. 구현 순서 (세션 가이드)

| 순서 | 모듈 | 파일 |
|------|------|------|
| 1 | 프로젝트 초기화 | package.json, next.config.ts |
| 2 | 타입 정의 | lib/saju/types.ts |
| 3 | 만세력 알고리즘 | lib/saju/calendar.ts, pillars.ts, elements.ts |
| 4 | Claude 클라이언트 | lib/claude.ts |
| 5 | API 라우트 | app/api/saju, gunghap, daily |
| 6 | 메인 UI | app/page.tsx + components/SajuForm.tsx |
| 7 | 결과 UI | app/result/page.tsx + components/SajuResult.tsx |
| 8 | PDF 기능 | lib/pdf.ts + components/PDFButton.tsx |
| 9 | 공유 기능 | app/share/[id]/page.tsx |
