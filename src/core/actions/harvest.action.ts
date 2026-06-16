'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getHarvests() {
  try {
    const harvests = await prisma.harvestForecast.findMany({
      include: {
        product: true,
      },
      orderBy: { forecast_date: 'asc' },
    });
    return harvests.map((h: any) => ({
      ...h,
      forecast_ton: h.forecast_ton.toString(),
      actual_ton: h.actual_ton ? h.actual_ton.toString() : null,
      accuracy_pct: h.accuracy_pct ? h.accuracy_pct.toString() : null,
      product: h.product ? {
        ...h.product,
        price_per_ton: h.product.price_per_ton.toString(),
        supply_cap_ton_week: h.product.supply_cap_ton_week.toString(),
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching harvests:', error);
    return [];
  }
}

export async function addHarvest(data: {
  product_id: number;
  period_label: string;
  forecast_ton: number;
  forecast_date: Date;
  harvest_date: Date;
}) {
  try {
    const newHarvest = await prisma.harvestForecast.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/dashboard');
    return { success: true, data: { ...newHarvest, forecast_ton: newHarvest.forecast_ton.toString() } };
  } catch (error: any) {
    console.error('Error adding harvest:', error);
    return { success: false, error: error.message };
  }
}

export async function updateActualHarvest(id: number, actual_ton: number) {
  try {
    const harvest = await prisma.harvestForecast.findUnique({ where: { id } });
    if (!harvest) throw new Error("Panen tidak ditemukan");

    // Hitung akurasi
    const est = Number(harvest.forecast_ton);
    let accuracy = 100 - (Math.abs(est - actual_ton) / est) * 100;
    if (accuracy < 0) accuracy = 0; // clamp to 0

    await prisma.harvestForecast.update({
      where: { id },
      data: {
        actual_ton,
        accuracy_pct: accuracy,
      },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating harvest:', error);
    return { success: false, error: error.message };
  }
}
