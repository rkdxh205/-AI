import OpenAI from 'openai';
import type { SajuChart, SajuReading, GunghapReading } from './saju/types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL = 'gpt-4o';

function buildChartDescription(chart: SajuChart, _name?: string, gender?: string): string {
  const genderStr = gender === 'male' ? '남성' : '여성';
  const hourStr = chart.hourPillar
    ? `${chart.hourPillar.stemChar}${chart.hourPillar.branchChar}(${chart.hourPillar.heavenlyStem}${chart.hourPillar.earthlyBranch})`
    : '미상';

  const elements = chart.elements;
  const elemStr = `목(${elements.목}) 화(${elements.화}) 토(${elements.토}) 금(${elements.금}) 수(${elements.수})`;

  const mf = chart.currentMajorFortune;
  const mfStr = mf
    ? `현재 대운: ${mf.pillar.stemChar}${mf.pillar.branchChar} (${mf.startAge}세~${mf.endAge}세)`
    : '대운 정보 없음';

  return `
성별: ${genderStr}

사주원국:
- 년주: ${chart.yearPillar.stemChar}${chart.yearPillar.branchChar} (${chart.yearPillar.heavenlyStem}${chart.yearPillar.earthlyBranch}, ${chart.yearPillar.element} ${chart.yearPillar.yinYang})
- 월주: ${chart.monthPillar.stemChar}${chart.monthPillar.branchChar} (${chart.monthPillar.heavenlyStem}${chart.monthPillar.earthlyBranch}, ${chart.monthPillar.element} ${chart.monthPillar.yinYang})
- 일주: ${chart.dayPillar.stemChar}${chart.dayPillar.branchChar} (${chart.dayPillar.heavenlyStem}${chart.dayPillar.earthlyBranch}, ${chart.dayPillar.element} ${chart.dayPillar.yinYang}) ← 일간(나 자신)
- 시주: ${hourStr}

오행 분포: ${elemStr}
${mfStr}
  `.trim();
}

export async function getSajuReading(
  chart: SajuChart,
  name?: string,
  gender?: string,
): Promise<SajuReading> {
  const chartDesc = buildChartDescription(chart, name, gender);

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 4000,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `당신은 40년 경력의 한국 전통 사주 전문가입니다.
만세력에 기반한 정확하고 상세한 사주 풀이를 제공합니다.
따뜻하고 희망적인 어조로 설명하되, 주의사항도 솔직하게 알려주세요.
반드시 JSON 형식으로만 응답하세요.`,
      },
      {
        role: 'user',
        content: `다음 사주를 분석하여 JSON으로 응답해주세요:

${chartDesc}

다음 JSON 구조로 응답하세요:
{
  "summary": "전체 사주 요약 (200자 이상)",
  "personality": "성격과 기질 분석 (300자 이상, 일간 중심)",
  "fortune": {
    "career": "직업운과 재물운 (300자 이상)",
    "love": "연애와 결혼운 (300자 이상)",
    "health": "건강운과 주의사항 (200자 이상)",
    "relationship": "대인관계운 (200자 이상)"
  },
  "strengths": ["강점1", "강점2", "강점3"],
  "challenges": ["주의사항1", "주의사항2", "주의사항3"],
  "luckyItems": {
    "color": "행운의 색상",
    "direction": "행운의 방향",
    "number": "행운의 숫자",
    "element": "보완이 필요한 오행"
  },
  "majorFortuneReading": "현재 대운 해설 (200자 이상)",
  "advice": "종합 조언 (200자 이상)"
}`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content ?? '';
  return JSON.parse(text) as SajuReading;
}

export async function getGunghapReading(
  chart1: SajuChart,
  chart2: SajuChart,
  name1?: string,
  name2?: string,
): Promise<GunghapReading> {
  const desc1 = buildChartDescription(chart1, name1);
  const desc2 = buildChartDescription(chart2, name2);

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `당신은 40년 경력의 한국 전통 사주 전문가입니다.
두 사람의 사주 궁합을 분석하여 따뜻하고 현실적인 조언을 제공합니다.
반드시 JSON 형식으로만 응답하세요.`,
      },
      {
        role: 'user',
        content: `두 사람의 궁합을 분석해주세요:

[첫 번째 사람]
${desc1}

[두 번째 사람]
${desc2}

다음 JSON 구조로 응답하세요:
{
  "score": 75,
  "summary": "궁합 총평 (200자 이상)",
  "compatibility": "오행 조화 분석 (300자 이상)",
  "strengths": ["잘 맞는 점1", "잘 맞는 점2", "잘 맞는 점3"],
  "challenges": ["주의할 점1", "주의할 점2"],
  "advice": "관계 발전을 위한 조언 (200자 이상)"
}`,
      },
    ],
  });

  const text = response.choices[0]?.message?.content ?? '';
  return JSON.parse(text) as GunghapReading;
}

export async function getDailyFortune(
  chart: SajuChart,
  todayYear: number,
  todayMonth: number,
  todayDay: number,
  name?: string,
): Promise<string> {
  const chartDesc = buildChartDescription(chart, name);
  const today = `${todayYear}년 ${todayMonth}월 ${todayDay}일`;

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 800,
    messages: [
      {
        role: 'system',
        content: `당신은 한국 전통 사주 전문가입니다. 오늘의 운세를 따뜻하고 실용적으로 안내합니다.`,
      },
      {
        role: 'user',
        content: `${today} 기준으로 이 사주의 오늘 운세를 알려주세요:

${chartDesc}

오늘의 운세를 300자 이상으로 자세히 설명해주세요.
긍정적인 면과 주의사항, 오늘 하면 좋은 일을 포함해주세요.`,
      },
    ],
  });

  return response.choices[0]?.message?.content ?? '';
}
