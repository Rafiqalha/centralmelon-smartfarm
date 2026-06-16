'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ContractStatus } from '@prisma/client';

export async function getContracts() {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        product: true,
        user: true,
      },
      orderBy: { signed_at: 'desc' },
    });
    return contracts.map((c: any) => ({
      ...c,
      volume_ton_month: c.volume_ton_month.toString(),
      price_per_ton_locked: c.price_per_ton_locked.toString(),
      product: c.product ? {
        ...c.product,
        price_per_ton: c.product.price_per_ton.toString(),
        supply_cap_ton_week: c.product.supply_cap_ton_week.toString(),
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching Contracts:', error);
    return [];
  }
}

export async function getMyContracts(userId: string) {
  try {
    const contracts = await prisma.contract.findMany({
      where: { user_id: userId },
      include: {
        product: true,
      },
      orderBy: { signed_at: 'desc' },
    });
    return contracts.map((c: any) => ({
      ...c,
      volume_ton_month: c.volume_ton_month.toString(),
      price_per_ton_locked: c.price_per_ton_locked.toString(),
      product: c.product ? {
        ...c.product,
        price_per_ton: c.product.price_per_ton.toString(),
        supply_cap_ton_week: c.product.supply_cap_ton_week.toString(),
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching my contracts:', error);
    return [];
  }
}

export async function createContract(data: {
  user_id: string;
  product_id: number;
  volume_ton_month: number;
  price_per_ton_locked: number;
  start_date: Date;
  end_date: Date;
  packaging?: 'standard' | 'custom';
  custom_label_info?: string;
  rfq_id?: number; // optionally complete an RFQ
}) {
  try {
    const newContract = await prisma.contract.create({
      data: {
        user_id: data.user_id,
        product_id: data.product_id,
        volume_ton_month: data.volume_ton_month,
        price_per_ton_locked: data.price_per_ton_locked,
        start_date: data.start_date,
        end_date: data.end_date,
        packaging: data.packaging || 'standard',
        custom_label_info: data.custom_label_info,
      },
    });

    if (data.rfq_id) {
      await prisma.rfqRequest.update({
        where: { id: data.rfq_id },
        data: { status: 'accepted' },
      });
    }

    revalidatePath('/contracts');
    revalidatePath('/dashboard');
    return { success: true, data: { ...newContract, price_per_ton_locked: newContract.price_per_ton_locked.toString() } };
  } catch (error: any) {
    console.error('Error creating Contract:', error);
    return { success: false, error: error.message };
  }
}

export async function updateContractStatus(id: number, status: ContractStatus) {
  try {
    await prisma.contract.update({
      where: { id },
      data: { status },
    });
    revalidatePath('/contracts');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating Contract:', error);
    return { success: false, error: error.message };
  }
}
