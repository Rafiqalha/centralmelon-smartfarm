'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { RfqStatus } from '@prisma/client';

export async function getRfqs() {
  try {
    const rfqs = await prisma.rfqRequest.findMany({
      include: {
        product: true,
        user: true,
      },
      orderBy: { created_at: 'desc' },
    });
    // Serialize Decimals
    return rfqs.map((r: any) => ({
      ...r,
      quantity_ton: r.quantity_ton.toString(),
      product: r.product ? {
        ...r.product,
        price_per_ton: r.product.price_per_ton.toString(),
        supply_cap_ton_week: r.product.supply_cap_ton_week.toString(),
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching RFQs:', error);
    return [];
  }
}

export async function getMyRfqs(userId: string) {
  try {
    const rfqs = await prisma.rfqRequest.findMany({
      where: { user_id: userId },
      include: {
        product: true,
      },
      orderBy: { created_at: 'desc' },
    });
    return rfqs.map((r: any) => ({
      ...r,
      quantity_ton: r.quantity_ton.toString(),
      product: r.product ? {
        ...r.product,
        price_per_ton: r.product.price_per_ton.toString(),
        supply_cap_ton_week: r.product.supply_cap_ton_week.toString(),
      } : null,
    }));
  } catch (error) {
    console.error('Error fetching my RFQs:', error);
    return [];
  }
}

export async function createRfq(data: {
  product_id: number;
  user_id: string;
  quantity_ton: number;
  grade_requested: string;
  notes?: string;
}) {
  try {
    const newRfq = await prisma.rfqRequest.create({
      data: {
        product_id: data.product_id,
        user_id: data.user_id,
        quantity_ton: data.quantity_ton,
        grade_requested: data.grade_requested,
        notes: data.notes,
      },
    });
    revalidatePath('/dashboard');
    return { success: true, data: { ...newRfq, quantity_ton: newRfq.quantity_ton.toString() } };
  } catch (error: any) {
    console.error('Error creating RFQ:', error);
    return { success: false, error: error.message };
  }
}

export async function updateRfqStatus(id: number, status: RfqStatus) {
  try {
    await prisma.rfqRequest.update({
      where: { id },
      data: { 
        status,
        responded_at: new Date()
      },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating RFQ:', error);
    return { success: false, error: error.message };
  }
}

import { getSession } from './session.action';

export async function submitCheckoutRfqs(items: any[], address: string, name: string) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
        return { success: false, error: 'Unauthorized. Silahkan login terlebih dahulu.' };
    }

    const notes = `Penerima: ${name}\nAlamat: ${address}`;
    
    // We create multiple RFQ requests for each item in the cart
    const createPromises = items.map(item => {
      return prisma.rfqRequest.create({
        data: {
          product_id: item.id,
          user_id: session.id as string,
          quantity_ton: item.quantity, 
          grade_requested: item.grade || 'A',
          notes: notes
        }
      });
    });

    await Promise.all(createPromises);
    revalidatePath('/supplier-dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error submitting checkout RFQs:', error);
    return { success: false, error: error.message };
  }
}
