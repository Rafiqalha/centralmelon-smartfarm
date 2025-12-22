'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { use } from 'react';

export default function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <main className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="pt-32 px-6 max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-slate-900">Detail Produk ID: {id}</h1>
                <p className="text-slate-500 mt-4">Halaman detail produk sedang dalam tahap pengembangan.</p>
                <Link href="/products" className="mt-8 inline-block text-emerald-600 hover:underline font-bold">
                    <ArrowLeft className="inline w-4 h-4" /> Kembali ke Katalog
                </Link>
            </div>
        </main>
    );
}