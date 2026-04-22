import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const count = await prisma.solar_products.count();
    const categories = await prisma.solar_products.groupBy({
      by: ['category'],
      _count: true,
    });

    return NextResponse.json({
      ok: true,
      total: count,
      categories: categories.map(c => ({
        name: c.category,
        count: c._count,
      })),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
