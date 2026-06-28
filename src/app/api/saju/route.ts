import { NextRequest, NextResponse } from 'next/server';
import { calculateSaju } from '@/lib/saju/pillars';
import { getSajuReading } from '@/lib/claude';
import type { SajuInput } from '@/lib/saju/types';

export async function POST(req: NextRequest) {
  try {
    const body: SajuInput = await req.json();
    const { name, gender, birthYear, birthMonth, birthDay, birthHour } = body;

    if (!gender || !birthYear || !birthMonth || !birthDay) {
      return NextResponse.json({ error: '필수 정보가 누락되었습니다.' }, { status: 400 });
    }

    const chart = calculateSaju(body);
    const reading = await getSajuReading(chart, name, gender);

    return NextResponse.json({ chart, reading });
  } catch (err) {
    console.error('[/api/saju]', err);
    return NextResponse.json({ error: '사주 분석 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
