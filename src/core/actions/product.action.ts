'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { ProductGrade, ProductStatus } from '@prisma/client';

export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' },
    });
    // Serialize Decimal values to string to be safe for Client Components
    return products.map(p => ({
        ...p,
        price_per_ton: p.price_per_ton.toString(),
        supply_cap_ton_week: p.supply_cap_ton_week.toString(),
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function addProduct(data: {
  name: string;
  variety_type: string;
  grade: ProductGrade;
  price_per_ton: number;
  avg_brix_min: number;
  avg_brix_max: number;
  moq_kg: number;
  supply_cap_ton_week: number;
  lead_time_days: number;
  status: ProductStatus;
  image_url?: string;
}) {
  try {
    const newProduct = await prisma.product.create({
      data: {
        ...data,
      },
    });
    revalidatePath('/dashboard');
    return { success: true, data: { ...newProduct, price_per_ton: newProduct.price_per_ton.toString(), supply_cap_ton_week: newProduct.supply_cap_ton_week.toString() } };
  } catch (error: any) {
    console.error('Error adding product:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message };
  }
}
