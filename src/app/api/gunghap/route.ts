import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/pillars';
import { getGunghapReading } from '@/lib/claude';
import type { SajuInput } from '@/lib/saju/types';

export async function POST(req: NextRequest) {
  try {
    const { person1, person2 }: { person1: SajuInput; person2: SajuInput } = await req.json();

    if (!person1 || !person2) {
      return NextResponse.json({ error: '두 사람의 정보가 필요합니다.' }, { status: 400 });
    }

    const chart1 = calculateSaju(person1);
    const chart2 = calculateSaju(person2);
    const reading = await getGunghapReading(chart1, chart2, person1.name, person2.name);

    return NextResponse.json({ chart1, chart2, reading });
  } catch (err) {
    console.error('[/api/gunghap]', err);
    return NextResponse.json({ error: '궁합 분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
