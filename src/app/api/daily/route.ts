import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/pillars';
import { getDailyFortune } from '@/lib/claude';
import type { SajuInput } from '@/lib/saju/types';

export async function POST(req: NextRequest) {
  try {
    const body: SajuInput = await req.json();
    const chart = calculateSaju(body);

    const today = new Date();
    const reading = await getDailyFortune(
      chart,
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
      body.name,
    );

    return NextResponse.json({ chart, reading });
  } catch (err) {
    console.error('[/api/daily]', err);
    return NextResponse.json({ error: '오늘의 운세 분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
